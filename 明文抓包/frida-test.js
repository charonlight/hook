Java.perform(function () {

    //请求加密前的点
    let AESUtil = Java.use("com.test.base.AESUtil");
    AESUtil["aesEncrypt"].overload('java.lang.String', 'java.lang.String').implementation = function (content, encryptKey) {
        // console.log('aesEncrypt is called' + ', ' + 'content: ' + content + ', ' + 'encryptKey: ' + encryptKey);
        let ret = this.aesEncrypt(content, encryptKey);
        // console.log('aesEncrypt ret value is ' + ret);
        console.log("\n请求加密前明文：\n", content);
        send({type: 'REQ', data: JSON.stringify(content,encryptKey)});
        return content;
    };


    //相应解密后的点
    AESUtil["aesDecrypt"].overload('java.lang.String', 'java.lang.String').implementation = function (encryptStr, decryptKey) {
        // console.log('aesDecrypt is called' + ', ' + 'encryptStr: ' + encryptStr + ', ' + 'decryptKey: ' + decryptKey);
        let ret = this.aesDecrypt(encryptStr, decryptKey);
        // console.log('aesDecrypt ret value is ' + ret);
        console.log("\n响应解密后明文：\n",ret);
        return ret;
    };
});
