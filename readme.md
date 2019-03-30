# TV

> TV is a simple media server and webapp to play your own videos via Chromecast.

**This is a work in progress. I do not recommend using this.**

[![Build Status](https://travis-ci.org/dustinspecker/tv.svg?branch=master)](https://travis-ci.org/dustinspecker/tv)

![Client](https://img.shields.io/badge/component-client-blue.svg)
[![Dependencies](https://david-dm.org/dustinspecker/tv/status.svg?path=client)](https://david-dm.org/dustinspecker/tv?path=client)
[![DevDependencies](https://david-dm.org/dustinspecker/tv/dev-status.svg?path=client)](https://david-dm.org/dustinspecker/tv?path=client&type=dev)

![Server](https://img.shields.io/badge/component-server-blue.svg)
[![Dependencies](https://david-dm.org/dustinspecker/tv/status.svg?path=server)](https://david-dm.org/dustinspecker/tv?path=server)
[![DevDependencies](https://david-dm.org/dustinspecker/tv/dev-status.svg?path=server)](https://david-dm.org/dustinspecker/tv?path=server&type=dev)

## Prerequisites

1. [Register any Chromecast compatible device](https://developers.google.com/cast/docs/registration#devices) - this is required because this is simply using the default Chromecast receiver app
1. TV only plays media given the following directory structure:
    ```
    media/
    ├── show one/
    │   ├── season 1
    │   │   ├── episode 1
    │   │   └── episode 2
    │   └── season 2
    └── show two/
    ```
    The show names, season names, and episode names are arbitrary for now. TV just expects to see a media directory containing directories of TV shows. Those TV show directories should contain season directories. Those season directory should contain episode videos.
1. Clone this project
1. Run Server
1. Build Client
1. Run Client Proxy Server

## Run Server

1. `cd server`
1. `export TV_MEDIA_DIRECTORY={YOUR MEDIA PATH HERE}`
    - Read [Environment Variables](#environment-variables) for more information
1. `npm i`
1. `npm start`

## Environment Variables

The following environment variables may either be defined as normal environment variables (`export var=value`) or by using [dotenv's `.env` file](https://github.com/motdotla/dotenv#usage).

| Environment Variable | Description |
| -------------------- | ----------- |
| TV_MEDIA_DIRECTORY | Directory on host to search for TV media |

In addition to the above supported environment variables, [fastify-cli](https://github.com/fastify/fastify-cli) has its own [supported environment variables](https://github.com/fastify/fastify-cli#options) that may be used as described above.

The environment variables must be defined in the same shell running Server or in a `.env` file in `./tv/server` directory.

## Build Client

1. `cd client`
1. `npm i -g webpack-cli`
1. `npm i`
1. `webpack-cli`

## Run Client Proxy Server
1. `npm start`
1. Default browser will open to local IP. Take note of this local IP if wanting to connect from another device.
1. You will have to allow using the untrusted cert

## docker-compose

Instead of manually building and running these servers, `docker-compose` may be used instead.

1. Install docker daemon and make sure it's running
1. Clone this project
1. Navigate to top level of this project
1. Run `./create-ssl.sh` to create self-signed certificates
1. `export TV_MEDIA_DIRECTORY={YOUR MEDIA PATH HERE}`
1. `export SERVER_HOST=http://{YOUR_LOCAL_IP}:3000`
1. `docker compose up --build`
1. Open browser and navigate to local IP address on port 443 (https)
1. You will have to allow using the untrusted cert

## Usage

1. Navigate to the address opened by Client Proxy Server in Chrome browser on any device on same network as Server
1. Click/Tap the Google Cast icon to begin a cast session
1. Select a video to begin casting

## Supported Media Types

TV uses the Default Media Receiver and its supported media types can be read at [Supported Media for Google Cast](https://developers.google.com/cast/docs/media#media_container_formats).

## LICENSE
MIT © [Dustin Specker](https://github.com/dustinspecker)
