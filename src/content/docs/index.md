---
title: Beeminder API Reference
---

## Introduction

See 
<a href="https://github.com/beeminder" title="The Beeminder org on GitHub">github.com/beeminder</a> 
for API libraries in various languages.
Examples here are currently just Curl and Ruby. 



In case you're here to automate adding data to Beeminder, there's a good chance 
we've got you covered with our 
[Zapier integration](http://beeminder.com/zapier "Zapier is a service like IFTTT that connects hundreds of disparate webservices. In the case of Beeminder you can create triggers in other webservices that automatically cause data to be added to Beeminder graphs.")
or our
[IFTTT integration](https://www.beeminder.com/ifttt "IFTTT = If This Then That").

The
[tech category of our forum](http://forum.beeminder.com/c/tech "Yay Discourse.org!")
is a good place to ask questions and show off what you're working on.
It's really important to us that this API be easy for developers to use so please don't be shy about asking us questions.
Whether you post in
[the forum](http://forum.beeminder.com "The above link is the Tech subset of the forum; this link is to the main page for the forum")
or email us at **support@beeminder.com** we've invariably found that questions people avoided asking for fear they were dumb turned out to point to things we needed to improve in the API or the documentation.
So lean on us heavily as you're hacking away with our API &mdash; it helps us a lot when you do!

If you're looking for ideas for things to do with the Beeminder API, we have a
[blog post with lots of examples](http://blog.beeminder.com/api "This was the blog post that originally announced our API in 2012").
While we're talking about things that people have done with the Beeminder API, we want to ladle out some extra praise for the
[Intend](https://intend.do/features?utm_source=beeminder&utm_medium=link&utm_campaign=beem-api-docs#beeminder "Describing how Beeminder integration complements Intend") 
and 
[TaskRatchet](https://docs.taskratchet.com/integrations.html#beeminder "Describing how Beeminder works with TaskRatchet") integrations.
Malcolm and Narthur, respectively, have built useful Beeminder integrations without us having to lift a finger. 
A beautiful example of our API earning its keep. 



## Preliminaries

### API Base URL
The base URL for all requests is `https://www.beeminder.com/api/v1/`.

You may also consume the Beeminder API via
[RapidAPI](https://rapidapi.com/beeminder/api/beeminder "RapidAPI (formerly Mashape) is a hub for cloud APIs (is how Wikipedia puts it)").


### Troubleshooting
A common mistake is to use the wrong URL, e.g., using an `http` protocol instead of `https`, or leaving out the `www` subdomain. 
We redirect insecure and non `www` requests to the canonical Beeminder URL, but do not forward parameters for `POST` requests, so some things will break opaquely if you don't use exactly the above base URL.
(And even worse, others will not.)

Also, please pay attention to the type of HTTP request an endpoint is expecting.
For example, the `Goal#create` endpoint and `Goal#update` endpoint differ primarily in whether you are making a `POST` or a `PUT` request (respectively).


### Backwards Compatibility
A note of caution for the reader: We document the User and Goal resources below, explaining various attributes that you will find in the API outputs. If you inspect the API outputs you get, however, you'll probably notice a bunch of info that's not included here. You can use any of that info you like, but it may change at our whim down the road. (That's why we don't document it.) 


[Back to top](#)

