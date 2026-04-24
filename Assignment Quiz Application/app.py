# app.py | Quiz Application - Backend

from flask import Flask, render_template, request, session, redirect, url_for

app = Flask(__name__)
app.secret_key = 'quiz_secret_key_123'

questions = [
    {
        "question": "What does HTML stand for?",
        "options": ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink Text Mode Language", "None of these"],
        "answer": "Hyper Text Markup Language"
    },
    {
        "question": "Which language is used for styling web pages?",
        "options": ["HTML", "JavaScript", "CSS", "Python"],
        "answer": "CSS"
    },
    {
        "question": "Which tag is used to create a hyperlink in HTML?",
        "options": ["<link>", "<a>", "<href>", "<url>"],
        "answer": "<a>"
    },
    {
        "question": "What does CSS stand for?",
        "options": ["Computer Style Sheets", "Creative Style Syntax", "Cascading Style Sheets", "Colorful Style Sheets"],
        "answer": "Cascading Style Sheets"
    },
    {
        "question": "Which Python framework is used to build web apps?",
        "options": ["Django only", "Flask only", "Both Flask and Django", "Neither"],
        "answer": "Both Flask and Django"
    }
]

@app.route('/')
def index():
    session.clear()
    return render_template('index.html')

@app.route('/quiz', methods=['GET', 'POST'])
def quiz():
    if 'current' not in session:
        session['current'] = 0
        session['score'] = 0
        session['answers'] = []

    if request.method == 'POST':
        selected = request.form.get('option')
        current_index = session['current']
        correct = questions[current_index]['answer']

        answers = session.get('answers', [])
        answers.append({
            'question': questions[current_index]['question'],
            'selected': selected,
            'correct': correct,
            'is_correct': selected == correct
        })
        session['answers'] = answers

        if selected == correct:
            session['score'] = session.get('score', 0) + 1

        session['current'] = current_index + 1

        if session['current'] >= len(questions):
            return redirect(url_for('result'))

    current_index = session.get('current', 0)
    if current_index >= len(questions):
        return redirect(url_for('result'))

    q = questions[current_index]
    return render_template('quiz.html', question=q, number=current_index + 1, total=len(questions))

@app.route('/result')
def result():
    score = session.get('score', 0)
    answers = session.get('answers', [])
    total = len(questions)
    return render_template('result.html', score=score, total=total, answers=answers)

if __name__ == '__main__':
    app.run(debug=True)
