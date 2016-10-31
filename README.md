# Eclipse

Server for online browser game written in NodeJS(back-end) and Pixi(front-end).

![screenshot](https://raw.githubusercontent.com/dnbard/eclipse-server/master/presentation/01.png)

## How to setup

* clone this repository `git clone https://github.com/dnbard/eclipse-server.git`
* install npm dependencies `npm install`
* run server `gulp`
* open URL `http://localhost:3000` in browser

## Debug mode

`Debug mode` are going to enabled by default locally. It will be disabled on `Curio` and similar environments. Open development tools (F12) and write `window.DEBUG` to access `debug mode` at the client-side.

Available commands:
* showNextWSMessage - will show next message that will come through the WebSockets

## How to contribute

* get task from [project kanban board](https://github.com/dnbard/eclipse-server/projects/1)
* start working on `low priority` tasks while learning the architecture
* commit your work and create pull request for review
* don't forget to write some tests for your code =)

## Servers

New version of server are going to be deployed once commit make its way to `master` branch and pass all tests during the CI process(not created atm - [task](https://github.com/dnbard/eclipse-server/issues/5) for it).

Test server - EU [Curio](https://curio.herokuapp.com/)

## Additional Tools

* [Image Preparation Tool](https://github.com/dnbard/eclipse-image-process)
