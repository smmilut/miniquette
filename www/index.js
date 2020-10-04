/* jshint module:true */

import * as mqtt from './mqtt.js';
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
  mqtt.MqttClient.connect(host, port);
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
  mqtt.MqttClient.subscribe(topicFilter, tree.tree.updateTopic);
};

