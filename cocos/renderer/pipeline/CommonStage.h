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

#pragma once

#include "./RenderStage.h"

namespace cc {
namespace pipeline {

class RenderFlow;
struct Camera;

class CC_DLL CommonStage : public RenderStage {
public:

    CommonStage();
    ~CommonStage() override;

    void render(Camera *camera) override;

    void setDirty(bool dirty) { _dirty = dirty; }
    void setRenderArea(const gfx::Rect &renderArea) { _renderArea = renderArea; }
    void setClearColor(const gfx::Color &color) { _clearColor = color; }
    void setClearDepth(float clearDepth) { _clearDepth = clearDepth; }
    void setClearStencil(uint32_t clearStencil) { _clearStencil = clearStencil; }
    void setFramebuffer(gfx::Framebuffer *framebuffer) { _framebuffer = framebuffer; }
    void setInputAssembler(gfx::InputAssembler *inputAssembler) { _inputAssembler = inputAssembler; }
    void setPipelineState(gfx::PipelineState *pipelineState) { _pipelineState = pipelineState; }
    void setPassHandle(uint32_t pass) { _passHandle = pass; }

private:
    bool _dirty = true;

    gfx::Rect              _renderArea;
    gfx::Color             _clearColor = { 0, 0, 0, 1 };
    float                  _clearDepth = 1;
    uint32_t               _clearStencil = 1;

    uint32_t                _passHandle = 0;
    gfx::Framebuffer        *_framebuffer = nullptr;
    gfx::InputAssembler     *_inputAssembler = nullptr;
    gfx::PipelineState      *_pipelineState  = nullptr;
};

} // namespace pipeline
} // namespace cc
