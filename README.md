Please don't forget to add your tokens inside the `Secrets` part in the sidebar

The Secret Environment Variables should contains the following items:

| key             | value                           |
|----             |-------                          |
|NODE_ENV         |production                       |
|PAGE_ACCESS_TOKEN| page access token from [facebook](https://developers.facebook.com/apps/) |
|VERIFY_TOKEN     | your generated random string    |
|APP_SECRET       | app secret from [facebook](https://developers.facebook.com/apps/)        |
|WIT_TOKEN        | WIT token from [wit.ai](https://wit.ai)           |


# How to register Hook?
In the [facebook developer page](https://developers.facebook.com/apps/) -> select `your app` in `messenger` product -> select `parameter` -> you can find  `register hook` part. Enter the url of your bot and verify token.


# How to find your page id?
In the [facebook developer page](https://developers.facebook.com/apps/) -> select `your app` in `messenger` product -> select `parameter` -> you can find your `page id`. just copy the page id and replace it 

