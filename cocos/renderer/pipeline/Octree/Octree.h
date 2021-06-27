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

    static Octree *getOctree(const uint sceneHandle, bool autoCreate = false) {
        const auto *scene = GET_SCENE(sceneHandle);
        return getOctree(scene, autoCreate);
    }
    static Octree* getOctree(const Scene* scene, bool autoCreate = false) {
        auto it = octrees.find(scene);
        Octree *octree = nullptr;
        if (it == octrees.end()) {
            if (autoCreate) {
                octree = new Octree(32, 8);
                octrees.emplace(scene, octree);
            }
        } else {
            octree = it->second;
        }

        return octree;
    }

    const unordered_set<ModelView *> &intersectsFrustum(const Frustum *frustum);

    static unordered_map<const Scene*, Octree *> octrees;

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