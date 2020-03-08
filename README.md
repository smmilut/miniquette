# About

*miniquette* is a simple web page to display MQTT data from websockets.

## Purpose

* subscribe to MQTT topics using websockets
* display current value of topics
* use a simple web page
* light on resources, to be served on a Raspberry Pi for example
* (optional) client-side mini-history of values

## Status

Currently a very basic proof of concept. Works with manual steps and no frills.


# Installing

## Dependencies

Import the [paho-mqtt](https://www.eclipse.org/paho/clients/js/) Javascript dependency :
At the root folder, do :
```sh
npm install paho-mqtt
```

## Deploying

Can be run as a file in a web browser.
Can be deployed as static files on a web server.


# Contributing

This is a very small project authored by a beginner for fun.
Currently I don't have plans for collaboration, but feedback is welcome and of course feel free to fork.

# License

MIT
