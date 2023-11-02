/*
* 原理：
* APP应用程序在处理数据、提交数据时，通常会将数据存放于集合中，而HashMap又是其中较为常用的。因此，可以通过Hook HashMap的put方法来定位关键代码所在的位置。
*
* 作用：
* 这个脚本分别hook了 android.app.AlertDialog 和 android.widget.Toast 类中的一些常用方法，用于展示对话框和Toast。
* 对于 AlertDialog，脚本hook了 setTitle(CharSequence title) 和 setMessage(CharSequence message) 方法，用于设置对话框的标题和内容。
* 对于 Toast，脚本hook了 show() 方法，用于显示Toast。
* 每次调用这些方法时，脚本都会打印相关信息以及调用栈，便于分析和了解在Android应用程序中使用这些方法的上下文和目的。
* */

Java.perform(function () {
    var hashMap = Java.use("java.util.HashMap");
    hashMap.put.implementation = function (a, b) {
        // if(a.equals("username")){
        //     console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()));
        //     console.log("hashMap.put: ", a, b);
        // }
        return this.put(a, b);
    }
});
