// import AutoRedirectingRequest from ".";
// console.log(AutoRedirectingRequest)
// const yoyo = new AutoRedirectingRequest();
// debugger;
import { createWriteStream } from 'fs';
import {http,https} from './index'
// console.log(http)
// debugger;

var request = http.request('http://localhost:8000/redirect3',async(response)=>{
// var request = http.request({ path: "/redirect", host: "localhost:8000", hostname: "localhost", protocol: "http:", port: 8000},async(response)=>{
  console.log('response')//
  const writable = createWriteStream('./image.jpg')
  response.pipe(writable)

})

request.end();//

// var request = http.request(new URL('http://jsonplaceholder.typicode.com/todos/1'),(response)=>{
//   console.log('response')

// })


// console.log(request)
// debugger;

// http.yoyo()
// console.log(http.get)
// request.on('response',(response)=>{
//   console.log('response!')
//   // console.log(response)

// })