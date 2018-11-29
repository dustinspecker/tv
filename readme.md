# TV

> TV is a simple media server and webapp to play your own videos via Chromecast.

**This is a work in progress. I do not recommend using this.**

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
1. Build Client
1. Run Server

## Build Client

1. `cd client`
1. `npm i -g webpack-cli`
1. `webpack-cli`

## Run Server

1. `cd server`
1. `export TV_MEDIA_DIRECTORY={YOUR MEDIA PATH HERE}`
1. `node index.js`
1. Take note of the address logged by Server

## Usage

1. Navigate to the address logged by Server on Chrome browser on any device on same network as Server
1. Click/Tap the Google Cast icon to begin a cast session
1. Select a video to begin casting

## Supported Media Types

TV uses the Default Media Receiver and its supported media types can be read at [Supported Media for Google Cast](https://developers.google.com/cast/docs/media#media_container_formats).

## LICENSE
MIT © [Dustin Specker](https://github.com/dustinspecker)
