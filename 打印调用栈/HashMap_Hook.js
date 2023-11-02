// hook_hashmap_put.js
//原理：APP应用程序在处理数据、提交数据时，通常会将数据存放于集合中，而HashMap又是其中较为常用的。因此，可以通过Hook HashMap的put方法来定位关键代码所在的位置。
// 使用Java.perform包装代码块以确保在正确的线程和类加载器上下文中执行
Java.perform(function () {
    // 获取 java.util.HashMap 类引用
    var HashMap = Java.use('java.util.HashMap');

    // Hook HashMap 的 put 方法
    HashMap.put.implementation = function (key, value) {
        // 将 Java String 转换为 JavaScript 字符串
        var keyStr = key ? key.toString() : '';

        //1.打印一下,初步判断是否存在
        console.log('Key:', keyStr);
        console.log('Value:', value);
        console.log('Call Stack:', Java.use('android.util.Log').getStackTraceString(Java.use('java.lang.Exception').$new()));

        // 2.缩小范围，如果 key 是 "xxx" 或 "xxx" , 打印调用栈
        // if (keyStr === 'securityData' || keyStr === 'sign') {
        //     // 打印 key 和 value
        //     console.log('Key:', keyStr);
        //     console.log('Value:', value);
        //
        //     // 打印调用栈
        //     console.log('Call Stack:', Java.use('android.util.Log').getStackTraceString(Java.use('java.lang.Exception').$new()));
        // }


        // 调用原始的 put 方法实现，并返回结果
        return this.put.call(this, key, value);
    };
});