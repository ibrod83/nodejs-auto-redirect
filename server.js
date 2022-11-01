const express  = require('express')
const app = express()

app.listen(8000)

app.get('/redirect',(req,res)=>{
    res.redirect('https://ibrod83.com/books/img/children.jpg')
})


app.get('/redirect2',(req,res)=>{
    res.redirect('http://localhost:8000/redirect')
})

app.get('/redirect3',(req,res)=>{
    res.redirect('http://localhost:8000/redirect2')
})