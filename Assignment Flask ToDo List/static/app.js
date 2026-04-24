// app.js — Flask To-Do App — All Fetch calls & DOM logic
// Name: ________________________________
// Roll Number: __________________________
// Date: _________________________________

'use strict';

// ─── State ───────────────────────────────────────────────────────────────────
let currentFilter = 'all';   // Tracks active filter: 'all' | 'active' | 'completed'


// ─── On DOM Ready ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});


// ─── 1. loadTasks() — Fetch and render task list ─────────────────────────────
async function loadTasks(filter = currentFilter) {
    const url = filter === 'all' ? '/api/tasks' : `/api/tasks?status=${filter}`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const tasks = await res.json();
        renderTaskList(tasks);
        updateCounter();       // Always fetch fresh totals for counter
    } catch (err) {
        showFetchError(`Failed to load tasks: ${err.message}`);
    }
}


// ─── 2. addTask() — Read inputs, validate, POST to Flask ─────────────────────
async function addTask() {
    const titleEl = document.getElementById('task-title');
    const descEl  = document.getElementById('task-desc');
    const prioEl  = document.getElementById('task-priority');
    const errEl   = document.getElementById('title-error');

    const title       = titleEl.value.trim();
    const description = descEl.value.trim();
    const priority    = prioEl.value;

    // Client-side validation — no fetch if empty
    if (!title) {
        errEl.style.display = 'block';
        titleEl.focus();
        return;
    }
    errEl.style.display = 'none';

    try {
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, priority })
        });
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || `Error ${res.status}`);
        }
        // Clear inputs on success
        titleEl.value = '';
        descEl.value  = '';
        prioEl.value  = 'medium';
        hideFetchError();
        await loadTasks();
    } catch (err) {
        showFetchError(`Could not add task: ${err.message}`);
    }
}


// ─── 3. deleteTask(id) — DELETE a task, remove card from DOM ─────────────────
async function deleteTask(id) {
    try {
        const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        if (res.status !== 204) throw new Error(`Unexpected status ${res.status}`);

        // Animate out then remove
        const card = document.querySelector(`.task-card[data-id="${id}"]`);
        if (card) {
            card.classList.add('slide-out');
            card.addEventListener('animationend', () => card.remove(), { once: true });
        }
        hideFetchError();
        await updateCounter();
    } catch (err) {
        showFetchError(`Could not delete task: ${err.message}`);
    }
}


// ─── 4. toggleTask(id) — PATCH toggle completed, update card ─────────────────
async function toggleTask(id) {
    try {
        const res = await fetch(`/api/tasks/${id}/toggle`, { method: 'PATCH' });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const task = await res.json();

        // Update card appearance without full reload
        const card = document.querySelector(`.task-card[data-id="${id}"]`);
        if (card) {
            const titleEl = card.querySelector('.task-title');
            const chk     = card.querySelector('.task-checkbox');
            if (task.completed) {
                card.classList.add('completed');
                titleEl.classList.add('strikethrough');
                chk.checked = true;
            } else {
                card.classList.remove('completed');
                titleEl.classList.remove('strikethrough');
                chk.checked = false;
            }
        }
        hideFetchError();
        await updateCounter();
    } catch (err) {
        showFetchError(`Could not toggle task: ${err.message}`);
    }
}


// ─── 5. editTask(id) — Inline edit mode ──────────────────────────────────────
function editTask(id) {
    const card = document.querySelector(`.task-card[data-id="${id}"]`);
    if (!card) return;

    // Read current values from data attributes
    const currentTitle = card.dataset.title;
    const currentDesc  = card.dataset.desc;
    const currentPrio  = card.dataset.priority;

    // Replace card body with edit fields
    const body = card.querySelector('.card-body');
    body.innerHTML = `
        <input  type="text" class="input-field edit-title-input" value="${escapeHtml(currentTitle)}" maxlength="120" />
        <textarea class="input-field edit-desc-input" rows="2">${escapeHtml(currentDesc)}</textarea>
        <select class="input-field edit-prio-select">
            <option value="low"    ${currentPrio === 'low'    ? 'selected' : ''}>🟢 Low</option>
            <option value="medium" ${currentPrio === 'medium' ? 'selected' : ''}>🟠 Medium</option>
            <option value="high"   ${currentPrio === 'high'   ? 'selected' : ''}>🔴 High</option>
        </select>
    `;

    // Replace action buttons
    const actions = card.querySelector('.card-actions');
    actions.innerHTML = `
        <button class="btn btn-save"   onclick="saveTask(${id})">💾 Save</button>
        <button class="btn btn-cancel" onclick="loadTasks()">✖ Cancel</button>
    `;
}


// ─── 6. saveTask(id) — PUT updated task to Flask ─────────────────────────────
async function saveTask(id) {
    const card = document.querySelector(`.task-card[data-id="${id}"]`);
    if (!card) return;

    const title       = card.querySelector('.edit-title-input').value.trim();
    const description = card.querySelector('.edit-desc-input').value.trim();
    const priority    = card.querySelector('.edit-prio-select').value;

    if (!title) {
        showFetchError('Title cannot be empty.');
        return;
    }

    try {
        const res = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, priority })
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        hideFetchError();
        await loadTasks();
    } catch (err) {
        showFetchError(`Could not save task: ${err.message}`);
    }
}


// ─── 7. filterTasks(status) — Update filter and reload list ──────────────────
async function filterTasks(status) {
    currentFilter = status;

    // Highlight active filter button
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.classList.toggle('active-filter', btn.dataset.filter === status);
    });

    await loadTasks(status);
}


// ─── 8. updateCounter() — Fetch all tasks and update count badges ─────────────
async function updateCounter() {
    try {
        const res = await fetch('/api/tasks');
        if (!res.ok) return;
        const all       = await res.json();
        const total     = all.length;
        const completed = all.filter(t => t.completed).length;
        const active    = total - completed;

        document.getElementById('cnt-total').textContent  = total;
        document.getElementById('cnt-active').textContent = active;
        document.getElementById('cnt-done').textContent   = completed;
        document.getElementById('nav-counter').textContent =
            `${total} task${total !== 1 ? 's' : ''}`;
    } catch (_) {
        // Silently ignore counter errors
    }
}


// ─── renderTaskList() — Build task card HTML and inject into DOM ──────────────
function renderTaskList(tasks) {
    const container = document.getElementById('task-list');

    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📭</span>
                <p>No tasks yet! Add your first task above.</p>
            </div>`;
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="task-card fade-in ${task.completed ? 'completed' : ''}"
             data-id="${task.id}"
             data-title="${escapeHtml(task.title)}"
             data-desc="${escapeHtml(task.description)}"
             data-priority="${task.priority}">

            <div class="card-header">
                <label class="checkbox-wrapper">
                    <input type="checkbox" class="task-checkbox"
                           ${task.completed ? 'checked' : ''}
                           onchange="toggleTask(${task.id})" />
                    <span class="checkmark"></span>
                </label>
                <span class="task-title ${task.completed ? 'strikethrough' : ''}">
                    ${escapeHtml(task.title)}
                </span>
                <span class="badge priority-${task.priority}">
                    ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
            </div>

            <div class="card-body">
                ${task.description
                    ? `<p class="task-desc">${escapeHtml(task.description)}</p>`
                    : ''}
                <small class="task-date">Added: ${task.created_at}</small>
            </div>

            <div class="card-actions">
                <button class="btn btn-edit"   onclick="editTask(${task.id})">✏️ Edit</button>
                <button class="btn btn-delete" onclick="deleteTask(${task.id})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}


// ─── Helpers ─────────────────────────────────────────────────────────────────

// Escape HTML to prevent XSS
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function showFetchError(msg) {
    const el = document.getElementById('fetch-error');
    el.textContent = msg;
    el.style.display = 'block';
}

function hideFetchError() {
    const el = document.getElementById('fetch-error');
    el.style.display = 'none';
}