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

#include "TonemapStage.h"

#include "../PipelineStateManager.h"
#include "../RenderPipeline.h"
#include "../RenderFlow.h"

#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXFramebuffer.h"
#include "gfx-base/GFXQueue.h"
#include "scene/SubModel.h"

#include "../deferred/DeferredPipeline.h"
#include "./CustomEngine.h"

namespace cc {
namespace pipeline {

framegraph::StringHandle fgStrHandlePass = framegraph::FrameGraph::stringToHandle("TonemapPass");

TonemapStage::TonemapStage() = default;

TonemapStage::~TonemapStage() {
}

void TonemapStage::render(scene::Camera *camera) {
    if (camera != _camera || !_pass || !_shader) {
        return;
    }

    auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);
    if (!pipeline->getFrameGraph().hasPass(DeferredPipeline::fgStrHandleLightingPass)) {
        return;
    }

    struct RenderData {
        framegraph::TextureHandle inColorTex;
        framegraph::TextureHandle outColorTex;
    };

    gfx::Color clearColor = pipeline->getClearcolor(camera);
    float      shadingScale{_pipeline->getPipelineSceneData()->getSharedData()->shadingScale};

    auto setup = [&](framegraph::PassNodeBuilder &builder, RenderData &data) {
        // read output
        data.inColorTex = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleOutColorTexture)));

        // write to lighting output
        framegraph::Texture::Descriptor colorTexInfo;
        colorTexInfo.format = gfx::Format::RGBA8;
        colorTexInfo.usage  = gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED;
        colorTexInfo.width  = static_cast<uint>(pipeline->getWidth() * shadingScale);
        colorTexInfo.height = static_cast<uint>(pipeline->getHeight() * shadingScale);
        data.outColorTex    = builder.create(RenderPipeline::fgStrHandleOutColorTexture, colorTexInfo);

        // write result
        framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
        colorAttachmentInfo.usage         = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorAttachmentInfo.loadOp        = gfx::LoadOp::CLEAR;
        colorAttachmentInfo.clearColor    = clearColor;
        colorAttachmentInfo.beginAccesses = {gfx::AccessType::FRAGMENT_SHADER_READ_TEXTURE};
        colorAttachmentInfo.endAccesses   = {gfx::AccessType::FRAGMENT_SHADER_READ_TEXTURE};
        data.outColorTex                  = builder.write(data.outColorTex, colorAttachmentInfo);
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleOutColorTexture, data.outColorTex);

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
        gfx::PipelineState * pState         = PipelineStateManager::getOrCreatePipelineState(_pass, _shader, inputAssembler, table.getRenderPass());

        // update descriptorSet
        _pass->getDescriptorSet()->bindTexture(0, table.getRead(data.inColorTex));
        _pass->getDescriptorSet()->bindSampler(0, pipeline->getGlobalDSManager()->getLinearSampler());
        _pass->getDescriptorSet()->update();

        cmdBuff->bindPipelineState(pState);
        cmdBuff->bindInputAssembler(inputAssembler);
        cmdBuff->bindDescriptorSet(materialSet, _pass->getDescriptorSet());
        cmdBuff->draw(inputAssembler);
    };

    pipeline->getFrameGraph().addPass<RenderData>(static_cast<uint>(CommonInsertPoint::DIP_POSTPROCESS) - 1, fgStrHandlePass, setup, exec);
}

} // namespace pipeline
} // namespace cc
