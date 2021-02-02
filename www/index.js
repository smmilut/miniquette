/* jshint module:true */

import * as mqtt from './mqtt.js';
import * as utils from './utils.js';
import * as tree from './tree.js';

const terminal = utils.createTerminal(document.getElementById("terminal"));

terminal.write("Terminal output on " + Date());
terminal.write("location.hostname=" + location.hostname);


const getConnectionFormData = function(formElement) {
  /*  Callback for the Connection form  */
  // get form data
  const host = document.getElementById('inputHost').value;
  const port = parseInt(document.getElementById('inputPort').value);
  terminal.write("Asking to connect to " + host + ":" + (port) + " ...");
  mqtt.MqttClient.connect(host, port);
};


const getTopicsData = function(formElement) {
  /*  Callback for the Subscribe form  */
  // get form data
  const topicFilter = document.getElementById('topicFilter').value;
  terminal.write("Asking to subscribe to " + topicFilter);
  mqtt.MqttClient.subscribe(topicFilter, tree.tree.updateTopic);
};


(function main() {
  if(location.hostname) {
    /* we are hosted on a server, we assume that the MQTT broker runs on the same machine */
    document.getElementById('inputHost').defaultValue = location.hostname;
    document.getElementById('inputHost').value = location.hostname;
  } else {
    /* we are probably on a file during some test, we don't assume anything */
    document.getElementById('inputHost').defaultValue = "localhost";
    document.getElementById('inputHost').value = "localhost";
  }
  
  /*  Callback for the Connection form  */
  document.getElementById('connectionForm').onsubmit = function(e) {
    // stop the regular form submission
    e.preventDefault();
    getConnectionFormData(this);
  };
  
  /*  Callback for the Subscribe form  */
  document.getElementById('topicForm').onsubmit = function(e) {
    // stop the regular form submission
    e.preventDefault();
    getTopicsData(this);
  };
})();
