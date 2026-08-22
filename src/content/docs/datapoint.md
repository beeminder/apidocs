---
title: Datapoint Resource
---

A Datapoint consists of a timestamp and a value, an optional comment, and meta information.
A Datapoint belongs to a [Goal](/goal/), which has many Datapoints.

### Attributes

* `id` (string): A unique ID, used to identify a datapoint when deleting or editing it.
* `timestamp` (number): The [unix time](http://en.wikipedia.org/wiki/Unix_time ) (in seconds) of the datapoint.
* `daystamp` (string): The date of the datapoint (e.g., "20150831"). Sometimes timestamps are surprising due to goal deadlines, so if you're looking at Beeminder data, you're probably interested in the daystamp.
* `value` (number): The value, e.g., how much you weighed on the day indicated by the timestamp.
* `comment` (string): An optional comment about the datapoint.
* `updated_at` (number): The unix time that this datapoint was entered or last updated.
* `requestid` (string): If a datapoint was created via the API and this parameter was included, it will be echoed back.
* `origin` (string): A short code related to where the datapoint came from. E.g. if it was added from the website, it would be "web"; if it was added by an autodata integration, e.g. Duolingo, it would be "duolingo".
* `creator` (string): Similar to origin, but for users. Especially in context of group goals, should resolve to the member who added the data, assuming the member is still around etc. When there isn't a logical `creator` this will be null.
* `is_dummy` (boolean): Not a logical datapoint, e.g. a "#DERAIL" datapoint, or Pessimistic Presumptive datapoint, added by Beeminder.
* `is_initial` (boolean): The initial datapoint added at goal creation time. Depending on the goal type this can be semantically slightly different from a "dummy" datapoint, e.g. in the case of an Odometer goal, it's a meaningful datapoint because it sets your starting count, which is "actual" data, and meaningful to the goal, but in the case of a Do More goal, it's more of a placeholder. 
* `created_at` (time): This is the timestamp at which the datapoint was created, which may differ from the datapoint's `timestamp` because of Reasons.



## Get all the datapoints {#dataall}

### HTTP Request

`GET /users/`*u*`/goals/`*g*`/datapoints.json`

Get the list of datapoints for user *u*'s goal *g* &mdash; beeminder.com/*u*/*g*.

```shell title="Examples"
  curl https://www.beeminder.com/api/v1/users/alice/goals/weight/datapoints.json?auth_token=abc123
```

### Parameters

* \[`sort`\] (string): Which attribute to sort on, descending. Defaults to `id` if none given.
* \[`count`\] (integer): Limit results to count number of datapoints. Must be non-negative. Defaults to all datapoints if parameter is missing. Ignored when `page` is specified.
* \[`page`\] (integer): Used to paginate results, 1-indexed, meaning page 1 is the first page.
* \[`per`\] (integer): Number of results per page. Default 25. Ignored without `page` parameter. Must be non-negative.

### Returns

The list of [Datapoint](/datapoint/) objects.

```json
  [{"id":"1", "timestamp":1234567890, "daystamp":"20090213", "value":7, "comment":"", "updated_at":123, "requestid":"a"},
   {"id":"2", "timestamp":1234567891, "daystamp":"20090214", "value":8, "comment":"", "updated_at":123, "requestid":"b"}]
```
## Create a datapoint {#postdata}

### HTTP Request

`POST /users/`*u*`/goals/`*g*`/datapoints.json`

Add a new datapoint to user *u*'s goal *g* &mdash; beeminder.com/*u*/*g*.

```shell title="Examples"
  curl -X POST https://www.beeminder.com/api/v1/users/alice/goals/weight/datapoints.json \
    -d auth_token=abc123 \
    -d timestamp=1325523600 \
    -d value=130.1 \
    -d comment=sweat+a+lot+today
```

### Parameters

* `value` (number)  
* \[`timestamp`\] (number). Defaults to "now" if none is passed in, or the existing timestamp if the datapoint is being updated rather than created (see `requestid` below).
* \[`daystamp`\] (string). Optionally you can include daystamp instead of the timestamp. If both are included, timestamp takes precedence.
* \[`comment`\] (string)
* \[`requestid`\] (string):
String to uniquely identify this datapoint (scoped to this goal. The same `requestid` can be used for different goals without being considered a duplicate).
Clients can use this to verify that Beeminder received a datapoint (important for clients with spotty connectivity).
Using requestids also means clients can safely resend datapoints without accidentally creating duplicates.
If `requestid` is included and the datapoint is identical to the existing datapoint with that requestid then the datapoint will be ignored (the API will return "duplicate datapoint").
If `requestid` is included and the datapoint differs from the existing one with the same requestid then the datapoint will be updated.
If no datapoint with the requestid exists then the datapoint is simply created.
In other words, this is an upsert endpoint and requestid is an idempotency key.

### Returns

The updated [Datapoint](/datapoint/) object.

```json
  { "timestamp": 1325523600,
    "daystamp": "20120102",
    "value": 130.1,         
    "comment": "sweat a lot today",   
    "id": "4f9dd9fd86f22478d3000008",
    "requestid":"abcd182475925" }
```
## Create multiple datapoints {#postdatas}

### HTTP Request

`POST /users/`*u*`/goals/`*g*`/datapoints/create_all.json`

Create multiple new datapoints for beeminder.com/*u*/*g*.

```shell title="Examples"
  curl -X POST https://www.beeminder.com/api/v1/users/alice/goals/weight/datapoints/create_all.json \
    -d auth_token=abc123 \
    -d datapoints=[{"timestamp":1343577600,"value":220.6,"comment":"blah+blah", "requestid":"abcd182475929"}, {"timestamp":1343491200,"value":220.7, "requestid":"abcd182475930"}]
```

### Parameters

* `datapoints` (array of Datapoints):
Each Datapoint should be a JSON object, and must include at minimum a `value`.
Other parameters are the same as for the single-create method above.  

### Returns

A list of successfully created [Datapoints](/datapoint/). 
Or, in the case of any errors, you will receive an object with two lists, `successes`, and `errors`.

```json
  [ { "id": "5016fa9adad11576ad00000f",
      "timestamp": 1343577600,
      "daystamp": "20120729",
      "value": 220.6,
      "comment": "blah blah",
      "updated_at": 1343577600,
      "requestid":"abcd182475923"},
    { "id": "5016fa9bdad11576ad000010",
      "timestamp": 1343491200,
      "daystamp": "20120728",
      "value": 220.7,
      "comment": "",
      "updated_at": 1343491200,
      "requestid":"abcd182475923" } ]
```
## Update a datapoint {#putdata}

### HTTP Request

`PUT /users/`*u*`/goals/`*g*`/datapoints/`*id*`.json`

Update the datapoint with ID *id* for user *u*'s goal *g* (beeminder.com/*u*/*g*).

```shell title="Examples"
  curl -X PUT https://www.beeminder.com/api/v1/users/alice/goals/weight/datapoints/5016fa9adad11576ad00000f.json \
    -d auth_token=abc123 \
    -d comment=a+real+comment
```

### Parameters

* \[`timestamp`\] (number)
* \[`value`\] (number)
* \[`comment`\] (string)

### Returns

The updated [Datapoint](/datapoint/) object.

```json
  { "id": "5016fa9adad11576ad00000f",
    "value": 220.6,
    "comment": "a real comment",
    "timestamp": 1343577600,
    "daystamp": "20120729",
    "updated_at": 1343577609 }
```
## Delete a datapoint {#deletedata}

### HTTP Request

`DELETE /users/`*u*`/goals/`*g*`/datapoints/`*id*`.json`

Delete the datapoint with ID *id* for user *u*'s goal *g* (beeminder.com/*u*/*g*).

```shell title="Examples"
  curl -X DELETE https://www.beeminder.com/api/v1/users/alice/goals/weight/datapoints/5016fa9adad11576ad00000f.json?auth_token=abc123
```

### Parameters

None.

### Returns

The deleted [Datapoint](/datapoint/) object.



[Back to top](#)

```json
  { "id": "5016fa9adad11576ad00000f",
    "value": 220.6,
    "comment": "a real comment",
    "timestamp": 1343577600,
    "daystamp": "20120729",
    "updated_at": 1343577609 }
```