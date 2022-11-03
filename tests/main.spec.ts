import { describe, it } from "mocha";
import { http } from '../src/index'
import expect from 'expect';
import { incomingMessageToJson, promisifyRequest } from "./utils";//


describe('Main tests', function(){
 
  this.timeout(0);

  it('Should get a JSON without redirect',async () => {
    const res = await promisifyRequest(http.request,'http://localhost:8000/json')
    const json = await incomingMessageToJson(res)
    expect(json).toStrictEqual({ name: 'John', age: 30 })
   

  })
  it('Should get a JSON with 3 redirects', async () => {
    const res = await promisifyRequest(http.request,'http://localhost:8000/redirect3/?to=http://localhost:8000/json')
    const json = await incomingMessageToJson(res)

    expect(json).toStrictEqual({ name: 'John', age: 30 })//
    expect(res.numRedirects).toBe(3)

  })

  it('Should timeout', (done) => {

    let timeoutCalled = false;
    const request = http.request('http://localhost:8000/timeout?timeout=800',{timeout:750},(response)=>{
    if(!timeoutCalled){
      throw new Error('Response received before timeout event')
    }else{
     
      done()
    }
    })
    request.end()
   
    
    request.on('timeout',()=>{//
      timeoutCalled = true;
    })
  })

  it('Should timeout, using setTimeout method', (done) => {

    let timeoutCalled = false;
    const request = http.request('http://localhost:8000/timeout?timeout=800',(response)=>{
    if(!timeoutCalled){
      throw new Error('Response received before timeout event')
    }else{
     
      done()
    }
    })
    request.end()
   
    request.setTimeout(750)
    
    request.on('timeout',()=>{//
      timeoutCalled = true;
    })
  })
  
  it('Should timeout after 1 redirect', (done) => {

    let timeoutCalled = false;
    const request = http.request('http://localhost:8000/redirect/?to=http://localhost:8000/timeout?timeout=800',{timeout:750},(response)=>{
    if(!timeoutCalled){
      throw new Error('Response received before timeout event')
    }else{
      expect(response.numRedirects).toBe(1)
      done()
    }
    })
    request.end()   
    
    request.on('timeout',()=>{
      timeoutCalled = true;
    })

    request.on('yoyo',()=>{
      console.log('yoyo event!')
    })
  })

  it('Should timeout after 1 redirect, using setTimeout method', (done) => {

    let timeoutCalled = false;
    const request = http.request('http://localhost:8000/redirect/?to=http://localhost:8000/timeout?timeout=800',(response)=>{
    if(!timeoutCalled){
      throw new Error('Response received before timeout event')
    }else{
      expect(response.numRedirects).toBe(1)
      done()
    }
    })
    request.end()   

    request.setTimeout(750)
    
    request.on('timeout',()=>{
      timeoutCalled = true;
    })

    request.on('yoyo',()=>{
      console.log('yoyo event!')
    })
  })
})

