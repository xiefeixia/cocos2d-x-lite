/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "MTLStd.h"

#include "MTLDevice.h"
#include "MTLGPUObjects.h"
#include "MTLShader.h"
#import <Metal/MTLDevice.h>

namespace cc {
namespace gfx {

CCMTLShader::CCMTLShader() : Shader() {
    _typedID = generateObjectID<decltype(this)>();
}

CCMTLShader::~CCMTLShader() {
    destroy();
}

void CCMTLShader::doInit(const ShaderInfo &info) {
    _gpuShader = CC_NEW(CCMTLGPUShader);
    _specializedFragFuncs = [[NSMutableDictionary alloc] init];
    
    for (const auto &stage : _stages) {
        if (!createMTLFunction(stage)) {
            destroy();
            return;
        }
    }

    setAvailableBufferBindingIndex();

    CC_LOG_INFO("%s compile succeed.", _name.c_str());
}

void CCMTLShader::doDestroy() {
    id<MTLLibrary> vertLib = _vertLibrary;
    _vertFunction       = nil;
    id<MTLLibrary> fragLib = _fragLibrary;
    _fragFunction     = nil;
    id<MTLLibrary> cmptLib = _cmptLibrary;
    _cmptFunction      = nil;
    
    id<MTLFunction> vertFunc = _vertFunction;
    _vertFunction       = nil;
    id<MTLFunction> fragFunc = _fragFunction;
    _fragFunction     = nil;
    id<MTLFunction> cmptFunc = _cmptFunction;
    _cmptFunction      = nil;
    
    // [_specializedFragFuncs release];
    const auto specFragFuncs = [_specializedFragFuncs retain];
    [_specializedFragFuncs release];

    CC_SAFE_DELETE(_gpuShader);

    std::function<void(void)> destroyFunc = [=]() {
        if(specFragFuncs.count > 0) {
            for (NSString* key in [specFragFuncs allKeys]) {
                [[specFragFuncs valueForKey:key] release];
            }
        }
        [specFragFuncs release];
        
        if (vertFunc) {
            [vertFunc release];
        }
        if (fragFunc) {
            [fragFunc release];
        }
        if (cmptFunc) {
            [cmptFunc release];
        }
        
        if(vertLib) {
            [vertLib release];
        }
        if(fragLib) {
            [fragLib release];
        }
        if(cmptLib) {
            [cmptLib release];
        }
    };
    CCMTLGPUGarbageCollectionPool::getInstance()->collect(destroyFunc);
}

bool CCMTLShader::createMTLFunction(const ShaderStage &stage) {
    bool isVertexShader   = false;
    bool isFragmentShader = false;
    bool isComputeShader  = false;

    if (stage.stage == ShaderStageFlagBit::VERTEX) {
        isVertexShader = true;
    } else if (stage.stage == ShaderStageFlagBit::FRAGMENT) {
        isFragmentShader = true;        
    } else if (stage.stage == ShaderStageFlagBit::COMPUTE) {
        isComputeShader = true;
    }

    id<MTLDevice> mtlDevice = id<MTLDevice>(CCMTLDevice::getInstance()->getMTLDevice());

    auto mtlShader = mu::compileGLSLShader2Msl(stage.source,
                                               stage.stage,
                                               CCMTLDevice::getInstance(),
                                               _gpuShader);

    NSString * rawSrc = [NSString stringWithUTF8String:stage.source.c_str()];
    NSString *     shader  = [NSString stringWithUTF8String:mtlShader.c_str()];
    NSError *      error   = nil;
    MTLCompileOptions *opts = [[MTLCompileOptions alloc] init];;
    //opts.languageVersion = MTLLanguageVersion2_3;
    id<MTLLibrary> &library = isVertexShader ? _vertLibrary : isFragmentShader ? _fragLibrary : _cmptLibrary;
    String shaderStage = isVertexShader ? "vertex" : isFragmentShader ? "fragment" : "compute";
    
    library = [mtlDevice newLibraryWithSource:shader options:opts error:&error];
    [opts release];
    if (!library) {
        CC_LOG_ERROR("Can not compile %s shader: %s", shaderStage.c_str(), [[error localizedDescription] UTF8String]);
        CC_LOG_ERROR("%s", stage.source.c_str());
        return false;
    }

    if (isVertexShader) {
        _vertFunction = [library newFunctionWithName:@"main0"];
        if (!_vertFunction) {
            [library release];
            CC_LOG_ERROR("Can not create vertex function: main0");
            return false;
        }
    } else if (isFragmentShader) {
        _fragFunction = [library newFunctionWithName:@"main0"];
        if (!_fragFunction) {
            [library release];
            CC_LOG_ERROR("Can not create fragment function: main0");
            return false;
        }
    } else if (isComputeShader) {
        _cmptFunction = [library newFunctionWithName:@"main0"];
        if (!_cmptFunction) {
            [library release];
            CC_LOG_ERROR("Can not create compute function: main0");
            return false;
        }
    } else {
        [library release];
        CC_LOG_ERROR("Shader type not supported yet!");
        return false;
    }

#ifdef DEBUG_SHADER
    if (isVertexShader) {
        _vertGlslShader = stage.source;
        _vertMtlShader  = mtlShader;
    } else if (isFragmenShader) {
        _fragGlslShader = stage.source;
        _fragMtlShader  = mtlShader;
    } else if (isComputeShader) {
        _cmptGlslShader = stage.source;
        _cmptMtlShader  = mtlShader;
    }
#endif
    return true;
}

id<MTLFunction> CCMTLShader::getSpecializedFragFunction(uint* index, int* val, uint count) {
    uint notEvenHash = 0;
    for (size_t i = 0; i < count; i++) {
        notEvenHash += val[i] * std::pow(10, index[i]);
    }
    
    NSString *hashStr = [NSString stringWithFormat:@"%d", notEvenHash];
    id<MTLFunction> specFunc = [_specializedFragFuncs objectForKey:hashStr];
    if(!specFunc) {
        MTLFunctionConstantValues* constantValues = [MTLFunctionConstantValues new];
        for (size_t i = 0; i < count; i++) {
            [constantValues setConstantValue:&val[i] type:MTLDataTypeInt atIndex:index[i]];
        }
        
        NSError *      error   = nil;
        id<MTLFunction> specFragFunc = [_fragLibrary newFunctionWithName:@"main0" constantValues:constantValues error:&error];
        [constantValues release];
        if (!specFragFunc) {
            CC_LOG_ERROR("Can not specialize shader: %s", [[error localizedDescription] UTF8String]);
        }
        [_specializedFragFuncs setObject:specFragFunc forKey:hashStr];
    }
    return [_specializedFragFuncs valueForKey:hashStr];
}

uint CCMTLShader::getAvailableBufferBindingIndex(ShaderStageFlagBit stage, uint stream) {
    if (hasFlag(stage, ShaderStageFlagBit::VERTEX)) {
        return _availableVertexBufferBindingIndex.at(stream);
    }

    if (hasFlag(stage, ShaderStageFlagBit::FRAGMENT)) {
        return _availableFragmentBufferBindingIndex.at(stream);
    }

    CC_LOG_ERROR("getAvailableBufferBindingIndex: invalid shader stage %d", stage);
    return 0;
}

void CCMTLShader::setAvailableBufferBindingIndex() {
    uint usedVertexBufferBindingIndexes   = 0;
    uint usedFragmentBufferBindingIndexes = 0;
    uint vertexBindingCount               = 0;
    uint fragmentBindingCount             = 0;
    for (const auto &block : _gpuShader->blocks) {
        if (hasFlag(block.second.stages, ShaderStageFlagBit::VERTEX)) {
            vertexBindingCount++;
            usedVertexBufferBindingIndexes |= 1 << block.second.mappedBinding;
        }
        if (hasFlag(block.second.stages, ShaderStageFlagBit::FRAGMENT)) {
            fragmentBindingCount++;
            usedFragmentBufferBindingIndexes |= 1 << block.second.mappedBinding;
        }
    }

    auto maxBufferBindingIndex = CCMTLDevice::getInstance()->getMaximumBufferBindingIndex();
    _availableVertexBufferBindingIndex.resize(maxBufferBindingIndex - vertexBindingCount);
    _availableFragmentBufferBindingIndex.resize(maxBufferBindingIndex - fragmentBindingCount);
    uint availableVertexBufferBit   = ~usedVertexBufferBindingIndexes;
    uint availableFragmentBufferBit = ~usedFragmentBufferBindingIndexes;
    int  theBit                     = maxBufferBindingIndex - 1;
    uint i = 0, j = 0;
    for (; theBit >= 0; theBit--) {
        if ((availableVertexBufferBit & (1 << theBit))) {
            _availableVertexBufferBindingIndex[i++] = theBit;
        }

        if ((availableFragmentBufferBit & (1 << theBit))) {
            _availableFragmentBufferBindingIndex[j++] = theBit;
        }
    }
}

} // namespace gfx
} // namespace cc
