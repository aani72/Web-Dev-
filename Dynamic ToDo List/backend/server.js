const express=require("express")
const sqlite3=require("sqlite3").verbose()
const cors=require("cors")
const bodyParser=require("body-parser")

const app=express()

app.use(cors())
app.use(bodyParser.json())

const db=new sqlite3.Database("db.sqlite")

db.serialize(()=>{
db.run(`CREATE TABLE IF NOT EXISTS tasks(
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT NOT NULL,
priority TEXT DEFAULT 'Medium',
isDone INTEGER DEFAULT 0,
createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`)
})

app.get("/tasks",(req,res)=>{
db.all("SELECT * FROM tasks",(err,rows)=>{
res.json(rows)
})
})

app.post("/tasks",(req,res)=>{
const {title,priority}=req.body
db.run("INSERT INTO tasks(title,priority) VALUES(?,?)",[title,priority],function(){
res.json({id:this.lastID})
})
})

app.put("/tasks/:id",(req,res)=>{
const {title,priority}=req.body
db.run("UPDATE tasks SET title=?,priority=? WHERE id=?",[title,priority,req.params.id],()=>{
res.json({updated:true})
})
})

app.patch("/tasks/:id/status",(req,res)=>{
db.get("SELECT isDone FROM tasks WHERE id=?",[req.params.id],(err,row)=>{
const newStatus=row.isDone?0:1
db.run("UPDATE tasks SET isDone=? WHERE id=?",[newStatus,req.params.id],()=>{
res.json({updated:true})
})
})
})

app.delete("/tasks/:id",(req,res)=>{
db.run("DELETE FROM tasks WHERE id=?",[req.params.id],()=>{
res.json({deleted:true})
})
})

app.listen(3000)
