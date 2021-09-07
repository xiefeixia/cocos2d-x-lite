/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include "cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/bindings/auto/jsb_pipeline_auto.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "gfx-base/GFXPipelineState.h"
#include "renderer/pipeline/Define.h"
#include "renderer/pipeline/PipelineStateManager.h"
#include "renderer/pipeline/RenderPipeline.h"

static bool js_pipeline_RenderPipeline_getMacros(se::State &s) {
    auto *cobj = static_cast<cc::pipeline::RenderPipeline *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "js_pipeline_RenderPipeline_getMacros : Invalid Native Object.");
    const auto &   args = s.args();
    size_t         argc = args.size();
    CC_UNUSED bool ok   = true;
    if (argc == 0) {
        s.rval().setObject(cobj->getMacros().getObject());
        SE_PRECONDITION2(ok, false, "js_pipeline_RenderPipeline_getMacros : Error processing arguments.");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_pipeline_RenderPipeline_getMacros)

static bool JSB_getOrCreatePipelineState(se::State &s) {
    const auto &args = s.args();
    size_t      argc = args.size();
    if (argc == 4) {
        auto *pass           = static_cast<cc::scene::Pass *>(args[0].toObject()->getPrivateData());
        auto *shader         = static_cast<cc::gfx::Shader *>(args[1].toObject()->getPrivateData());
        auto *renderPass     = static_cast<cc::gfx::RenderPass *>(args[2].toObject()->getPrivateData());
        auto *inputAssembler = static_cast<cc::gfx::InputAssembler *>(args[3].toObject()->getPrivateData());
        auto *pipelineState  = cc::pipeline::PipelineStateManager::getOrCreatePipelineState(pass, shader, inputAssembler, renderPass);
        native_ptr_to_seval<cc::gfx::PipelineState>(pipelineState, &s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(JSB_getOrCreatePipelineState);

bool JSB_register_global_descriptor_block(se::State &s) {
    const auto &args = s.args();
    size_t      argc = args.size();
    if (argc == 4) {
        bool ok = true;

        // arg0
        uint32_t binding = 0;
        ok &= seval_to_uint32(args[0], &binding);
        SE_PRECONDITION2(ok, false, "JSB_register_global_descriptor_block : Error getting block binding.");

        // arg1
        cc::gfx::DescriptorSetLayoutBinding descriptor;
        ok &= sevalue_to_native(args[1], &descriptor, s.thisObject());
        SE_PRECONDITION2(ok, false, "JSB_register_global_descriptor_block : Error getting descriptor.");

        // arg2
        std::string name = "";
        ok &= seval_to_std_string(args[2], &name);
        SE_PRECONDITION2(ok, false, "JSB_register_global_descriptor_block : Error getting block name.");

        // arg3
        cc::gfx::UniformBlock block;
        ok &= sevalue_to_native(args[3], &block, s.thisObject());
        SE_PRECONDITION2(ok, false, "JSB_register_global_descriptor_block : Error getting block.");

        if (cc::pipeline::globalDescriptorSetLayout.bindings.size() < (binding + 1)) {
            cc::pipeline::globalDescriptorSetLayout.bindings.resize((binding + 1));
        }

        cc::pipeline::globalDescriptorSetLayout.bindings[binding] = descriptor;
        cc::pipeline::globalDescriptorSetLayout.blocks[name]      = block;

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(JSB_register_global_descriptor_block);

bool JSB_register_global_descriptor_sampler(se::State &s) {
    const auto &args = s.args();
    size_t      argc = args.size();
    if (argc == 4) {
        bool ok = true;

        // arg0
        uint32_t binding = 0;
        ok &= seval_to_uint32(args[0], &binding);
        SE_PRECONDITION2(ok, false, "JSB_register_global_descriptor_sampler : Error getting block binding.");

        // arg1
        cc::gfx::DescriptorSetLayoutBinding descriptor;
        ok &= sevalue_to_native(args[1], &descriptor, s.thisObject());
        SE_PRECONDITION2(ok, false, "JSB_register_global_descriptor_block : Error getting descriptor.");

        // arg2
        std::string name = "";
        ok &= seval_to_std_string(args[2], &name);
        SE_PRECONDITION2(ok, false, "JSB_register_global_descriptor_sampler : Error getting block name.");

        // arg3
        cc::gfx::UniformSamplerTexture sampler;
        ok &= sevalue_to_native(args[3], &sampler, s.thisObject());
        SE_PRECONDITION2(ok, false, "JSB_register_global_descriptor_sampler : Error getting sampler.");

        if (cc::pipeline::globalDescriptorSetLayout.bindings.size() < (binding + 1)) {
            cc::pipeline::globalDescriptorSetLayout.bindings.resize((binding + 1));
        }

        cc::pipeline::globalDescriptorSetLayout.bindings[binding] = descriptor;
        cc::pipeline::globalDescriptorSetLayout.samplers[name]    = sampler;

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(JSB_register_global_descriptor_sampler);

bool register_all_pipeline_manual(se::Object *obj) {
    // Get the ns
    se::Value nrVal;
    if (!obj->getProperty("nr", &nrVal)) {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nrVal.setObject(jsobj);
        obj->setProperty("nr", nrVal);
    }
    se::Object *nr = nrVal.toObject();

    se::Value        psmVal;
    se::HandleObject jsobj(se::Object::createPlainObject());
    psmVal.setObject(jsobj);
    nr->setProperty("PipelineStateManager", psmVal);
    psmVal.toObject()->defineFunction("getOrCreatePipelineState", _SE(JSB_getOrCreatePipelineState));

    __jsb_cc_pipeline_RenderPipeline_proto->defineProperty("macros", _SE(js_pipeline_RenderPipeline_getMacros), nullptr);

    __jsb_cc_pipeline_RenderPipeline_proto->defineFunction("registerGlobalDescriptorBlock", _SE(JSB_register_global_descriptor_block));
    __jsb_cc_pipeline_RenderPipeline_proto->defineFunction("registerGlobalDescriptorSampler", _SE(JSB_register_global_descriptor_sampler));

    return true;
}
