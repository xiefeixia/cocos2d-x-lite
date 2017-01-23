require "premake-androidmk/androidmk"

local COCOS_ROOT = "/Users/youyou/Desktop/workspace/fireball/cc-dev/cocos2d-x/"

function P (p)
    return COCOS_ROOT..p
end

function PrintTable( tbl , level, filteDefault)
  local msg = ""
  filteDefault = filteDefault or true --默认过滤关键字（DeleteMe, _class_type）
  level = level or 1
  local indent_str = ""
  for i = 1, level do
    indent_str = indent_str.."  "
  end

  print(indent_str .. "{")
  for k,v in pairs(tbl) do
    if filteDefault then
      if k ~= "_class_type" and k ~= "DeleteMe" then
        local item_str = string.format("%s%s = %s", indent_str .. " ",tostring(k), tostring(v))
        print(item_str)
        if type(v) == "table" then
          PrintTable(v, level + 1)
        end
      end
    else
      local item_str = string.format("%s%s = %s", indent_str .. " ",tostring(k), tostring(v))
      print(item_str)
      if type(v) == "table" then
        PrintTable(v, level + 1)
      end
    end
  end
  print(indent_str .. "}")
end

local commonAndroidIncludeDirs = { 
    "../external/android/$(TARGET_ARCH_ABI)/include", 
    "../external/android/$(TARGET_ARCH_ABI)/include/spidermonkey", 
    "../external/android/$(TARGET_ARCH_ABI)/include/chipmunk", 
    "../external/android/$(TARGET_ARCH_ABI)/include/freetype",
    "../cocos/platform",
    "../cocos/platform/android",
    "../cocos/audio/android",
}

solution "CocosCreator"
    location ( "build" )
    configurations { "Debug", "Release" }
    platforms {"native", "x64", "x32"}
    language "C++"
    
    filter "configurations:Release"
        optimize "On"
    filter "configurations:Debug"
        optimize "Debug"

    configuration "macosx"
        location "frameworks/runtime-src/proj.mac"

    configuration "androidmk"
        ndkabi      "armeabi-v7a"
        ndkplatform "android-14"

    project "cocos2d_libs"
        kind "StaticLib"

        files { "../cocos/**.cpp", "../cocos/**.h", "../cocos/**.c" }
        files { "../external/sources/ConvertUTF/**", "../external/sources/edtaa3func/**", "../external/sources/unzip/**", "../external/sources/tinyxml2/**", "../external/sources/xxhash/**", "../external/sources/poly2tri/**", "../external/sources/clipper/**" }
        files { "../extensions/**.h", "../extensions/**.cpp" }
        removefiles { "../cocos/scripting/**", "../cocos/base/CCDataVisitor.*", "../extensions/anysdk/**" }

        includedirs { "../", "../cocos", "../cocos/editor-support", "../extensions", "../external", "../external/sources", "../cocos/audio/include" }

        defines { "USE_FILE32API", "CC_ENABLE_CHIPMUNK_INTEGRATION=1" }

        configuration "macosx"
            filter "configurations:Debug"
                defines { "COCOS2D_DEBUG=1" }
            files { "../cocos/**.mm", "../cocos/**.m" }
            
            includedirs { "../external/mac/include",  "../external/mac/include/spidermonkey", "../external/mac/include/chipmunk", "../external/mac/include/freetype" }

            links { "QuartzCore.framework",  "Cocoa.framework", "ApplicationServices.framework", "OpenGL.framework", "AudioToolbox.framework", "IOKit.framework", "Foundation.framework", "AVFoundation.framework" }
            libdirs { "../external/mac/libs" }
            
            removefiles { "../cocos/platform/android/**", "../cocos/platform/win32/**", "../cocos/audio/android/**", "../cocos/audio/win32/**", "../cocos/audio/ios/**" }
            removefiles { "../cocos/network/CCDownloader-android.cpp",  "../cocos/network/CCDownloader-android.h", "../cocos/network/HttpClient-android.cpp" }
            removefiles { "../cocos/scripting/**" }
            removefiles { "../cocos/ui/UIEditBox/iOS/**" }

            xcodebuildsettings { 
                ALWAYS_SEARCH_USER_PATHS = 'YES',
                CLANG_CXX_LANGUAGE_STANDARD = "c++0x", 
                CLANG_CXX_LIBRARY = "libc++" 
            }

            pchheader (P("cocos/platform/mac/cocos2d-prefix.pch"))

            links { "glfw3", "ssl", "crypto", "curl", "chipmunk", "chipmunk", "websockets", "websockets", "freetype", "jpeg", "png", "tiff", "freetype" }


        configuration "androidmk"
            location "frameworks/runtime-src/proj.android/jni/cocos"
            targetname "libcocos2d_libs"

            removefiles { "../cocos/network/CCDownloader-curl.cpp", "../cocos/network/HttpCookie.cpp", "../cocos/network/HttpClient.cpp" }
            removefiles { "../cocos/platform/win32/**", "../cocos/platform/desktop/**", "../cocos/platform/apple/**", "../cocos/audio/win32/**" }
            
            removefiles { "../cocos/math/MathUtil.cpp", "../cocos/ui/UIEditBox/UIEditBoxImpl-win32.cpp" }

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

    project "jscocos2d"
        kind "StaticLib"

        files { "../cocos/scripting/**.cpp", "../cocos/scripting/**.h", "../cocos/scripting/**.hpp" }

        includedirs { "../", "../cocos", "../cocos/editor-support", "../extensions", "../external", "../external/sources" }
        includedirs { "../cocos/ui", "../cocos/3d", "../cocos/2d", "../cocos/base" }
        includedirs { "../cocos/scripting/js-bindings/manual", "../cocos/scripting/js-bindings/auto" }

        defines { "USE_FILE32API", "CC_ENABLE_CHIPMUNK_INTEGRATION=1", "COCOS2D_JAVASCRIPT" }

        configuration "macosx"
            files { "../cocos/scripting/**.mm" }
            libdirs { "../external/mac/libs" }
            includedirs { "../external/mac/include", "../external/mac/include/spidermonkey", "../external/mac/include/chipmunk", "../external/mac/include/freetype" }
            -- xcode.getbuildcategory(node)
            removefiles { "../cocos/scripting/js-bindings/manual/experimental/jsb_cocos2dx_experimental_webView_manual.h", "../cocos/scripting/js-bindings/manual/experimental/jsb_cocos2dx_experimental_webView_manual.cpp" }
            
            xcodebuildsettings { 
                ALWAYS_SEARCH_USER_PATHS = 'YES',
                CLANG_CXX_LANGUAGE_STANDARD = "c++0x", 
                CLANG_CXX_LIBRARY = "libc++" 
            }

            filter "configurations:Debug"
                defines { "COCOS2D_DEBUG=1" }
            
            links { "js_static" }

        configuration "androidmk"
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

    project "test"
        kind "WindowedApp"

        files { "frameworks/runtime-src/Classes/**" }
        
        includedirs { "frameworks/runtime-src/Classes" }
        includedirs { "../", "../cocos", "../cocos/editor-support", "../extensions", "../external", "../external/sources", "../cocos/audio/include" }
        includedirs { "../cocos/scripting/js-bindings/manual", "../cocos/scripting/js-bindings/auto" }

        configuration "macosx"
            files { "frameworks/runtime-src/proj.ios_mac/mac/**" }

            links { "glfw3", "ssl", "crypto", "curl", "chipmunk", "chipmunk", "websockets", "websockets", "freetype", "jpeg", "png", "tiff", "freetype" }
            links { "QuartzCore.framework",  "Cocoa.framework", "ApplicationServices.framework", "OpenGL.framework", "AudioToolbox.framework", "IOKit.framework", "Foundation.framework", "AVFoundation.framework", "Security.framework", "AppKit.framework", "OpenAL.framework", "AudioToolbox.framework" }
            links { "z" }
            links { "cocos2d_libs", "jscocos2d" }
            links { "js_static", "iconv", "curl", "sqlite3" }

            libdirs { "../external/mac/libs" }

            files { "main.js", "project.json", "src", "res", "../cocos/scripting/js-bindings/script" }
            xcodebuildresources { "main.js", "project.json", "src" }
    
            includedirs { "../", "../cocos", "../cocos/editor-support", "../extensions", "../external", "../external/mac/include", "../external/mac/include/spidermonkey", "../external/mac/include/chipmunk", "../external/mac/include/freetype", "../external/sources" }
            includedirs { "../cocos/ui", "../cocos/3d", "../cocos/2d", "../cocos/base", "../cocos/audio/include" }
            includedirs { "../cocos/scripting/js-bindings/manual", "../cocos/scripting/js-bindings/auto" }

            xcodebuildsettings { 
                ALWAYS_SEARCH_USER_PATHS = 'YES',
                CLANG_CXX_LANGUAGE_STANDARD = "c++0x", 
                CLANG_CXX_LIBRARY = "libc++" 
            }

            pchheader "../runtime-src/proj.ios_mac/mac/Prefix.pch"

        configuration "androidmk"
            targetname "libcocos2djs"
            location "frameworks/runtime-src/proj.android/jni"

            files { "frameworks/runtime-src/proj.android/jni/hellojavascript/main.cpp" }
            links { "jscocos2d" }

            includedirs (commonAndroidIncludeDirs)

            -- amk_includes {
            --     "js-bindings"
            -- }

