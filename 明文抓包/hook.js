Java.perform(function () {

    var AESUtil = Java.use("com.test.base.AESUtil");

    // 定义一个变量来存储从 Python 接收到的新字符串
    var newStr;
    AESUtil.aesEncrypt.overload('java.lang.String', 'java.lang.String').implementation = function (content, encryptKey) {
        // 将原始参数转换为 JSON 字符串并将其发送给 Python
        send({type: 'REQ', data: JSON.stringify(content)});

        // 等待来自 Python 的新参数
        var newArgs = recv('NEW_REQ', function (data) {
            // 将从 Python 接收到的 JSON 字符串转换为 JavaScript 对象
            newStr = JSON.parse(data.payload);
        });
        // 等待 recv 函数处理完数据
        newArgs.wait();

        // 使用新参数调用原始方法并返回结果
        return this.aesEncrypt(newStr, encryptKey);
    }

    // 定义一个变量来存储从 Python 接收到的新明文
    var newPlaintext;

    //解密位置
    AESUtil.aesDecrypt.overload('java.lang.String', 'java.lang.String').implementation = function (encryptStr, decryptKey) {

        var plaintext = this.aesDecrypt(encryptStr, decryptKey);
        // console.log(plaintext)

        // 将解密后的明文转换为 JSON 字符串并将其发送给 Python
        send({type: 'RESP', data: JSON.stringify(plaintext)});

        // 等待来自 Python 的新明文
        var newResult = recv('NEW_RESP', function (data) {
            // 将从 Python 接收到的 JSON 字符串转换为 JavaScript 对象
            newPlaintext = JSON.parse(data.payload);
        });
        // 等待 recv 函数处理完数据
        newResult.wait();

        return this.aesDecrypt(encryptStr, decryptKey);
    }
});
