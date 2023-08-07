# FFmpeg.app

[![Netlify Status](https://api.netlify.com/api/v1/badges/006fc397-1f62-4a9b-bef8-5503392d3e20/deploy-status)](https://ffmpeg.app)

## About

FFmpeg.app is a web-based front end to [FFmpeg](https://ffmpeg.org/), the free and open-source application and libraries for processing of video and audio files. Its purpose is to serve as an easy front-end to this powerful tool, so anybody can discover and use it with no setup (or command-line access) necessary.

You can find the public version of the FFmpeg.app front-end at [ffmpeg.app](https://ffmpeg.app/), and a development "staging" version at [dev.ffmpeg.app](https://dev.ffmpeg.app/).

All processing done by FFmpeg.app runs in the browser, without ever leaving one's computer. No data is tracked.

## Disclaimers

FFmpeg.app uses [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) by [Jerome Wu](https://github.com/jeromewu) to be able to run FFmpeg as a library inside a web browser.

FFmpeg.app is not associated with, nor endorsed by, the FFmpeg project.

## Development

Start a dev watch/run process at [http://localhost:5173/](http://localhost:5173/):

```shell
yarn start
```

Same as `vite`.

## Build

Build for production:

```shell
yarn build
```

Locally preview production build:

```shell
yarn preview
```

