#include "./CustomEngine.h"

namespace cc {
namespace pipeline {

framegraph::StringHandle CustomEngine::fgStrHandleTAAPass = framegraph::FrameGraph::stringToHandle("deferredTAAPass");
float CustomEngine::renderScale = 1;

framegraph::StringHandle CustomEngine::fgStrHandleTAATexture[2] = {
    framegraph::FrameGraph::stringToHandle("TAATexture1"),
    framegraph::FrameGraph::stringToHandle("TAATexture2")
};

uint CustomEngine::taaTextureIndex = 0;

} // namespace pipeline
} // namespace cc
