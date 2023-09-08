from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO
import matplotlib.pyplot as plt

plt.switch_backend('agg')

app = Flask(__name__)
socketio = SocketIO(app)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def indexDashboard():
    return render_template('dashboard.html')

@app.route('/result')
def indexResult():
    return render_template('result.html')



@socketio.on('testConnection')
def testSocket(data):

    print(data)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=80, debug=False)
