LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)
LOCAL_MODULE := jscocos2d

LOCAL_SRC_FILES := ../../../../../../cocos/scripting/js-bindings/auto/jsb_cocos2dx_audioengine_auto.cpp \
 ../../../../../../cocos/scripting/js-bindings/auto/jsb_cocos2dx_auto.cpp \
 ../../../../../../cocos/scripting/js-bindings/auto/jsb_cocos2dx_builder_auto.cpp \
 ../../../../../../cocos/scripting/js-bindings/auto/jsb_cocos2dx_experimental_video_auto.cpp \
 ../../../../../../cocos/scripting/js-bindings/auto/jsb_cocos2dx_experimental_webView_auto.cpp \
 ../../../../../../cocos/scripting/js-bindings/auto/jsb_cocos2dx_extension_auto.cpp \
 ../../../../../../cocos/scripting/js-bindings/auto/jsb_cocos2dx_spine_auto.cpp \
 ../../../../../../cocos/scripting/js-bindings/auto/jsb_cocos2dx_studio_auto.cpp \
 ../../../../../../cocos/scripting/js-bindings/auto/jsb_cocos2dx_ui_auto.cpp \
 ../../../../../../cocos/scripting/js-bindings/auto/jsb_creator_auto.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/ScriptingCore.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/chipmunk/js_bindings_chipmunk_auto_classes.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/chipmunk/js_bindings_chipmunk_functions.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/chipmunk/js_bindings_chipmunk_manual.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/chipmunk/js_bindings_chipmunk_registration.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/cocos2d_specifics.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/cocosbuilder/js_bindings_ccbreader.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/cocostudio/jsb_cocos2dx_studio_conversions.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/cocostudio/jsb_cocos2dx_studio_manual.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/component/CCComponentJS.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/experimental/jsb_cocos2dx_experimental_video_manual.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/experimental/jsb_cocos2dx_experimental_webView_manual.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/extension/jsb_cocos2dx_extension_manual.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/js_bindings_core.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/js_bindings_opengl.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/js_manual_conversions.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/js_module_register.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/jsb_event_dispatcher_manual.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/jsb_opengl_functions.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/jsb_opengl_manual.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/jsb_opengl_registration.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/localstorage/js_bindings_system_functions.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/localstorage/js_bindings_system_registration.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/network/XMLHTTPRequest.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/network/jsb_socketio.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/network/jsb_websocket.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/spine/jsb_cocos2dx_spine_manual.cpp \
 ../../../../../../cocos/scripting/js-bindings/manual/ui/jsb_cocos2dx_ui_manual.cpp \


  LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../../../../.. \
$(LOCAL_PATH)/../../../../../../cocos \
$(LOCAL_PATH)/../../../../../../cocos/platform/android \
$(LOCAL_PATH)/../../../../../../cocos/editor-support \
$(LOCAL_PATH)/../../../../../../extensions \
$(LOCAL_PATH)/../../../../../../external \
$(LOCAL_PATH)/../../../../../../external/sources \
$(LOCAL_PATH)/../../../../../../cocos/ui \
$(LOCAL_PATH)/../../../../../../cocos/3d \
$(LOCAL_PATH)/../../../../../../cocos/2d \
$(LOCAL_PATH)/../../../../../../cocos/base \
$(LOCAL_PATH)/../../../../../../cocos/scripting/js-bindings/manual \
$(LOCAL_PATH)/../../../../../../cocos/scripting/js-bindings/auto \
$(LOCAL_PATH)/../../../../../../external/android/$(TARGET_ARCH_ABI)/include \
$(LOCAL_PATH)/../../../../../../external/android/$(TARGET_ARCH_ABI)/include/spidermonkey \
$(LOCAL_PATH)/../../../../../../external/android/$(TARGET_ARCH_ABI)/include/chipmunk \
$(LOCAL_PATH)/../../../../../../external/android/$(TARGET_ARCH_ABI)/include/freetype \

LOCAL_CFLAGS := -DCOCOS2D_JAVASCRIPT

LOCAL_EXPORT_CFLAGS := -DCOCOS2D_JAVASCRIPT


LOCAL_STATIC_LIBRARIES := cocos2d_libs
LOCAL_STATIC_LIBRARIES += cocos_chipmunk_static
LOCAL_STATIC_LIBRARIES += spidermonkey_static

  include $(BUILD_STATIC_LIBRARY)

  $(call import-module,cocos)
