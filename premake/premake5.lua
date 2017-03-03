require "premake-androidmk/androidmk"

local COCOS_ROOT = "/Users/youyou/Desktop/workspace/fireball/cc-dev/cocos2d-x/"

function P (p)
    return COCOS_ROOT..p
end

local commonAndroidIncludeDirs = { 
    "../external/android/$(TARGET_ARCH_ABI)/include", 
    "../external/android/$(TARGET_ARCH_ABI)/include/spidermonkey", 
    "../external/android/$(TARGET_ARCH_ABI)/include/chipmunk", 
    "../external/android/$(TARGET_ARCH_ABI)/include/freetype",
    P("cocos/platform"),
    P("cocos/platform/android"),
    P("cocos/audio/android"),
}

function libsMacIos ()
    links { "chipmunk", "websockets", "jpeg", "png", "tiff", "freetype", "webp", "ssl", "crypto" }
    links { "Foundation.framework", "AVFoundation.framework", "AudioToolbox.framework", "QuartzCore.framework" }
end

function libsMac( ... )
    links { "glfw3", "curl" }
    links { 
        "Cocoa.framework", "ApplicationServices.framework", "OpenGL.framework", 
        "IOKit.framework", "AppKit.framework" 
    }
end

function xcodebuildsettingsCommon( ... )
    xcodebuildsettings { 
        ALWAYS_SEARCH_USER_PATHS = 'YES',
        CLANG_CXX_LANGUAGE_STANDARD = "c++0x", 
        CLANG_CXX_LIBRARY = "libc++",

        ENABLE_BITCODE = "NO",

        DEVELOPMENT_TEAM = "AWRL7A5V7U" -- https://developer.apple.com/account/#/membership/AWRL7A5V7U
    }
end

function xcodebuildsettingsIos( ... )
    xcodebuildsettings {
        INFOPLIST_FILE = "../proj.ios_mac/ios/info.plist",
        CODE_SIGN_IDENTITY = "iPhone Developer",
        SDKROOT = "iphoneos",
        IPHONEOS_DEPLOYMENT_TARGET = "8.0"
    }
end

function cocos2dLibsCommon( )
    kind "StaticLib"

    files { P("cocos/**.cpp"), P("cocos/**.h"), P("cocos/**.c") }
    files { P("external/sources/ConvertUTF/**"), P("external/sources/edtaa3func/**"), P("external/sources/unzip/**"), P("external/sources/tinyxml2/**"), P("external/sources/xxhash/**"), P("external/sources/poly2tri/**"), P("external/sources/clipper/**") }
    files { P("extensions/**.h"), P("extensions/**.cpp") }
    removefiles { P("cocos/scripting/**"), P("cocos/base/CCDataVisitor.*"), P("extensions/anysdk/**") }

    includedirs { P(""), P("cocos"), P("cocos/editor-support"), P("extensions"), P("external"), P("external/sources"), P("cocos/audio/include") }

    defines { "USE_FILE32API", "CC_ENABLE_CHIPMUNK_INTEGRATION=1" }

    filter "configurations:Debug"
        defines { "COCOS2D_DEBUG=1" }
    filter {}
end  

function cocos2dLibsMacIos( )
    files { P("cocos/**.mm"), P("cocos/**.m") }
    
    removefiles { P("cocos/platform/android/**"), P("cocos/platform/win32/**"), P("cocos/audio/android/**"), P("cocos/audio/win32/**")}
    removefiles { P("cocos/network/CCDownloader-android.cpp"),  P("cocos/network/CCDownloader-android.h"), P("cocos/network/HttpClient-android.cpp") }
    removefiles { P("cocos/scripting/**") }
    removefiles { P("cocos/ui/UIWebView-inl.h"), P("cocos/ui/UIWebView.cpp")}
    
    libsMacIos {}
end

function jsCocos2dCommon( )
    kind "StaticLib"

    files { P("cocos/scripting/**.cpp"), P("cocos/scripting/**.h"), P("cocos/scripting/**.hpp") }

    includedirs { P(""), P("cocos"), P("cocos/editor-support"), P("extensions"), P("external"), P("external/sources") }
    includedirs { P("cocos/ui"), P("cocos/3d"), P("cocos/2d"), P("cocos/base") }
    includedirs { P("cocos/scripting/js-bindings/manual"), P("cocos/scripting/js-bindings/auto") }

    defines { "USE_FILE32API", "CC_ENABLE_CHIPMUNK_INTEGRATION=1", "COCOS2D_JAVASCRIPT" }
end

function jsCocos2dMacIos( ... )
    -- removefiles { P("cocos/scripting/js-bindings/manual/experimental/jsb_cocos2dx_experimental_webView_manual.h"), P("cocos/scripting/js-bindings/manual/experimental/jsb_cocos2dx_experimental_webView_manual.cpp") }
    removefiles { P("cocos/scripting/js-bindings/manual/platform/android/**") }
    
    links { "js_static" }

    filter "configurations:Debug"
        defines { "COCOS2D_DEBUG=1" }
end

function projectCommon( )
    kind "WindowedApp"

    files { "frameworks/runtime-src/Classes/**" }
    
    includedirs { "frameworks/runtime-src/Classes" }
    includedirs { P(""), P("cocos"), P("cocos/editor-support"), P("extensions"), P("external"), P("external/sources"), P("cocos/audio/include") }
    includedirs { P("cocos/scripting/js-bindings/manual"), P("cocos/scripting/js-bindings/auto") }
end

function projectMacIos( )
    libsMacIos {}
    links { "Security.framework", "OpenAL.framework", "CoreGraphics.framework" }
    links { "z" }
    links { "js_static", "iconv", "sqlite3" }

    libdirs { P("external/ios/libs") }

    files { "main.js", "project.json", "src", "res", P("cocos/scripting/js-bindings/script") }
    xcodebuildresources { "main.js", "project.json", "[/]src$", "[/]res$", "js[-]bindings[/]script" }

    includedirs { P(""), P("cocos"), P("cocos/editor-support"), P("extensions"), P("external"), P("external/mac/include"), P("external/mac/include/spidermonkey"), P("external/mac/include/chipmunk"), P("external/mac/include/freetype"), P("external/sources") }
    includedirs { P("cocos/ui"), P("cocos/3d"), P("cocos/2d"), P("cocos/base"), P("cocos/audio/include") }
    includedirs { P("cocos/scripting/js-bindings/manual"), P("cocos/scripting/js-bindings/auto") }
end

solution "CocosCreator"
    location ( "build" )
    configurations { "Debug", "Release" }
    platforms {"native", "x64", "x32"}
    language "C++"

    -- architecture "x86_64"

    filter "action:xcode4"
        location "frameworks/runtime-src/proj.mac"
    filter "action:androidmk"
        ndkabi      "armeabi-v7a"
        ndkplatform "android-14"

    filter "configurations:Release"
        optimize "On"
    filter "configurations:Debug"
        optimize "Debug"

    project "cocos2d_libs_mac"
        cocos2dLibsCommon {}

        filter "action:xcode4"            
            includedirs { P("external/mac/include"),  P("external/mac/include/spidermonkey"), P("external/mac/include/chipmunk"), P("external/mac/include/freetype") }
            libdirs { P("external/mac/libs") }
            pchheader (P("cocos/platform/mac/cocos2d-prefix.pch"))

            xcodebuildsettingsCommon {}
            cocos2dLibsMacIos {}
            libsMac {}

            removefiles { P("cocos/ui/UIEditBox/iOS/**"), P("cocos/audio/ios/**") }

    project "cocos2d_libs_ios"
        cocos2dLibsCommon {}

        filter "action:xcode4"            
            includedirs { P("external/ios/include"),  P("external/ios/include/spidermonkey"), P("external/ios/include/chipmunk"), P("external/ios/include/freetype") }
            libdirs { P("external/ios/libs") }
            pchheader (P("cocos/platform/ios/cocos2d-prefix.pch"))

            xcodebuildsettingsCommon {}
            xcodebuildsettingsIos {}
            cocos2dLibsMacIos {}

            removefiles { P("cocos/ui/UIEditBox/Mac/**"), P("cocos/audio/mac/**"), P("cocos/platform/desktop/**"), P("cocos/network/CCDownloader-curl.*"), P("cocos/network/HttpClient.cpp") }

    project "cocos2d_libs_android"
        cocos2dLibsCommon {}

        filter "action:androidmk"
            location "frameworks/runtime-src/proj.android/jni/cocos"
            targetname "libcocos2d_libs"

            removefiles { P("cocos/network/CCDownloader-curl.cpp"), P("cocos/network/HttpCookie.cpp"), P("cocos/network/HttpClient.cpp") }
            removefiles { P("cocos/platform/win32/**"), P("cocos/platform/desktop/**"), P("cocos/platform/apple/**"), P("cocos/audio/win32/**") }
            
            removefiles { P("cocos/math/MathUtil.cpp"), P("cocos/ui/UIEditBox/UIEditBoxImpl-win32.cpp") }

            includedirs (commonAndroidIncludeDirs)

            links { "GLESv1_CM", "GLESv2", "EGL", "log", "android", "OpenSLES" }
            amk_exportlibs { "GLESv1_CM", "GLESv2", "EGL", "log", "android", "OpenSLES" }

            disablewarnings { "deprecated-declarations" }

            amk_staticlinks { 
                "cocos_freetype2_static", 
                "cocos_png_static", 
                "cocos_jpeg_static", 
                "cocos_tiff_static", 
                "cocos_webp_static", 
                "cocos_zlib_static",
                "libwebsockets_static"
            }

            amk_whole_staticlinks {
                "cpufeatures",
                "cocos_chipmunk_static"
            }

            amk_importmodules {
                "android",
                "android/cpufeatures"
            }

            amk_customstrings {
                'LOCAL_CFLAGS := -DUSE_FILE32API -fexceptions',
                'LOCAL_CPPFLAGS := -Wno-deprecated-declarations',
                'LOCAL_EXPORT_CFLAGS   := -DUSE_FILE32API',
                'LOCAL_EXPORT_CPPFLAGS := -Wno-deprecated-declarations',
                '',
                '',
                'ifeq ($(TARGET_ARCH_ABI),armeabi-v7a)',
                'MATHNEONFILE := ../../../../../../cocos/math/MathUtil.cpp.neon',
                'else',
                'MATHNEONFILE := ../../../../../../cocos/math/MathUtil.cpp',
                'endif',
                'LOCAL_SRC_FILES += $(MATHNEONFILE)',
            }

    project "jscocos2d_mac"
        jsCocos2dCommon()

        filter "action:xcode4"
            files { P("cocos/scripting/**.mm") }
            libdirs { P("external/mac/libs") }
            includedirs { P("external/mac/include"), P("external/mac/include/spidermonkey"), P("external/mac/include/chipmunk"), P("external/mac/include/freetype") }
            
            jsCocos2dMacIos {}
            xcodebuildsettingsCommon {}

    project "jscocos2d_ios"
        jsCocos2dCommon()

        filter "action:xcode4"
            files { P("cocos/scripting/**.mm") }
            libdirs { P("external/ios/libs") }
            includedirs { P("external/ios/include"), P("external/ios/include/spidermonkey"), P("external/ios/include/chipmunk"), P("external/ios/include/freetype") }

            jsCocos2dMacIos {}
            xcodebuildsettingsCommon {}
            xcodebuildsettingsIos {}

    project "jscocos2d_android"
        jsCocos2dCommon()

        filter "action:androidmk"
            targetname "jscocos2d"
            location "frameworks/runtime-src/proj.android/jni/js-bindings"

            amk_staticlinks {
                "cocos2d_libs",
                "cocos_chipmunk_static",
                "spidermonkey_static"
            }

            amk_importmodules {
                "cocos"
            }

            includedirs (commonAndroidIncludeDirs)

    project "test_mac"
        projectCommon()

        filter "action:xcode4"
            files { "frameworks/runtime-src/proj.ios_mac/mac/**" }

            projectMacIos {}
            libsMac {}
            links { "cocos2d_libs_mac", "jscocos2d_mac" }

            libdirs { P("external/mac/libs") }

            xcodebuildsettingsCommon {}

            pchheader ( "../proj.ios_mac/mac/Prefix.pch" )

    project "test_ios"
        projectCommon()

        filter "action:xcode4"
            files { "frameworks/runtime-src/proj.ios_mac/ios/**" }

            projectMacIos {}
            links { "cocos2d_libs_ios", "jscocos2d_ios" }
            links { "PluginProtocol" }
            links { 
                "OpenGLES.framework", "UIKit.framework", "CoreMotion.framework", "MediaPlayer.framework", 
                "CoreText.framework", "CFNetwork.framework", "CoreFoundation.framework",
                "MobileCoreServices.framework", "GameController.framework", "SystemConfiguration.framework"
            }

            xcodebuildsettingsCommon {}
            xcodebuildsettingsIos {}

            xcodebuildresources { "proj[.]ios_mac[/]ios.*[.]png" }

            pchheader ( "../proj.ios_mac/ios/Prefix.pch" )


    project "test_android"
        projectCommon()

        filter "action:androidmk"
            targetname "libcocos2djs"
            location "frameworks/runtime-src/proj.android/jni"

            files { "frameworks/runtime-src/proj.android/jni/hellojavascript/main.cpp" }
            links { "jscocos2d" }

            includedirs (commonAndroidIncludeDirs)

-- premake.override(premake.modules.xcode, "generateProject", function(base, prj)
--     base(prj)
--     -- print(prj.xcode.projectnode)
-- end)
