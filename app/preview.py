#File code này xài để preview trước giao diện, sau có dữ liệu thì xoá đi
import os, uuid
from flask import Flask, render_template, request, send_from_directory
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files.get("file")
    if file is None or file.filename == "":
        return "Chưa chọn ảnh", 400

    filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
    file.save(os.path.join(UPLOAD_DIR, filename))

    # TODO: 
    top3 = [
        {"name": "Apple___Black_rot", "confidence": 87.5},
        {"name": "Apple___Apple_scab", "confidence": 8.2},
        {"name": "Apple___Cedar_apple_rust", "confidence": 2.1},
    ]

    return render_template("result.html",
                           image_url=f"/uploads/{filename}",
                           top3=top3)

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_DIR, filename)


@app.route("/result")
def result():
     top3 = [
        {"name": "Apple___Black_rot", "confidence": 87.5},
        {"name": "Apple___Apple_scab", "confidence": 8.2},
        {"name": "Apple___Cedar_apple_rust", "confidence": 2.1},
    ]
     return render_template("result.html", image_url="", top3=top3)


if __name__ == "__main__":
    app.run(debug=True)