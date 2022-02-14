'use strict'
const crypto = require('crypto');
const axios = require('axios');

const request = require('request');
const nlp = require('./nlp_helper');
const apiVersion = 'v2.6';

class FBeamer {
  constructor({ pageAccessToken, verifyToken, appSecret }) {

    if (pageAccessToken && verifyToken && appSecret) {
      this.pageAccessToken = pageAccessToken;
      this.verifyToken = verifyToken;
      this.appSecret = appSecret;
    } else {
      console.error(`Error! One or more tokens/credentials are missing!
Please verify Environment Variables from secret sidebar in replit`)
      process.exit(1)
    }
    // console.log(this.appSecret )

  }

  registerHook(request, response) {
    const params = request.query;
    const mode = params['hub.mode'];
    const token = params['hub.verify_token'];
    const challenge = params['hub.challenge'];

    if (mode && mode === 'subscribe' && token === this.verifyToken) {
      console.log("Webhook registered!");
      return response.send(challenge);
    } else {
      console.log("Could not register webhook!");
      return response.sendStatus(400);
    }

  }

  incoming(request, response, callback) {
    response.sendStatus(200);
    // Extract the body of the POST request
    if (request.body.object === 'page' && request.body.entry) {
      const data = request.body;
      data.entry.forEach(pageObj => {
        pageObj.messaging.forEach(async messageObj => {
          if (messageObj.postback) {
            //handle postbacks
            console.log('postback message received', messageObj)
          } else {
            let newMsg=await this.messageHandler(messageObj);
            callback(newMsg);
          }
        })

      })
    }
  }

  async messageHandler(obj) {
    let sender = obj.sender.id;
    let message = obj.message;
    
    if (message.text) {
      let obj = {
        sender,
        type: 'text',
        content: message.text
      };
      try{
         obj.nlp=await nlp(message.text)
       }catch(e){
         console.log('error in nlp',e)
       }
      return obj;
    }
  }

  sendMessage(payload) {
    return new Promise((resolve, reject) => {
      request({
        url: `https://graph.facebook.com/${apiVersion}/me/messages`,
        qs: {
          access_token: this.pageAccessToken
        },
        method: "POST",
        json: payload
      }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          resolve({
            mid: body.message_id
          });
        } else {
          console.error('Error in send message', body)
          reject(body);
        }
      })
    })
  }
  txt(id, text, messaging_type = 'RESPONSE') {
    let obj = {
      messaging_type,
      recipient: {
        id
      },
      message: {
        text
      }
    };
    return this.sendMessage(obj);
  }
  img(id, url, messaging_type = 'RESPONSE') {
    let obj = {
      messaging_type,
      recipient: {
        id
      },
      message: {
        attachment: {
          type: 'image',
          payload: {
            url
          }
        },
      }
    };
    return this.sendMessage(obj);
  }
  action(id, type = 'typing_on', messaging_type = 'RESPONSE') {
    let obj = {
      messaging_type,
      recipient: {
        id
      },
      "sender_action": type

    };
    return this.sendMessage(obj);
  }
}

module.exports = FBeamer;
