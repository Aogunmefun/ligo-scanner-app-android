// Write C++ code here.
//
// Do not forget to dynamically load the C++ library into your application.
//
// For instance,
//
// In MainActivity.java:
//    static {
//       System.loadLibrary("app");
//    }
//
// Or, in MainActivity.kt:
//    companion object {
//      init {
//         System.loadLibrary("app")
//      }
//    }

#include <jni.h>
#include <string>
#include <iostream>

extern "C" JNIEXPORT void JNICALL
Java_com_example_app_MainActivity_imgMask(JNIEnv *env, jobject /*thiz*/) {
    std::cout << "Welcome to GFG";
}