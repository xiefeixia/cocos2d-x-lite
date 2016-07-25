//
//  CCFilterNode.hpp
//  cocos2d_libs
//
//  Created by youyou on 16/7/22.
//
//

#ifndef __CREATOR_CCFILTERNODE_H__
#define __CREATOR_CCFILTERNODE_H__

#include "CCFilterTexture.h"

#include "2d/CCNode.h"
#include "renderer/CCGroupCommand.h"
#include "renderer/CCCustomCommand.h"

namespace creator {

class CC_DLL FilterNode : public cocos2d::Node
{
public:
    virtual void visit(cocos2d::Renderer *renderer, const cocos2d::Mat4 &parentTransform, uint32_t parentFlags);
    
    FilterTexture* getTexture();
    void returnTexture(FilterTexture* texture);
    
    void drawFilter(FilterTexture* input, FilterTexture* output);
    
    void setBeginDrawCallback(std::function<FilterTexture*()> callback);
    void setEndDrawCallback(std::function<void()> callback);
    
CC_CONSTRUCTOR_ACCESS:
    FilterNode();
    virtual ~FilterNode();
    
protected:
    void onBeginDraw();
    void onEndDraw();
    
    GLint _oldFBO;
    GLfloat _oldClearColor[4];
    
    GLuint _quadBuffer;
    cocos2d::V3F_C4B_T2F_Quad _quad;
    
    cocos2d::GroupCommand _groupCommand;
    cocos2d::CustomCommand _gridBeginCommand;
    cocos2d::CustomCommand _gridEndCommand;
    
    bool _beginDraw;
    
    std::function<FilterTexture*()> _beginDrawCallback;
    std::function<void()> _endDrawCallback;
};

}

#endif /* __CREATOR_CCFILTERNODE_H__ */
