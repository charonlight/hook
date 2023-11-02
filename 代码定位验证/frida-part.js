Java.perform(function () {

    //frida片段-------------------------------------------------------------------------------
    let AESUtil = Java.use("com.iflytek.base.AESUtil");
    AESUtil["aesDecrypt"].overload('java.lang.String', 'java.lang.String').implementation = function (encryptStr, decryptKey) {
        console.log('aesDecrypt is called' + ', ' + 'encryptStr: ' + encryptStr + ', ' + 'decryptKey: ' + decryptKey);
        let ret = this.aesDecrypt(encryptStr, decryptKey);
        console.log('aesDecrypt ret value is ' + ret);
        return ret;
    };
    //---------------------------------------------------------------------------------------
});

//frida -UF -l frid-part.js