'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    FB: {
      pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
      verifyToken: process.env.VERIFY_TOKEN,
      appSecret: process.env.APP_SECRET,
    },
    witToken: process.env.WIT_TOKEN,
    TMDB : process.env.TMDB
  }
} else {
  console.error(`Error! Environment Variables are not set.
   Please add them from secret sidebar in replit`)
  process.exit(1)
}