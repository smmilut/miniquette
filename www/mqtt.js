import * as Controller from "./controller.js";

const maxClientIdLength = 23;  // from Paho MQTT documentation
const defaultClientIdBase = "miniq";
let pahoClient;

/** Generate a fairly unique client Id
 *   in order to avoid getting disconnected when connecting from multiple sources
 */
function generateClientId(base = defaultClientIdBase) {
  const timeString = (new Date()).getTime().toString();
  const randomString = (Math.floor(Math.random() * Math.pow(10, maxClientIdLength))).toString(16);
  const fullClientId = `${base}${timeString}-${randomString}`;
  return fullClientId.slice(0, maxClientIdLength);
}

function disconnectIfExists() {
  if (pahoClient !== undefined) {
    Controller.terminalWrite("Disconnecting existing client.");
    pahoClient.disconnect();
  }
}

function replaceClient(host, port) {
  const clientId = generateClientId();
  Controller.terminalWrite("clientId = " + clientId);
  pahoClient = new window.Paho.Client(host, port, clientId);
}

function setDefaultHandlers() {
  pahoClient.onConnectionLost = function onConnectionLostDefault(responseObject) {
    Controller.terminalWrite("Connection lost.");
    if (responseObject.errorCode !== 0) {
      Controller.terminalWrite(`error code (${responseObject.errorCode}): ${responseObject.errorMessage}`, responseObject);
    }
  };
  pahoClient.onMessageArrived = function onMessageArrivedDefault(message) {
    Controller.terminalWrite("Message not handled.", message);
  };

}

/** Replace the existing client instance */
export function connect(host, port) {
  disconnectIfExists();
  replaceClient(host, port);
  setDefaultHandlers();
  Controller.terminalWrite(`Connecting to ${host}:${port} ...`);
  pahoClient.connect({
    onSuccess() {
      Controller.terminalWrite("... connected.");
    }
  });
}

/** subscribe to the topic filter */
export function subscribe(topicFilter, callbackMessageArrived) {
  if (pahoClient === undefined) {
    throw new Error("Couldn't subscribe : connection not initialized.");
  }

  pahoClient.onMessageArrived = function onMessageArrived(message) {
    /* action when a new MQTT message arrives */
    const data = {
      topic: message.destinationName,
      value: message.payloadString,
      date: new Date()
    }
    callbackMessageArrived(data);
  }

  pahoClient.subscribe(topicFilter);
  Controller.terminalWrite("... subscribed.");
}
