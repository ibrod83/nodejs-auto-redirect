import { describe, it } from "mocha";
import { http } from '../src/index'
import expect from 'expect';
import { incomingMessageToJson, promisifyRequest, verifyFile } from "./utils";//
import rimraf from 'rimraf'
import path from 'path'
import { createReadStream, mkdirSync } from "fs";

describe('POST tests', function () {

    before(function (done) {
        // rimraf(path.join(__dirname, 'temp'), () => { 
        //     mkdirSync(path.join(__dirname, 'temp'))
        //     done()
        //  })

        // done()//
        rimraf.sync(path.join(__dirname, 'temp'))
        // mkdirSync(path.join(__dirname, 'temp'))
        done()//
    })

    this.timeout(0);

    it('Should upload a file with one redirect, using on("data")', (done) => {//
        var request = http.request('http://localhost:8000/redirect?to=http://localhost:8000/upload', { method: 'post' }, async (response) => {
            let hasError = false;
            let error;
            console.log('response from upload file')
            try {
                await verifyFile(path.join(__dirname, 'temp', 'uploadedFile.jpg'), 780831)//
            } catch (e:any) {
                hasError = true//
                error= e
            }finally{//
                done(hasError && new Error(error))
            }
        });

        const readable = createReadStream('./tests/dummy.jpg');
        readable.on('data', (chunk) => {
            request.write(chunk, (arg) => {//
                console.log('callback of write', arg)//
            })
        })

        readable.on('end', () => {
            request.end();
        })//
    })

    it('Should upload a file with two redirects, using on("data")', (done) => {//
        var request = http.request('http://localhost:8000/redirect2?to=http://localhost:8000/upload', { method: 'post' }, async (response) => {
            
            let hasError = false;//
            let error;
            console.log('response from upload file')
            try {
                expect(response.numRedirects).toBe(2)
                await verifyFile(path.join(__dirname, 'temp', 'uploadedFile.jpg'), 780831)//
            } catch (e) {
                error=e
                hasError = true
            }finally{//
                done(hasError && new Error('Upload file failed'+error))
            }
        });

        const readable = createReadStream('./tests/dummy.jpg');
        readable.on('data', (chunk) => {
            request.write(chunk, (arg) => {//
                // console.log('callback of write', arg)//
            })
        })

        readable.on('end', () => {
            
            request.end();
            console.log('called end from client')
        })//
    })

    it('Should upload a file with three redirects, using iterator',async () => {//
        let resolve
        const prom = new Promise((res)=>resolve=res)
        var request = http.request('http://localhost:8000/redirect3?to=http://localhost:8000/upload', { method: 'post' }, async (response) => {
            resolve()            
        });

        const readable = createReadStream('./tests/dummy.jpg');
        for await(let chunk  of readable){
            request.write(chunk)
        }

        request.end()
        await prom;
        // expect(response.numRedirects).toBe(3)//
        await verifyFile(path.join(__dirname, 'temp', 'uploadedFile.jpg'), 780831)//
    })

    
})

