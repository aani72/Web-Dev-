from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

posts = []
next_id = 1

@app.route('/')
def index():
    return render_template('index.html', posts=posts)

@app.route('/create', methods=['GET', 'POST'])
def create():
    global next_id
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        posts.append({'id': next_id, 'title': title, 'content': content})
        next_id += 1
        return redirect(url_for('index'))
    return render_template('create.html')

@app.route('/edit/<int:post_id>', methods=['GET', 'POST'])
def edit(post_id):
    post = next((p for p in posts if p['id'] == post_id), None)
    if not post:
        return redirect(url_for('index'))
    if request.method == 'POST':
        post['title'] = request.form['title']
        post['content'] = request.form['content']
        return redirect(url_for('index'))
    return render_template('edit.html', post=post)

@app.route('/delete/<int:post_id>')
def delete(post_id):
    global posts
    posts = [p for p in posts if p['id'] != post_id]
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)