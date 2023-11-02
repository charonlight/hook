from threading import Thread
from http.server import HTTPServer, BaseHTTPRequestHandler
import sys
import requests
import frida


# 创建一个请求处理器类，继承自 BaseHTTPRequestHandler
class RequestHandler(BaseHTTPRequestHandler):
    # 定义处理请求的方法
    def do_REQUEST(self):
        content_length = int(self.headers.get('content-length', 0))
        self.send_response(200)
        self.end_headers()
        self.wfile.write(self.rfile.read(content_length))

    # 处理响应的方法与处理请求的方法相同
    do_RESPONSE = do_REQUEST


def echo_server_thread():
    print('start echo server at port {}'.format(ECHO_PORT))
    server = HTTPServer(('', ECHO_PORT), RequestHandler)
    server.serve_forever()


# 定义处理来自 Frida 脚本的消息的函数
def on_message(message, data):
    if message['type'] == 'send':
        payload = message['payload']
        _type, data = payload['type'], payload['data']
        # print(message)
        if _type == 'REQ':
            data = str(data)
            r = requests.request('REQUEST', 'http://127.0.0.1:{}/'.format(ECHO_PORT),
                                 proxies={'http': 'http://127.0.0.1:{}'.format(BURP_PORT)},
                                 data=data.encode('utf-8'))

            script.post({'type': 'NEW_REQ', 'payload': r.text})
            print("burpsuite已经收到请求数据\n", r.text)

        elif _type == 'RESP':
            r = requests.request('RESPONSE', 'http://127.0.0.1:{}/'.format(ECHO_PORT),
                                 proxies={'http': 'http://127.0.0.1:{}'.format(BURP_PORT)},
                                 data=data.encode('utf-8'))

            script.post({'type': 'NEW_RESP', 'payload': r.text})
            print("burpsuite已经放行响应数据\n", r.text)


if __name__ == '__main__':
    ECHO_PORT = 28080  # 自定义端口
    BURP_PORT = 8080  # burp的监听端口
    args_process_name = "com.iflytek.iflyapp"  # 包名
    args_js_file = "./hook.js"  # 需要hook的脚本

    # 下面的信息都不需要改了
    t = Thread(target=echo_server_thread)
    t.daemon = True
    t.start()
    # 通过 USB 设备附加到指定进程
    session = frida.get_usb_device().attach(args_process_name)

    # 加载 Frida JS 脚本
    with open(args_js_file, "r", encoding='utf-8') as f:
        js_code = f.read()
    script = session.create_script(js_code)

    # 为 Frida 脚本设置消息处理函数
    script.on('message', on_message)
    script.load()

    # 使主线程保持运行，等待用户输入
    sys.stdin.read()
