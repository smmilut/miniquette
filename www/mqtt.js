/* jshint module:true */

import * as utils from './utils.js';

const terminal = utils.createTerminal(document.getElementById("terminal"));


export const MqttClient = (function build_MqttClient() {
  const maxClientIdLength = 23;  // from Paho MQTT documentation
  let pahoClient = undefined;

  function generateClientId() {
    /* generate a fairly unique client Id to avoid getting disconnected when connecting from multiple sources */
    let name = "miniq";
    let timeString = (new Date()).getTime().toString();
    let randomString = (Math.floor(Math.random()* Math.pow(10, maxClientIdLength))).toString(16);
    let clientId = name + timeString + "-" + randomString;
    clientId = clientId.slice(0, maxClientIdLength);
    terminal.write("clientId = " + clientId);
    return clientId;
  }

  function pahoConnect(host, port) {
    /* Create a client instance */
    if(pahoClient != undefined) {
      terminal.write("Disconnecting existing client.");
      pahoClient.disconnect();
    }
    
    function onConnect() {
      /* Connection successful.
        Once a connection has been made, make a subscription
      */
      terminal.write("... connected.");
    }
    
    function defaultMessageArrived(message) {
      /* default action when a new MQTT message arrives */
      terminal.write("Message not handled.");
    }
    
    function onConnectionLost(responseObject) {
      /* called when the client loses its connection */
      terminal.write("Connection Lost");
      if (responseObject.errorCode !== 0) {
        console.log("error code (" + (responseObject.errorCode) + "): " + responseObject.errorMessage);
        terminal.write("error code (" + (responseObject.errorCode) + "): " + responseObject.errorMessage);
      }
    }
    
    // create Client
    pahoClient = new Paho.Client(host, port, generateClientId());
    
    // set callback handlers
    pahoClient.onConnectionLost = onConnectionLost;
    pahoClient.onMessageArrived = defaultMessageArrived;
    
    // connect the client
    terminal.write("Connecting to " + host + ":" + (port) + " ...");
    pahoClient.connect({onSuccess:onConnect});
  }

  function pahoSubscribe(topicFilter, callbackMessageArrived) {
    /* subscribe to the topic filter */
    if(pahoClient == undefined) {
      terminal.write("ERROR : Couldn't subscribe : connection not initialized.");
      return;
    }
    
    pahoClient.onMessageArrived = function onMessageArrived(message) {
      /* action when a new MQTT message arrives */
      const data = {
        topic : message.destinationName,
        value : message.payloadString,
        date : new Date()
      }
      callbackMessageArrived(data);
    }
    
    pahoClient.subscribe(topicFilter);
    terminal.write("... subscribed.");
  }

  return {
    connect : pahoConnect,
    subscribe : pahoSubscribe
  };
})();
