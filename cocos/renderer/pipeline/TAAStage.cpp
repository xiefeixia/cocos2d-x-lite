/****************************************************************************
 Copyright (c) 2020-2021 Huawei Technologies Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "TAAStage.h"
#include "./PipelineStateManager.h"
#include "RenderPipeline.h"
#include "RenderFlow.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXFramebuffer.h"
#include "gfx-base/GFXQueue.h"
#include "scene/SubModel.h"

#include "./deferred/DeferredPipeline.h"
#include "./common/CustomEngine.h"

namespace cc {
namespace pipeline {


TAAStage::TAAStage() = default;

TAAStage::~TAAStage() {
}

void TAAStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);

    gfx::SamplerInfo samplerInfo;
    samplerInfo.minFilter = gfx::Filter::LINEAR;
    samplerInfo.magFilter = gfx::Filter::LINEAR;
    samplerInfo.addressU  = gfx::Address::CLAMP;
    samplerInfo.addressV  = gfx::Address::CLAMP;
    samplerInfo.addressW  = gfx::Address::CLAMP;
    _linearSampler        = _device->getSampler(samplerInfo);

}

void TAAStage::render(scene::Camera *camera) {
    #ifdef CC_USE_VULKAN
        #if CC_PLATFORM == CC_PLATFORM_ANDROID
            return;
        #endif
    #endif

    if (camera != _camera || !_taaPass || !_taaShader) {
        return;
    }

    auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);
    if (!pipeline->getFrameGraph().hasPass(DeferredPipeline::fgStrHandleLightingPass)) {
        return;
    }

    auto shadingScale = pipeline->getPipelineSceneData()->getSharedData()->shadingScale;

    auto width  = pipeline->getWidth() * shadingScale;
    auto height = pipeline->getHeight() * shadingScale;

    DeferredPipeline *pip = static_cast<DeferredPipeline *>(pipeline);
    if (!_initPrev || !_taaTextures[0].get() || 
        _taaTextures[0].getDesc().width != width || 
        _taaTextures[0].getDesc().height != height) {
        for (int i = 0; i < 2; i++) {
                framegraph::Texture::Descriptor colorTexInfo;
                colorTexInfo.format = gfx::Format::RGBA16F;
                colorTexInfo.usage  = gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED;
                colorTexInfo.width  = width;
                colorTexInfo.height = height;

                if (_taaTextures[i].get()) {
                    _taaTextures[i].get()->destroy();
                    _taaTextures[i].destroyPersistent();
                }

                _taaTextures[i] = framegraph::Texture(colorTexInfo);
                _taaTextures[i].createPersistent();
        }
    }

    const int gbuffer_pos_index = 1;
    struct RenderData {
        framegraph::TextureHandle gbuffer_pos;  // read from gbuffer stage
        framegraph::TextureHandle lightOutput;  // light output texture

        framegraph::TextureHandle taaPrev;      // prev texture
        framegraph::TextureHandle taaResult;    // output texture

    };

    gfx::Color clearColor = pipeline->getClearcolor(camera);

    auto setup = [&](framegraph::PassNodeBuilder &builder, RenderData &data) {
        // read gbuffer
        data.gbuffer_pos = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleGbufferTexture[gbuffer_pos_index])));

        // read lighting output
        data.lightOutput = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleOutColorTexture)));

        auto prev   = CustomEngine::fgStrHandleTAATexture[0];
        auto result = CustomEngine::fgStrHandleTAATexture[1];

        data.taaPrev   = framegraph::TextureHandle(builder.importExternal(prev, _taaTextures[CustomEngine::taaTextureIndex % 2]));
        data.taaResult = framegraph::TextureHandle(builder.importExternal(result, _taaTextures[(CustomEngine::taaTextureIndex + 1) % 2]));

        if (!_initPrev) {
            data.taaPrev = data.lightOutput;
            _initPrev = true;
        }

        data.taaPrev = builder.read(data.taaPrev);
        builder.writeToBlackboard(prev, data.taaPrev);

        // write taa result
        framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
        colorAttachmentInfo.usage         = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorAttachmentInfo.loadOp        = gfx::LoadOp::CLEAR;
        colorAttachmentInfo.clearColor    = clearColor;
        colorAttachmentInfo.beginAccesses = {gfx::AccessType::FRAGMENT_SHADER_READ_TEXTURE};
        colorAttachmentInfo.endAccesses   = {gfx::AccessType::FRAGMENT_SHADER_READ_TEXTURE};
        data.taaResult                    = builder.write(data.taaResult, colorAttachmentInfo);
        builder.writeToBlackboard(result, data.taaResult);

        builder.writeToBlackboard(DeferredPipeline::fgStrHandleOutColorTexture, data.taaResult);

        // set render area
        builder.setViewport(pipeline->getViewport(camera), pipeline->getRenderArea(camera));
    };

    auto exec = [this, camera](RenderData const &data, const framegraph::DevicePassResourceTable &table) {
        auto *      pipeline  = static_cast<DeferredPipeline *>(_pipeline);
        auto *const sceneData = pipeline->getPipelineSceneData();
        auto *      cmdBuff   = pipeline->getCommandBuffers()[0];

        const std::array<uint, 1> globalOffsets = {_pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
        cmdBuff->bindDescriptorSet(globalSet, pipeline->getDescriptorSet(), utils::toUint(globalOffsets.size()), globalOffsets.data());
        // get PSO and draw quad
        auto rendeArea = pipeline->getRenderArea(camera);

        gfx::InputAssembler *inputAssembler = pipeline->getIAByRenderArea(rendeArea);
        gfx::PipelineState * pState         = PipelineStateManager::getOrCreatePipelineState(_taaPass, _taaShader, inputAssembler, table.getRenderPass());

        // update taa descriptorSet
        // 0 - lighting result map
        _taaPass->getDescriptorSet()->bindTexture(0, table.getRead(data.lightOutput));
        _taaPass->getDescriptorSet()->bindSampler(0, _linearSampler);
        // 1 - position gbuffer map
        _taaPass->getDescriptorSet()->bindTexture(1, table.getRead(data.gbuffer_pos));
        _taaPass->getDescriptorSet()->bindSampler(1, _linearSampler);
        // 2 - previous taa result map
        _taaPass->getDescriptorSet()->bindTexture(2, table.getRead(data.taaPrev));
        _taaPass->getDescriptorSet()->bindSampler(2, _linearSampler);

        _taaPass->getDescriptorSet()->update();

        cmdBuff->bindPipelineState(pState);
        cmdBuff->bindInputAssembler(inputAssembler);
        cmdBuff->bindDescriptorSet(materialSet, _taaPass->getDescriptorSet());
        cmdBuff->draw(inputAssembler);
    };


    pipeline->getFrameGraph().addPass<RenderData>(static_cast<uint>(DeferredInsertPoint::DIP_LIGHTING) + 1, CustomEngine::fgStrHandleTAAPass, setup, exec);
    
    if (_dirty) {
        CustomEngine::taaTextureIndex++;
        _dirty = false;
    }
}

} // namespace pipeline
} // namespace cc
