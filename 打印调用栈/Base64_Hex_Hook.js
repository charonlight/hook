/*
* 原理：加密以后的数据，通常需要进行base64编码或者Hex编码。
* 这时可以尝试Hook base64的encodeTostring方法来定位关键代码所在位置。
*
*
*
* 作用：此脚本会Hook android.util.Base64 类中的 encodeToString(byte[] input, int flags) 方法。
* 当这个方法被调用时，脚本将打印输入的字节数组（转换为JSON格式的字符串）以及返回值（Base64编码后的字符串）。
*
* */

Java.perform(function () {
    // 获取android.util.Base64类的引用
    var base64 = Java.use("android.util.Base64");

    // Hook android.util.Base64类的encodeToString(byte[] input, int flags)方法
    base64.encodeToString.overload('[B', 'int').implementation = function (a, b) {
        // 打印输入的字节数组（a）为JSON格式的字符串
        console.log("base64.encodeToString: ", JSON.stringify(a));

        // 调用原始的encodeToString方法并获取返回值（Base64编码后的字符串）
        var result = this.encodeToString(a, b);

        // 打印Base64编码后的字符串
        console.log("base64.encodeToString result: ", result)

        // 返回原始方法的结果（Base64编码后的字符串）
        return result;
    }
});
