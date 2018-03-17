crowd-pulse-web-ui
==================

Crowd Pulse Web Application.

------------------

## Requirements

Install NodeJS with the following commands:

```
sudo apt-get update -y
sudo apt-get install -y build-essential
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install libkrb5-dev
```

## Installation

Run the following commands:
- `npm install`
- `npm install -g bower`
- `bower install`

### Change the leaflet library
The current version of leaflet is not working properly. Download the development 
release [here](http://leafletjs.com/download.html) (currently 1.3.1) and copy all main folder files in 
`bower_components/leaflet` directory.

From terminal:

```
 cd bower_components/leaflet
 
 # remove all files in the folder with rm command (eg. rm README.md, ... etc)
 
 wget http://cdn.leafletjs.com/leaflet/v1.3.1/leaflet.zip 
 unzip leaflet.zip -d ./
 rm leaflet.zip
```

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
If the command is not found from the terminal, install gulp with `sudo npm install -g gulp`.

To execute the application, run `sudo node ./bin/crowd-pulse-web-ui.js`.
