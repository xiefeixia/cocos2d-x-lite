//
//  CCFilterNode.cpp
//  cocos2d_libs
//
//  Created by youyou on 16/7/22.
//
//

#include "CCFilterNode.h"
#include "renderer/CCRenderer.h"
#include "renderer/ccGLStateCache.h"
#include "renderer/CCGLProgram.h"
#include "renderer/CCGLProgramState.h"
#include "base/CCDirector.h"

USING_NS_CC;

namespace creator {
    
Rect getBoundingBoxToCurrentNode (Node* node, Mat4& parentTransform)
{
    Size size = node->getContentSize();
    Rect rect(0, 0, size.width, size.height);
    Mat4 trans = TransformConcat(node->getNodeToParentTransform(), parentTransform);
    rect = RectApplyTransform(rect, trans);
    
    auto children = node->getChildren();
    if (children.size() == 0)
        return rect;
    
    for (int i = 0; i < children.size(); i++) {
        Node* child = children.at(i);
        if (child && child->isVisible()) {
            Rect childRect = getBoundingBoxToCurrentNode(child, trans);
            rect = rect.unionWithRect(childRect);
        }
    }
    return rect;
}
    
Rect getWorldBoundingBox(Node* node)
{
    Size size = node->getContentSize();
    Rect rect(0, 0, size.width, size.height);
    Mat4 trans = node->getNodeToWorldTransform();
    
    rect = RectApplyTransform(rect, trans);
    
    auto children = node->getChildren();
    if (children.size() == 0)
        return rect;
    
    for (int i = 0; i < children.size(); i++) {
        Node* child = children.at(i);
        if (child && child->isVisible()) {
            Rect childRect = getBoundingBoxToCurrentNode(child, trans);
            rect = rect.unionWithRect(childRect);
        }
    }
    return rect;
}

FilterNode::FilterNode()
{
    glGenBuffers(1, &_quadBuffer);
    
    _quad.bl.colors = Color4B::WHITE;
    _quad.br.colors = Color4B::WHITE;
    _quad.tl.colors = Color4B::WHITE;
    _quad.tr.colors = Color4B::WHITE;
}

FilterNode::~FilterNode()
{
    std::vector<FilterTexture*> texturePool;
    texturePool.erase(texturePool.end());
}

FilterTexture* FilterNode::getTexture()
{
    auto size = Director::getInstance()->getWinSize();
    float width = size.width;
    float height = size.height;
    
    FilterTexture* texture;
    
    if (_texturePool.size() == 0) {
        texture = new FilterTexture();
    }
    else {
        texture = _texturePool.back();
        _texturePool.popBack();
    }
    
    texture->resize(width, height);
    
    return texture;
}

FilterTexture* FilterNode::getSourceTexture()
{
    return _sourceTexture;
}
    
void FilterNode::returnTexture(FilterTexture* texture)
{
    _texturePool.pushBack(texture);
}
    
void FilterNode::onBeginDraw()
{
    _beginDraw = false;
    
    if (!_beginDrawCallback || !_beginDrawCallback()) {
        return;
    }
    
    _beginDraw = true;
    
    glGetIntegerv(GL_FRAMEBUFFER_BINDING, &_oldFBO);
    
    _sourceTexture = getTexture();
    glBindFramebuffer(GL_FRAMEBUFFER, _sourceTexture->frameBuffer);
    
    // save clear color
    glGetFloatv(GL_COLOR_CLEAR_VALUE, _oldClearColor);
    
    // BUG XXX: doesn't work with RGB565.
    glClearColor(0, 0, 0, 0);
    
    // BUG #631: To fix #631, uncomment the lines with #631
    // Warning: But it CCGrabber won't work with 2 effects at the same time
    //  glClearColor(0.0f,0.0f,0.0f,1.0f);    // #631
    
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
}

void FilterNode::onEndDraw()
{
    if (!_beginDraw || !_endDrawCallback) {
        return;
    }
    
    updateState();
    
    _endDrawCallback();
}


void FilterNode::drawFilter(FilterTexture* input, FilterTexture* output)
{
    glBindTexture(GL_TEXTURE_2D, input->texture);
    
    if (!output && !_oldFBO) {
        glBindFramebuffer(GL_FRAMEBUFFER, _oldFBO);
        glColorMask(true, true, true, true);
    }
    else if (_oldFBO) {
        glBindFramebuffer(GL_FRAMEBUFFER, _oldFBO);
    }
    else if (output) {
        glBindFramebuffer(GL_FRAMEBUFFER, output->frameBuffer);
        glClearColor(0, 0, 0, 0);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    }
    
    GL::enableVertexAttribs(GL::VERTEX_ATTRIB_FLAG_POSITION | GL::VERTEX_ATTRIB_FLAG_COLOR | GL::VERTEX_ATTRIB_FLAG_TEX_COORD);
    
    glBindBuffer(GL_ARRAY_BUFFER, _quadBuffer);
    glBufferData(GL_ARRAY_BUFFER, sizeof(_quad), &_quad, GL_DYNAMIC_DRAW);
    
    glVertexAttribPointer(GLProgram::VERTEX_ATTRIB_POSITION, 3, GL_FLOAT, false, 24, (const GLvoid*)0);
    glVertexAttribPointer(GLProgram::VERTEX_ATTRIB_COLOR, 4, GL_UNSIGNED_BYTE, true, 24, (const GLvoid*)12);
    glVertexAttribPointer(GLProgram::VERTEX_ATTRIB_TEX_COORD, 2, GL_FLOAT, false, 24, (const GLvoid*)16);
    
    glDrawArrays(GL_TRIANGLE_STRIP, 0, 4);
    
    GL::bindTexture2DN(0, 0);
}

void FilterNode::visit(cocos2d::Renderer *renderer, const cocos2d::Mat4 &parentTransform, uint32_t parentFlags)
{
    // quick return if not visible. children won't be drawn.
    if (!_visible)
    {
        return;
    }
    
    _groupCommand.init(_globalZOrder);
    renderer->addCommand(&_groupCommand);
    renderer->pushGroup(_groupCommand.getRenderQueueID());
    
    uint32_t flags = processParentFlags(parentTransform, parentFlags);
    
    
    // IMPORTANT:
    // To ease the migration to v3.0, we still support the Mat4 stack,
    // but it is deprecated and your code should not rely on it
    _director->pushMatrix(MATRIX_STACK_TYPE::MATRIX_STACK_MODELVIEW);
    _director->loadMatrix(MATRIX_STACK_TYPE::MATRIX_STACK_MODELVIEW, _modelViewTransform);
    
    _gridBeginCommand.init(_globalZOrder);
    _gridBeginCommand.func = CC_CALLBACK_0(FilterNode::onBeginDraw, this);
    renderer->addCommand(&_gridBeginCommand);
    
    if(!_children.empty())
    {
        sortAllChildren();
        
        int i = 0;
        // draw children zOrder < 0
        for( ; i < _children.size(); i++ )
        {
            auto node = _children.at(i);
            
            if (node && node->getLocalZOrder() < 0)
                node->visit(renderer, _modelViewTransform, flags);
            else
                break;
        }
        // self draw
        this->draw(renderer, _modelViewTransform, flags);
        
        for(auto it=_children.cbegin()+i; it != _children.cend(); ++it)
            (*it)->visit(renderer, _modelViewTransform, flags);
    }
    else
    {
        this->draw(renderer, _modelViewTransform, flags);
    }
    
    _gridEndCommand.init(_globalZOrder);
    _gridEndCommand.func = CC_CALLBACK_0(FilterNode::onEndDraw, this);
    renderer->addCommand(&_gridEndCommand);
    
    renderer->popGroup();
    
    _director->popMatrix(MATRIX_STACK_TYPE::MATRIX_STACK_MODELVIEW);
}
    
void FilterNode::updateState()
{
    auto boundingBox = getWorldBoundingBox(this);
    
    float minx = boundingBox.getMinX();
    float miny = boundingBox.getMinY();
    float maxx = boundingBox.getMaxX();
    float maxy = boundingBox.getMaxY();
    
    _quad.bl.vertices.set(minx, miny, 0);
    _quad.br.vertices.set(maxx, miny, 0);
    _quad.tl.vertices.set(minx, maxy, 0);
    _quad.tr.vertices.set(maxx, maxy, 0);
    
    auto size = Director::getInstance()->getWinSize();
    float width = size.width;
    float height = size.height;
    
    float l = minx/width;
    float r = maxx/width;
    float b = miny/height;
    float t = maxy/height;
    
    _quad.bl.texCoords.u = l;
    _quad.bl.texCoords.v = b;
    _quad.br.texCoords.u = r;
    _quad.br.texCoords.v = b;
    _quad.tl.texCoords.u = l;
    _quad.tl.texCoords.v = t;
    _quad.tr.texCoords.u = r;
    _quad.tr.texCoords.v = t;
}

void FilterNode::setBeginDrawCallback(std::function<bool()> callback)
{
    _beginDrawCallback = callback;
}
    
void FilterNode::setEndDrawCallback(std::function<void()> callback)
{
    _endDrawCallback = callback;
}

}
