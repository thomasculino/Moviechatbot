const axios = require ("axios");

const extractEntity = (nlp, entity) => {
  if (nlp.intents[0].confidence<0.8){
    return console.log(`confidence is not sufficient ! received: ${nlp.intents[0].confidence} expected > 0.8`);
  }
  else {
    return nlp.entities[`movie:${entity}`][0].value;
  }
}

const extractIntent = (nlp) => {
  intent = nlp.intents[0].name;
  return intent;
}

const getMovieData = (movie, releaseYear) => {
  const request=`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB}&query=${movie}&primary_release_year=${releaseYear}`;
  return new Promise((resolve, reject) => 
  {
    axios.get(request).then(res => {
      resolve(res.data)
      }).catch(error =>{
        console.log("getMovieData error",error.response.data)
        reject(error.response.data);
      })
  });
}

const getDirector = (movieID) => {
  return new Promise((resolve, reject) => {
    const request = require('request');

    request(`https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=${process.env.TMDB}`, {json: true}, (err, res, body) => {
        if (err) {
          reject(body.url, body);
        } else {
          resolve(body);
        }
      });
  })
}

module.exports = nlpData => {
  return new Promise (async function(resolve , reject) {
    let intent = extractIntent(nlpData, 'intent');
    if (intent){
      let movie = extractEntity(nlpData, 'movie');
      let releaseYear = 'null';
      if('movie:releaseYear' in nlpData.entities) {
        releaseYear = extractEntity(nlpData, 'releaseYear');
      }
      
      try {
        let movieData = await getMovieData(movie, releaseYear);
        if (nlpData.intents[0].name == 'director') {
          let director = await getDirector(movieData.results[0].id);
          var directorName = director.crew.filter(({job}) => job === 'Director')[0];
          resolve(directorName.name);
        }
        else {
          resolve(movieData);
        }
      } 
      catch ( error ) {reject ( error ) ;}
    } 
    else {
      resolve ({
        txt : " I’m not sure I understand you ! "
      });
    }
  });
}