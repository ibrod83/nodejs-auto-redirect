const queryString= require('query-string')
const express = require('express')
const { setTimeout }= require('timers/promises')
const app = express()

const server = app.listen(8000,()=>{
    console.log('listening!')
   
})

app.get('/json',(req,res)=>{
    res.json({
        name:'John',
        age:30
    })
})

app.get('/redirect',(req,res)=>{
      
    const to = req.query.to || 'https://ibrod83.com/books/img/children.jpg'
    res.redirect(to  )
})


app.get('/redirect2',async(req,res)=>{
    const url = getUrlWithQuery('http://localhost:8000/redirect',req.query)
    await setTimeout(150)
    res.redirect(url)
})

app.get('/redirect3',async(req,res)=>{
    const url = getUrlWithQuery('http://localhost:8000/redirect2',req.query)
    await setTimeout(150)
    res.redirect(url)
})


app.get('/timeout',async(req,res)=>{
    const timeout = req.query?.timeout || 3000
    await setTimeout(timeout)
    res.send('ok')//
})


function getUrlWithQuery(url,query){
    //@ts-ignore
    return queryString.stringifyUrl({url,query })
}



module.exports= {
    server,app,

}


