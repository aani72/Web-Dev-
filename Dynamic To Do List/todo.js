const taskInput = document.getElementById("taskInput");
const reminderInput = document.getElementById("reminderTime");
const emailInput = document.getElementById("emailInput");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const addBtn = document.getElementById("addBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

addBtn.addEventListener("click", addTask);
renderTasks();
updateStats();
startReminderChecker();

function addTask() {
    const text = taskInput.value.trim();
    const time = reminderInput.value;
    const email = emailInput.value.trim();

    if (!text || !time || !email) {
        alert("Please fill all fields!");
        return;
    }

    const task = {
        id: Date.now(),
        text,
        time,
        email,
        completed: false,
        notified: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    updateStats();

    taskInput.value = "";
    reminderInput.value = "";
    emailInput.value = "";
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="task-header">
                <span class="${task.completed ? "completed" : ""}">
                    ${task.text}
                </span>
                <div class="task-buttons">
                    <button class="complete-btn" onclick="toggleComplete(${task.id})">Complete</button>
                    <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            </div>
            <div class="task-time">
                Reminder: ${new Date(task.time).toLocaleString()}
            </div>
        `;

        taskList.appendChild(li);
    });
}

function toggleComplete(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
    updateStats();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newText = prompt("Edit your task:", task.text);

    if (newText && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

function updateStats() {
    totalTasks.textContent = tasks.length;
    completedTasks.textContent =
        tasks.filter(t => t.completed).length;
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function startReminderChecker() {
    setInterval(() => {
        const now = new Date().getTime();

        tasks.forEach(task => {
            const taskTime = new Date(task.time).getTime();

            if (!task.completed && !task.notified && now >= taskTime) {
                alert(`Reminder: ${task.text}\nEmail: ${task.email}`);
                task.notified = true;
                saveTasks();
            }
        });
    }, 30000);
}
