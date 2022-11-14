import { IncomingMessage } from "http";
import { CustomIncomingMessage } from "../src/types";
import { http } from '../src/index'
import { RequestOptions } from "https";
import { readFile } from "fs";

export function incomingMessageToJson(incomingMessage: IncomingMessage) {
  return new Promise((res, rej) => {
    var data = '';
    incomingMessage.on('data', function (chunk) {
      data += chunk;
    });
    incomingMessage.on('end', function () {
      data = JSON.parse(data);
      res(data)
    })
    incomingMessage.on('error', rej)
  })
}


export function promisifyRequest(executionFunction: Function, url: string | URL, config: RequestOptions = {}) {
  return new Promise<CustomIncomingMessage>((res, rej) => {
    executionFunction(url, config, async (response: CustomIncomingMessage) => {
      res(response)
    }).end()
  })
}



export function verifyFile(path, size) {
  return new Promise<void>((resolve, reject) => {
    readFile(path, (err, data) => {
      if (err)
        return reject(err);
      if (!size || data.length == size) {
        resolve();
      } else {
        //@ts-ignore
        reject(new Error(data.length));
      }
    });

  })

}
