#pragma once

#include "cocos/bindings/jswrapper/Object.h"
#include "base/CoreStd.h"
#include "../helper/SharedMemory.h"

namespace cc {
namespace pipeline {



class CC_DLL OctreeBlock : public Object {
public:
    OctreeBlock(Vec3 minPoint, Vec3 maxPoint, float capcity, float depth, float maxDepth) 
    : _minPoint(minPoint),
      _maxPoint(maxPoint),
      _capacity(capcity),
      _depth(depth),
      _maxDepth(maxDepth)
    {
        aabb.halfExtents = (maxPoint - minPoint / 2);
        aabb.center      = minPoint + aabb.halfExtents;
    }
    ~OctreeBlock() = default;

    void addEntry(ModelView *entry);
    void addEntries(const unordered_set<ModelView *>& entries);
    void removeEntry(ModelView *entry);

    void intersectsFrustum(const Frustum *frumstum, unordered_set<ModelView *> &selection);

    AABB aabb;
    unordered_set<OctreeBlock*> blocks;
    unordered_set<ModelView *>   entries;

    static void createInnerBlocks(unordered_set<OctreeBlock*>& blocks, const unordered_set<ModelView *> &entries, const Vec3 &minPoint, const Vec3 &maxPoint, float capacity, float depth, float maxDepth) {
        Vec3 blockSize((maxPoint.x - minPoint.x) / 2, (maxPoint.y - minPoint.y) / 2, (maxPoint.z - minPoint.z) / 2);
        for (uint x = 0; x < 2; x++) {
            for (uint y = 0; y < 2; y++) {
                for (uint z = 0; z < 2; z++) {
                    Vec3 localMin = (Vec3(blockSize) * Vec3(x, y, z)) + minPoint;
                    Vec3 localMax = (Vec3(blockSize) * Vec3(x + 1, y + 1, z + 1)) + minPoint;

                    OctreeBlock *block = new OctreeBlock(localMin, localMax, capacity, depth + 1, maxDepth);
                    block->addEntries(entries);
                    blocks.emplace(block);
                }
            }
        }
    }

protected:

    float _depth = 0;
    float _maxDepth = 2;
    float _capacity = 64;
    Vec3 _minPoint;
    Vec3 _maxPoint;

};

} // namespace pipeline
} // namespace cc
