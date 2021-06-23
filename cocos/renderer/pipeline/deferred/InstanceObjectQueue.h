/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "base/CoreStd.h"
#include "cocos/bindings/jswrapper/Object.h"

namespace cc {

namespace gfx {
class Device;
class RenderPass;
class CommandBuffer;
} // namespace gfx

namespace pipeline {

class InstancedBuffer;
struct Camera;

class CC_DLL InstanceObjectQueue : public Object {
public:
    InstanceObjectQueue() = default;
    ~InstanceObjectQueue() = default;

    void setLayer (uint layer) { _layer = layer; }
    void setPhase(uint phase) { _phase = phase; }
    void recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer, Camera *camera);
    void add(InstancedBuffer *instancedBuffer);
    void uploadBuffers();
    void clear();

    void setNativeDataArray(se::Object *dataArray);
    void processNativeDataArray(uint count);

    static void mergeInstance(InstancedBuffer *buffer, uint modelHandle, uint subModelHandle, uint passIdx);
    static InstancedBuffer *createInstanceBuffer(uint passHandle);

private:
    uint                             _layer = 0;
    uint                             _phase = 0;
    unordered_set<InstancedBuffer *> _queues;
    se::Object *                     _dataArray = nullptr;
};

} // namespace pipeline
} // namespace cc
