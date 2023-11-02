/*
* 原理：在APP应用程序请求数据时，为了确保数据不被篡改，通常会在请求参数加上一个sign签名算法，而这个签名算法一般使用消息摘要算法来进行加密，如MD5、SHA、MAC算法等。
* 一般APP应用程序在进行数据签名的时候，会先对数据进行排序。
* 因为摘要结果不可逆，服务端需要根据接受到的数据来复现算法，以此来比对摘要结果。
* 而排序可以保证不会因为参数顺序不同而导致摘要结果不同。
* 在开发中较为常用的排序有Collections的sort方法、Arrays的sort方法
*
*
* 作用：这个Frida脚本的作用是hook Android应用程序中的java.util.Collections类的sort()方法。
* 脚本会针对两个重载版本的sort()方法进行hook。
* 当sort()方法被调用时，脚本首先打印调用栈信息，帮助了解sort()方法是在哪个位置被调用的。
* 接着，脚本会将传入的List参数转换为java.util.ArrayList类型，并打印排序前的List。
* 最后，脚本会继续调用原始的sort()方法，并返回结果。
* */

// 使用Java.perform函数确保在主线程中运行代码
Java.perform(function () {
    // 使用Java.use获取对java.util.Collections类的引用
    var collections = Java.use("java.util.Collections");

    // 定义一个显示调用栈信息的函数
    function showStack() {
        // 使用Java.use获取对android.util.Log类的引用
        var log = Java.use("android.util.Log");

        // 使用Java.use获取对java.lang.Throwable类的引用
        var throwable = Java.use("java.lang.Throwable");

        // 创建一个新的Throwable实例，用于获取调用栈信息
        var stackTrace = throwable.$new();

        // 获取调用栈信息并打印
        console.log(log.getStackTraceString(stackTrace));
    }

    // Hook java.util.Collections类的sort方法，该方法有一个参数（java.util.List）
    collections.sort.overload('java.util.List').implementation = function (a) {
        // 显示调用栈信息
        showStack();

        // 将传入的List参数转换为java.util.ArrayList类型
        var result = Java.cast(a, Java.use("java.util.ArrayList"));

        // 打印排序前的List
        console.log("collections.sort List: ", result.toString());

        // 调用原始的sort方法并返回结果
        return this.sort(a);
    }

    // Hook java.util.Collections类的sort方法，该方法有两个参数（java.util.List, java.util.Comparator）
    collections.sort.overload('java.util.List', 'java.util.Comparator').implementation = function (a, b) {
        // 显示调用栈信息
        showStack();

        // 将传入的List参数转换为java.util.ArrayList类型
        var result = Java.cast(a, Java.use("java.util.ArrayList"));

        // 打印排序前的List
        console.log("collections.sort List Comparator: ", result.toString());

        // 调用原始的sort方法并返回结果
        return this.sort(a, b);
    };
});
