---
title: Goal Resource
---

A Goal object includes everything about a specific goal for a specific user, including the target value and date, the steepness of the bright red line, the graph image, and various settings for the goal. 

### Attributes

* `slug` (string): The final part of the URL of the goal, used as an identifier. E.g., if user "alice" has a goal at beeminder.com/alice/weight then the goal's slug is "weight".
* `updated_at` (number): [Unix timestamp](http://en.wikipedia.org/wiki/Unix_time ) of the last time this goal was updated.
* `title` (string): The title that the user specified for the goal. E.g., "Weight Loss".
* `fineprint` (string): The user-provided description of what exactly they are committing to.
* `yaxis` (string): The label for the y-axis of the graph. E.g., "Cumulative total hours".
* `goaldate` (number): Unix timestamp (in seconds) of the goal date. NOTE: this may be null; [see below](#one-of-three).
* `goalval` (number): Goal value &mdash; the number the bright red line will eventually reach. E.g., 70 kilograms. NOTE: this may be null; [see below](#one-of-three).
* `rate` (number): The slope of the (final section of the) bright red line. You must also consider `runits` to fully specify the rate. NOTE: this may be null; [see below](#one-of-three). 
* `runits` (string): Rate units. One of `y`, `m`, `w`, `d`, `h` indicating that the rate of the bright red line is yearly, monthly, weekly, daily, or hourly.
* `svg_url` (string): URL for the goal's graph svg. E.g., "http://static.beeminder.com/alice/weight.svg".
* `graph_url` (string): URL for the goal's graph image. E.g., "http://static.beeminder.com/alice/weight.png".
* `thumb_url` (string): URL for the goal's graph thumbnail image. E.g., "http://static.beeminder.com/alice/weight-thumb.png".
* `autodata` (string): The name of automatic data source, if this goal has one. Will be null for manual goals.
* `goal_type` (string): One of the following symbols (detailed info [below](#goal-types)):
 - `hustler`: Do More
 - `biker`: Odometer
 - `fatloser`: Weight loss
 - `gainer`: Gain Weight
 - `inboxer`: Inbox Fewer
 - `drinker`: Do Less
 - `custom`: Full access to the underlying goal parameters
* `losedate` (number): Unix timestamp of derailment. When you'll cross the bright red line if nothing is reported.
* `urgencykey` (string): Sort by this key to put the goals in order of decreasing urgency. (Case-sensitive ascii or unicode sorting is assumed). This is the order the goals list comes in. Detailed info [on the blog](https://blog.beeminder.com/urgency).
* `queued` (boolean): Whether the graph is currently being updated to reflect new data.
* `secret` (boolean): Whether you have to be logged in as owner of the goal to view it. Default: `false`.
* `datapublic` (boolean): Whether you have to be logged in as the owner of the goal to view the datapoints. Default: `false`.
* `datapoints` (array of [Datapoints](/datapoint/)): The datapoints for this goal.
* `numpts` (number): Number of datapoints.
* `pledge` (number): Amount pledged (USD) on the goal.
* `initday` (number): Unix timestamp (in seconds) of the start of the bright red line.
* `initval` (number): The y-value of the start of the bright red line.
* `curday` (number): Unix timestamp (in seconds) of the end of the bright red line, i.e., the most recent (inferred) datapoint.
* `curval` (number): The value of the most recent datapoint.
* `currate` (number): The rate of the red line at time `curday`; if there's a rate change on that day, take the limit from the left.
* `lastday` (number): Unix timestamp (in seconds) of the last (explicitly entered) datapoint.
* `yaw` (number): Good side of the bright red line. I.e., the side of the line (+1/-1 = above/below) that makes you say "yay".
* `dir` (number): Direction the bright red line is sloping, usually the same as yaw.
* `lane` (number): Deprecated. See `losedate` and `safebuf`.
* `mathishard` (array of 3 numbers): The goaldate, goalval, and rate &mdash; all filled in. (The commitment dial specifies 2 out of 3 and you can check this if you want Beeminder to do the math for you on inferring the third one.) Note: this field may be null if the goal is in an error state such that the graph image can't be generated.
* `headsum` (string): Deprecated. Summary text blurb saying how much safety buffer you have.
* `limsum` (string): Summary of what you need to do to eke by, e.g., "+2 within 1 day".
* `kyoom` (boolean): Cumulative; plot values as the sum of all those entered so far, aka auto-summing.
* `odom` (boolean): Treat zeros as accidental odometer resets.
* `aggday` (string): How to aggregate points on the same day, eg, min/max/mean.
* `steppy` (boolean): Join dots with purple steppy-style line.
* `rosy` (boolean): Show the rose-colored dots and connecting line.
* `movingav` (boolean): Show moving average line superimposed on the data.
* `aura` (boolean): Show turquoise swath, aka blue-green aura.
* `frozen` (boolean): Whether the goal is currently frozen and therefore must be restarted before continuing to accept data.
* `won` (boolean): Whether the goal has been successfully completed.
* `lost` (boolean): Whether the goal is currently off track.
* `maxflux` (Integer): Max daily fluctuation for weight goals. Used as an absolute buffer amount after a derail. Also shown on the graph as a thick guiding line.
* `contract` (dictionary): Dictionary with two attributes. `amount` is the amount at risk on the contract, and `stepdown_at` is a Unix timestamp of when the contract is scheduled to revert to the next lowest pledge amount. `null` indicates that it is not scheduled to revert.
* `road` (array): Array of tuples that can be used to construct the Bright Red Line (formerly "Yellow Brick Road"). This field is also known as the graph matrix. Each tuple specifies 2 out of 3 of \[`time`, `goal`, `rate`\]. To construct `road`, start with a known starting point (time, value) and then each row of the graph matrix specifies 2 out of 3 of {t,v,r} which gives the segment ending at time t. You can walk forward filling in the missing 1-out-of-3 from the (time, value) in the previous row.
* `roadall` (array): Like `road` but with an additional initial row consisting of \[`initday`, `initval`, null\] and an additional final row consisting of \[`goaldate`, `goalval`, `rate`\].
* `fullroad` (array): Like `roadall` but with the nulls filled in.
* `rah` (number): Red line value (y-value of the bright red line) at the akrasia horizon (today plus one week).
* `delta` (number): Distance from the bright red line to today's datapoint (`curval`).
* `delta_text` (string): Deprecated.
* `safebuf` (number): The integer number of safe days. If it's a beemergency this will be zero.
* `colorkey` (string): One of {red, orange, blue, green, dkgreen, gray} indicating the amount of safety buffer (see below).
* `colorhex` (string): The RGB color corresponding to `colorkey`.
* `safebump` (number): The absolute y-axis number you need to reach to get one additional day of safety buffer.
* `autoratchet` (number): The goal's autoratchet setting. If it's not set or they don't have permission to autoratchet, its value will be nil. This represents the maximum number of days of safety buffer the goal is allowed to accrue, or in the case of a Do-Less goal, the max buffer in terms of the goal's units. Read-only. 
* `id` (string of hex digits): We prefer using user/slug as the goal identifier, however, since we began allowing users to change slugs, this id is useful!
* `callback_url` (string): Callback URL, as
[discussed in the forum](http://forum.beeminder.com/t/webhook-callback-documentation/313 "In short: you can add a callback to your own server whenever data is added on Beeminder").
WARNING: If different apps change this they'll step on each other's toes.
* `description` (string): Deprecated. User-supplied description of goal (listed in sidebar of graph page as "Goal Statement").
* `graphsum` (string): Deprecated. Text summary of the graph, not used in the web UI anymore.
* `lanewidth` (number): Deprecated. Now always zero.
* `deadline` (number): Seconds by which your deadline differs from midnight. Negative is before midnight, positive is after midnight.
Allowed range is -17*3600 to 6*3600 (7am to 6am).
* `leadtime` (number): Days before derailing we start sending you reminders. Zero means we start sending them on the beemergency day, when you will derail later that day.
* `alertstart` (number): Seconds after midnight that we start sending you reminders (on the day that you're scheduled to start getting them, see `leadtime` above).
* `plotall` (boolean): Whether to plot all the datapoints, or only the `aggday`'d one. So if false then only the official datapoint that's counted is plotted.
* `last_datapoint` ([Datapoint](/datapoint/)): The last datapoint entered for this goal.
* `integery` (boolean): Assume that the units must be integer values.  Used for things like `limsum`.
* `gunits` (string): Goal units, like "hours" or "pushups" or "pages".
* `timey` (boolean): Whether to show data in a "timey" way, with colons.  For example, this would make a 1.5 show up as 1:30. This replaces `hhmmformat`.
* `hhmmformat` (boolean): DEPRECATED. Will be removed in a future version. Use `timey` instead.
* `todayta` (boolean): Whether there are any datapoints for today
* `weekends_off` (boolean): If the goal has weekends automatically scheduled.
* `tmin` (string): Lower bound on x-axis; don't show data before this date; using yyyy-mm-dd date format. (In Graph Settings this is 'X-min')
* `tmax` (string): Upper bound on x-axis; don't show data after this date; using yyyy-mm-dd date format. (In Graph Settings this is 'X-max')
* `tags` (array): A list of the goal's tags.
* `archivedate` (number): Unix timestamp (in seconds) of the date at which the goal will be archived. Null if already archived or not scheduled for archive. Date may be in the past of archival is due or in-flight.

<em id="one-of-three">A note about rate, date, and val:</em> One of the three fields `goaldate`, `goalval`, and `rate` will return a null value.
This indicates that the value is calculated based on the other two fields, as selected by the user.

<em id="goal-types">A detailed note about goal types:</em> The goal types are shorthand for a collection of settings of more fundamental goal attributes.
Note that changing the goal type of an already-created goal has no effect on those fundamental goal attributes.
The following table lists what those attributes are.

parameter | `hustler` | `biker` | `fatloser` | `gainer` | `inboxer` | `drinker`
--------- | --------- | ------- | ---------- | -------- | --------- | ---------
`yaw` | 1 | 1 | -1 | 1 | -1 | -1
`dir` | 1 | 1 | -1 | 1 | -1 | 1
`kyoom`| true| false| false| false| false| true
`odom` | false |true |false |false |false| false
`edgy` | false |false |false |false |false |true
`aggday`| "sum" |"last" |"min" |"max" |"min" |"sum"
`steppy`| true |true |false |false |true |true
`rosy`| false |false| true| true| false| false
`movingav`| false |false |true |true |false |false
`aura`|false|false|true| true |false |false

There are four broad, theoretical categories &mdash; called the platonic goal types &mdash; that goals fall into, defined by `dir` and `yaw`:

`MOAR = dir +1 & yaw +1`: "go up, like work out more"<br>
`PHAT = dir -1 & yaw -1`: "go down, like weightloss or gmailzero"<br>
`WEEN = dir +1 & yaw -1`: "go up less, like quit smoking"<br>
`RASH = dir -1 & yaw +1`: "go down less, ie, rationing, <a href="http://beeminder.com/d/contacts" title="The Beeminder CEO with an early Beeminder graph to ration his supply of 'daily' contact lenses to last for 2 years, till 2013">for example</a>"

The `dir` parameter, for which direction the bright red line is expected to go, is mostly just for the above categorization, but is used specifically in the following ways:

1. Where to draw the watermarks (amount pledged and number of safe days)
2. How to phrase things like "bare min of +123 in 4 days" and the status line (also used in bot email subjects)
3. Which direction is the optimistic one for the rosy dots algorithm

<aside class="notice">
Clearing up confusion about WEEN and RASH goal types: Beeminder generally plots the cumulative total of your metric, such as total cigarettes smoked. So even a quit-smoking goal will slope up (dir&gt;0). Just that it will slope up less and less steeply as you wean yourself. When you actually quit, the slope will be zero. That's why "WEEN" goals are sloping up but good side is down. The opposite case &mdash; sloping down but good side's up &mdash; is called "RASH" and is rarely used. It's for beeminding a number that you want to go down slowly. Maybe cigarettes remaining in a carton that you want to be your last, or bottles of fresh water remaining post-apocalypse &mdash; someday this goal type will be useful!
</aside>

Note that `colorkey` and `colorhex` can be inferred from `safebuf` roughly according to the code in the sidebar.
There's also "gray" as a possible color in case of an error preventing us from generating the graph.

```javascript
colorkey = (safebuf < 1 ? "red"    :
            safebuf < 2 ? "orange" :
            safebuf < 3 ? "blue"   : 
            safebuf < 7 ? "green"  : 
                          "darkgreen")
```

```javascript
colorhex = (safebuf < 1 ? "#ff0000" : // Red for beemergencies
            safebuf < 2 ? "#ffa500" : // Orange for 1 safe day
            safebuf < 3 ? "#3f3fff" : // Blue for 2 safe days
            safebuf < 7 ? "#00aa00" : // Green for 3-6 safe days
                          "#228B22")  // Dark green Grayson dots, 7+ safe days
```

Finally, the way to tell if a goal has finished successfully is `now >= goaldate && goaldate < losedate`.
That is, you win if you hit the goal date before hitting `losedate`.
You don't have to actually reach the goal value &mdash; staying on the right side of the bright red line till the end suffices.




<h2 id="getgoal">Get information about a goal</h2>

```shell title="Examples"
  curl https://www.beeminder.com/api/v1/users/alice/goals/weight.json?auth_token=abc123&datapoints=true
```

```json
  { "slug": "weight",               
    "title": "Weight Loss",         
    "goaldate": 1358524800,         
    "goalval": 166,                 
    "rate": null,                   
    "svg_url":   "http://static.beeminder.com/alice+weight.svg",
    "graph_url": "http://static.beeminder.com/alice+weight.png",
    "thumb_url": "http://static.beeminder.com/alice+weight-thumb.png",    
    "goal_type": "fatloser",            
    "losedate": 1358524800,        
    "queued": false,                
    "updated_at": 1337479214,       
    "datapoints": [{"timestamp": 1325523600,    
                    "value": 70.45,            
                    "comment": "blah blah",     
                    "id": "4f9dd9fd86f22478d3"},
                   {"timestamp": 1325610000,
                    "value": 70.85,
                    "comment": "blah blah",
                    "id": "5f9d79fd86f33468d4"}]}

```

### HTTP Request

`GET /users/`*u*`/goals/`*g*`.json`

Gets goal details for user *u*'s goal *g* &mdash; beeminder.com/*u*/*g*.

### Parameters

* \[`datapoints`\] (boolean): Whether to send the goal's datapoints in the response. Default: `false`.
* \[`emaciated`\] (boolean):
If included the goal attributes called `road`, `roadall`, and `fullroad` will be stripped from the goal object. 
Default: false.

### Returns

A [Goal](/goal/) object, possibly without the datapoints attribute.


<h2 id="getgoals">Get all goals for a user</h2>


```shell title="Examples"
  curl https://www.beeminder.com/api/v1/users/alice/goals.json?auth_token=abc123
```

```json
  [ { "slug": "gmailzero",
      "title": "Inbox Zero",
      "goal_type": "inboxer",
      "svg_url": "http://static.beeminder.com/alice+gmailzero.svg",
      "graph_url": "http://static.beeminder.com/alice+gmailzero.png",
      "thumb_url": "http://static.beeminder.com/alice+weight-thumb.png",
      "losedate": 1347519599,
      "goaldate": 0,
      "goalval": 25.0,
      "rate": -0.5,
      "updated_at": 1345774578,
      "queued": false },
    { "slug": "fitbit-me",
      "title": "Never stop moving",
      "goal_type": "hustler",
      "svg_url": "http://static.beeminder.com/alice+fitbit-me.svg",
      "graph_url": "http://static.beeminder.com/alice+fitbit-me.png",
      "thumb_url": "http://static.beeminder.com/alice+fitbit-thumb.png",
      "losedate": 1346482799,
      "goaldate": 1349582400,
      "goalval": null,
      "rate": 8.0,
      "updated_at": 1345771188,
      "queued": false } ]
```

### HTTP Request

`GET /users/`*u*`/goals.json`

Get user *u*'s list of goals.

### Parameters

* \[`emaciated`\] (boolean):
If included the goal attributes called `road`, `roadall`, and `fullroad` will be stripped from the goal objects. 
Default: false.

### Returns

A list of [Goal](/goal/) objects for the user.
Goals are sorted in descending order of urgency, i.e., increasing order of time to derailment.
(There's actually a very tiny caveat to this involving the long-deprecated "sort threshold" parameter.
If you don't know what that is then you can ignore this parenthetical!)

<h2 id="getarchivedgoals">Get archived goals for a user</h2>


```shell title="Examples"
  curl https://www.beeminder.com/api/v1/users/alice/goals/archived.json?auth_token=abc123
```

```json
  [ { "slug": "gmailzero",
      "title": "Inbox Zero",
      "goal_type": "inboxer",
      "svg_url": "http://static.beeminder.com/alice+gmailzero.svg",
      "graph_url": "http://static.beeminder.com/alice+gmailzero.png",
      "thumb_url": "http://static.beeminder.com/alice+weight-thumb.png",
      "losedate": 1347519599,
      "goaldate": 0,
      "goalval": 25.0,
      "rate": -0.5,
      "updated_at": 1345774578,
      "queued": false },
    { "slug": "fitbit-me",
      "title": "Never stop moving",
      "goal_type": "hustler",
      "svg_url": "http://static.beeminder.com/alice+fitbit-me.svg",
      "graph_url": "http://static.beeminder.com/alice+fitbit-me.png",
      "thumb_url": "http://static.beeminder.com/alice+fitbit-thumb.png",
      "losedate": 1346482799,
      "goaldate": 1349582400,
      "goalval": null,
      "rate": 8.0,
      "updated_at": 1345771188,
      "queued": false } ]
```

### HTTP Request

`GET /users/`*u*`/goals/archived.json`

Get user *u*'s archived goals.

### Parameters

* \[`emaciated`\] (boolean):
If included the goal attributes called `road`, `roadall`, and `fullroad` will be stripped from the goal objects. 
Default: false.

### Returns

A list of [Goal](/goal/) objects representing the user's archived goals.

<h2 id="creategoal">Create a goal for a user</h2>


```shell title="Examples"
  curl -X POST https://www.beeminder.com/api/v1/users/alice/goals.json \
    -d auth_token=abc123 \
    -d slug=exercise \
    -d title=Work+Out+More \
    -d goal_type=hustler \
    -d goaldate=1400000000 \
    -d gunits=workouts \
    -d rate=5 \
    -d goalval=null
```

```json
  { "slug": "exercise",
    "title": "Work Out More",
    "goal_type": "hustler",
    "svg_url": "http://static.beeminder.com/alice+exercise.svg",
    "graph_url": "http://static.beeminder.com/alice+exercise.png",
    "thumb_url": "http://static.beeminder.com/alice+exercise-thumb.png",
    "losedate": 1447519599,
    "goaldate": 1400000000,
    "goalval": null,
    "rate": 5,
    "updated_at": 1345774578,
    "queued": false }
```

### HTTP Request

`POST /users/`*u*`/goals.json`

Create a new goal for user *u*.

### Parameters

* `slug` (string)
* `title` (string)
* `goal_type` (string)
* `gunits` (string)
* `goaldate` (number or null)
* `goalval` (number or null)
* `rate` (number or null)
* `initval` (number): Initial value for today's date. Default: 0.
* \[`secret`\] (boolean)
* \[`datapublic`\] (boolean)
* \[`datasource`\] (string): one of {"api", "ifttt", "zapier", or `clientname`\}. Default: none (i.e., "manual").
* \[`dryrun`\] (boolean). Pass this to test the endpoint without actually creating a goal. Defaults to false.
* \[`tags`\] (array). An optional list of tags to add to the new goal. Each tag must be an alphanumeric string.

[Exactly](http://youtu.be/QM9Bynjh2Lk?t=4m14s) two out of three of `goaldate`, `goalval`, and `rate` are required.

If you pass in your API client's registered name for the `datasource`, and your client has a registered `autofetch_callback_url`, we will POST to your callback when this goal wants new data, as outlined in [Client OAuth](/authentication/#autofetch).

### Returns

The newly created [Goal](/goal/) object.


<h2 id="putgoal">Update a goal for a user</h2>

```shell title="Examples"
  curl -X PUT https://www.beeminder.com/api/v1/users/alice/goals/exercise.json \
    -d auth_token=abc124 \
    -d title=Work+Out+Even+More \
    -d secret=true
```

```json
  { "slug": "exercise",
    "title": "Work Out Even More",
    "goal_type": "hustler",
    "svg_url": "http://static.beeminder.com/alice+exercise.svg",
    "graph_url": "http://static.beeminder.com/alice+exercise.png",
    "thumb_url": "http://static.beeminder.com/alice+exercise-thumb.png",
    "secret": true,
    "losedate": 1447519599,
    "goaldate": 1400000000,
    "goalval": null,
    "rate": 5,
    "updated_at": 1345774578,
    "queued": false }
```

### HTTP Request

`PUT /users/`*u*`/goals/`*g*`.json`

Update user *u*'s goal with slug *g*.
This is similar to the call to create a new goal, but the goal type (`goal_type`) cannot be changed.
To change any of {`goaldate`, `goalval`, `rate`} use `roadall`.

### Parameters

* \[`title`\] (string)
* \[`yaxis`\] (string)
* \[`tmin`\] (string) date format "yyyy-mm-dd"
* \[`tmax`\] (string) date format "yyyy-mm-dd"
* \[`secret`\] (boolean)
* \[`datapublic`\] (boolean)
* \[`roadall`\] (array of arrays like `[date::int, value::float, rate::float]` each with exactly one field null)
  * This must not make the goal easier between now and the akrasia horizon (unless you are an admin).
  * Use `roadall` returned by [goal GET](#getgoal), not `road` &mdash; the latter is missing the first and last rows (for the sake of backwards compatibility).
  * The first row must be `[date, value, null]` and gives the start of the bright red line, same as `initday` and `initval` in [goal GET](#getgoal).
  * The last row can be `[null, value, rate]` but no other row can be.
  * You can also send a `roadall` with dates specified as either a daystamp or date string, e.g., "20170727" or "2017-07-27".
  * This is a superset of `dial_road` (which changes just the last row of this `roadall`).
  * If you change rate units in the same call, the bright red line will be updated first, and rate units second, so make adjustments to the bright red line in terms of the original rate units, or make two separate calls, first updating rate units, then sending your adjusted `roadall`.
* \[`datasource`\] (string): one of {"api", "ifttt", "zapier", or `clientname`\}. Default: none.
  * If you pass in your API client's registered name for the `datasource`, and your client has a registered `autofetch_callback_url`, we will POST to your callback when this goal wants new data, as outlined in [Client OAuth](/authentication/#autofetch).
  * To unset the datasource, (i.e., return to manual entry) pass in the empty string `""`.
* \[`tags`\] (array). A list of tags for the goal. Each tag must be an alphanumeric string. NOTE: if you pass this parameter, it will replace the existing tags for the goal. If you pass an empty array, or an explicit nil value, it will remove all tags from the goal. 

### Returns

The updated [Goal](/goal/) object.


<h2 id="refresh">Force a fetch of autodata and graph refresh</h2>

```shell title="Example Request"
  curl https://www.beeminder.com/api/v1/users/alice/goals/weight/refresh_graph.json?auth_token=abc123
```

```json
  true
```

### HTTP Request

`GET /users/`*u*`/goals/`*g*`/refresh_graph.json`

Analagous to the refresh button on the goal page. Forces a refetch of autodata for goals with automatic data sources. Refreshes the graph image regardless.
***Please be extremely conservative with this endpoint!***

### Parameters

None.

### Returns

This is an asynchronous operation, so this endpoint simply returns **true** if the goal was queued and **false** if not.
It is up to you to watch for an updated graph image.


<h2 id="dialroad">[deprecated] Update a yellow brick road aka bright red line</h2>


```shell
  // Example request

  curl -X POST https://www.beeminder.com/api/v1/users/alice/goals/weight/dial_road.json \
    -d auth_token=abc124 \
    -d rate=-0.5 \
    -d goalval=166 \
    -d goaldate=null
```

```json
  // Example result

  { "slug": "weight",                       
    "title": "Weight Loss",                 
    "goal_type": "fatloser",                    
    "svg_url": "http://static.beeminder.com/alice+weight.svg",
    "graph_url": "http://static.beeminder.com/alice+weight.png",
    "thumb_url": "http://static.beeminder.com/alice+weight-thumb.png",
    "goaldate": null,                 
    "goalval": 166,                         
    "rate": -0.5,                           
    "losedate": 1358524800 }
```

### HTTP Request

`POST /users/`*u*`/goals/`*g*`/dial_road.json`

<aside class="notice">
Note: the dial_road endpoint is deprecated in favor of
<a href="#putgoal" title="on the goal update endpoint">roadall</a> which, despite its highly confusing state, is the future.
</aside>

Change the slope of the yellow brick road aka bright red line (starting after the one-week
[Akrasia Horizon](http://blog.beeminder.com/dial ))
for beeminder.com/*u*/*g*.

### Parameters

* `rate` (number or null)
* `goaldate` (number or null)
* `goalval` (number or null)

Exactly two of `goaldate`, `goalval`, and `rate` should be specified &mdash; setting two implies the third.

### Returns

The updated [Goal](/goal/) object.


<h2 id="shortcircuit">Short circuit a goal's pledge</h2>

### HTTP Request

`POST /users/`*u*`/goals/`*g*`/shortcircuit.json`

Increase the goal's pledge level and **charge the user the amount of the current pledge**.

### Parameters

None

### Returns

The updated [Goal](/goal/) object.


<h2 id="stepdown">Step down a goal's pledge</h2>

### HTTP Request

`POST /users/`*u*`/goals/`*g*`/stepdown.json`

Decrease the goal's pledge level **subject to the akrasia horizon**, i.e., not immediately.
After a successful request the goal will have a countdown to when it will revert to the lower pledge level.

### Parameters

None

### Returns

The updated [Goal](/goal/) object.


<h2 id="cancelstepdown">Cancel a scheduled step down</h2>

### HTTP Request

`POST /users/`*u*`/goals/`*g*`/cancel_stepdown.json`

Cancel a pending stepdown of a goal's pledge.
The pledge will remain at the current amount.

### Parameters

None

### Returns

The updated [Goal](/goal/) object.


<h2 id="unclebutton">Call "Uncle" (i.e. instant derail)</h2>

```shell title="Example"
  curl https://www.beeminder.com/api/v1/users/alice/goals/blah/uncleme.json?auth_token=abc123
```

```json
  // Example success:
  // updated goal object
  { "slug": "blah",                       
    "goal_type": "hustler",                    
    "svg_url": "http://static.beeminder.com/alice+blah.svg",
    "graph_url": "http://static.beeminder.com/alice+blah.png",
    "thumb_url": "http://static.beeminder.com/alice+blah-thumb.png",
    "goaldate": null,                 
    "goalval": 166,                         
    "rate": 0.5,                           
    ...
    "losedate": 1358524800 }

  // Example error:
  {"errors": "Can't uncle a goal that's not in the red."}
```

### HTTP Request

`POST /users/`*u*`/goals/`*g*`/uncleme.json`

USE AT YOUR OWN RISK. No lifeguard will be posted. 

Call "Uncle" on a goal that is imminently going to derail (aka is in a beemergency, or "is red").
Sometimes there's just no way you're going to complete a goal, despite it being in the red, and you'd rather just derail it now, pay the pledge, and get your post-derail-respite.
That's what this endpoint is for.

Posting to this endpoint insta-derails the goal (stopping all alerts), charges you the pledge amount, and inserts your post-derail respite into the graph. 

This endpoint will fail if the goal has more than 0 days of buffer. 

This endpoint will charge you -- and all Groupies of the goal -- immediately for the derail.

There are no takebacks, no undos, and no refunds.
This *intentionally* and *immediately* derails the goal, so be careful. 


### Parameters

None

### Returns

The updated [Goal](/goal/) object, or an error if the goal is not red.


<h2 id="ratchet">Ratchet a goal</h2>

```shell title="Example"
  # Ratchet a do-more goal down to 2 days of safety buffer
  curl -X POST https://www.beeminder.com/api/v1/users/alice/goals/exercise/ratchet.json \
    -d auth_token=abc123 \
    -d newsafety=2

  # Ratchet a do-less goal down to 3 *units* of safety buffer (distance below
  # the bright red line)
  curl -X POST https://www.beeminder.com/api/v1/users/alice/goals/junkfood/ratchet.json \
    -d auth_token=abc123 \
    -d newsafety=3

  # Ratchet to beemergency (requires beemergency=True for safety)
  curl -X POST https://www.beeminder.com/api/v1/users/alice/goals/exercise/ratchet.json \
    -d auth_token=abc123 \
    -d newsafety=0 \
    -d beemergency=True
```

```json
  // Example success:
  // updated goal object
  { "slug": "exercise",                       
    "goal_type": "hustler",                    
    "svg_url": "http://static.beeminder.com/alice+exercise.svg",
    "graph_url": "http://static.beeminder.com/alice+exercise.png",
    "thumb_url": "http://static.beeminder.com/alice+exercise-thumb.png",
    "goaldate": null,                 
    "goalval": 100,                         
    "rate": 1,
    "safebuf": 2,
    ...
    "losedate": 1358524800 }

  // Example error:
  {"errors": "newsafety cannot exceed 5"}
  {"errors": "Ratcheting to 0 days of buffer requires beemergency=True on the API call"}
  {"errors": "Goal cannot be ratcheted (may be archived, ended, or have no buffer)"}
```

### HTTP Request

`POST /users/`*u*`/goals/`*g*`/ratchet.json`

Ratchet down the goal by reducing the safety buffer (for do-more goals) or hard cap (for do-less goals).
This moves the bright red line (yellow brick road) closer to your current data, making the goal harder.

Ratcheting is useful when you have built up a large safety buffer and want to commit to maintaining your rate more consistently, or when you want to increase the pressure on yourself to meet your goal.

**Important differences by goal type:**

* **Do More / Odometer / Gain Weight goals**: `newsafety` represents the number of **days of safety buffer** you want to ratchet down to. For example, `newsafety=2` means you'll have 2 days of buffer after ratcheting.

* **Do Less / Whittle Down goals**: `newsafety` specifies the number of **units of safety buffer** you want to ratchet down to. Namely, the distance, as measured in the goal's units (e.g., cigarettes or dollars), between your current total and the bright red line. For example, if your current hard cap is +10 cigarettes and you pass `newsafety=5`, you'll have a hard cap of +5 cigarettes, aka 5 units of buffer before you derail. (Note that the number is relative to the bright red line, not the absolute hard-cap total.)

### Parameters

* `newsafety` (number, required): Target safety buffer to ratchet down to, given as days of buffer for do-more goals, or units of buffer for do-less goals. Must be between 0 and the current maximum ratchetable amount. The meaning depends on goal type (see above).
* \[`beemergency`\] (boolean or string): Required when `newsafety=0`. Must be `true`, `"true"`, or `"True"`. This is a safety mechanism to prevent accidentally ratcheting to beemergency (zero days of buffer or zero hard cap).

<aside class="notice">
If the goal is currently on a flat spot (such as a scheduled break starting tomorrow), <code>newsafety</code> is clamped to a minimum of 1 day: ratcheting cannot push you into a beemergency while you're on a break. The request still returns <code>200</code> with the updated goal, but the resulting buffer may be larger than the <code>newsafety</code> you requested. In particular, <code>newsafety=0</code>, even with <code>beemergency=true</code>, would leave you with 1 day of buffer, not 0, when you're on flat spot. Ratchet again to further shorten the break.
</aside>

### Returns

The updated [Goal](/goal/) object.

### Errors

* "newsafety parameter is required" - Missing required parameter
* "newsafety must be a number" - Invalid parameter type
* "newsafety cannot be negative" - Negative value not allowed
* "newsafety cannot exceed X" - Requested value exceeds maximum ratchetable amount
* "Ratcheting to 0 days of buffer requires beemergency=True on the API call" - Safety parameter missing for zero ratchet
* "Goal cannot be ratcheted because it is non-monotonic in the next N days" - Goal is not in a ratchetable state
* "Goal cannot be ratcheted (may be archived, ended, or have no buffer)" - Goal is not in a ratchetable state
* "Failed to ratchet goal" - Ratchet operation failed

[Back to top](#)


