import os
import json
import uuid
from flask import Flask, jsonify, send_from_directory, request, redirect

from core import NoteJson

app = Flask(__name__)


PORT = 8080
PUBLIC_FOLDER = 'root'
NOTEJSON = NoteJson("noteData.json",PORT)

@app.after_request
def add_header(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    return response


# IMAGES_FOLDER = 'images'
#
#
# @app.route('/pictures')
# def pictures_route():
#     result = PICTURES.pictures()
#     return jsonify(result)
#
#
# @app.route('/picture/<string:id>')
# def image_route(id):
#     pic = PICTURES.get_picture(id)
#     return send_from_directory(IMAGES_FOLDER + '/' + id, pic['name'])
#
#
# @app.route('/new-picture-url', methods=['POST'])
# def new_picture_url_route():
#     body = request.get_json()
#     result = PICTURES.new_picture_url(body['url'], IMAGES_FOLDER)
#     return jsonify(result)
#
#
# @app.route('/comments/<string:id>')
# def comments_route(id):
#     result = PICTURES.comments(id)
#     return jsonify(result)
#
#
# @app.route('/new-comment/<string:id>', methods=['POST'])
# def new_comment_route(id):
#     body = request.get_json()
#     result = PICTURES.new_comment(id, body['comment'])
#     return jsonify(result)


@app.route('/')
def root_route():
    print(NOTEJSON.fullNote)
    return redirect('/index.html')

@app.route('/loadAll')
def getAllData():
    result = NOTEJSON.loadAll()
    return jsonify(result)

@app.route('/deleteNoteJson', methods=['GET','POST'])
def deleteNoteJson():
    body = request.get_json()
    result = NOTEJSON.deleteNote(body)
    print(NOTEJSON.fullNote)
    return jsonify(result)

@app.route('/newNoteJson', methods=['GET','POST'])
def newNoteJson():
    body = request.get_json()
    result = NOTEJSON.addNewNote(body)
    print(NOTEJSON.fullNote)
    return jsonify(result)

@app.route('/updateNoteJson', methods=['GET','POST'])
def updateNoteJson():
    body = request.get_json()
    result = NOTEJSON.updateSelectedNote(body["title"], body["content"])
    print(NOTEJSON.fullNote)
    return jsonify(result)

@app.route('/editTabName', methods=['GET','POST'])
def editTabName():
    body = request.get_json()
    result = NOTEJSON.editTabName(body["prev"], body["curr"])
    return jsonify(result)

@app.route('/exportFile', methods=['GET','POST'])
def exportFile():
    body = request.get_json()
    fileName = body['title']
    fileText = body['content']

    typeList = fileName.split(".")
    if(len(typeList) == 1):
        fileName += ".txt"

    f = open(fileName, 'w')
    f.write(fileText)
    f.close()
    return jsonify(fileName)

@app.route('/importFile', methods=['GET','POST'])
def importFile():
    body = request.get_json()
    if(body in NOTEJSON.fullNote.keys()):
        return jsonify(-1)
    f = open(body,"r")
    data = f.read()
    f.close()
    result = NOTEJSON.updateSelectedNote(body, data)
    return jsonify(data)




@app.route('/<path:p>')
def generic_route(p):
    return send_from_directory(PUBLIC_FOLDER, p)


app.run(port=PORT)
