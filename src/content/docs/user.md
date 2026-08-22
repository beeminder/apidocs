---
title: User Resource
---

A User object ("object" in the
[JSON](http://json.org "JavaScript Objection Notation aka how data is passed around on the internet")
sense) includes information about a user, like their list of goals.

### Attributes

* `username` (string)
* `timezone` (string)
* `updated_at` (number):
[Unix timestamp](http://en.wikipedia.org/wiki/Unix_time "Number of seconds since 1970-01-01 at midnight GMT")
(in seconds) of the last update to this user or any of their goals or datapoints.
* `goals` (array):
A list of slugs for each of the user's goals, or an array of goal hashes (objects) if `diff_since` or `associations` is sent.
* `deadbeat` (boolean):
True if the user's payment info is out of date, or an attempted payment has failed.
* `urgency_load` (number):
The idea of Urgency Load is to construct a single number that captures how edge-skatey you are across all your goals. A lower number means fewer urgently due goals. A score of 0 means that you have >= 7 days of buffer on all of your active goals.
* `deleted_goals` (array):
An array of hashes, each with one key/value pair for the id of the deleted goal.
Only returned if `diff_since` is sent.


## Get information about a user {#getuser}

```shell title="Examples"
  curl https://www.beeminder.com/api/v1/users/alice.json?auth_token=abc123

  { "username": "alice",
    "timezone": "America/Los_Angeles",
    "updated_at": 1343449880,                       
    "goals": ["gmailzero", "weight"] }
```

```ruby
  require 'beeminder'

  bee = Beeminder::User.new "yourtoken"
  bee.info
```

```shell
  curl https://www.beeminder.com/api/v1/users/alice.json?diff_since=1352561989&auth_token=abc123
```

```json
  { "username": "alice",
    "timezone": "America/Los_Angeles",
    "updated_at": 1343449880,                       
    "goals": [ {"slug": "weight", ...,
               "datapoints": [{"timestamp": 1325523600,    
                    "value": 70.45,            
                    "comment": "blah blah",     
                    "id": "4f9dd9fd86f22478d3"},
                   {"timestamp": 1325610000,
                    "value": 70.85,
                    "comment": "blah blah",
                    "id": "5f9d79fd86f33468d4"}],
               "title": "Weight Loss", ...},
               { another goal }, ... ],
    "deleted_goals": [{ "id": "519279fd86f33468ne"}, ... ] }
```

### HTTP Request

`GET /users/`*u*`.json`

Retrieves information and a list of goalnames for the user with username *u*.

Since appending an `access_token` to the request uniquely identifies a user, you can alternatively make the request to /users/me.json (without the username).

### Parameters


* \[`associations`\] (boolean): Convenience method to fetch all information about a user. Please use sparingly and see also the `diff_since` parameter.
Default: false  
Send `true` if you want to receive all of the user's goal and datapoints as attributes of the user object.

* \[`diff_since`\] (number): Unix timestamp in seconds.
Default: null, which will return all goals and datapoints  
Send a Unix timestamp to receive a filtered list of the user's goals and datapoints.
Only goals and datapoints that have been created or updated since the timestamp will be returned.
Sending `diff_since` implies that you want the user's associations, so you don't need to send both.

* \[`skinny`\] (boolean): Convenience method to only get a subset of goal attributes and the most recent datapoint for the goal.
Default: false, which will return all goal attributes and all datapoints created or updated since `diff_since`.  
`skinny` must be sent along with `diff_since`.
If `diff_since` is not present, `skinny` is ignored.
Some goal attributes, as well as fetching all datapoints, can take some additional time to compute on the server side, so you can send `skinny` if you only need the latest datapoint and the following subset of attributes:
`slug,
title,
description,
goalval,
rate,
goaldate,
svg_url,
graph_url,
thumb_url,
goal_type,
autodata,
losedate,
urgencykey,
deadline,
leadtime,
alertstart,
id,
queued,
updated_at,
burner,
yaw,
lane,
delta,
runits,
limsum,
frozen,
lost,
won,
contract,
delta_text,
safebump,
gunits,
todayta,
timey
hhmmformat
`
Instead of a `datapoints` attribute, sending `skinny` will replace that attribute with a `last_datapoint` attribute. Its value is a Datapoint hash.

* \[`emaciated`\] (boolean):
If included the goal attributes called `road`, `roadall`, and `fullroad` will be stripped from any goal objects returned with the user. 
Default: false.

* \[`datapoints_count`\] (number): number of datapoints.
Default: null, which will return all goals and datapoints.
Send a number `n` to only recieve the `n` most recently added datapoints, sorted by `updated_at`.
Note that the most recently added datapoint could have been a datapoint whose timestamp is well in the past and therefore before other datapoints in that respect.
For example, my datapoints might look like:  
<br>
12 1  
14 1  
15 1  
16 1  
<br>
If I go back and realize that I forgot to enter data on the 13th, the datapoint for the 13th will be sorted ahead of the one on the 16th:  
<br>
12 1  
14 1  
15 1  
16 1  
13 1  

### Returns

A [User](/user/) object.


Use the `updated_at` field to be a good Beeminder API citizen and avoid unnecessary requests for goals and datapoints.
Any updates to a user, their goals, or any datapoints on any of their goals will cause this field to be updated to the current unix timestamp.
If you store the returned value and, on your next call to this endpoint, the value is the same, there's no need to make requests to other endpoints.

Checking the timestamp is an order of magnitude faster than retrieving all the data, so it's definitely wise to use this approach.


## Authenticate and redirect the user {#redirectuser}

```shell title="Examples"
  curl https://www.beeminder.com/api/v1/users/alice.json?auth_token=abc123&redirect_to_url=https%3A%2F%2Fwww.beeminder.com%2Fpledges
```

### HTTP Request

`GET /users/`*u*`.json`

Attempts to authenticate the user and if successful redirects to the given URL.
Allows third-party apps to send the user to a specific part of the website without getting intercepted by a login screen, for doing things not available through the API.

### Parameters

* \[`redirect_to_url`\] (string): Url to redirect the user to.



[Back to top](#)



