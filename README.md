crowd-pulse-web-ui
==================

Crowd Pulse Web Application.

------------------

## Installation

Run the following commands:
- `npm install`
- `npm install -g bower`
- `bower install`

## Configuration

To specify the port to start the server on, set the `CROWD_PULSE_UI_PORT` environment variable 
(defaults to 3000).

To configure the application, write and put a `config.json` file (see [sample](config.json.sample))
in the `dist` directory:

```json
{
  "api": "http://your-server-machine:5000/api/",
  "socket": "http://your-server-machine:5000/",
  "index": "http://your-index-machine:9000/rest/"
}
```

Alternatively, you can set the following environment variables that will be used if the JSON file
does not exist:

* `CROWD_PULSE_UI_API` instead of `api`
* `CROWD_PULSE_UI_SOCKET` instead of `socket`
* `CROWD_PULSE_UI_INDEX` instead of `index`

## Run

Before running you need to build a release with Gulp. In the main directory run `sudo gulp`.

To execute the application, run `node ./bin/crowd-pulse-web-ui.js`.
