/*
*原理：通常在加密之前会先将字符串转换成字节形式，这时可能会使用到String类的getBytes方法。
*加密的时候一般是对明文的字节形式的数据进行操作（左移、右移等操作），通过一些列操作后最终把这个字节数组变成另一个字节数组，就得到了加密结果，再转换成明文就看着是乱码，
* 因为经过前面的操作后，转换的字节结果并不一定就处于ascii码的可见字符范围里面，所以我们一般需要对加密后的字节数据进行编码（hex、base64、可以把任意数据变成可见形式）
*
*
* 作用：此脚本会Hook java.lang.String 类中的 getBytes() 方法和 getBytes(String charsetName) 方法。
* 当这些方法被调用时，脚本将打印调用栈信息、参数值（如果有）以及返回值（转换为字符串）。
*
*  */

Java.perform(function () {
    // 获取java.lang.String类的引用
    var str = Java.use("java.lang.String");

    // Hook java.lang.String类的getBytes()方法
    str.getBytes.overload().implementation = function () {
        // 打印调用栈信息
        showStack();

        // 调用原始的getBytes方法并获取返回值（字节数组）
        var result = this.getBytes();

        // 将字节数组转换为字符串
        var newStr = str.$new(result);

        // 打印转换后的字符串
        console.log("str.getBytes result: ", newStr);

        // 返回原始方法的结果（字节数组）
        return result;
    }

    // Hook java.lang.String类的getBytes(String charsetName)方法
    str.getBytes.overload('java.lang.String').implementation = function (a) {
        // 打印调用栈信息
        showStack();

        // 调用原始的getBytes方法并获取返回值（字节数组）
        var result = this.getBytes(a);

        // 将字节数组转换为字符串（使用指定的字符集）
        var newStr = str.$new(result, a);

        // 打印转换后的字符串
        console.log("str.getBytes result: ", newStr);

        // 返回原始方法的结果（字节数组）
        return result;
    }

    // 定义showStack函数，用于打印调用栈信息
    function showStack() {
        console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()));
    }
});
