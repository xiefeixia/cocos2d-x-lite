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

#include "CommonStage.h"
#include "./PipelineStateManager.h"
#include "./helper/SharedMemory.h"
#include "RenderPipeline.h"
#include "RenderFlow.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXFramebuffer.h"
#include "gfx-base/GFXQueue.h"

#include "./deferred/DeferredPipeline.h"

namespace cc {
namespace pipeline {


CommonStage::CommonStage() = default;

CommonStage::~CommonStage() {
}


void CommonStage::render(Camera *camera) {

    if (_framebuffer == nullptr || _inputAssembler == nullptr || _pipelineState == nullptr || !_dirty) {
        return;
    }

    PassView *pass = GET_PASS(_passHandle);
    if (pass == nullptr) {
        return;
    }

    //_dirty = false;

    gfx::CommandBuffer *cmdBuff = _pipeline->getCommandBuffers()[0];

    auto *renderPass = _framebuffer->getRenderPass();

    cmdBuff->beginRenderPass(renderPass, _framebuffer, _renderArea, &_clearColor, _clearDepth, _clearStencil);
    cmdBuff->bindDescriptorSet((uint32_t)cc::pipeline::SetIndex::GLOBAL, _pipeline->getDescriptorSet());
    cmdBuff->bindDescriptorSet((uint32_t)cc::pipeline::SetIndex::MATERIAL, pass->getDescriptorSet());
    cmdBuff->bindPipelineState(_pipelineState);
    cmdBuff->bindInputAssembler(_inputAssembler);
    cmdBuff->draw(_inputAssembler);
    cmdBuff->endRenderPass();
}

} // namespace pipeline
} // namespace cc
