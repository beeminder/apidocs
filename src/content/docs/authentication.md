---
title: Authentication
---

All API endpoints require authentication.
There are two ways to authenticate.
Both ultimately give you a token which you must then include with every API request.

<aside class="notice">
Note: A common mistake is to pass the personal auth token but call the parameter
access_token, or vice-versa. 
The parameter name for your personal auth token should be `auth_token`.
</aside>

## Personal authentication token

For example, if your username is "alice" and your token is "abc123" you can 
query information about your "weight" goal like so:

```shell
  curl https://www.beeminder.com/api/v1/users/alice/goals/weight.json?auth_token=abc123
```


This authentication pattern is for making API calls just to your own Beeminder account.


After you
[log in to Beeminder](https://www.beeminder.com/users/sign_in ),
visit
<a href="https://www.beeminder.com/api/v1/auth_token.json">`https://www.beeminder.com/api/v1/auth_token.json`</a>
to get your personal auth token.
Append it to API requests you make as an additional GET or POST parameter.


## Client OAuth


This authentication pattern is for clients (applications) accessing the Beeminder API on a user's behalf.
Beeminder implements the
[OAuth](http://oauth.net/ "Specifically Oauth2")
provider protocol to allow access reasonably securely.

There are four steps to build a client:

### 1. Register your app {#registerapp}

Register your app at
[beeminder.com/apps/new](https://www.beeminder.com/apps/new ).
Application name and redirect URL are required.
The redirect URL is where the user is sent after authorizing your app.

### 2. Send your users to the Beeminder authorization URL {#authurl}

```plaintext title="Example authorization URL:"
  https://www.beeminder.com/apps/authorize?\
   client_id=xyz456&redirect_uri=http&#58;//foo.com/auth_callback\
   &response_type=token
```

The base URL is the same for all apps:
`https://www.beeminder.com/apps/authorize`.
You'll need to add the following parameters:

* `client_id`: Your application's client ID.
You can see a list of your registered apps and retrieve their `client_id`s at
[beeminder.com/apps](https://www.beeminder.com/apps "List of apps you've registered, not to be confused with the list of apps you've authorized to access your Beeminder account, or the list of services you've authorized Beeminder to access").
* `redirect_uri`: This is where Beeminder will send the user after they have authorized your app.
This *must match* the redirect URL you supplied when you registered your app above.
Make sure to
[url-encode](http://en.wikipedia.org/wiki/Percent-encoding "Where you replace characters that have special meaning in URLs with a percent sign and their ascii number (or plus signs for spaces)")
this if it contains any special characters like question marks or ampersands.
* `response_type`: Currently this should just always be set to the value "`token`".


### 3. Receive and store user's access token {#storetoken}

For example, if the user "alice" has access token "abc123" then the following string would be appended to the URL when the user is redirected there:

```
  ?access_token=abc123&username=alice
```

After the user authorizes your application they'll be redirected to the `redirect_uri` that you specified, with two additional parameters,
`access_token` and
`username`, in the
[query string](http://en.wikipedia.org/wiki/Query_string "The query string is the parameters that come after the question mark in a URL").


You should set up your server to handle this GET request and have it remember each user's access token.
The access token uniquely identifies the user's authorization for your app.

The username is provided here for convenenience.
You can retrieve the username for a given access token at any time by sending a GET request for `/api/v1/me.json` with the token appended as a parameter.

### 4. Include access token in your request {#tokenparam}

```shell
  curl https://www.beeminder.com/api/v1/users/me.json?access_token=abc123

  or

  curl -H "Authorization: Bearer abc123" https://www.beeminder.com/api/v1/users/me.json
```

Append the access token as a parameter on any API requests you make on behalf of that user, or include it in the request headers using the `Authorization: Bearer` scheme.
For example, your first request will probably be to get information about the
[User](/user/)
who just authorized your app.


You can literally use "me" in place of the username for any endpoint and it will be macro-expanded to the username of the authorized user.

### 5. Optional: De-authorization callback {#deauth}

If you provide a Post De-Authorization Callback URL when you register your client, we will make a POST to your endpoint when a user removes your app. The POST will include a single parameter, `access_token` in the body of the request. The value of this parameter will be the token that was de-authorized.

### 6. Optional: Autofetch callback {#autofetch}

The autofetch callback URL is also optional.
We will POST to this URL if provided, including the parameters `username` and `slug` in the body of the request when the user wants new data from you.
E.g., when the user pushes the manual refresh button, or prior to sending alerts to the user, and before derailing the goal at the end of a beemergency day.

[Back to top](#)

