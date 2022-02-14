'use strict';
const matcher = require('./matcher');
const timeservice = require('./time-service')


async function handler(fb, msg) {
  await fb.action(msg.sender, 'typing_on');

  matcher(msg.content, async data => {
    try {
      switch (data.intent) {
        case 'Hello':
          fb.txt(msg.sender, "Hey ! I am your Movie ChatBot, you can ask me questions about movies such as:\ntell me about <movie_name> \nwhen was <movie_name> released?\nwho directed <movie_name>?");
          break;


        case 'Exit':
          await fb.txt(msg.sender, "Have a great day!");
          break;


        case 'Time':
          await fb.txt(msg.sender, `Let me check... it takes time`);
          await fb.action(msg.sender, 'typing_on');
          let city = data.entities.city;
          timeservice.getTime(city)
            .then(async response => {
              await fb.txt(msg.sender, `${city}'s time is ${response}`);
            })
            .catch(async error => {
              console.error(error);
              await fb.txt(msg.sender, "There seems to be a problem connecting to the time service.");
            });
          break;


        case 'Help':
          await fb.txt(msg.sender, `Ask me: what is the time of Paris?`);
          break;


        default:
          await fb.txt(msg.sender, "I don't know what you mean :(");
          await fb.action(msg.sender, 'typing_on');
          timeservice.echotest(msg.content)
            .then(async response => {
              await fb.txt(msg.sender, `i know you said ${response}`);
            })
            .catch(async error => {
              console.error(error);
              await fb.txt(msg.sender, "There seems to be a problem connecting to the time service.");
            });
      }
    } catch (e) {
      console.error("Error occurred", e);
      await fb.txt(msg.sender, "An internal error occurred.");
    }
  });
}

module.exports = handler;