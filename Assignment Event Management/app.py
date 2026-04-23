from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = "secret"

# sample data
events = [
    {"id": 1, "name": "Tech Fest", "date": "10 May", "venue": "Auditorium"},
    {"id": 2, "name": "Hackathon", "date": "15 May", "venue": "Lab"},
    {"id": 3, "name": "Workshop", "date": "20 May", "venue": "Hall"},
    {"id": 4, "name": "Seminar", "date": "25 May", "venue": "Room 101"}
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/events')
def show_events():
    return render_template('events.html', events=events)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        flash("Registration Successful!")
        return redirect(url_for('show_events'))
    return render_template('register.html', events=events)

@app.route('/admin')
def admin():
    return render_template('admin.html', events=events)

@app.route('/admin/add', methods=['POST'])
def add_event():
    new_event = {
        "id": len(events) + 1,
        "name": request.form['name'],
        "date": request.form['date'],
        "venue": request.form['venue']
    }
    events.append(new_event)
    flash("Event Added!")
    return redirect(url_for('admin'))

@app.route('/admin/delete/<int:id>')
def delete_event(id):
    global events
    events = [e for e in events if e['id'] != id]
    flash("Event Deleted!")
    return redirect(url_for('admin'))

if __name__ == '__main__':
    app.run(debug=True)