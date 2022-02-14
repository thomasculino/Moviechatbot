'use strict';

const express = require('express');
const server = express();
const bodyparser = require('body-parser');
server.use(bodyparser.json())


const config = require('./config');
console.log(config);
const FBeamer = require('./fbeamer');
const fb = new FBeamer(config.FB);
const witai = require('./fbeamer/nlp_helper.js')
const tmdb = require('./tmdb');

// Default page when opening https://your-repository.repl.co/
server.get('/', (request, response) => response.send(`
<h1>MovieChatbot - DIA3</h1>
<h2>Members</h2>
<ul>
  <li>Thomas CULINO</li>
  <li>Zachary CHENOT</li>
</ul>
<a href='https://m.me/103378302251993'>click here to chat with my bot</a> (open it on a new tab)
`));



// Registering WebHook url https://your-repository.repl.co/fb
server.get('/fb', (request, response) => fb.registerHook(request, response));


//define your bot
const timezonebot = require('./timezone-app');

// Your server should handel post request from facebook. it should have a same path as your webhook path
server.post('/fb', (request, response, next) => {
  fb.incoming(request, response, async msg => {
    if (Object.keys(msg.nlp.entities).length != 0) {
      var movieInfo = await tmdb(msg.nlp, 'intent');
      if (Object.keys(msg.nlp.entities).length == 1) {
        if (msg.nlp.intents[0].name == 'releaseYear') {
          await fb.txt(msg.sender, `${movieInfo.results[0].title} was released in ${movieInfo.results[0].release_date}.`);
        }
        else if (msg.nlp.intents[0].name == 'movieinfo') {
          await fb.txt(msg.sender, `${movieInfo.results[0].title} was released in ${movieInfo.results[0].release_date}. Here is a little overview: ${movieInfo.results[0].overview}`);
          await fb.img(msg.sender, `https://image.tmdb.org/t/p/original${movieInfo.results[0].poster_path}`);
        }
        else if (movieInfo != '[object Object]') {
          await fb.txt(msg.sender, `This film has been directed by ${movieInfo}.`);
        }
      }
      else {
        if (msg.nlp.intents[0].name == 'movieinfo') {
          if (msg.nlp.entities['movie:releaseYear'] != []) {
            await fb.txt(msg.sender, `${movieInfo.results[0].title} was released in ${movieInfo.results[0].release_date}. Here is a little overview: ${movieInfo.results[0].overview}`);
            await fb.img(msg.sender, `https://image.tmdb.org/t/p/original${movieInfo.results[0].poster_path}`);
          }
        }
      }
    }
    else {
      timezonebot(fb, msg);
    }
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`FBeamer Bot Service running on Port ${PORT}`));