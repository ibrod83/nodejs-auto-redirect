const queryString= require('query-string')
const express = require('express')
const { setTimeout }= require('timers/promises')
const { createWriteStream, mkdirSync } = require('fs')
const path = require('path')
const app = express()
const util= require('util')
const stream =  require('stream');
const pipelinePromisified = util.promisify(stream.pipeline);

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

app.post('/redirect',async(req,res)=>{
    // await setTimeout(2000);
    // req.on('data',()=>{console.log('data recevied in /redirect')})
    const to = req.query.to || 'https://ibrod83.com/books/img/children.jpg'
    console.log('redirecting to '+to)
    res.redirect(to)
})

app.post('/upload',async(req,res)=>{
    console.log('upload process began')//
    mkdirSync(path.join(__dirname,'temp'), { recursive: true })
    const write = createWriteStream(path.join(__dirname,'temp','uploadedFile.jpg'))//
    // req.on('data',(chunk)=>{
    //     // console.log('chunk recevied',chunk)
    //     write.write(chunk)
    // })
    // req.on('end',()=>{//
    //     // console.log('end event from upload')
    //     write.end()
    //     console.log('ended writing on server')
    //     res.send('ok')
    // })
    await pipelinePromisified(req,write)
    console.log('ended writing on server')
    res.send('ok')//
    
    // req.pipe(createWriteStream('./uploadedFile.jpg'))
    debugger;
})



app.post('/redirect2',async(req,res)=>{
    const url = getUrlWithQuery('http://localhost:8000/redirect',req.query)
    // await setTimeout(150)
    res.redirect(url)
})


app.post('/redirect3',async(req,res)=>{
    const url = getUrlWithQuery('http://localhost:8000/redirect2',req.query)
    // await setTimeout(150)
    res.redirect(url)
})


app.get('/redirect2',async(req,res)=>{
    const url = getUrlWithQuery('http://localhost:8000/redirect',req.query)
    // await setTimeout(150)
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


