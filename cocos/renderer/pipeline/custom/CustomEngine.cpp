#include "./CustomEngine.h"

namespace cc {
namespace pipeline {

framegraph::StringHandle CustomEngine::fgStrHandleTAAPass = framegraph::FrameGraph::stringToHandle("deferredTAAPass");

framegraph::StringHandle CustomEngine::fgStrHandleTAATexture[2] = {
    framegraph::FrameGraph::stringToHandle("TAATexture1"),
    framegraph::FrameGraph::stringToHandle("TAATexture2")
};

} // namespace pipeline
} // namespace cc
