
#include "./Octree.h"

namespace cc {
namespace pipeline {

    void Octree::addEntry(uint modelHandle) {
        auto* model = GET_MODEL(modelHandle);
        if (_allEntries.find(model) != _allEntries.end()) {
            return;
        }

        //if (!model->worldBoundsID) {
        //    _dynamicContent.emplace(model);
        //    return;
        //}

        _allEntries.emplace(model);
        _dirty = true;
    }

    void Octree::removeEntry(uint modelHandle) {
        auto* model = GET_MODEL(modelHandle);
        if (_allEntries.find(model) != _allEntries.end()) {
            return;
        }

      /*  if (!model->worldBoundsID) {
            _dynamicContent.erase(model);
            return;
        }*/

        _allEntries.erase(model);
        _dirty = true;
    }

    static AABB _tempAABB;
    static Vec3 _updateTempMin;
    static Vec3 _updateTempMax;
    void Octree::update() {
        if (_dirty) {
            _tempAABB.center = Vec3::ZERO;
            _tempAABB.halfExtents = Vec3::ZERO;

            bool inited     = false;
            for (auto it = _allEntries.begin(); it != _allEntries.end(); it++) {
                auto entry = *it;
                if (!entry->worldBoundsID) {
                    continue;
                }

                if (!inited) {
                    inited = true;
                    _tempAABB = *entry->getWorldBounds();
                } else {
                    _tempAABB.merge(*entry->getWorldBounds());
                }
            }

            _tempAABB.getBoundary(_updateTempMin, _updateTempMax);

            OctreeBlock::createInnerBlocks(_blocks, _allEntries, _updateTempMin, _updateTempMax, _maxBlockCapacity, 0, _maxDepth);
            _dirty = false;
        }
    }

    const unordered_set<ModelView*>& Octree::intersectsFrustum(Frustum* frustum) {
        _selectionContent.clear();

        for (auto it = _blocks.begin(); it != _blocks.end(); it++) {
            (*it)->intersectsFrustum(frustum, _selectionContent);
        }

        return _selectionContent;
    }


} // namespace pipeline
} // namespace cc