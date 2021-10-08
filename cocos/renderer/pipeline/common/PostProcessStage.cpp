
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

#include "PostProcessStage.h"
#include "../PipelineStateManager.h"
#include "../RenderQueue.h"
#include "UIPhase.h"
#include "../RenderPipeline.h"
#include "frame-graph/DevicePass.h"
#include "frame-graph/PassNodeBuilder.h"
#include "frame-graph/Resource.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXFramebuffer.h"
#include "pipeline/Define.h"
#include "pipeline/helper/Utils.h"
#include "scene/SubModel.h"


namespace cc {
namespace pipeline {
namespace {
const String STAGE_NAME = "PostProcessStage";
}

RenderStageInfo PostProcessStage::initInfo = {
    STAGE_NAME,
    static_cast<uint>(DeferredStagePriority::POSTPROCESS),
    0,
    {{true, RenderQueueSortMode::BACK_TO_FRONT, {"default"}}},
};
const RenderStageInfo &PostProcessStage::getInitializeInfo() { return PostProcessStage::initInfo; }

PostProcessStage::PostProcessStage() {
    _uiPhase = CC_NEW(UIPhase);
}

bool PostProcessStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    _renderQueueDescriptors = info.renderQueues;

    return true;
}

void PostProcessStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);
    _uiPhase->activate(pipeline);
    _phaseID = getPhaseID("default");

    for (const auto &descriptor : _renderQueueDescriptors) {
        uint phase = 0;
        for (const auto &stage : descriptor.stages) {
            phase |= getPhaseID(stage);
        }

        std::function<int(const RenderPass &, const RenderPass &)> sortFunc = opaqueCompareFn;
        switch (descriptor.sortMode) {
            case RenderQueueSortMode::BACK_TO_FRONT:
                sortFunc = transparentCompareFn;
                break;
            case RenderQueueSortMode::FRONT_TO_BACK:
                sortFunc = opaqueCompareFn;
            default:
                break;
        }

        RenderQueueCreateInfo info = {descriptor.isTransparent, phase, sortFunc};
        _renderQueues.emplace_back(CC_NEW(RenderQueue(std::move(info))));
    }
}

void PostProcessStage::destroy() {
    CC_SAFE_DELETE(_uiPhase);
}

void PostProcessStage::render(scene::Camera *camera) {
    static framegraph::StringHandle fgStrHandlePostProcessOutTexture = framegraph::FrameGraph::stringToHandle("postProcessOutputTexture");
    struct RenderData {
        framegraph::TextureHandle outColorTex; // read from lighting output
        framegraph::TextureHandle backBuffer;  // write to back buffer
        framegraph::TextureHandle depth;

        framegraph::TextureHandle taaResult;   // read from taa output
    };

    if (hasFlag(static_cast<gfx::ClearFlags>(camera->clearFlag), gfx::ClearFlagBit::COLOR)) {
        _clearColors[0].x = camera->clearColor.x;
        _clearColors[0].y = camera->clearColor.y;
        _clearColors[0].z = camera->clearColor.z;
    }
    _clearColors[0].w = camera->clearColor.w;

    auto *pipeline  = _pipeline;
    auto  postSetup = [&](framegraph::PassNodeBuilder &builder, RenderData &data) {
        if (pipeline->getBloomEnable()) {
            data.outColorTex = framegraph::TextureHandle(builder.readFromBlackboard(RenderPipeline::fgStrHandleBloomOutTexture));
        } else {
            data.outColorTex = framegraph::TextureHandle(builder.readFromBlackboard(RenderPipeline::fgStrHandleOutColorTexture));
        }

        if (!data.outColorTex.isValid()) {
            framegraph::Texture::Descriptor colorTexInfo;
            colorTexInfo.format = gfx::Format::RGBA16F;
            colorTexInfo.usage  = gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED;
            colorTexInfo.width  = pipeline->getWidth();
            colorTexInfo.height = pipeline->getHeight();

            data.outColorTex = builder.create<framegraph::Texture>(RenderPipeline::fgStrHandleOutColorTexture, colorTexInfo);
        }

        data.outColorTex = builder.read(data.outColorTex);
        builder.writeToBlackboard(RenderPipeline::fgStrHandleOutColorTexture, data.outColorTex);

        auto taaResultHande = DeferredPipeline::fgStrHandleTAATexture[1];
        data.taaResult      = framegraph::TextureHandle(builder.readFromBlackboard(taaResultHande));
        if (data.taaResult.isValid()) {
            data.taaResult = builder.read(data.taaResult);
            builder.writeToBlackboard(taaResultHande, data.taaResult);
        }

        builder.sideEffect();


        /*framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
        colorAttachmentInfo.usage      = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorAttachmentInfo.clearColor = _clearColors[0];
        colorAttachmentInfo.loadOp     = gfx::LoadOp::CLEAR;

        auto clearFlags = static_cast<gfx::ClearFlagBit>(camera->clearFlag);
        if (!hasFlag(clearFlags, gfx::ClearFlagBit::COLOR)) {
            if (hasFlag(clearFlags, static_cast<gfx::ClearFlagBit>(skyboxFlag))) {
                colorAttachmentInfo.loadOp = gfx::LoadOp::DISCARD;
            } else {
                colorAttachmentInfo.loadOp = gfx::LoadOp::LOAD;
            }
        }

        colorAttachmentInfo.beginAccesses = {gfx::AccessType::COLOR_ATTACHMENT_WRITE};
        colorAttachmentInfo.endAccesses   = {gfx::AccessType::COLOR_ATTACHMENT_WRITE};

        gfx::TextureInfo textureInfo = {
            gfx::TextureType::TEX2D,
            gfx::TextureUsageBit::COLOR_ATTACHMENT,
            gfx::Format::RGBA8,
            camera->window->getWidth(),
            camera->window->getHeight(),
        };
        data.backBuffer = builder.create<framegraph::Texture>(fgStrHandlePostProcessOutTexture, textureInfo);
        data.backBuffer = builder.write(data.backBuffer, colorAttachmentInfo);
        builder.writeToBlackboard(fgStrHandlePostProcessOutTexture, data.backBuffer);*/

        // depth
        /*framegraph::RenderTargetAttachment::Descriptor depthAttachmentInfo;
        depthAttachmentInfo.usage         = framegraph::RenderTargetAttachment::Usage::DEPTH;
        depthAttachmentInfo.loadOp        = gfx::LoadOp::CLEAR;
        depthAttachmentInfo.beginAccesses = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE};
        depthAttachmentInfo.endAccesses   = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE};

        data.depth = framegraph::TextureHandle(builder.readFromBlackboard(RenderPipeline::fgStrHandleOutDepthTexture));
        if (data.depth.isValid()) {
            data.depth = builder.write(data.depth, depthAttachmentInfo);
            builder.writeToBlackboard(RenderPipeline::fgStrHandleOutDepthTexture, data.depth);
        }*/

        builder.setViewport(pipeline->getRenderArea(camera));
    };

    auto postExec = [this, camera](RenderData const &data, const framegraph::DevicePassResourceTable &table) {
        auto *           pipeline   = static_cast<DeferredPipeline *>(_pipeline);
        //gfx::RenderPass *renderPass = table.getRenderPass();
        auto *           renderPass = camera->window->frameBuffer->getRenderPass();

            auto rendeArea = pipeline->getRenderArea(camera, camera->window->swapchain);

        auto *                    cmdBuff       = pipeline->getCommandBuffers()[0];

        gfx::RenderPassInfo info;
        info.colorAttachments = renderPass->getColorAttachments();
        info.depthStencilAttachment = renderPass->getDepthStencilAttachment();
        info.subpasses              = renderPass->getSubpasses();
        info.dependencies           = renderPass->getDependencies();

        auto& ca = renderPass->getColorAttachments();

        auto clearFlags = static_cast<gfx::ClearFlagBit>(camera->clearFlag);
        if (!hasFlag(clearFlags, gfx::ClearFlagBit::COLOR)) {
            if (hasFlag(clearFlags, static_cast<gfx::ClearFlagBit>(skyboxFlag))) {
                info.colorAttachments.at(0).loadOp = gfx::LoadOp::DISCARD;
            } else {
                info.colorAttachments.at(0).loadOp = gfx::LoadOp::LOAD;
            }
        }
        
        auto rp = framegraph::RenderPass(info);
        rp.createTransient();

        cmdBuff->beginRenderPass(rp.get(), camera->window->frameBuffer, rendeArea, _clearColors, camera->clearDepth, camera->clearStencil);


        // bind descriptor
        gfx::Texture *input = nullptr;
        if (data.taaResult.isValid()) {
            input = static_cast<gfx::Texture *>(table.getRead(data.taaResult));
        } else {
            input = static_cast<gfx::Texture *>(table.getRead(data.outColorTex));
        }

        const std::array<uint, 1> globalOffsets = {_pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
        cmdBuff->bindDescriptorSet(globalSet, pipeline->getDescriptorSet(), static_cast<uint>(std::size(globalOffsets)), globalOffsets);
        cmdBuff->bindDescriptorSet(globalSet, pipeline->getDescriptorSet(), utils::toUint(globalOffsets.size()), globalOffsets.data());

        if (!pipeline->getPipelineSceneData()->getRenderObjects().empty()) {
            // post process
            auto *const  sceneData = pipeline->getPipelineSceneData();
            scene::Pass *pv        = sceneData->getSharedData()->pipelinePostPass;
            gfx::Shader *sd        = sceneData->getSharedData()->pipelinePostPassShader;

            // get pso and draw quad
            gfx::InputAssembler *ia        = pipeline->getIAByRenderArea(pipeline->getRenderArea(camera));
            gfx::PipelineState * pso       = PipelineStateManager::getOrCreatePipelineState(pv, sd, ia, renderPass);

            pv->getDescriptorSet()->bindTexture(0, input);
            pv->getDescriptorSet()->bindSampler(0, pipeline->getDevice()->getSampler({
                                                       gfx::Filter::LINEAR,
                                                       gfx::Filter::LINEAR,
                                                       gfx::Filter::NONE,
                                                       gfx::Address::CLAMP,
                                                       gfx::Address::CLAMP,
                                                       gfx::Address::CLAMP,
                                                   }));
            pv->getDescriptorSet()->update();

            cmdBuff->bindPipelineState(pso);
            cmdBuff->bindDescriptorSet(materialSet, pv->getDescriptorSet());
            cmdBuff->bindInputAssembler(ia);
            cmdBuff->draw(ia);
        }

        _uiPhase->render(camera, renderPass);

        auto it = std::find(pipeline->cameras.begin(), pipeline->cameras.end(), camera);
        if (it == pipeline->cameras.end() - 1) {
            renderProfiler(renderPass, cmdBuff, pipeline->getProfiler(), camera->window->swapchain);
        }

        cmdBuff->endRenderPass();

        rp.destroyTransient();
    };

    // add pass
    // pipeline->getFrameGraph().addPass<RenderData>(static_cast<uint>(CommonInsertPoint::DIP_POSTPROCESS), RenderPipeline::fgStrHandlePostprocessPass, postSetup, postExec);
    // pipeline->getFrameGraph().presentFromBlackboard(fgStrHandlePostProcessOutTexture, camera->window->frameBuffer->getColorTextures()[0]);

    static const StringHandle PRESENT_PASS = framegraph::FrameGraph::stringToHandle("Present");
    pipeline->getFrameGraph().addPass<RenderData>(static_cast<uint>(DeferredInsertPoint::IP_POSTPROCESS), PRESENT_PASS, postSetup, postExec);
}

} // namespace pipeline
} // namespace cc
