const textInput =
    document.getElementById("textInput");

const startBtn =
    document.getElementById("startBtn");

const stopBtn =
    document.getElementById("stopBtn");

const analyzeBtn =
    document.getElementById("analyzeBtn");

const clearBtn =
    document.getElementById("clearBtn");


const emotion =
    document.getElementById("emotion");

const emotionEmoji =
    document.getElementById("emotionEmoji");

const confidence =
    document.getElementById("confidence");

const progressBar =
    document.getElementById("progressBar");

const voiceStatus =
    document.getElementById("voiceStatus");


/* SPEECH RECOGNITION */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


let recognition;


if (SpeechRecognition) {

    recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;


    startBtn.addEventListener("click", () => {

        recognition.start();

        voiceStatus.innerText =
            "● Listening to your voice...";

        startBtn.innerText =
            "🎙️ Listening...";

    });


    stopBtn.addEventListener("click", () => {

        recognition.stop();

        voiceStatus.innerText =
            "● Recording stopped";

        startBtn.innerText =
            "🎙️ Speak";

    });


    recognition.onresult = (event) => {

        const speechText =
            event.results[0][0].transcript;

        textInput.value = speechText;

        voiceStatus.innerText =
            "● Speech converted to text";

        startBtn.innerText =
            "🎙️ Speak";

    };


    recognition.onend = () => {

        startBtn.innerText =
            "🎙️ Speak";

    };


    recognition.onerror = () => {

        voiceStatus.innerText =
            "● Microphone error";

        startBtn.innerText =
            "🎙️ Speak";

    };

}


/* ANALYZE */

analyzeBtn.addEventListener("click", async () => {

    const text =
        textInput.value.trim();


    if (text === "") {

        alert("Please type or speak something.");

        return;

    }


    analyzeBtn.innerText =
        "⏳ Analyzing...";


    try {

        const response =
            await fetch("/analyze", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    text: text
                })

            });


        const data =
            await response.json();


        if (data.error) {

            alert(data.error);

            return;

        }


        /* MAIN RESULT */

        emotion.innerText =
            data.emotion;

        emotionEmoji.innerText =
            data.emoji;

        confidence.innerText =
            data.confidence + "%";

        progressBar.style.width =
            data.confidence + "%";


        /* EMOTION PERCENTAGES */

        document.getElementById("happy")
            .innerText =
            data.positive + "%";


        document.getElementById("neutral")
            .innerText =
            data.neutral + "%";


        document.getElementById("negative")
            .innerText =
            data.negative + "%";


        /* BARS */

        document.getElementById("happyBar")
            .style.width =
            data.positive + "%";


        document.getElementById("neutralBar")
            .style.width =
            data.neutral + "%";


        document.getElementById("negativeBar")
            .style.width =
            data.negative + "%";


    }

    catch (error) {

        alert("Unable to connect to Flask server.");

        console.log(error);

    }


    analyzeBtn.innerText =
        "✨ Analyze";

});


/* RESET */

clearBtn.addEventListener("click", () => {

    textInput.value = "";

    emotion.innerText =
        "Waiting...";

    emotionEmoji.innerText =
        "🤔";

    confidence.innerText =
        "0%";

    progressBar.style.width =
        "0%";


    document.getElementById("happy")
        .innerText = "0%";

    document.getElementById("neutral")
        .innerText = "0%";

    document.getElementById("negative")
        .innerText = "0%";


    document.getElementById("happyBar")
        .style.width = "0%";

    document.getElementById("neutralBar")
        .style.width = "0%";

    document.getElementById("negativeBar")
        .style.width = "0%";


    voiceStatus.innerText =
        "● Ready to listen";

});