//
//  CCFilterTexture.cpp
//  cocos2d_libs
//
//  Created by youyou on 16/7/22.
//
//

#include "CCFilterTexture.h"

#include "renderer/ccGLStateCache.h"

USING_NS_CC;

namespace creator {

FilterTexture::FilterTexture()
    :width(0),
    height(0)
{
    /**
     * @property frameBuffer
     * @type Any
     */
    glGenBuffers(1, &frameBuffer);
    
    /**
     * @property texture
     * @type Any
     */
    glGenTextures(1, &texture);
    
    GL::bindTexture2D(texture);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
    
    GLint oldFrameBuffer;
    glGetIntegerv(GL_FRAMEBUFFER_BINDING, &oldFrameBuffer);
    
    glBindFramebuffer(GL_FRAMEBUFFER, frameBuffer);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, texture, 0);
    
    // required for masking a mask??
    // this.renderBuffer = gl.createRenderbuffer();
    // gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
    // gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);
    
    glBindFramebuffer(GL_FRAMEBUFFER, oldFrameBuffer);
}

FilterTexture::~FilterTexture()
{
    
}
    
void FilterTexture::resize(float w, float h)
{
    if(width == w && height == h) return;
    
    width = w;
    height = h;
    
    glBindTexture(GL_TEXTURE_2D,  texture);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA,  width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, 0);
}

}