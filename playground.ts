
import { createWriteStream } from 'fs';
import {http,https} from './src/index'
// var request = http.request('http://localhost:8000/redirect3',async(response)=>{
// // var request = http.request({ path: "/redirect", host: "localhost:8000", hostname: "localhost", protocol: "http:", port: 8000},async(response)=>{
//   console.log('response')//
//   const writable = createWriteStream('./image.jpg')
//   response.pipe(writable)

// })
// request.end();//


var request = http.request('http://localhost:8000/timeout',{timeout:2500},async(response)=>{
// var request = http.request({ path: "/redirect", host: "localhost:8000", hostname: "localhost", protocol: "http:", port: 8000},async(response)=>{
  console.log('response')
  // const writable = createWriteStream('./image.jpg')
  // response.pipe(writable)

})
request.on('timeout',()=>{//
  console.log('timeout!!!!')//
})
request.end();//

