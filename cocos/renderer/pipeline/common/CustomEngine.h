
#pragma once

#include "../RenderPipeline.h"

namespace cc {
namespace pipeline {

class CustomEngine {
public:
    static uint                     taaTextureIndex;
    static framegraph::StringHandle fgStrHandleTAATexture[2];
    static framegraph::StringHandle fgStrHandleTAAPass;
};


} // namespace pipeline
} // namespace cc
