
/*
* 原理：在数据包加解密过程中，客户端与服务端进行数据交互时，通常会使用JSON数据作为中间数据进行交互。这时候就用用到一些JSON解析相关的类，如JSONObject、Gson等。
* JSONObject这个类使用的相对较少，因为不是很好用。而Gson使用的相对较多，但Gson并不是系统类，可以被混淆。
*
*
* 作用：
* 以上脚本在原有的基础上增加了对Gson库的支持。
* 脚本将同时Hook `org.json.JSONObject` 和 `com.google.gson.Gson` 类的相关方法。
* 当这些方法被调用时，脚本将打印参数值、方法的返回值以及调用栈信息。
* 这有助于分析和了解在Android应用程序中使用Gson库对数据进行序列化和反序列化的过程。
* */
// 使用Java.perform函数确保在主线程中运行代码
Java.perform(function () {
    // 使用Java.use获取对org.json.JSONObject类的引用
    var jSONObject = Java.use("org.json.JSONObject");

    // 使用Java.use获取对com.google.gson.Gson类的引用
    var gson = Java.use("com.google.gson.Gson");

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

    // Hook org.json.JSONObject类的put方法，该方法有两个参数（java.lang.String, java.lang.Object）
    jSONObject.put.overload('java.lang.String', 'java.lang.Object').implementation = function (a, b) {
        // 打印put方法的参数值
        console.log("jSONObject.put: ", a, b);

        // 显示调用栈信息
        showStack();

        // 调用原始的put方法并返回结果
        return this.put(a, b);
    }

    // Hook org.json.JSONObject类的getString方法，该方法有一个参数（java.lang.String）
    jSONObject.getString.implementation = function (a) {
        // 打印getString方法的参数值
        console.log("jSONObject.getString: ", a);

        // 调用原始的getString方法并将结果存储在result变量中
        var result = this.getString(a);

        // 打印getString方法的返回值
        console.log("jSONObject.getString result: ", result);

        // 显示调用栈信息
        showStack();

        // 返回getString方法的结果
        return result;
    }

    // Hook com.google.gson.Gson类的toJson方法
    gson.toJson.overload('java.lang.Object').implementation = function (a) {
        // 打印toJson方法的参数值
        console.log("gson.toJson: ", a);

        // 显示调用栈信息
        showStack();

        // 调用原始的toJson方法并将结果存储在result变量中
        var result = this.toJson(a);

        // 打印toJson方法的返回值
        console.log("gson.toJson result: ", result);

        // 返回toJson方法的结果
        return result;
    }

    // Hook com.google.gson.Gson类的fromJson方法
    gson.fromJson.overload('java.lang.String', 'java.lang.Class').implementation = function (a, b) {
        // 打印fromJson方法的参数值
        console.log("gson.fromJson: ", a, b);

        // 显示调用栈信息
        showStack();

        // 调用原始的fromJson方法并将结果存储在result变量中
        var result = this.fromJson(a, b);

        // 打印fromJson方法的返回值
        console.log("gson.fromJson result: ",    result);

        // 返回fromJson方法的结果
        return result;
    }
});
