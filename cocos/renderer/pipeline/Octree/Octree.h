#pragma once

#include "cocos/bindings/jswrapper/Object.h"
#include "base/CoreStd.h"
#include "../helper/SharedMemory.h"
#include "./OctreeBlock.h"

namespace cc {
namespace pipeline {

class Frustum;

class CC_DLL Octree : public Object {
public:
    Octree(uint maxBlockCapacity = 64, uint maxDepth = 2)
    : _maxBlockCapacity(maxBlockCapacity), 
      _maxDepth(maxDepth)
    {};

    ~Octree() = default;

    void addEntry(uint modeHandle);
    void removeEntry(uint modelHandle);
    void update();

    const unordered_set<ModelView *> &intersectsFrustum(Frustum *frustum);

protected:
    unordered_set<ModelView *> _dynamicContent;
    unordered_set<ModelView *> _allEntries;
    unordered_set<ModelView *> _selectionContent;
    unordered_set<OctreeBlock* > _blocks;

    uint _maxBlockCapacity = 64;
    uint _maxDepth         = 2;

    bool _dirty = false;
};

} // namespace pipeline
} // namespace cc