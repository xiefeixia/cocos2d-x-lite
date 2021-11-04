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

#include "../RenderStage.h"
#include "scene/Pass.h"
#include "frame-graph/FrameGraph.h"

namespace cc {
namespace pipeline {

class RenderFlow;


class CC_DLL BaseStage : public RenderStage {
public:
    BaseStage();
    ~BaseStage() override;

    void setCamera(scene::Camera *camera) { _camera = camera; }
    scene::Camera *getCamera() { return _camera; }

    void setPass(scene::Pass *pass) { _pass = pass; }
    scene::Pass *getPass() { return _pass; }

    void setShader(gfx::Shader *shader) { _shader = shader; }
    gfx::Shader *getShader() { return _shader; }

    void setDirty(bool dirty) { _dirty = dirty; }

protected:
    scene::Camera *_camera{nullptr};

    scene::Pass *_pass{nullptr};
    gfx::Shader *_shader{nullptr};

    bool _dirty{false};
};

} // namespace pipeline
} // namespace cc
