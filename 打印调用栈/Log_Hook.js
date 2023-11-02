//原理：有些APP会在日志信息中输出请求数据包或者加解密相关的调试内容
/*
* 这个Frida脚本的作用是hook Android应用程序中的android.util.Log类的w()方法。
* 当w()方法被调用时，脚本会首先打印调用栈信息，帮助了解w()方法是在哪个位置被调用的。
* 接着，脚本会打印一条消息，显示被hook的log.w方法的tag和message参数。
* 最后，脚本会继续调用原始的w()方法，并返回结果。
* */
// 使用Java.perform函数确保在主线程中运行代码
Java.perform(function () {
    // 使用Java.use获取对android.util.Log类的引用
    var log = Java.use("android.util.Log");

    // 定义一个显示调用栈信息的函数
    function showStack() {
        // 使用Java.use获取对java.lang.Throwable类的引用
        var throwable = Java.use("java.lang.Throwable");

        // 创建一个新的Throwable实例，用于获取调用栈信息
        var stackTrace = throwable.$new();

        // 获取调用栈信息并打印
        console.log(log.getStackTraceString(stackTrace));
    }

    // Hook android.util.Log类的w方法，该方法有两个参数（java.lang.String, java.lang.String）
    log.w.overload('java.lang.String', 'java.lang.String').implementation = function (tag, message) {


        // 打印被hook的log.w方法的tag和message参数
        console.log("log.w: ", tag, message);

        // 显示调用栈信息
        showStack();

        // 调用原始的w方法并返回结果
        return this.w(tag, message);
    };
});
