/* jshint module:true */

import * as utils from './utils.js';

const terminal = utils.createTerminal(document.getElementById("terminal"));


export const MqttClient = (function build_MqttClient() {
  let pahoClient = undefined;

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
    pahoClient = new Paho.Client(host, port, "miniquette");
    
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
