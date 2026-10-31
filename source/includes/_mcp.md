# MCP server

<!-- Claude wrote this section; it's in Claude's words, attributed as such,
until a Beeminder human rewrites it. The server is github.com/beeminder/mcbee. -->

Claude: "Beeminder has an MCP server, so Claude and other AI assistants
that speak the Model Context Protocol can read and update your goals.
Its URL is `https://www.beeminder.com/api/mcp`.

**In Claude**, add Beeminder from the connector directory, or add a custom
connector with that URL. The first time Claude uses it, it opens
Beeminder's sign-in page. Sign in and allow access, and Claude gets a token
for your account only. To disconnect, remove the connector in Claude.

Then ask for things in plain words, like 'Which of my Beeminder goals are
due today?' or 'Add 30 to my pushups goal.'

**In other MCP clients** that can't do the sign-in, send your personal auth
token from [beeminder.com/account](https://www.beeminder.com/account)
instead, either as the header `X-Beeminder-Auth-Token: <token>` or as
`?auth_token=<token>` on the URL. A request with no token at all gets
HTTP 401 pointing at the OAuth discovery document,
`https://www.beeminder.com/.well-known/oauth-protected-resource/api/mcp`.

The server offers these tools. They call the same API documented on this
page, as you.

Tool | What it does
---- | ------------
`list_goals` | Lists your goals with each one's rate, pledge and deadline
`get_goal` | One goal's details
`get_datapoints` | A goal's datapoints
`add_datapoint` | Adds a datapoint
`update_datapoint` | Changes a datapoint
`delete_datapoint` | Deletes a datapoint
`create_goal` | Creates a goal
`update_goal` | Changes a goal's settings
`dial_road` | Changes a goal's rate (the bright red line)
`refresh_goal` | Asks an autodata goal to fetch new data
`archive_goal` | Archives a goal, which the API can't undo

Each tool is marked read-only, additive or destructive, so a client can
ask you before it changes or deletes anything. The server keeps no copy of
your goals or data; it passes each request through to the Beeminder API.
Questions go to [support@beeminder.com](mailto:support@beeminder.com)."
