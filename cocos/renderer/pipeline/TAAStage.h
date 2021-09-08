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
#include "scene/Pass.h"
#include "frame-graph/FrameGraph.h"

namespace cc {
namespace pipeline {

class RenderFlow;


class CC_DLL TAAStage : public RenderStage {
public:

    TAAStage();
    ~TAAStage() override;

    void render(scene::Camera *camera) override;
    void activate(RenderPipeline *pipeline, RenderFlow *flow) override;

    void setCamera(scene::Camera *camera) { _camera = camera; }
    scene::Camera *getCamera() { return _camera; }

    void setPass(scene::Pass *pass) { _taaPass = pass; }
    scene::Pass *getPass() { return _taaPass; }

    void setShader(gfx::Shader *shader) { _taaShader = shader; }
    gfx::Shader *getShader() { return _taaShader; }

    void setDirty(bool dirty) { _dirty = dirty; }

private:
    scene::Camera *_camera{nullptr};
    gfx::Sampler * _linearSampler{nullptr};

    scene::Pass *  _taaPass;
    gfx::Shader *  _taaShader;

    framegraph::Texture _taaTextures[2];

    bool _dirty{false};
    bool _initPrev{false};
};

} // namespace pipeline
} // namespace cc
