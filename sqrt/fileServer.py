from flask import Flask
from flask import request
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route('/', methods=['GET', 'POST'])

def serve_file():
    startIndex = int(request.args.get('start'))
    sizeToRead = int(request.args.get('length'))
    return get_file_contents(startIndex, sizeToRead)


def get_file_contents(startIndex, sizeToRead):
    with open('sqrt2.10mil.txt') as big_file:
        if(startIndex + sizeToRead > len(big_file.read())):
            return 'ERROR'
        big_file.seek(startIndex)
        data = big_file.read(sizeToRead)
        return data

@app.route('/create')
def create_parts():
    parts = int(request.args.get('parts'))
    with open('sqrt2.10mil.txt') as big_file:
        part_size = int(len(big_file.read()) / parts)
    for part in range(parts):
        with open('parts/part' + str(part) + '.txt', 'a+') as part_file:
            part_file.write(get_file_contents(part * part_size, part_size))
    return 'created' + str(parts)