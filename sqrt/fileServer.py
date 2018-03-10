from flask import Flask
from flask import request
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route('/', methods=['GET', 'POST'])

def hello_world():
    startIndex = int(request.args.get('start'))
    sizeToRead = int(request.args.get('length'))
    with open('sqrt2.10mil.txt') as big_file:
       if(startIndex + sizeToRead > len(big_file.read())):
            return 'ERROR'
       big_file.seek(startIndex)
       data = big_file.read(sizeToRead)
       return data
