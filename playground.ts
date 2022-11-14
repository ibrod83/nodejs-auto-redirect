
import { createReadStream, createWriteStream } from 'fs';
import { setTimeout } from 'timers/promises';
import { http, https } from './src/index'
// var request = http.request('http://localhost:8000/redirect3',async(response)=>{
// // var request = http.request({ path: "/redirect", host: "localhost:8000", hostname: "localhost", protocol: "http:", port: 8000},async(response)=>{
//   console.log('response')//
//   const writable = createWriteStream('./image.jpg')
//   response.pipe(writable)

// })
// request.end();//


// var request = http.request('http://localhost:8000/timeout',{timeout:2500},async(response)=>{
// var request = http.request('http://localhost:8000/timeout',{timeout:2500},async(response)=>{
// var request = http.request('http://localhost:8000/upload',{method:'post'},async(response)=>{
var request = http.request('http://localhost:8000/redirect?to=http://localhost:8000/upload', { method: 'post' }, async (response) => {
  // var request = https.request('https://8fa5-2a06-c701-74c7-1e00-9deb-d6f8-4370-3196.eu.ngrok.io/upload',{method:'post'},async(response)=>{
  // var request = http.request({ path: "/redirect", host: "localhost:8000", hostname: "localhost", protocol: "http:", port: 8000},async(response)=>{
  console.log('response main callback', response.statusCode)//
  // const writable = createWriteStream('./image.jpg')
  // response.pipe(writable)

});

async function* generate() {
  for (let i = 0; i < 10; i++) {//
    await setTimeout(10)

    yield new Uint8Array([i]);
  };
}

// const readable = Readable.from(generate())

const readable = createReadStream('./tests/dummy.jpg');
readable.on('data',(chunk)=>{
  request.write(chunk,(arg)=>{//
    console.log('callback of write',arg)
  })
})

readable.on('end',()=>{
  request.end();
})//

// (async () => {//
//   // await setTimeout(4000)
//   // for await (const chunk of generate()) {
//   for await (const chunk of readable) {
   
//     request.write(chunk)
//     await setTimeout(500)//
//     // await new Promise(resolve => request.write(chunk, resolve));
//     // console.log('chunk sent')
//   }
//   // await setTimeout(2000)
//   request.end();
// })();



