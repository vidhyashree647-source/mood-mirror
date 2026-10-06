from flask import Flask, render_template, request, jsonify
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = Flask(__name__)

analyzer = SentimentIntensityAnalyzer()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json()
    text = data.get("text", "").strip()

    if not text:
        return jsonify({
            "error": "Please enter or speak something."
        })

    scores = analyzer.polarity_scores(text)
    compound = scores["compound"]

    if compound >= 0.05:
        emotion = "Happy"
        emoji = "😊"
    elif compound <= -0.05:
        emotion = "Sad"
        emoji = "😢"
    else:
        emotion = "Neutral"
        emoji = "😐"

    confidence = round(abs(compound) * 100)

    if confidence < 40:
        confidence = 40

    return jsonify({
        "emotion": emotion,
        "emoji": emoji,
        "confidence": confidence,
        "positive": round(scores["pos"] * 100),
        "negative": round(scores["neg"] * 100),
        "neutral": round(scores["neu"] * 100)
    })


if __name__ == "__main__":
    app.run(debug=True)