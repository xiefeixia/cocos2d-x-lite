LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)
LOCAL_MODULE := test
LOCAL_MODULE_FILENAME := libcocos2djs

LOCAL_SRC_FILES := ../../Classes/AppDelegate.cpp \
 ../../proj.ios_mac/mac/main.cpp \
 hellojavascript/main.cpp \


LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../Classes \
 $(LOCAL_PATH)/../../../../.. \
 $(LOCAL_PATH)/../../../../../cocos \
 $(LOCAL_PATH)/../../../../../cocos/editor-support \
 $(LOCAL_PATH)/../../../../../extensions \
 $(LOCAL_PATH)/../../../../../external \
 $(LOCAL_PATH)/../../../../../external/mac/include \
 $(LOCAL_PATH)/../../../../../external/mac/include/spidermonkey \
 $(LOCAL_PATH)/../../../../../external/mac/include/chipmunk \
 $(LOCAL_PATH)/../../../../../external/mac/include/freetype \
 $(LOCAL_PATH)/../../../../../external/sources \
 $(LOCAL_PATH)/../../../../../cocos/ui \
 $(LOCAL_PATH)/../../../../../cocos/3d \
 $(LOCAL_PATH)/../../../../../cocos/2d \
 $(LOCAL_PATH)/../../../../../cocos/base \
 $(LOCAL_PATH)/../../../../../cocos/audio/include \
 $(LOCAL_PATH)/../../../../../cocos/scripting/js-bindings/manual \
 $(LOCAL_PATH)/../../../../../cocos/scripting/js-bindings/auto \
 $(LOCAL_PATH)/../../../../../external/android/$(TARGET_ARCH_ABI)/include \
 $(LOCAL_PATH)/../../../../../external/android/$(TARGET_ARCH_ABI)/include/spidermonkey \
 $(LOCAL_PATH)/../../../../../external/android/$(TARGET_ARCH_ABI)/include/chipmunk \
 $(LOCAL_PATH)/../../../../../external/android/$(TARGET_ARCH_ABI)/include/freetype \
 $(LOCAL_PATH)/../../../../../cocos/platform \
 $(LOCAL_PATH)/../../../../../cocos/platform/android \
 $(LOCAL_PATH)/../../../../../cocos/audio/android \


LOCAL_STATIC_LIBRARIES := cocos2d_libs \
 jscocos2d \

LOCAL_LDLIBS := -L../../../../../external/mac/libs -lglfw3 -lssl -lcrypto -lchipmunk -lwebsockets -ljpeg -lpng -ltiff -lfreetype -lQuartzCore -lCocoa -lApplicationServices -lOpenGL -lIOKit -lFoundation -lAVFoundation -lSecurity -lAppKit -lOpenAL -lAudioToolbox -lz -ljs_static -liconv -lcurl -lsqlite3



include $(BUILD_SHARED_LIBRARY)

$(call import-module, cocos)
$(call import-module, js-bindings)