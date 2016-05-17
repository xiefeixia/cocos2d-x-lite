LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)
LOCAL_MODULE := cocos2d_libs

ifeq ($(USE_ARM_MODE),1)
LOCAL_ARM_MODE := arm
endif

ifeq ($(TARGET_ARCH_ABI),armeabi-v7a)
MATHNEONFILE := ../../../../../../cocos/math/MathUtil.cpp.neon
else
MATHNEONFILE := ../../../../../../cocos/math/MathUtil.cpp
endif

LOCAL_SRC_FILES := ../../../../../../cocos/2d/CCAction.cpp \
 ../../../../../../cocos/2d/CCActionCamera.cpp \
 ../../../../../../cocos/2d/CCActionCatmullRom.cpp \
 ../../../../../../cocos/2d/CCActionEase.cpp \
 ../../../../../../cocos/2d/CCActionGrid.cpp \
 ../../../../../../cocos/2d/CCActionGrid3D.cpp \
 ../../../../../../cocos/2d/CCActionInstant.cpp \
 ../../../../../../cocos/2d/CCActionInterval.cpp \
 ../../../../../../cocos/2d/CCActionManager.cpp \
 ../../../../../../cocos/2d/CCActionPageTurn3D.cpp \
 ../../../../../../cocos/2d/CCActionProgressTimer.cpp \
 ../../../../../../cocos/2d/CCActionTiledGrid.cpp \
 ../../../../../../cocos/2d/CCActionTween.cpp \
 ../../../../../../cocos/2d/CCAnimation.cpp \
 ../../../../../../cocos/2d/CCAnimationCache.cpp \
 ../../../../../../cocos/2d/CCAtlasNode.cpp \
 ../../../../../../cocos/2d/CCAutoPolygon.cpp \
 ../../../../../../cocos/2d/CCClippingNode.cpp \
 ../../../../../../cocos/2d/CCClippingRectangleNode.cpp \
 ../../../../../../cocos/2d/CCComponent.cpp \
 ../../../../../../cocos/2d/CCComponentContainer.cpp \
 ../../../../../../cocos/2d/CCDrawNode.cpp \
 ../../../../../../cocos/2d/CCDrawingPrimitives.cpp \
 ../../../../../../cocos/2d/CCFastTMXLayer.cpp \
 ../../../../../../cocos/2d/CCFastTMXTiledMap.cpp \
 ../../../../../../cocos/2d/CCFont.cpp \
 ../../../../../../cocos/2d/CCFontAtlas.cpp \
 ../../../../../../cocos/2d/CCFontAtlasCache.cpp \
 ../../../../../../cocos/2d/CCFontCharMap.cpp \
 ../../../../../../cocos/2d/CCFontFNT.cpp \
 ../../../../../../cocos/2d/CCFontFreeType.cpp \
 ../../../../../../cocos/2d/CCGLBufferedNode.cpp \
 ../../../../../../cocos/2d/CCGrabber.cpp \
 ../../../../../../cocos/2d/CCGrid.cpp \
 ../../../../../../cocos/2d/CCLabel.cpp \
 ../../../../../../cocos/2d/CCLabelAtlas.cpp \
 ../../../../../../cocos/2d/CCLabelTextFormatter.cpp \
 ../../../../../../cocos/2d/CCLayer.cpp \
 ../../../../../../cocos/2d/CCMenu.cpp \
 ../../../../../../cocos/2d/CCMenuItem.cpp \
 ../../../../../../cocos/2d/CCMotionStreak.cpp \
 ../../../../../../cocos/2d/CCNode.cpp \
 ../../../../../../cocos/2d/CCNodeGrid.cpp \
 ../../../../../../cocos/2d/CCParallaxNode.cpp \
 ../../../../../../cocos/2d/CCParticleBatchNode.cpp \
 ../../../../../../cocos/2d/CCParticleExamples.cpp \
 ../../../../../../cocos/2d/CCParticleSystem.cpp \
 ../../../../../../cocos/2d/CCParticleSystemQuad.cpp \
 ../../../../../../cocos/2d/CCProgressTimer.cpp \
 ../../../../../../cocos/2d/CCProtectedNode.cpp \
 ../../../../../../cocos/2d/CCRenderTexture.cpp \
 ../../../../../../cocos/2d/CCScene.cpp \
 ../../../../../../cocos/2d/CCSprite.cpp \
 ../../../../../../cocos/2d/CCSpriteBatchNode.cpp \
 ../../../../../../cocos/2d/CCSpriteFrame.cpp \
 ../../../../../../cocos/2d/CCSpriteFrameCache.cpp \
 ../../../../../../cocos/2d/CCTMXObjectGroup.cpp \
 ../../../../../../cocos/2d/CCTMXXMLParser.cpp \
 ../../../../../../cocos/2d/CCTextFieldTTF.cpp \
 ../../../../../../cocos/2d/CCTileMapAtlas.cpp \
 ../../../../../../cocos/2d/CCTransition.cpp \
 ../../../../../../cocos/2d/CCTransitionPageTurn.cpp \
 ../../../../../../cocos/2d/CCTransitionProgress.cpp \
 ../../../../../../cocos/2d/CCTweenFunction.cpp \
 ../../../../../../cocos/audio/AudioEngine.cpp \
 ../../../../../../cocos/audio/android/AudioEngine-inl.cpp \
 ../../../../../../cocos/audio/android/ccdandroidUtils.cpp \
 ../../../../../../cocos/audio/android/cddSimpleAudioEngine.cpp \
 ../../../../../../cocos/audio/android/jni/cddandroidAndroidJavaEngine.cpp \
 ../../../../../../cocos/base/CCAsyncTaskPool.cpp \
 ../../../../../../cocos/base/CCAutoreleasePool.cpp \
 ../../../../../../cocos/base/CCConfiguration.cpp \
 ../../../../../../cocos/base/CCConsole.cpp \
 ../../../../../../cocos/base/CCData.cpp \
 ../../../../../../cocos/base/CCDirector.cpp \
 ../../../../../../cocos/base/CCEvent.cpp \
 ../../../../../../cocos/base/CCEventAcceleration.cpp \
 ../../../../../../cocos/base/CCEventCustom.cpp \
 ../../../../../../cocos/base/CCEventDispatcher.cpp \
 ../../../../../../cocos/base/CCEventFocus.cpp \
 ../../../../../../cocos/base/CCEventKeyboard.cpp \
 ../../../../../../cocos/base/CCEventListener.cpp \
 ../../../../../../cocos/base/CCEventListenerAcceleration.cpp \
 ../../../../../../cocos/base/CCEventListenerCustom.cpp \
 ../../../../../../cocos/base/CCEventListenerFocus.cpp \
 ../../../../../../cocos/base/CCEventListenerKeyboard.cpp \
 ../../../../../../cocos/base/CCEventListenerMouse.cpp \
 ../../../../../../cocos/base/CCEventListenerTouch.cpp \
 ../../../../../../cocos/base/CCEventMouse.cpp \
 ../../../../../../cocos/base/CCEventTouch.cpp \
 ../../../../../../cocos/base/CCIMEDispatcher.cpp \
 ../../../../../../cocos/base/CCNS.cpp \
 ../../../../../../cocos/base/CCNinePatchImageParser.cpp \
 ../../../../../../cocos/base/CCProfiling.cpp \
 ../../../../../../cocos/base/CCProperties.cpp \
 ../../../../../../cocos/base/CCRef.cpp \
 ../../../../../../cocos/base/CCScheduler.cpp \
 ../../../../../../cocos/base/CCScriptSupport.cpp \
 ../../../../../../cocos/base/CCStencilStateManager.cpp \
 ../../../../../../cocos/base/CCString.cpp \
 ../../../../../../cocos/base/CCTouch.cpp \
 ../../../../../../cocos/base/CCUserDefault-android.cpp \
 ../../../../../../cocos/base/CCUserDefault.cpp \
 ../../../../../../cocos/base/CCValue.cpp \
 ../../../../../../cocos/base/ObjectFactory.cpp \
 ../../../../../../cocos/base/TGAlib.cpp \
 ../../../../../../cocos/base/ZipUtils.cpp \
 ../../../../../../cocos/base/base64.cpp \
 ../../../../../../cocos/base/ccCArray.cpp \
 ../../../../../../cocos/base/ccFPSImages.c \
 ../../../../../../cocos/base/ccRandom.cpp \
 ../../../../../../cocos/base/ccTypes.cpp \
 ../../../../../../cocos/base/ccUTF8.cpp \
 ../../../../../../cocos/base/ccUtils.cpp \
 ../../../../../../cocos/base/etc1.cpp \
 ../../../../../../cocos/base/pvr.cpp \
 ../../../../../../cocos/cocos2d.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCBAnimationManager.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCBFileLoader.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCBKeyframe.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCBReader.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCBSequence.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCBSequenceProperty.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCControlButtonLoader.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCControlLoader.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCLabelBMFontLoader.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCLabelTTFLoader.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCLayerColorLoader.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCLayerGradientLoader.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCLayerLoader.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCMenuItemImageLoader.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCMenuItemLoader.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCNode+CCBRelativePositioning.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCNodeLoader.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCNodeLoaderLibrary.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCParticleSystemQuadLoader.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCScale9SpriteLoader.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCScrollViewLoader.cpp \
 ../../../../../../cocos/editor-support/cocosbuilder/CCSpriteLoader.cpp \
 ../../../../../../cocos/editor-support/cocostudio/ActionTimeline/CCActionTimeline.cpp \
 ../../../../../../cocos/editor-support/cocostudio/ActionTimeline/CCActionTimelineNode.cpp \
 ../../../../../../cocos/editor-support/cocostudio/ActionTimeline/CCBoneNode.cpp \
 ../../../../../../cocos/editor-support/cocostudio/ActionTimeline/CCFrame.cpp \
 ../../../../../../cocos/editor-support/cocostudio/ActionTimeline/CCSkeletonNode.cpp \
 ../../../../../../cocos/editor-support/cocostudio/ActionTimeline/CCSkinNode.cpp \
 ../../../../../../cocos/editor-support/cocostudio/ActionTimeline/CCTimeLine.cpp \
 ../../../../../../cocos/editor-support/cocostudio/Armature/CCArmature.cpp \
 ../../../../../../cocos/editor-support/cocostudio/Armature/CCArmatureAnimation.cpp \
 ../../../../../../cocos/editor-support/cocostudio/Armature/CCArmatureDataManager.cpp \
 ../../../../../../cocos/editor-support/cocostudio/Armature/CCArmatureDefine.cpp \
 ../../../../../../cocos/editor-support/cocostudio/Armature/CCBatchNode.cpp \
 ../../../../../../cocos/editor-support/cocostudio/Armature/CCBone.cpp \
 ../../../../../../cocos/editor-support/cocostudio/Armature/CCColliderDetector.cpp \
 ../../../../../../cocos/editor-support/cocostudio/Armature/CCDataReaderHelper.cpp \
 ../../../../../../cocos/editor-support/cocostudio/Armature/CCDatas.cpp \
 ../../../../../../cocos/editor-support/cocostudio/Armature/CCDecorativeDisplay.cpp \
 ../../../../../../cocos/editor-support/cocostudio/Armature/CCDisplayFactory.cpp \
 ../../../../../../cocos/editor-support/cocostudio/Armature/CCDisplayManager.cpp \
 ../../../../../../cocos/editor-support/cocostudio/Armature/CCProcessBase.cpp \
 ../../../../../../cocos/editor-support/cocostudio/Armature/CCSkin.cpp \
 ../../../../../../cocos/editor-support/cocostudio/Armature/CCSpriteFrameCacheHelper.cpp \
 ../../../../../../cocos/editor-support/cocostudio/Armature/CCTransformHelp.cpp \
 ../../../../../../cocos/editor-support/cocostudio/Armature/CCTween.cpp \
 ../../../../../../cocos/editor-support/cocostudio/Armature/CCUtilMath.cpp \
 $(MATHNEONFILE) \
 ../../../../../../cocos/editor-support/cocostudio/CCActionFrame.cpp \
 ../../../../../../cocos/editor-support/cocostudio/CCActionFrameEasing.cpp \
 ../../../../../../cocos/editor-support/cocostudio/CCActionManagerEx.cpp \
 ../../../../../../cocos/editor-support/cocostudio/CCActionNode.cpp \
 ../../../../../../cocos/editor-support/cocostudio/CCActionObject.cpp \
 ../../../../../../cocos/editor-support/cocostudio/CCComAttribute.cpp \
 ../../../../../../cocos/editor-support/cocostudio/CCComAudio.cpp \
 ../../../../../../cocos/editor-support/cocostudio/CCComController.cpp \
 ../../../../../../cocos/editor-support/cocostudio/CCComExtensionData.cpp \
 ../../../../../../cocos/editor-support/cocostudio/CCComRender.cpp \
 ../../../../../../cocos/editor-support/cocostudio/CCInputDelegate.cpp \
 ../../../../../../cocos/editor-support/cocostudio/CocoLoader.cpp \
 ../../../../../../cocos/editor-support/cocostudio/CocoStudio.cpp \
 ../../../../../../cocos/editor-support/cocostudio/DictionaryHelper.cpp \
 ../../../../../../cocos/editor-support/cocostudio/WidgetCallBackHandlerProtocol.cpp \
 ../../../../../../cocos/editor-support/creator/CCScale9Sprite.cpp \
 ../../../../../../cocos/editor-support/spine/Animation.c \
 ../../../../../../cocos/editor-support/spine/AnimationState.c \
 ../../../../../../cocos/editor-support/spine/AnimationStateData.c \
 ../../../../../../cocos/editor-support/spine/Atlas.c \
 ../../../../../../cocos/editor-support/spine/AtlasAttachmentLoader.c \
 ../../../../../../cocos/editor-support/spine/Attachment.c \
 ../../../../../../cocos/editor-support/spine/AttachmentLoader.c \
 ../../../../../../cocos/editor-support/spine/Bone.c \
 ../../../../../../cocos/editor-support/spine/BoneData.c \
 ../../../../../../cocos/editor-support/spine/BoundingBoxAttachment.c \
 ../../../../../../cocos/editor-support/spine/Event.c \
 ../../../../../../cocos/editor-support/spine/EventData.c \
 ../../../../../../cocos/editor-support/spine/IkConstraint.c \
 ../../../../../../cocos/editor-support/spine/IkConstraintData.c \
 ../../../../../../cocos/editor-support/spine/Json.c \
 ../../../../../../cocos/editor-support/spine/MeshAttachment.c \
 ../../../../../../cocos/editor-support/spine/PolygonBatch.cpp \
 ../../../../../../cocos/editor-support/spine/RegionAttachment.c \
 ../../../../../../cocos/editor-support/spine/Skeleton.c \
 ../../../../../../cocos/editor-support/spine/SkeletonAnimation.cpp \
 ../../../../../../cocos/editor-support/spine/SkeletonBounds.c \
 ../../../../../../cocos/editor-support/spine/SkeletonData.c \
 ../../../../../../cocos/editor-support/spine/SkeletonJson.c \
 ../../../../../../cocos/editor-support/spine/SkeletonRenderer.cpp \
 ../../../../../../cocos/editor-support/spine/Skin.c \
 ../../../../../../cocos/editor-support/spine/SkinnedMeshAttachment.c \
 ../../../../../../cocos/editor-support/spine/Slot.c \
 ../../../../../../cocos/editor-support/spine/SlotData.c \
 ../../../../../../cocos/editor-support/spine/extension.c \
 ../../../../../../cocos/editor-support/spine/spine-cocos2dx.cpp \
 ../../../../../../cocos/math/CCAffineTransform.cpp \
 ../../../../../../cocos/math/CCGeometry.cpp \
 ../../../../../../cocos/math/CCVertex.cpp \
 ../../../../../../cocos/math/Mat4.cpp \
 ../../../../../../cocos/math/Quaternion.cpp \
 ../../../../../../cocos/math/TransformUtils.cpp \
 ../../../../../../cocos/math/Vec2.cpp \
 ../../../../../../cocos/math/Vec3.cpp \
 ../../../../../../cocos/math/Vec4.cpp \
 ../../../../../../cocos/network/CCDownloader-android.cpp \
 ../../../../../../cocos/network/CCDownloader.cpp \
 ../../../../../../cocos/network/HttpClient-android.cpp \
 ../../../../../../cocos/network/SocketIO.cpp \
 ../../../../../../cocos/network/WebSocket.cpp \
 ../../../../../../cocos/platform/CCFileUtils.cpp \
 ../../../../../../cocos/platform/CCGLView.cpp \
 ../../../../../../cocos/platform/CCImage.cpp \
 ../../../../../../cocos/platform/CCSAXParser.cpp \
 ../../../../../../cocos/platform/CCThread.cpp \
 ../../../../../../cocos/platform/android/CCApplication-android.cpp \
 ../../../../../../cocos/platform/android/CCCommon-android.cpp \
 ../../../../../../cocos/platform/android/CCDevice-android.cpp \
 ../../../../../../cocos/platform/android/CCFileUtils-android.cpp \
 ../../../../../../cocos/platform/android/CCGLViewImpl-android.cpp \
 ../../../../../../cocos/platform/android/javaactivity-android.cpp \
 ../../../../../../cocos/platform/android/jni/Java_org_cocos2dx_lib_Cocos2dxAccelerometer.cpp \
 ../../../../../../cocos/platform/android/jni/Java_org_cocos2dx_lib_Cocos2dxBitmap.cpp \
 ../../../../../../cocos/platform/android/jni/Java_org_cocos2dx_lib_Cocos2dxHelper.cpp \
 ../../../../../../cocos/platform/android/jni/Java_org_cocos2dx_lib_Cocos2dxRenderer.cpp \
 ../../../../../../cocos/platform/android/jni/JniHelper.cpp \
 ../../../../../../cocos/platform/android/jni/TouchesJni.cpp \
 ../../../../../../cocos/renderer/CCBatchCommand.cpp \
 ../../../../../../cocos/renderer/CCCustomCommand.cpp \
 ../../../../../../cocos/renderer/CCGLProgram.cpp \
 ../../../../../../cocos/renderer/CCGLProgramCache.cpp \
 ../../../../../../cocos/renderer/CCGLProgramState.cpp \
 ../../../../../../cocos/renderer/CCGLProgramStateCache.cpp \
 ../../../../../../cocos/renderer/CCGroupCommand.cpp \
 ../../../../../../cocos/renderer/CCPrimitive.cpp \
 ../../../../../../cocos/renderer/CCPrimitiveCommand.cpp \
 ../../../../../../cocos/renderer/CCQuadCommand.cpp \
 ../../../../../../cocos/renderer/CCRenderCommand.cpp \
 ../../../../../../cocos/renderer/CCRenderState.cpp \
 ../../../../../../cocos/renderer/CCRenderer.cpp \
 ../../../../../../cocos/renderer/CCTexture2D.cpp \
 ../../../../../../cocos/renderer/CCTextureAtlas.cpp \
 ../../../../../../cocos/renderer/CCTextureCache.cpp \
 ../../../../../../cocos/renderer/CCTrianglesCommand.cpp \
 ../../../../../../cocos/renderer/CCVertexAttribBinding.cpp \
 ../../../../../../cocos/renderer/CCVertexIndexBuffer.cpp \
 ../../../../../../cocos/renderer/CCVertexIndexData.cpp \
 ../../../../../../cocos/renderer/ccGLStateCache.cpp \
 ../../../../../../cocos/renderer/ccShaders.cpp \
 ../../../../../../cocos/storage/local-storage/LocalStorage-android.cpp \
 ../../../../../../cocos/storage/local-storage/LocalStorage.cpp \
 ../../../../../../cocos/ui/CocosGUI.cpp \
 ../../../../../../cocos/ui/UIAbstractCheckButton.cpp \
 ../../../../../../cocos/ui/UIButton.cpp \
 ../../../../../../cocos/ui/UICheckBox.cpp \
 ../../../../../../cocos/ui/UIEditBox/UIEditBox.cpp \
 ../../../../../../cocos/ui/UIEditBox/UIEditBoxImpl-android.cpp \
 ../../../../../../cocos/ui/UIEditBox/UIEditBoxImpl-common.cpp \
 ../../../../../../cocos/ui/UIEditBox/UIEditBoxImpl-stub.cpp \
 ../../../../../../cocos/ui/UIHBox.cpp \
 ../../../../../../cocos/ui/UIHelper.cpp \
 ../../../../../../cocos/ui/UIImageView.cpp \
 ../../../../../../cocos/ui/UILayout.cpp \
 ../../../../../../cocos/ui/UILayoutComponent.cpp \
 ../../../../../../cocos/ui/UILayoutManager.cpp \
 ../../../../../../cocos/ui/UILayoutParameter.cpp \
 ../../../../../../cocos/ui/UIListView.cpp \
 ../../../../../../cocos/ui/UILoadingBar.cpp \
 ../../../../../../cocos/ui/UIPageView.cpp \
 ../../../../../../cocos/ui/UIPageViewIndicator.cpp \
 ../../../../../../cocos/ui/UIRadioButton.cpp \
 ../../../../../../cocos/ui/UIRelativeBox.cpp \
 ../../../../../../cocos/ui/UIRichText.cpp \
 ../../../../../../cocos/ui/UIScale9Sprite.cpp \
 ../../../../../../cocos/ui/UIScrollView.cpp \
 ../../../../../../cocos/ui/UIScrollViewBar.cpp \
 ../../../../../../cocos/ui/UISlider.cpp \
 ../../../../../../cocos/ui/UIText.cpp \
 ../../../../../../cocos/ui/UITextAtlas.cpp \
 ../../../../../../cocos/ui/UITextBMFont.cpp \
 ../../../../../../cocos/ui/UITextField.cpp \
 ../../../../../../cocos/ui/UIVBox.cpp \
 ../../../../../../cocos/ui/UIVideoPlayer-android.cpp \
 ../../../../../../cocos/ui/UIWebView.cpp \
 ../../../../../../cocos/ui/UIWebViewImpl-android.cpp \
 ../../../../../../cocos/ui/UIWidget.cpp \
 ../../../../../../extensions/GUI/CCControlExtension/CCControl.cpp \
 ../../../../../../extensions/GUI/CCControlExtension/CCControlButton.cpp \
 ../../../../../../extensions/GUI/CCControlExtension/CCControlColourPicker.cpp \
 ../../../../../../extensions/GUI/CCControlExtension/CCControlHuePicker.cpp \
 ../../../../../../extensions/GUI/CCControlExtension/CCControlPotentiometer.cpp \
 ../../../../../../extensions/GUI/CCControlExtension/CCControlSaturationBrightnessPicker.cpp \
 ../../../../../../extensions/GUI/CCControlExtension/CCControlSlider.cpp \
 ../../../../../../extensions/GUI/CCControlExtension/CCControlStepper.cpp \
 ../../../../../../extensions/GUI/CCControlExtension/CCControlSwitch.cpp \
 ../../../../../../extensions/GUI/CCControlExtension/CCControlUtils.cpp \
 ../../../../../../extensions/GUI/CCControlExtension/CCInvocation.cpp \
 ../../../../../../extensions/GUI/CCScrollView/CCScrollView.cpp \
 ../../../../../../extensions/GUI/CCScrollView/CCTableView.cpp \
 ../../../../../../extensions/GUI/CCScrollView/CCTableViewCell.cpp \
 ../../../../../../extensions/physics-nodes/CCPhysicsDebugNode.cpp \
 ../../../../../../extensions/physics-nodes/CCPhysicsSprite.cpp \
 ../../../../../../external/sources/ConvertUTF/ConvertUTF.c \
 ../../../../../../external/sources/ConvertUTF/ConvertUTFWrapper.cpp \
 ../../../../../../external/sources/edtaa3func/edtaa3func.cpp \
 ../../../../../../external/sources/tinyxml2/tinyxml2.cpp \
 ../../../../../../external/sources/unzip/ioapi.cpp \
 ../../../../../../external/sources/unzip/ioapi_mem.cpp \
 ../../../../../../external/sources/unzip/unzip.cpp \
 ../../../../../../external/sources/xxhash/xxhash.c \


  LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../../../../.. \
$(LOCAL_PATH)/../../../../../../cocos \
$(LOCAL_PATH)/../../../../../../cocos/audio/android \
$(LOCAL_PATH)/../../../../../../cocos/audio/include \
$(LOCAL_PATH)/../../../../../../cocos/platform/android \
$(LOCAL_PATH)/../../../../../../cocos/platform \
$(LOCAL_PATH)/../../../../../../cocos/editor-support \
$(LOCAL_PATH)/../../../../../../extensions \
$(LOCAL_PATH)/../../../../../../external \
$(LOCAL_PATH)/../../../../../../external/sources \
$(LOCAL_PATH)/../../../../../../external/android/$(TARGET_ARCH_ABI)/include \
$(LOCAL_PATH)/../../../../../../external/android/$(TARGET_ARCH_ABI)/include/spidermonkey \
$(LOCAL_PATH)/../../../../../../external/android/$(TARGET_ARCH_ABI)/include/chipmunk \
$(LOCAL_PATH)/../../../../../../external/android/$(TARGET_ARCH_ABI)/include/freetype \

LOCAL_EXPORT_LDLIBS := -lGLESv1_CM \
                       -lGLESv2 \
                       -lEGL \
                       -llog \
                       -landroid \
                       -lOpenSLES

LOCAL_LDLIBS := -lGLESv1_CM \
                       -lGLESv2 \
                       -lEGL \
                       -llog \
                       -landroid \
                       -lOpenSLES

LOCAL_STATIC_LIBRARIES := cocos_freetype2_static
LOCAL_STATIC_LIBRARIES += cocos_png_static
LOCAL_STATIC_LIBRARIES += cocos_jpeg_static
LOCAL_STATIC_LIBRARIES += cocos_tiff_static
LOCAL_STATIC_LIBRARIES += cocos_webp_static
LOCAL_STATIC_LIBRARIES += cocos_zlib_static

LOCAL_STATIC_LIBRARIES += libwebsockets_static

LOCAL_WHOLE_STATIC_LIBRARIES := cpufeatures
LOCAL_WHOLE_STATIC_LIBRARIES += cocos_chipmunk_static

  # define the macro to compile through support/zip_support/ioapi.c
    LOCAL_CFLAGS := -DUSE_FILE32API -fexceptions
    LOCAL_CPPFLAGS := -Wno-deprecated-declarations
    LOCAL_EXPORT_CFLAGS   := -DUSE_FILE32API
    LOCAL_EXPORT_CPPFLAGS := -Wno-deprecated-declarations

  include $(BUILD_STATIC_LIBRARY)

#$(call import-module,.)
$(call import-module,android)
$(call import-module,android/cpufeatures)