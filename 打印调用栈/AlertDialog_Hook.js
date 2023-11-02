/*
* 原理：
* APP在做了某些检测或者操作后，一般会选择弹出一个对话框来对用户进行提示。
* 对话框的弹出一般是经过的一些判断满足了对应的条件后弹出，因此可通过hook对话框的调用来定位关键代码。
*
* 作用：
* 这个脚本分别hook了 android.app.AlertDialog 和 android.widget.Toast 类中的一些常用方法，用于展示对话框和Toast。
* 对于 AlertDialog，脚本hook了 setTitle(CharSequence title) 和 setMessage(CharSequence message) 方法，用于设置对话框的标题和内容。
* 对于 Toast，脚本hook了 show() 方法，用于显示Toast。
* 每次调用这些方法时，脚本都会打印相关信息以及调用栈，便于分析和了解在Android应用程序中使用这些方法的上下文和目的。
* */

Java.perform(function () {
    // 函数：显示调用栈
    function showStack() {
        console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()));
    }

    // 获取android.app.AlertDialog类的引用
    var alertDialog = Java.use("android.app.AlertDialog");

    // Hook android.app.AlertDialog类的setTitle(CharSequence title)方法
    alertDialog.setTitle.overload('java.lang.CharSequence').implementation = function (title) {
        console.log("AlertDialog.setTitle: ", title);
        showStack();
        return this.setTitle(title);
    }

    // Hook android.app.AlertDialog类的setMessage(CharSequence message)方法
    alertDialog.setMessage.overload('java.lang.CharSequence').implementation = function (message) {
        console.log("AlertDialog.setMessage: ", message);
        showStack();
        return this.setMessage(message);
    }

    // 获取android.widget.Toast类的引用
    var toast = Java.use("android.widget.Toast");

    // Hook android.widget.Toast类的show()方法
    toast.show.implementation = function () {
        console.log("Toast.show: ");
        showStack();
        return this.show();
    }
});
