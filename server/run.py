from app import create_app
from flask import jsonify, render_template
from datetime import datetime
import os
app = create_app()

current_dir = os.path.dirname(os.path.abspath(__file__))

template_dir = os.path.join(current_dir, 'templates')
app.template_folder = template_dir


@app.route('/', methods=['GET'])
def index_router():
    # current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    # return jsonify({
    #     "message": "欢迎进入 音乐推荐系统服务端！",
    #     "date": f"当前时间：{current_time}"
    # })
    return render_template('index.html')

if __name__ == '__main__':
    print('\x1b[36m%s\x1b[0m' % 'Python启动成功')
    print('\x1b[36m%s\x1b[0m' % '请访问： http://localhost:3001')
    app.run(host='127.0.0.1', debug=True, port=3001)

    