/* jshint module:true */

import * as utils from './utils.js';
import * as tree from './tree.js';

const terminal = utils.createTerminal(document.getElementById("terminal"));

terminal.write("Terminal output on " + Date());


/*  Callback for the Connection form  */
document.getElementById('connectionForm').onsubmit = function(e) {
  // stop the regular form submission
  e.preventDefault();
  getConnectionFormData(this);
};

const getConnectionFormData = function(formElement) {
  // get data
  const host = document.getElementById('inputHost').value;
  const port = parseInt(document.getElementById('inputPort').value);
  terminal.write("Asking to connect to " + host + ":" + (port) + " ...");
  MqttClient.connect(host, port);
};

/*  Callback for the Subscribe form  */
document.getElementById('topicForm').onsubmit = function(e) {
  // stop the regular form submission
  e.preventDefault();
  getTopicsData(this);
};

const getTopicsData = function(formElement) {
  // get data
  const topicFilter = document.getElementById('topicFilter').value;
  terminal.write("Asking to subscribe to " + topicFilter);
  MqttClient.subscribe(topicFilter);
};



const MqttClient = (function build_MqttClient() {
  let pahoClient = null;

  function pahoConnect(host, port) {
    /* Create a client instance */
    if(pahoClient != null) {
      terminal.write("Disconnecting existing client.");
      pahoClient.disconnect();
    }
    
    function onConnect() {
      /* Connection successful.
        Once a connection has been made, make a subscription
      */
      terminal.write("... connected.");
    }
    
    function onMessageArrived(message) {
      /* action when a new MQTT message arrives */
      const topic = message.destinationName;
      const value = message.payloadString;
      tree.tree.updateTopic(topic, value);
    }
    
    function onConnectionLost(responseObject) {
      /* called when the client loses its connection */
      terminal.write("Connection Lost");
      if (responseObject.errorCode !== 0) {
        terminal.write("error code (" + (responseObject.errorCode) + "): " + responseObject.errorMessage);
      }
    }
    
    // create Client
    pahoClient = new Paho.Client(host, port, "miniquette");
    
    // set callback handlers
    pahoClient.onConnectionLost = onConnectionLost;
    pahoClient.onMessageArrived = onMessageArrived;
    
    // connect the client
    terminal.write("Connecting to " + host + ":" + (port) + " ...");
    pahoClient.connect({onSuccess:onConnect});
  }

  function pahoSubscribe(topicFilter) {
    /* subscribe to the topic filter */
    if(pahoClient == null) {
      terminal.write("ERROR : Couldn't subscribe : connection not initialized.");
      return;
    }
    terminal.write("... subscribed.");
    pahoClient.subscribe(topicFilter);
  }

  return {
    connect : pahoConnect,
    subscribe : pahoSubscribe
  };
})();
