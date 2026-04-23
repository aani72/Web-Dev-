// list.js | Experiment 4 - Dynamic To-Do List

let tasks = [];

function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();

    // Prevent empty tasks
    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    tasks.push({ text: text, done: false });
    input.value = '';
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('task-list');
    const emptyMsg = document.getElementById('empty-msg');
    list.innerHTML = '';

    if (tasks.length === 0) {
        emptyMsg.style.display = 'block';
        return;
    }

    emptyMsg.style.display = 'none';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';

        li.innerHTML = `
            <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleDone(${index})">
            <span class="task-text ${task.done ? 'done' : ''}" id="text-${index}">${task.text}</span>
            <button class="btn-edit" onclick="editTask(${index})">Edit</button>
            <button class="btn-delete" onclick="deleteTask(${index})">Delete</button>
        `;

        list.appendChild(li);
    });
}

function toggleDone(index) {
    tasks[index].done = !tasks[index].done;
    renderTasks();
}

function editTask(index) {
    const taskItem = document.querySelector(`#text-${index}`).parentElement;
    const currentText = tasks[index].text;

    taskItem.innerHTML = `
        <input type="text" class="edit-input" id="edit-${index}" value="${currentText}">
        <button class="btn-edit" onclick="saveEdit(${index})">Save</button>
        <button class="btn-delete" onclick="cancelEdit()">Cancel</button>
    `;
}

function saveEdit(index) {
    const newText = document.getElementById(`edit-${index}`).value.trim();
    if (newText === '') {
        alert('Task cannot be empty!');
        return;
    }
    tasks[index].text = newText;
    renderTasks();
}

function cancelEdit() {
    renderTasks();
}

function deleteTask(index) {
    if (confirm('Delete this task?')) {
        tasks.splice(index, 1);
        renderTasks();
    }
}

// Allow Enter key to add task
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('task-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') addTask();
    });
});