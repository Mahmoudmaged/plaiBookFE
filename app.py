import sys
import os

# Get the parent directory of the current script (app.py)
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)

# Add the parent directory to the Python path
sys.path.append(parent_dir)

from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO
from Classes.perspective_transform import PerspectiveTransform
from Classes.Soccer_Analysis import Soccer_Analysis
from Classes.yolo8_detection import Yolo8_detection
import os
from threading import Thread
from Classes.assets import *
import shutil

plt.switch_backend('agg')
app = Flask(__name__)
socketio = SocketIO(app)

from flask_socketio import SocketIO, join_room, leave_room

app = Flask(__name__)
socketio = SocketIO(app)

# Dictionary to store the room association for each client (replace with a database in production)
client_rooms = {}
client_id = None

@socketio.on('connect')
def handle_connect():
    # Here, you can determine the client's identity, such as a session ID or username
    client_id = request.sid  # Get the unique socket ID of the client
    room = client_id  # You can use the client's ID as the room name
    join_room(room)  # Join the client to the room
    client_rooms[client_id] = room  # Store the room association



@socketio.on('disconnect')
def handle_disconnect():
    client_id = request.sid
    room = client_rooms.get(client_id)
    if room:
        leave_room(room)
        del client_rooms[client_id]


# Clean previous results and videos to save space

try:
    shutil.rmtree('uploads')
    shutil.rmtree('../tmp/results')
except:
    pass

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def load_input_parameters():
    input_parameters = {}
    with open('../tmp/input_parameters.txt', 'r') as f:
        for line in f.readlines():
            parameter_list = line.split(';')
            parameter = parameter_list[0].split('=')
            if parameter[0].strip() == 'det-conf-thresh' or parameter[0].strip() == 'det-iou-thresh' \
                    or parameter[0].strip() == 'seg-conf-thresh' or parameter[0].strip() == 'seg-iou-thresh':
                input_parameters[parameter[0].strip()] = float(parameter[1].strip())
            elif parameter[0].strip() == 'outputfps' or parameter[0].strip() == 'images_batch_size' \
                    or parameter[0].strip() == 'skip_frames' or parameter[0].strip() == 'detection_skip_frames' \
                    or parameter[0].strip() == 'image_processing_height' \
                    or parameter[0].strip() == 'image_processing_width':
                input_parameters[parameter[0].strip()] = int(parameter[1].strip())
            elif parameter[0].strip() == 'debug' or parameter[0].strip() == 'save':
                input_parameters[parameter[0].strip()] = parameter[1].strip() == 'True'
            else:
                input_parameters[parameter[0].strip()] = parameter[1].strip()

        input_parameters['show_distances'] = False
        input_parameters['show_heatmap'] = False
        input_parameters['show_zone_analysis'] = False
        input_parameters['show_text_analysis'] = False
        input_parameters['show_speed_analysis'] = False
        input_parameters['analysis_hour'] = 0
        input_parameters['analysis_min'] = 0
        input_parameters['analysis_sec'] = 0
        input_parameters['start_time_hour'] = 0
        input_parameters['start_time_min'] = 0
        input_parameters['start_time_sec'] = 0
        input_parameters['left_team_color'] = str("['Light Blue',]")
        input_parameters['right_team_color'] = str("['red',]")
        input_parameters['referee_color'] = str("['black',]")
        input_parameters['url'] = 'CityUtdR.mp4'
        input_parameters['youtube'] = False
        input_parameters['email'] = 'keroatef295@gmail.com'

        starting_time_in_milliseconds = (int(input_parameters['start_time_hour']) * 3600 + int(
            input_parameters['start_time_min']) * 60 + int(input_parameters['start_time_sec'])) * 1000
        Analysis_time = (input_parameters['analysis_hour'] * 60 * 60) + (input_parameters['analysis_min'] * 60) + \
                        input_parameters['analysis_sec']
        input_parameters['source'] = 'tmp/inference/videos_input/' + input_parameters['url']
        input_parameters['starting_time_in_milliseconds'] = starting_time_in_milliseconds
        input_parameters['Analysis_time'] = Analysis_time
    return input_parameters


input_parameters = load_input_parameters()

soccer_analysis = Soccer_Analysis(input_parameters)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/dashboard')
def indexDashboard():
    return render_template('dashboard.html')


@app.route('/result')
def indexResult():
    return render_template('result.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    video = request.files['video']
    filepath = os.path.join(UPLOAD_FOLDER, video.filename)
    video.save(filepath)
    return jsonify({"message": "Video uploaded", "path": filepath}), 200


def send_speed_images(speed_images_arr):
    events_arr = ['left_team_speed_heatmap', 'right_team_speed_heatmap', 'left_team_players_speed',
                  'right_team_players_speed']
    for speed_image, event in zip(speed_images_arr, events_arr):
        ret, jpeg = cv2.imencode('.jpg', speed_image)
        img_str = base64.b64encode(jpeg.tobytes()).decode('utf-8')
        socketio.emit(event, {'image': f"data:image/jpeg;base64,{img_str}"},room=client_id)


def send_heatmaps_images(heatmap_images_arr):
    events_arr = ['left_team_heatmap', 'right_team_heatmap', 'ref_heatmap', ]
    for heat_image, event in zip(heatmap_images_arr, events_arr):
        ret, jpeg = cv2.imencode('.jpg', heat_image)
        img_str = base64.b64encode(jpeg.tobytes()).decode('utf-8')
        socketio.emit(event, {'image': f"data:image/jpeg;base64,{img_str}"},room=client_id)


def send_zone_analysis_images(zone_analysis_images_arr):
    events_arr = ['left_team_zone_analysis', 'right_team_zone_analysis', 'ref_analysis', ]
    for zone_image, event in zip(zone_analysis_images_arr, events_arr):
        ret, jpeg = cv2.imencode('.jpg', zone_image)
        img_str = base64.b64encode(jpeg.tobytes()).decode('utf-8')
        socketio.emit(event, {'image': f"data:image/jpeg;base64,{img_str}"},room=client_id)


def send_text_analysis(text_analysis):
    socketio.emit('text_analysis', {'text_analysis': text_analysis},room=client_id)


def send_ai_enhancement(gpt_text):
    socketio.emit('gpt_text', {'gpt_text': gpt_text},room=client_id)


def update_parameters_from_ui(ui_data):
    soccer_analysis.opt['show_distances'] = ui_data['show_distance']
    # soccer_analysis.opt['left_team_color'] = str(f"['{ui_data['left_team_color']}',]")
    # soccer_analysis.opt['right_team_color'] = str(f"['{ui_data['right_team_color']}',]")
    # soccer_analysis.opt['referee_color'] = str(f"['{ui_data['ref_color']}',]")

    soccer_analysis.opt['left_team_color'] = str(f"{ui_data['left_team_color']}")
    soccer_analysis.opt['right_team_color'] = str(f"{ui_data['right_team_color']}")
    soccer_analysis.opt['referee_color'] = str(f"{ui_data['ref_color']}")

    soccer_analysis.opt['show_speed_analysis'] = ui_data['show_speed_analysis']
    soccer_analysis.opt['show_heatmap'] = ui_data['show_heatmap']
    soccer_analysis.opt['show_zone_analysis'] = ui_data['show_zone_analysis']
    soccer_analysis.opt['show_text_analysis'] = ui_data['show_text_analysis']

    if ui_data['youtube_url'] != '':
        soccer_analysis.opt['youtube'] = True
    else:
        soccer_analysis.opt['youtube'] = False
    soccer_analysis.opt['email'] = ui_data['email']
    starting_time_in_milliseconds = (int(ui_data['start_time_hour']) * 3600 + int(
        ui_data['start_time_min']) * 60 + int(
        ui_data['start_time_sec'])) * 1000
    Analysis_time = (int(ui_data['analysis_time_hour']) * 60 * 60) + (int(ui_data['analysis_time_min']) * 60) + int(
        ui_data['analysis_time_sec'])
    if soccer_analysis.opt['youtube']:
        youtube_url = get_video_url(ui_data['youtube_url'])
        soccer_analysis.opt['source'] = youtube_url
    else:
        uploaded_video_path = os.path.join(os.getcwd(), ui_data['path'])
        soccer_analysis.opt['source'] = uploaded_video_path
    soccer_analysis.opt['starting_time_in_milliseconds'] = starting_time_in_milliseconds
    soccer_analysis.opt['Analysis_time'] = Analysis_time


def write_highlight_status(text):
    socketio.emit('highlight_status', {'text': text}, room=client_id)


def display(frame_generator):
    for frame in frame_generator:
        if 'processed_frame' in frame.keys():
            socketio.emit('new_frame', {'image': frame['processed_frame']}, namespace='/',room=client_id)
        if 'speed_images' in frame.keys():
            send_speed_images(frame['speed_images'])
        if 'heatmaps' in frame.keys():
            send_heatmaps_images(frame['heatmaps'])
        if 'zone_analysis' in frame.keys():
            send_zone_analysis_images(frame['zone_analysis'])
        if 'text_analysis' in frame.keys():
            send_text_analysis(frame['text_analysis'])
        if 'highlight_status' in frame.keys():
            write_highlight_status(frame['highlight_status'])
        if 'total_frames' in frame.keys():
            socketio.emit('totalFrameNumber', frame['total_frames'],room=client_id)


@socketio.on('start_processing')
def process_video(data):
    # update the input parameters with the new data from the client side and also re initialize the video to can loop
    # over it again from the beginning
    print(data)
    update_parameters_from_ui(data)
    soccer_analysis.reset_object()
    # emit the total number of frames to the client side to can update the progress bar accordingly and also to can know when to stop the video processing
    load_models()
    socketio.emit('totalFrameNumber', {'total_frames': soccer_analysis.loop_length},room=client_id)
    t1 = time.time()
    frame_generator = soccer_analysis.video_run()
    display_thread = Thread(target=display, args=(frame_generator,), name='display_thread')
    display_thread.daemon = True  # thread dies when main thread (only non-daemon thread) exits.
    display_thread.start()
    print(time.time() - t1)


@socketio.on('get_variant_image')
def send_variant_image():
    # For demonstration, we're sending a random colored image.
    # In a real-world scenario, this can be any image/frame variant you need.
    dummy_image = 255 * np.random.rand(480, 640, 3)
    ret, jpeg = cv2.imencode('.jpg', dummy_image)
    image_str = base64.b64encode(jpeg.tobytes()).decode('utf-8')
    socketio.emit('variant_image_response', {'image': f"data:image/jpeg;base64,{image_str}"},room=client_id)


# @socketio.on('show_speed_images')
# def show_speed_images(data):
#     soccer_analysis.opt['show_speed_analysis'] = data['show_speed_analysis']

#
# @socketio.on('show_heatmap_images')
# def show_heatmap_images(data):
#     soccer_analysis.opt['show_heatmap'] = data['show_heatmap']
# prev=-1
# while soccer_analysis.frame_num< soccer_analysis.frame_count-100 and data['show_heatmap']:
#     print('frame_num',soccer_analysis.frame_num)
#     if soccer_analysis.frame_num % 56 == 0 and soccer_analysis.frame_num!=prev:
#         # Heat maps
#         t2 = time.time()
#         left_team_heatmap, right_team_heatmap, = soccer_analysis.draw_teams_heatmaps()
#         ref_heatmap = soccer_analysis.draw_referee_heatmaps()
#         print('heatmaps time', time.time() - t2)
#         send_heatmaps_images([left_team_heatmap, right_team_heatmap, ref_heatmap])
#         prev=soccer_analysis.frame_num


# @socketio.on('show_zone_analysis')
# def show_heatmap_images(data):
#     soccer_analysis.opt['show_zone_analysis'] = data['show_zone_analysis']
#

# @socketio.on('show_text_analysis')
# def show_text_analysis(data):
#     soccer_analysis.opt['show_text_analysis'] = data['show_text_analysis']


@socketio.on('show_ai_enhancement')
def show_ai_enhancement():
    insights = ""
    for line in soccer_analysis.text_analysis_lines:
        insights += line
    gpt_ans = get_gpt_response(insights)
    print(gpt_ans)
    send_ai_enhancement(gpt_ans)


def load_models():
    perspective_transform = PerspectiveTransform(input_parameters)
    detector = Yolo8_detection(os.path.join(os.getcwd(), '../model/weights/detection_yolo8.pt'), input_parameters)
    soccer_analysis.initialize_models(detector, perspective_transform)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=80, debug=False)
