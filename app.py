from dotenv import load_dotenv
load_dotenv()

import os

mongo_uri = os.getenv('MONGO_URI')

from pymongo import MongoClient

client = MongoClient(mongo_uri)
db = client.db_jungle 

from flask import Flask, render_template, request, jsonify 

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/todo", methods=['POST'])
def post_item():
    data = request.json
    todo_receive = data.get("todo_give")
    item = {
        "todo": todo_receive,
        "checked": False
    }
    
    db.items.insert_one(item)

    return jsonify({"result": "success", "msg":"등록 완료!"})


@app.route("/todo", methods=["GET"])
def show_items():
    all_items = list(
        db.items.find(
            {},
            {"_id": False}
        ))
    
    return jsonify({
        "result": "success", 
        "items": all_items
    })


@app.route("/todo/checked", methods=["POST"])
def complete_todo():
    data = request.json
    todo_receive = data.get("todo_give")

    db.items.update_one(
        {"todo": todo_receive}, 
        {"$set": {
            "checked": True
        }}
    )

    return jsonify({
        "result": "success", 
        "msg": "할 일 체크 완료!"
    })


@app.route("/todo/edit", methods=['POST'])
def edit_todo():
    data = request.json
    original_todo_receive = data.get("original_todo_give")
    updated_todo_receive = data.get("updated_todo_give")

    db.items.update_one(
        {"todo": original_todo_receive}, 
        {"$set": {
            "todo": updated_todo_receive
        }}
    )

    return jsonify({
        "result": "success",
        "msg": "할 일 업데이트 완료!" 
    })


@app.route("/todo/delete", methods=["DELETE"])
def delete_items():
    data = request.json
    todo_recieve = data.get("todo_give")
    db.items.delete_one({
        "todo": todo_recieve
    })
    return jsonify({
        "result":"success",
        "msg": "할 일 삭제 완료!"
    })


if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)




