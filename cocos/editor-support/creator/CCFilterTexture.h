//
//  CCFilterTexture.hpp
//  cocos2d_libs
//
//  Created by youyou on 16/7/22.
//
//

#ifndef __CREATOR_CCFILTERTEXTURE_H__
#define __CREATOR_CCFILTERTEXTURE_H__

#include "2d/CCNode.h"

class FilterTexture {
public:
    GLint frameBuffer;
    GLuint texture;
    
CC_CONSTRUCTOR_ACCESS:
    FilterTexture();
    virtual ~FilterTexture();
};

#endif /* __CREATOR_CCFILTERTEXTURE_H__ */
