//原理：app应用程序在登陆失败时，会弹出提示，根据弹出的组件样式，猜测使用的是Toast。如果要将toast显示出来，就需要使用到toast类中的show方法
/*
Frida脚本的作用是hook Android应用程序中的android.widget.Toast类的show()方法。
当show()方法被调用时，脚本会打印一条消息，表示该方法已被调用。同
时，脚本还会打印调用栈信息，帮助了解show()方法是在哪个位置被调用的。最后，脚本会继续调用原始的show()方法，使Toast正常显示。
*/
// 使用Java.perform函数确保在主线程中运行代码
Java.perform(function () {
    // 使用Java.use获取对android.widget.Toast类的引用
    var toast = Java.use("android.widget.Toast");

    // hook Toast类的show方法
    toast.show.implementation = function () {
        // 打印一个提示信息，表示toast.show方法被调用
        console.log("toast.show: ");

        // 使用Java.use获取对android.util.Log类的引用
        var log = Java.use("android.util.Log");

        // 使用Java.use获取对java.lang.Throwable类的引用
        var throwable = Java.use("java.lang.Throwable");

        // 创建一个新的Throwable实例，用于获取调用栈信息
        var stackTrace = throwable.$new();

        // 获取调用栈信息并打印
        console.log(log.getStackTraceString(stackTrace));

        // 调用原始的show方法
        return this.show();
    };
});
