---
title: Webhooks
---

```json title="Example of POSTed data"
  { "goal":
    { "id": "5016fa9adad11576ad00000f",
    "slug": "example", ... }  
  }
```

You can configure Beeminder to remind you about goals that are about to derail via webhook, either on the individual goal settings page or on your reminder settings page.

Beeminder will remind you via POST request to the URL you specify with a JSON body with all the attributes specified in the description of the
[Goal Resource](/goal/).
