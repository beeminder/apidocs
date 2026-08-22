---
title: Charge Resource
---

Beeminder provides an endpoint to charge an arbitrary amount to a Beeminder user. The user is inferred from the `access_token` or `auth_token` provided.
A `Charge` object has the following attributes:


### Attributes

* `amount` (number): The amount to charge the user, in US dollars.  Must be positive, >=1.00
* `note` (string): An explanation of why the charge was made.
* `username` (string): The Beeminder username of the user being charged.

## Create a charge {#postcharge}

### HTTP request

`POST /charges`

Create a charge of a given amount and optionally add a note.

```shell title="Example request"
  curl -X POST 'https://www.beeminder.com/api/v1/charges.json' \
    -d auth_token=abc123 \
    -d user_id=alice \
    -d amount=10 \
    -d note=I%27m+not+worthy%3B+charge+myself+%2410 \
```

### Parameters

* `user_id` (string): Username of the user who is getting charged.
* `amount` (number): The amount to charge the user, in US dollars.  Minimum value is 1.00
* `note` (string)
* \[`dryrun`\] (string): If passed, the Charge is not actually created, but the JSON for it is returned as if it were. Default: false.

### Returns

The Charge object, or an object with the error message(s) if the request was not successful.

```json title="Example response"
  { "id": "5016fa9adad11576ad00000f",
    "amount": 10,
    "note": "I'm not worthy; charge myself $10",
    "username": "alice" }
```
## Charge a goal {#goalcharge}

You're probably thinking of calling Uncle on a goal that's about to derail to get it over with.
See the [Uncle](/goal/#unclebutton) endpoint.


[Back to top](#)



