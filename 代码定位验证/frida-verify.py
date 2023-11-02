import frida
import sys

# 连接手机设备,在运行这个代码之前，一定要先在手机上启动app
rdev = frida.get_remote_device()  # 获取设备信息


def get_processes():
    # # 枚举所有的进程
    # processes = rdev.enumerate_processes()
    # for process in processes:
    #     print("PID: {}, Name: {}".format(process.pid, process.name))

    # # 获取在前台运行的APP
    front_app = rdev.get_frontmost_application()
    print(front_app)


def on_message(message, data):
    print(message, data)


def main():
    # 端口转发
    """
adb forward tcp:27042 tcp:27042
adb forward tcp:27043 tcp:27043
    """

    # get_processes()  # 获取进程/包名

    session = rdev.attach("com.iflytek.iflyapp")  # 填app的包名/进程
    with open("frida-part.js", encoding="utf8") as f:
        script = session.create_script(f.read())

    script.on("message", on_message)
    script.load()
    sys.stdin.read()


if __name__ == '__main__':
    main()
