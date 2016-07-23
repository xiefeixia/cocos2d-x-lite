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

FilterNode::FilterNode()
{
    glGenBuffers(1, &_quadBuffer);
}

FilterNode::~FilterNode()
{
}

void FilterNode::onBeginDraw()
{
    _beginDraw = false;
    
    FilterTexture* texture = _beginDrawCallback();
    if (!texture) {
        return;
    }
    
    _beginDraw = true;
    
    glGetIntegerv(GL_FRAMEBUFFER_BINDING, &_oldFBO);
    
    glBindFramebuffer(GL_FRAMEBUFFER, texture->frameBuffer);
    
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
    if (!_beginDraw) {
        return;
    }
    
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