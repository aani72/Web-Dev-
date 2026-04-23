const quizData = [
    {
        question: "Which language is used for web page structure?",
        options: ["HTML", "CSS", "JavaScript", "Python"],
        answer: "HTML"
    },
    {
        question: "Which language is used for styling web pages?",
        options: ["HTML", "CSS", "JavaScript", "Java"],
        answer: "CSS"
    },
    {
        question: "Which language adds interactivity to websites?",
        options: ["C++", "Python", "JavaScript", "SQL"],
        answer: "JavaScript"
    }
];

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");

const quizSection = document.getElementById("quiz");
const resultSection = document.getElementById("result");
const scoreText = document.getElementById("score-text");
const feedbackText = document.getElementById("feedback");
const restartBtn = document.getElementById("restart-btn");

let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;

function loadQuestion() {
    selectedOption = null;
    const currentQuestion = quizData[currentQuestionIndex];

    questionElement.textContent = currentQuestion.question;
    optionsElement.innerHTML = "";

    currentQuestion.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option-btn");

        button.addEventListener("click", () => {
            document.querySelectorAll(".option-btn").forEach(btn =>
                btn.classList.remove("selected")
            );

            button.classList.add("selected");
            selectedOption = option;
        });

        optionsElement.appendChild(button);
    });
}

nextBtn.addEventListener("click", () => {

    if (!selectedOption) {
        alert("Please select an answer!");
        return;
    }

    if (selectedOption === quizData[currentQuestionIndex].answer) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    quizSection.classList.add("hidden");
    resultSection.classList.remove("hidden");

    scoreText.textContent = `You scored ${score} out of ${quizData.length}`;

    if (score === quizData.length) {
        feedbackText.textContent = "Excellent!";
    } else if (score >= quizData.length / 2) {
        feedbackText.textContent = "Good Job!";
    } else {
        feedbackText.textContent = "Try Again!";
    }
}

restartBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;

    resultSection.classList.add("hidden");
    quizSection.classList.remove("hidden");

    loadQuestion();
});

loadQuestion();
