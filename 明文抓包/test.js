Java.perform(function () {
    var AESUtil = Java.use("com.test.base.AESUtil");

    //加密位置
    AESUtil.aesEncrypt.overload('java.lang.String', 'java.lang.String').implementation = function (content, encryptKey) {
        console.log("\n请求加密前明文：\n", content);
        return this.aesEncrypt(content, encryptKey);
    }
    //解密位置
    AESUtil.aesDecrypt.overload('java.lang.String', 'java.lang.String').implementation = function (encryptStr, decryptKey) {
        console.log("\n响应解密后明文：\n", this.aesDecrypt(encryptStr, decryptKey));
        return this.aesDecrypt(encryptStr, decryptKey);
    }
});