# wiremock-chrome-extension
A simple chrome extension for Wiremock

## Setting up with source code

1. Clone or download code from the repo
2. Import the `src` folder into the [extension section of Chrome](https://developer.chrome.com/extensions/getstarted#unpacked)
3. Download the latest supported version of Wiremock from [here](http://repo1.maven.org/maven2/com/github/tomakehurst/wiremock-standalone/2.2.2/wiremock-standalone-2.2.2.jar)
4. Startup Wiremock on localhost:8080 to allow the extension to talk to Wiremock

## Running tests

1. Navigate to the root folder and run ```npm install```
2. (Optional) Install Mocha ```npm install -g mocha```
3. To run tests run ```npm test```
