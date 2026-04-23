const title = document.getElementById("title")
const description = document.getElementById("description")
const priority = document.getElementById("priority")
const addBtn = document.getElementById("addBtn")
const list = document.getElementById("taskList")
const count = document.getElementById("count")

let tasks = JSON.parse(localStorage.getItem("tasks")) || []
let filter = "all"

function save(){
localStorage.setItem("tasks", JSON.stringify(tasks))
}

function render(){

list.innerHTML=""

let filtered = tasks

if(filter==="active") filtered = tasks.filter(t=>!t.isDone)
if(filter==="completed") filtered = tasks.filter(t=>t.isDone)

if(filtered.length===0){
list.innerHTML="<p style='text-align:center'>No tasks found</p>"
}

filtered.forEach(task=>{

const li=document.createElement("li")

if(task.isDone) li.classList.add("completed")

li.innerHTML=`
<div>
<input type="checkbox" ${task.isDone?"checked":""}>
<div>
<span>${task.title}</span>
<small>${task.description || ""}</small>
</div>
</div>

<span class="priority ${task.priority}">${task.priority}</span>

<div class="actions">
<button class="edit">Edit</button>
<button class="delete">Delete</button>
</div>
`

li.querySelector("input").onclick=()=>{
task.isDone=!task.isDone
save()
render()
}

li.querySelector(".delete").onclick=()=>{
tasks = tasks.filter(t=>t.id!==task.id)
save()
render()
}

li.querySelector(".edit").onclick=()=>{

const newTitle = prompt("Edit task", task.title)
if(!newTitle) return

task.title = newTitle
save()
render()
}

list.appendChild(li)

})

const completed = tasks.filter(t=>t.isDone).length
count.innerText = `${completed} Completed / ${tasks.length} Total`
}

addBtn.onclick=()=>{

if(title.value.trim()==="") return

tasks.push({
id: Date.now(),
title: title.value,
description: description.value,
priority: priority.value,
isDone:false
})

title.value=""
description.value=""

save()
render()
}

document.querySelectorAll(".filters button").forEach(btn=>{
btn.onclick=()=>{
filter = btn.dataset.filter

document.querySelectorAll(".filters button").forEach(b=>b.classList.remove("active"))
btn.classList.add("active")

render()
}
})

title.addEventListener("keypress", e=>{
if(e.key==="Enter") addBtn.click()
})

render()
