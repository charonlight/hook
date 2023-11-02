//原理：Java集合ArrayList在开发中也很常用，也可以作为定位关键代码所在位置的方法之一。
// 比如签名算法使用时需要对参数进行排序，这个时候就可能会用到ArrayList。
//
// 在okhttp3的框架中也是使用ArrayList add这个方法去提交post参数的。

// 使用Java.perform包装代码块以确保在正确的线程和类加载器上下文中执行
Java.perform(function () {
    // 使用Java.use获取java.util.ArrayList类的引用
    var arrayList = Java.use("java.util.ArrayList");

    // hook ArrayList类中的add方法，这个重载接受一个参数（Object）
    arrayList.add.overload('java.lang.Object').implementation = function (a) {
        // 打印调用add方法时传递的参数a
        console.log("arrayList.add: ", a);

        // 调用原始的add方法并返回其结果
        return this.add(a);
    }

    // hook ArrayList类中的add方法，这个重载接受两个参数（int, Object）
    arrayList.add.overload('int', 'java.lang.Object').implementation = function (a, b) {
        // 打印调用add方法时传递的参数a和b
        console.log("arrayList.add: ", a, b);

        // 调用原始的add方法并返回其结果
        return this.add(a, b);
    }
})
