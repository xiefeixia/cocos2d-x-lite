#include "OctreeBlock.h"

namespace cc {
namespace pipeline {

    static Vec3 _tempMin;
    static Vec3 _tempMax;

    bool intersectsMinMax(const AABB& boudingBox, const Vec3& min, const Vec3& max) {
        boudingBox.getBoundary(_tempMin, _tempMax);
        const float myMinX = _tempMin.x, myMinY = _tempMin.y, myMinZ = _tempMin.z, myMaxX = _tempMax.x, myMaxY = _tempMax.y, myMaxZ = _tempMax.z;
        const float minX = min.x, minY = min.y, minZ = min.z, maxX = max.x, maxY = max.y, maxZ = max.z;
        if (myMaxX < minX || myMinX > maxX) {
            return false;
        }

        if (myMaxY < minY || myMinY > maxY) {
            return false;
        }

        if (myMaxZ < minZ || myMinZ > maxZ) {
            return false;
        }

        return true;
    }

    void OctreeBlock::addEntry(ModelView* entry) {
        if (blocks.size()) {
            for (auto it = blocks.begin(); it != blocks.end(); it++) {
                (*it)->addEntry(entry);
            }
            return;
        }

        if (!entry->getSubModelID() || intersectsMinMax(*entry->getWorldBounds(), _minPoint, _maxPoint)) {
            entries.emplace(entry);
        }

        if (entries.size() > _capacity && _depth < _maxDepth) {
            createInnerBlocks(blocks, entries, _minPoint, _maxPoint, _capacity, _depth, _maxDepth);
        }
    }
    void OctreeBlock::addEntries(const unordered_set<ModelView*>& entries) {
        for (auto it = entries.begin(); it != entries.end(); it++) {
            addEntry(*it);
        }
    }
    void OctreeBlock::removeEntry(ModelView* entry) {
        if (blocks.size()) {
            for (auto it = blocks.begin(); it != blocks.end(); it++) {
                (*it)->removeEntry(entry);
            }
        }

        if (entries.find(entry) != entries.end()) {
            entries.erase(entry);
        }
    }

    void OctreeBlock::intersectsFrustum(Frustum* frustum, unordered_set<ModelView*>& selection) {
        if (aabbFrustum(&aabb, frustum)) {
            if (blocks.size()) {
                for (auto it = blocks.begin(); it != blocks.end(); it++) {
                    (*it)->intersectsFrustum(frustum, selection);
                }
                return;
            }

            for (auto it = entries.begin(); it != entries.end(); it++) {
                auto entry = *it;
                if (!entry->worldBoundsID || aabbFrustum(entry->getWorldBounds(), frustum)) {
                    selection.emplace(entry);
                }
            }
        }
    }

} // namespace pipeline
} // namespace cc
