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

#include "LightingStage.h"
#include "../BatchedBuffer.h"
#include "../Define.h"
#include "../InstancedBuffer.h"
#include "../PipelineStateManager.h"
#include "../PlanarShadowQueue.h"
#include "../RenderBatchedQueue.h"
#include "../RenderInstancedQueue.h"
#include "../RenderQueue.h"
#include "DeferredPipeline.h"
#include "base/Utils.h"
#include "frame-graph/Blackboard.h"
#include "frame-graph/Handle.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXFramebuffer.h"
#include "gfx-base/GFXQueue.h"
#include "pipeline/Define.h"
#include "scene/RenderScene.h"
#include "scene/Sphere.h"
#include "scene/SphereLight.h"

namespace cc {
namespace pipeline {
namespace {
void srgbToLinear(gfx::Color *out, const gfx::Color &gamma) {
    out->x = gamma.x * gamma.x;
    out->y = gamma.y * gamma.y;
    out->z = gamma.z * gamma.z;
}

void linearToSrgb(gfx::Color *out, const gfx::Color &linear) {
    out->x = std::sqrt(linear.x);
    out->y = std::sqrt(linear.y);
    out->z = std::sqrt(linear.z);
}

const String             STAGE_NAME         = "LightingStage";
const uint               MAX_REFLECTOR_SIZE = 5;
framegraph::StringHandle reflectTexHandle   = framegraph::FrameGraph::stringToHandle("reflectionTex");
framegraph::StringHandle denoiseTexHandle[MAX_REFLECTOR_SIZE];
framegraph::StringHandle ssprClearPass[MAX_REFLECTOR_SIZE];
framegraph::StringHandle ssprCompReflectPass[MAX_REFLECTOR_SIZE];
framegraph::StringHandle ssprCompDenoisePass[MAX_REFLECTOR_SIZE];
framegraph::StringHandle ssprRenderPass[MAX_REFLECTOR_SIZE];

void initStrHandle() {
    std::string tmp;
    for (int i = 0; i < MAX_REFLECTOR_SIZE; ++i) {
        tmp                 = std::string("denoiseTexureHandle") + std::to_string(i);
        denoiseTexHandle[i] = framegraph::FrameGraph::stringToHandle(tmp.c_str());

        tmp              = std::string("ssprClearPss") + std::to_string(i);
        ssprClearPass[i] = framegraph::FrameGraph::stringToHandle(tmp.c_str());

        tmp                    = std::string("ssprReflectPass") + std::to_string(i);
        ssprCompReflectPass[i] = framegraph::FrameGraph::stringToHandle(tmp.c_str());

        tmp                    = std::string("ssprDenoisePass") + std::to_string(i);
        ssprCompDenoisePass[i] = framegraph::FrameGraph::stringToHandle(tmp.c_str());

        tmp               = std::string("ssprRenderPass") + std::to_string(i);
        ssprRenderPass[i] = framegraph::FrameGraph::stringToHandle(tmp.c_str());
    }
}
} // namespace

RenderStageInfo LightingStage::initInfo = {
    STAGE_NAME,
    static_cast<uint>(DeferredStagePriority::LIGHTING),
    static_cast<uint>(RenderFlowTag::SCENE),
};

const RenderStageInfo &LightingStage::getInitializeInfo() { return LightingStage::initInfo; }

LightingStage::LightingStage() = default;

LightingStage::~LightingStage() {
    CC_SAFE_DESTROY(_deferredLitsBufs);
    CC_SAFE_DESTROY(_deferredLitsBufView);
}

bool LightingStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    _renderQueueDescriptors = info.renderQueues;
    _phaseID                = getPhaseID("default");
    _reflectionPhaseID      = getPhaseID("reflection");
    initStrHandle();

    return true;
}

void LightingStage::gatherLights(scene::Camera *camera) {
    auto *      pipeline   = static_cast<DeferredPipeline *>(_pipeline);
    auto *const sceneData  = _pipeline->getPipelineSceneData();
    auto *const sharedData = sceneData->getSharedData();

    gfx::CommandBuffer *cmdBuf = pipeline->getCommandBuffers()[0];
    const auto *        scene  = camera->scene;

    scene::Sphere sphere;
    auto          exposure   = camera->exposure;
    uint          idx        = 0;
    int           elementLen = sizeof(cc::Vec4) / sizeof(float);
    uint          fieldLen   = elementLen * _maxDeferredLights;
    uint          offset     = 0;
    cc::Vec4      tmpArray;

    uint i = 0;
    for (auto *light : scene->getSphereLights()) {
        if (i >= _maxDeferredLights) {
            break;
        }

        const auto &position = light->getPosition();
        sphere.setCenter(position);
        sphere.setRadius(light->getRange());
        if (!sphere.sphereFrustum(camera->frustum)) {
            continue;
        }
        // position
        offset                       = idx * elementLen;
        _lightBufferData[offset]     = position.x;
        _lightBufferData[offset + 1] = position.y;
        _lightBufferData[offset + 2] = position.z;
        _lightBufferData[offset + 3] = 0;

        // color
        const auto &color = light->getColor();
        offset            = idx * elementLen + fieldLen;
        tmpArray.set(color.x, color.y, color.z, 0);
        if (light->getUseColorTemperature()) {
            const auto &colorTemperatureRGB = light->getColorTemperatureRGB();
            tmpArray.x *= colorTemperatureRGB.x;
            tmpArray.y *= colorTemperatureRGB.y;
            tmpArray.z *= colorTemperatureRGB.z;
        }

        if (sharedData->isHDR) {
            tmpArray.w = light->getIlluminance() * sharedData->fpScale * _lightMeterScale;
        } else {
            tmpArray.w = light->getIlluminance() * exposure * _lightMeterScale;
        }

        _lightBufferData[offset + 0] = tmpArray.x;
        _lightBufferData[offset + 1] = tmpArray.y;
        _lightBufferData[offset + 2] = tmpArray.z;
        _lightBufferData[offset + 3] = tmpArray.w;

        // size range angle
        offset                       = idx * elementLen + fieldLen * 2;
        _lightBufferData[offset]     = light->getSize();
        _lightBufferData[offset + 1] = light->getRange();
        _lightBufferData[offset + 2] = 0;

        ++i;
        ++idx;
    }

    i = 0;
    for (auto *light : scene->getSpotLights()) {
        if (i >= _maxDeferredLights) {
            break;
        }

        const auto &position = light->getPosition();
        sphere.setCenter(position);
        sphere.setRadius(light->getRange());
        if (!sphere.sphereFrustum(camera->frustum)) {
            continue;
        }
        // position
        offset                       = idx * elementLen;
        _lightBufferData[offset]     = position.x;
        _lightBufferData[offset + 1] = position.y;
        _lightBufferData[offset + 2] = position.z;
        _lightBufferData[offset + 3] = 1;

        // color
        offset            = idx * elementLen + fieldLen;
        const auto &color = light->getColor();
        tmpArray.set(color.x, color.y, color.z, 0);
        if (light->getUseColorTemperature()) {
            const auto &colorTemperatureRGB = light->getColorTemperatureRGB();
            tmpArray.x *= colorTemperatureRGB.x;
            tmpArray.y *= colorTemperatureRGB.y;
            tmpArray.z *= colorTemperatureRGB.z;
        }

        if (sharedData->isHDR) {
            tmpArray.w = light->getIlluminance() * sharedData->fpScale * _lightMeterScale;
        } else {
            tmpArray.w = light->getIlluminance() * exposure * _lightMeterScale;
        }

        _lightBufferData[offset + 0] = tmpArray.x;
        _lightBufferData[offset + 1] = tmpArray.y;
        _lightBufferData[offset + 2] = tmpArray.z;
        _lightBufferData[offset + 3] = tmpArray.w;

        // size range angle
        offset                       = idx * elementLen + fieldLen * 2;
        _lightBufferData[offset]     = light->getSize();
        _lightBufferData[offset + 1] = light->getRange();
        _lightBufferData[offset + 2] = light->getSpotAngle();

        // dir
        const auto &direction        = light->getDirection();
        offset                       = idx * elementLen + fieldLen * 3;
        _lightBufferData[offset]     = direction.x;
        _lightBufferData[offset + 1] = direction.y;
        _lightBufferData[offset + 2] = direction.z;

        ++i;
        ++idx;
    }

    // the count of lights is set to cc_lightDir[0].w
    _lightBufferData[fieldLen * 3 + 3] = static_cast<float>(idx);
    cmdBuf->updateBuffer(_deferredLitsBufs, _lightBufferData.data());
}

void LightingStage::initLightingBuffer() {
    auto *const device = _pipeline->getDevice();

    // color/pos/dir/angle 都是vec4存储, 最后一个vec4只要x存储光源个数
    uint stride    = utils::alignTo(sizeof(Vec4) * 4, device->getCapabilities().uboOffsetAlignment);
    uint totalSize = stride * _maxDeferredLights;

    // create lighting buffer and view
    if (_deferredLitsBufs == nullptr) {
        gfx::BufferInfo bfInfo = {
            gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
            totalSize,
            stride,
        };
        _deferredLitsBufs = device->createBuffer(bfInfo);
    }

    if (_deferredLitsBufView == nullptr) {
        gfx::BufferViewInfo bvInfo = {_deferredLitsBufs, 0, totalSize};
        _deferredLitsBufView       = device->createBuffer(bvInfo);
        _descriptorSet->bindBuffer(static_cast<uint>(ModelLocalBindings::UBO_FORWARD_LIGHTS), _deferredLitsBufView);
    }

    _lightBufferData.resize(totalSize / sizeof(float));
}

void LightingStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);

    auto *const device = pipeline->getDevice();

    for (const auto &descriptor : _renderQueueDescriptors) {
        uint                  phase    = convertPhase(descriptor.stages);
        RenderQueueSortFunc   sortFunc = convertQueueSortFunc(descriptor.sortMode);
        RenderQueueCreateInfo info     = {descriptor.isTransparent, phase, sortFunc};
        _renderQueues.emplace_back(CC_NEW(RenderQueue(std::move(info))));
    }

    // create descriptor set/layout
    gfx::DescriptorSetLayoutInfo layoutInfo = {localDescriptorSetLayout.bindings};
    _descLayout                             = device->createDescriptorSetLayout(layoutInfo);

    gfx::DescriptorSetInfo setInfo = {_descLayout};
    _descriptorSet                 = device->createDescriptorSet(setInfo);

    // create lighting buffer and view
    initLightingBuffer();

    _planarShadowQueue = CC_NEW(PlanarShadowQueue(_pipeline));

    // create reflection resource
    RenderQueueCreateInfo info = {true, _reflectionPhaseID, transparentCompareFn};
    _reflectionComp            = new ReflectionComp();
    _reflectionComp->init(_device, 8, 8);

    _reflectionRenderQueue = CC_NEW(RenderQueue(std::move(info)));

    gfx::SamplerInfo samplerInfo;
    samplerInfo.minFilter = gfx::Filter::POINT;
    samplerInfo.magFilter = gfx::Filter::POINT;
    samplerInfo.addressU  = gfx::Address::CLAMP;
    samplerInfo.addressV  = gfx::Address::CLAMP;
    samplerInfo.addressW  = gfx::Address::CLAMP;
    _defaultSampler       = _device->getSampler(samplerInfo);
}

void LightingStage::destroy() {
    CC_SAFE_DESTROY(_descriptorSet);
    CC_SAFE_DESTROY(_descLayout);
    CC_SAFE_DESTROY(_planarShadowQueue);
    CC_SAFE_DELETE(_reflectionRenderQueue);
    RenderStage::destroy();

    CC_SAFE_DELETE(_reflectionComp);
}

void LightingStage::fgLightingPass(scene::Camera *camera) {
    // lighting info, ubo
    gatherLights(camera);
    _descriptorSet->update();

    struct RenderData {
        framegraph::TextureHandle gbuffer[4];  // read from gbuffer stage
        framegraph::TextureHandle lightOutput; // output texture
        framegraph::TextureHandle depth;
    };

    auto *     pipeline   = static_cast<DeferredPipeline *>(_pipeline);
    gfx::Color clearColor = pipeline->getClearcolor(camera);

    auto lightingSetup = [&](framegraph::PassNodeBuilder &builder, RenderData &data) {
        // read gbuffer
        for (int i = 0; i < 4; i++) {
            data.gbuffer[i] = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleGbufferTexture[i])));
            builder.writeToBlackboard(DeferredPipeline::fgStrHandleGbufferTexture[i], data.gbuffer[i]);
        }

        // read depth, as an attachment
        framegraph::RenderTargetAttachment::Descriptor depthAttachmentInfo;
        depthAttachmentInfo.usage         = framegraph::RenderTargetAttachment::Usage::DEPTH;
        depthAttachmentInfo.loadOp        = gfx::LoadOp::LOAD;
        depthAttachmentInfo.beginAccesses = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE};
        depthAttachmentInfo.endAccesses   = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE};

        data.depth = framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleDepthTexture));
        data.depth = builder.write(data.depth, depthAttachmentInfo);
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleDepthTexture, data.depth);

        // write to lighting output
        framegraph::Texture::Descriptor colorTexInfo;
        colorTexInfo.format = gfx::Format::RGBA16F;
        colorTexInfo.usage  = gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED;
        colorTexInfo.width  = pipeline->getWidth();
        colorTexInfo.height = pipeline->getHeight();
        data.lightOutput    = builder.create<framegraph::Texture>(DeferredPipeline::fgStrHandleLightingOutTexture, colorTexInfo);

        framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
        colorAttachmentInfo.usage         = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorAttachmentInfo.loadOp        = gfx::LoadOp::CLEAR;
        colorAttachmentInfo.clearColor    = clearColor;
        colorAttachmentInfo.beginAccesses = {gfx::AccessType::FRAGMENT_SHADER_READ_TEXTURE};
        colorAttachmentInfo.endAccesses   = {gfx::AccessType::FRAGMENT_SHADER_READ_TEXTURE};
        data.lightOutput                  = builder.write(data.lightOutput, colorAttachmentInfo);
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleLightingOutTexture, data.lightOutput);

        // set render area
        auto          renderArea = pipeline->getRenderArea(camera, false);
        gfx::Viewport viewport{renderArea.x, renderArea.y, renderArea.width, renderArea.height, 0.F, 1.F};
        builder.setViewport(viewport, renderArea);
    };

    auto lightingExec = [this, camera](RenderData const &data, const framegraph::DevicePassResourceTable &table) {
        auto *      pipeline  = static_cast<DeferredPipeline *>(_pipeline);
        auto *const sceneData = pipeline->getPipelineSceneData();

        auto *       cmdBuff        = pipeline->getCommandBuffers()[0];
        vector<uint> dynamicOffsets = {0};
        cmdBuff->bindDescriptorSet(localSet, _descriptorSet, dynamicOffsets);

        uint const globalOffsets[] = {pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
        cmdBuff->bindDescriptorSet(globalSet, pipeline->getDescriptorSet(), static_cast<uint>(std::size(globalOffsets)), globalOffsets);
        // get PSO and draw quad
        auto rendeArea = pipeline->getRenderArea(camera, false);

        scene::Pass *        pass           = sceneData->getSharedData()->deferredLightPass;
        gfx::Shader *        shader         = sceneData->getSharedData()->deferredLightPassShader;
        gfx::InputAssembler *inputAssembler = pipeline->getIAByRenderArea(rendeArea);
        gfx::PipelineState * pState         = PipelineStateManager::getOrCreatePipelineState(
            pass, shader, inputAssembler, table.getRenderPass());

        for (uint i = 0; i < DeferredPipeline::GBUFFER_COUNT; ++i) {
            pass->getDescriptorSet()->bindTexture(i, table.getRead(data.gbuffer[i]));
            pass->getDescriptorSet()->bindSampler(i, _defaultSampler);
        }
        pass->getDescriptorSet()->update();

        cmdBuff->bindPipelineState(pState);
        cmdBuff->bindInputAssembler(inputAssembler);
        cmdBuff->bindDescriptorSet(materialSet, pass->getDescriptorSet());
        cmdBuff->draw(inputAssembler);
    };

    pipeline->getFrameGraph().addPass<RenderData>(static_cast<uint>(DeferredInsertPoint::IP_LIGHTING), DeferredPipeline::fgStrHandleLightingPass, lightingSetup, lightingExec);
}

void LightingStage::fgTransparent(scene::Camera *camera) {
    struct RenderData {
        framegraph::TextureHandle lightOutput; // output texture
        framegraph::TextureHandle depth;
    };

    auto *     pipeline   = static_cast<DeferredPipeline *>(_pipeline);
    gfx::Color clearColor = pipeline->getClearcolor(camera);

    auto transparentSetup = [&](framegraph::PassNodeBuilder &builder, RenderData &data) {
        // write to lighting output
        framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
        colorAttachmentInfo.usage         = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorAttachmentInfo.loadOp        = gfx::LoadOp::LOAD;
        colorAttachmentInfo.beginAccesses = {gfx::AccessType::FRAGMENT_SHADER_READ_TEXTURE};
        colorAttachmentInfo.endAccesses   = {gfx::AccessType::FRAGMENT_SHADER_READ_TEXTURE};

        data.lightOutput       = framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleLightingOutTexture));
        bool lightingPassValid = data.lightOutput.isValid();
        if (!lightingPassValid) {
            framegraph::Texture::Descriptor colorTexInfo;
            colorTexInfo.format = gfx::Format::RGBA16F;
            colorTexInfo.usage  = gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED;
            colorTexInfo.width  = pipeline->getWidth();
            colorTexInfo.height = pipeline->getHeight();

            colorAttachmentInfo.loadOp     = gfx::LoadOp::CLEAR;
            colorAttachmentInfo.clearColor = clearColor;

            data.lightOutput = builder.create<framegraph::Texture>(DeferredPipeline::fgStrHandleLightingOutTexture, colorTexInfo);
        }

        data.lightOutput = builder.write(data.lightOutput, colorAttachmentInfo);
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleLightingOutTexture, data.lightOutput);

        framegraph::RenderTargetAttachment::Descriptor depthAttachmentInfo;
        depthAttachmentInfo.usage         = framegraph::RenderTargetAttachment::Usage::DEPTH;
        depthAttachmentInfo.loadOp        = gfx::LoadOp::LOAD;
        depthAttachmentInfo.beginAccesses = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE};
        depthAttachmentInfo.endAccesses   = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE};

        data.depth = framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleDepthTexture));
        if (!data.depth.isValid()) { // when there is no opaque object present
            gfx::TextureInfo depthTexInfo = {
                gfx::TextureType::TEX2D,
                gfx::TextureUsageBit::DEPTH_STENCIL_ATTACHMENT,
                gfx::Format::DEPTH_STENCIL,
                pipeline->getWidth(),
                pipeline->getHeight(),
            };
            data.depth = builder.create<framegraph::Texture>(DeferredPipeline::fgStrHandleDepthTexture, depthTexInfo);
        }
        data.depth = builder.write(data.depth, depthAttachmentInfo);
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleDepthTexture, data.depth);

        // set render area
        auto          renderArea = pipeline->getRenderArea(camera, false);
        gfx::Viewport viewport{renderArea.x, renderArea.y, renderArea.width, renderArea.height, 0.F, 1.F};
        builder.setViewport(viewport, renderArea);
    };

    auto transparentExec = [this](RenderData const & /*data*/, const framegraph::DevicePassResourceTable &table) {
        auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);
        auto *cmdBuff  = pipeline->getCommandBuffers()[0];

        vector<uint> dynamicOffsets = {0};
        cmdBuff->bindDescriptorSet(localSet, _descriptorSet, dynamicOffsets);

        uint const globalOffsets[] = {pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
        cmdBuff->bindDescriptorSet(globalSet, pipeline->getDescriptorSet(), static_cast<uint>(std::size(globalOffsets)), globalOffsets);

        // transparent
        for (auto *queue : _renderQueues) {
            queue->sort();
            queue->recordCommandBuffer(pipeline->getDevice(), table.getRenderPass(), cmdBuff);
        }

        //_planarShadowQueue->recordCommandBuffer(_device, renderPass, cmdBuff);
    };

    putTransparentObj2Queue();

    bool empty = true;
    for (auto *node : _renderQueues) {
        if (!node->empty()) {
            empty = false;
            break;
        }
    }

    if (!empty) {
        pipeline->getFrameGraph().addPass<RenderData>(static_cast<uint>(DeferredInsertPoint::IP_TRANSPARENT),
                                                      DeferredPipeline::fgStrHandleTransparentPass, transparentSetup, transparentExec);
    }
}

void LightingStage::putTransparentObj2Queue() {
    for (auto *queue : _renderQueues) {
        queue->clear();
    }

    auto *const sceneData     = _pipeline->getPipelineSceneData();
    const auto &renderObjects = sceneData->getRenderObjects();

    uint   m = 0;
    uint   p = 0;
    size_t k = 0;
    for (auto ro : renderObjects) {
        const auto *const model = ro.model;
        for (auto *subModel : model->getSubModels()) {
            for (auto *pass : subModel->getPasses()) {
                // TODO(xwx): need to fallback unlit and gizmo material.
                if (pass->getPhase() != _phaseID) continue;
                for (k = 0; k < _renderQueues.size(); k++) {
                    _renderQueues[k]->insertRenderPass(ro, m, p);
                }
            }
        }
    }
}

void LightingStage::fgSsprPass(scene::Camera *camera) {
    // The max reflector objects is 5.
    // for each reflector, there are 4 pass, clear pass/reflection pass/denoise pass/render pass
    // each reflector has its own denoise texture, and will be used in render pass
    // All the reflectors use the same reflect texture which is temp resource for the reflectors, and the reflect texture should be cleared for each reflector
    // we first calculate denoise textures of all reflectors one by one, the first 3 pass will be executed
    // then we render all reflectors one by one, the last render pass will be executed

    if (!_device->hasFeature(gfx::Feature::COMPUTE_SHADER)) {
        return;
    }
    auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);

    _denoiseIndex = 0;
    _matViewProj  = camera->matViewProj;
    _reflectionElems.clear();

    // step 1 prepare clear model's reflection texture pass. should switch to image clear command after available
    uint minSize   = 512;
    _ssprTexWidth  = pipeline->getWidth();
    _ssprTexHeight = pipeline->getHeight();
    if (_ssprTexHeight < _ssprTexWidth) {
        _ssprTexWidth  = minSize * _ssprTexWidth / _ssprTexHeight;
        _ssprTexHeight = minSize;
    } else {
        _ssprTexWidth  = minSize;
        _ssprTexHeight = minSize * _ssprTexHeight / _ssprTexWidth;
    }

    struct DataClear {
        framegraph::TextureHandle reflection;
    };

    auto clearSetup = [&](framegraph::PassNodeBuilder &builder, DataClear &data) {
        framegraph::Texture::Descriptor colorTexInfo;
        colorTexInfo.format = gfx::Format::RGBA8;
        colorTexInfo.usage  = gfx::TextureUsageBit::STORAGE | gfx::TextureUsageBit::SAMPLED | gfx::TextureUsageBit::TRANSFER_SRC | gfx::TextureUsageBit::TRANSFER_DST;
        colorTexInfo.width  = _ssprTexWidth;
        colorTexInfo.height = _ssprTexHeight;
        data.reflection     = builder.create<framegraph::Texture>(reflectTexHandle, colorTexInfo);

        framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
        colorAttachmentInfo.usage       = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorAttachmentInfo.loadOp      = gfx::LoadOp::CLEAR;
        colorAttachmentInfo.clearColor  = {0.F, 0.F, 0.F, 0.F};
        colorAttachmentInfo.endAccesses = {gfx::AccessType::COMPUTE_SHADER_WRITE};
        data.reflection                 = builder.write(data.reflection, colorAttachmentInfo);
        builder.writeToBlackboard(reflectTexHandle, data.reflection);
        builder.sideEffect();
    };

    auto clearExec = [](DataClear const &data, const framegraph::DevicePassResourceTable &table) {};

    // step 2 prepare compute the reflection pass, contain 1 dispatch commands, compute pipeline
    struct DataCompReflect {
        framegraph::TextureHandle reflection;      // compute result texture
        framegraph::TextureHandle lightingOut;     // read from lighting pass output texture
        framegraph::TextureHandle gbufferPosition; // read from gbuffer.positon texture
    };

    auto compReflectSetup = [&](framegraph::PassNodeBuilder &builder, DataCompReflect &data) {
        // if there is no attachment in the pass, render pass will not be created
        // read lighting out as input
        data.lightingOut = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleLightingOutTexture)));
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleLightingOutTexture, data.lightingOut);

        // read gbufferPosition as input
        data.gbufferPosition = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleGbufferTexture[1])));
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleGbufferTexture[1], data.gbufferPosition);

        // write to reflection
        data.reflection = framegraph::TextureHandle(builder.readFromBlackboard(reflectTexHandle));
        if (!data.reflection.isValid()) {
            framegraph::Texture::Descriptor colorTexInfo;
            colorTexInfo.format = gfx::Format::RGBA8;
            colorTexInfo.usage  = gfx::TextureUsageBit::STORAGE | gfx::TextureUsageBit::SAMPLED | gfx::TextureUsageBit::TRANSFER_SRC | gfx::TextureUsageBit::TRANSFER_DST;
            colorTexInfo.width  = _ssprTexWidth;
            colorTexInfo.height = _ssprTexHeight;
            data.reflection     = builder.create<framegraph::Texture>(reflectTexHandle, colorTexInfo);
        }

        data.reflection = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(reflectTexHandle)));
        builder.writeToBlackboard(reflectTexHandle, data.reflection);

        data.reflection = builder.write(data.reflection);
        builder.writeToBlackboard(reflectTexHandle, data.reflection);
    };

    auto compReflectExec = [this](DataCompReflect const &data, const framegraph::DevicePassResourceTable &table) {
        auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);

        _reflectionComp->applyTexSize(_ssprTexWidth, _ssprTexHeight, _matViewProj);

        auto *texReflection  = static_cast<gfx::Texture *>(table.getWrite(data.reflection));
        auto *texLightingOut = static_cast<gfx::Texture *>(table.getRead(data.lightingOut));
        auto *texPositon     = static_cast<gfx::Texture *>(table.getRead(data.gbufferPosition));

        // step 1 pipeline barrier before exec
        auto *cmdBuff = pipeline->getCommandBuffers()[0];
        cmdBuff->pipelineBarrier(_reflectionComp->getBarrierPre());

        // step 2 bind descriptors
        // layout(set = 0, binding = 0) uniform Constants {  mat4 matViewProj; vec2 texSize; };
        // layout(set = 0, binding = 1) uniform sampler2D lightingTex;
        // layout(set = 0, binding = 2) uniform sampler2D worldPositionTex;
        // layout(set = 0, binding = 3, rgba8) writeonly uniform lowp image2D reflectionTex;
        // set 0
        gfx::DescriptorSet *reflectDesc = _reflectionComp->getDescriptorSet();
        gfx::Sampler *      sampler     = _reflectionComp->getSampler();
        gfx::Buffer *       constBuffer = _reflectionComp->getConstantsBuffer();

        reflectDesc->bindBuffer(0, constBuffer);
        reflectDesc->bindSampler(1, sampler);
        reflectDesc->bindTexture(1, texLightingOut);
        reflectDesc->bindSampler(2, sampler);
        reflectDesc->bindTexture(2, texPositon);
        reflectDesc->bindTexture(3, texReflection);
        reflectDesc->bindBuffer(4, _reflectionElems[_denoiseIndex].set->getBuffer(0));
        reflectDesc->update();

        // set 1, subModel->getDescriptorSet(0)
        cmdBuff->bindPipelineState(const_cast<gfx::PipelineState *>(_reflectionComp->getPipelineState()));
        cmdBuff->bindDescriptorSet(globalSet, reflectDesc);
        cmdBuff->dispatch(_reflectionComp->getDispatchInfo());
    };

    // step 3 prepare compute the denoise pass, contain 1 dispatch commands, compute pipeline
    struct DataCompDenoise {
        framegraph::TextureHandle denoise;    // each reflector has its own denoise texture
        framegraph::TextureHandle reflection; // the texture from last pass
    };

    auto compDenoiseSetup = [&](framegraph::PassNodeBuilder &builder, DataCompDenoise &data) {
        // if there is no attachment in the pass, render pass will not be created
        // read reflectTexHandle
        data.reflection = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(reflectTexHandle)));
        builder.writeToBlackboard(reflectTexHandle, data.reflection);

        // write to reflection
        framegraph::Texture::Descriptor colorTexInfo;
        colorTexInfo.format = gfx::Format::RGBA8;
        colorTexInfo.usage  = gfx::TextureUsageBit::STORAGE | gfx::TextureUsageBit::SAMPLED | gfx::TextureUsageBit::TRANSFER_SRC;
        colorTexInfo.width  = _ssprTexWidth;
        colorTexInfo.height = _ssprTexHeight;
        data.denoise        = builder.create<framegraph::Texture>(denoiseTexHandle[_denoiseIndex], colorTexInfo);

        data.denoise = builder.write(data.denoise);
        builder.writeToBlackboard(denoiseTexHandle[_denoiseIndex], data.denoise);
    };

    auto compDenoiseExec = [this](DataCompDenoise const &data, const framegraph::DevicePassResourceTable &table) {
        auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);

        auto *denoiseTex    = static_cast<gfx::Texture *>(table.getWrite(data.denoise));
        auto *reflectionTex = static_cast<gfx::Texture *>(table.getRead(data.reflection));
        auto &elem       = _reflectionElems[_denoiseIndex];

        // pipeline barrier
        auto *cmdBuff = pipeline->getCommandBuffers()[0];
        cmdBuff->pipelineBarrier(nullptr, const_cast<gfx::TextureBarrierList &>(_reflectionComp->getBarrierBeforeDenoise()), {reflectionTex, denoiseTex});

        // bind descriptor set
        _reflectionComp->getDenoiseDescriptorSet()->bindTexture(0, reflectionTex);
        _reflectionComp->getDenoiseDescriptorSet()->bindSampler(0, _reflectionComp->getSampler());
        _reflectionComp->getDenoiseDescriptorSet()->update();

        elem.set->bindTexture(static_cast<uint>(ModelLocalBindings::STORAGE_REFLECTION), denoiseTex);
        elem.set->bindSampler(static_cast<uint>(ModelLocalBindings::STORAGE_REFLECTION), _defaultSampler);

        // for render stage usage
        elem.set->bindTexture(static_cast<uint>(ModelLocalBindings::SAMPLER_REFLECTION), denoiseTex);
        elem.set->bindSampler(static_cast<uint>(ModelLocalBindings::SAMPLER_REFLECTION), _defaultSampler);
        elem.set->update();

        cmdBuff->bindPipelineState(const_cast<gfx::PipelineState *>(_reflectionComp->getDenoisePipelineState()));
        cmdBuff->bindDescriptorSet(globalSet, const_cast<gfx::DescriptorSet *>(_reflectionComp->getDenoiseDescriptorSet()));
        cmdBuff->bindDescriptorSet(materialSet, elem.set);
        cmdBuff->dispatch(_reflectionComp->getDenioseDispatchInfo());

        // pipeline barrier
        // dispatch -> fragment
        cmdBuff->pipelineBarrier(nullptr, _reflectionComp->getBarrierAfterDenoise(), {denoiseTex});

        _denoiseIndex = (_denoiseIndex + 1) % _reflectionElems.size();
    };

    // step 4 prepare render reflector objects pass, graphics pipeline
    struct DataRender {
        framegraph::TextureHandle denoise;     // input texture
        framegraph::TextureHandle lightingOut; // attachment, load and write
        framegraph::TextureHandle depth;       // attachment, load and write
    };

    auto renderSetup = [&](framegraph::PassNodeBuilder &builder, DataRender &data) {
        data.denoise = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(denoiseTexHandle[_denoiseIndex])));
        builder.writeToBlackboard(denoiseTexHandle[_denoiseIndex], data.denoise);

        // write lighting out, as an attachment
        framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
        colorAttachmentInfo.usage         = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorAttachmentInfo.loadOp        = gfx::LoadOp::LOAD;
        colorAttachmentInfo.clearColor    = gfx::Color();
        colorAttachmentInfo.beginAccesses = {gfx::AccessType::FRAGMENT_SHADER_READ_TEXTURE};
        colorAttachmentInfo.endAccesses   = {gfx::AccessType::FRAGMENT_SHADER_READ_TEXTURE};

        data.lightingOut = builder.write(framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleLightingOutTexture)), colorAttachmentInfo);
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleLightingOutTexture, data.lightingOut);

        // read depth, as an attachment
        framegraph::RenderTargetAttachment::Descriptor depthAttachmentInfo;
        depthAttachmentInfo.usage         = framegraph::RenderTargetAttachment::Usage::DEPTH;
        depthAttachmentInfo.loadOp        = gfx::LoadOp::LOAD;
        depthAttachmentInfo.clearColor    = gfx::Color();
        depthAttachmentInfo.beginAccesses = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_READ};
        depthAttachmentInfo.endAccesses   = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_READ};

        data.depth = builder.write(framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleDepthTexture)), depthAttachmentInfo);
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleDepthTexture, data.depth);

        auto          renderArea = pipeline->getRenderArea(camera, false);
        gfx::Viewport viewport{renderArea.x, renderArea.y, renderArea.width, renderArea.height, 0.F, 1.F};
        builder.setViewport(viewport, renderArea);
    };

    auto renderExec = [this](DataRender const &data, const framegraph::DevicePassResourceTable &table) {
        auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);
        auto *cmdBuff  = pipeline->getCommandBuffers()[0];
        auto &elem     = _reflectionElems[_denoiseIndex];

        // bind descriptor
        cmdBuff->bindDescriptorSet(globalSet, pipeline->getDescriptorSet());

        gfx::DescriptorSet *descLocal  = elem.set; // sub model descriptor set
        auto *              denoiseTex = static_cast<gfx::Texture *>(table.getRead(data.denoise));

        descLocal->bindTexture(static_cast<uint>(ModelLocalBindings::SAMPLER_REFLECTION), denoiseTex);
        descLocal->bindSampler(static_cast<uint>(ModelLocalBindings::SAMPLER_REFLECTION), _defaultSampler);
        descLocal->update();
        cmdBuff->bindDescriptorSet(localSet, descLocal);

        _reflectionRenderQueue->clear();
        _reflectionRenderQueue->insertRenderPass(elem.renderObject, elem.modelIndex, elem.passIndex);

        gfx::RenderPass *renderPass = table.getRenderPass();
        _reflectionRenderQueue->sort();
        _reflectionRenderQueue->recordCommandBuffer(pipeline->getDevice(), renderPass, cmdBuff);
    };

    // step 5 add framegraph passes
    auto *const sceneData     = _pipeline->getPipelineSceneData();
    const auto &renderObjects = sceneData->getRenderObjects();
    uint        m             = 0;
    uint        p             = 0;
    for (const auto &ro : renderObjects) {
        const auto *model     = ro.model;
        const auto &subModels = model->getSubModels();
        for (m = 0; m < subModels.size(); ++m) {
            const auto &subModel  = subModels[m];
            const auto &passes    = subModel->getPasses();
            auto        passCount = passes.size();
            for (p = 0; p < passCount; ++p) {
                auto *pass = passes[p];
                if (pass->getPhase() == _reflectionPhaseID) {
                    RenderElem elem = {ro, subModel->getDescriptorSet(), m, p};
                    _reflectionElems.push_back(elem);
                }
            }
        }
    }

    uint insertPoint = static_cast<uint>(DeferredInsertPoint::IP_SSPR);
    for (uint i = 0; i < _reflectionElems.size(); ++i) {
        // add clear and comp passes here
        pipeline->getFrameGraph().addPass<DataClear>(insertPoint++, ssprClearPass[i], clearSetup, clearExec);
        pipeline->getFrameGraph().addPass<DataCompReflect>(insertPoint++, ssprCompReflectPass[i], compReflectSetup, compReflectExec);
        pipeline->getFrameGraph().addPass<DataCompDenoise>(insertPoint++, ssprCompDenoisePass[i], compDenoiseSetup, compDenoiseExec);
    }

    for (uint i = 0; i < _reflectionElems.size(); ++i) {
        // add graphic pass here
        pipeline->getFrameGraph().addPass<DataRender>(insertPoint++, ssprRenderPass[i], renderSetup, renderExec);
    }
}

void LightingStage::render(scene::Camera *camera) {
    auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);

    // if gbuffer pass does not exist, skip lighting pass.
    // transparent objects draw after lighting pass, can be automatically merged by FG
    if (pipeline->getFrameGraph().hasPass(DeferredPipeline::fgStrHandleGbufferPass)) {
        fgLightingPass(camera);
    }

    fgTransparent(camera);

    // if lighting pass does not exist, skip SSPR pass.
    // switch to clear image API when available
    if (pipeline->getFrameGraph().hasPass(DeferredPipeline::fgStrHandleLightingPass)) {
        fgSsprPass(camera);
    }
}

} // namespace pipeline
} // namespace cc
