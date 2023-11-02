import frida
import sys
from flask import Flask, request, jsonify

app = Flask(__name__)

device = frida.get_usb_device()
session = device.attach("org.tdyoa.mcdfmv")  # 使用你的APP包名替换


@app.route('/decrypt', methods=['POST'])
def decrypt():
    encrypted_data = request.json['encrypted_data']
    decrypt_key = request.json['decrypt_key']

    script = session.create_script("""
        Java.perform(function() {
            var EncryptUtil = Java.use('com.qq.lib.EncryptUtil');
            var encrypted_data = '%s';
            var decrypt_key = '%s';

            var decrypted_data = EncryptUtil.decrypt(encrypted_data, decrypt_key);
            send(decrypted_data);
        });
    """ % (encrypted_data, decrypt_key))

    decrypted_data = None

    def on_message(message, data):
        nonlocal decrypted_data
        if message['type'] == 'send':
            decrypted_data = message['payload']

    script.on('message', on_message)
    script.load()
    script.unload()

    return jsonify({'decrypted_data': decrypted_data})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
