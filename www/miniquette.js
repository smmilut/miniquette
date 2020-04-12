/* jshint module:true */

const terminal = {
  element : document.getElementById("terminal"),
  write : function(content) {
    this.element.innerHTML += "<p class=\"termentry\"># " + content + "</p>";
  }
};

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
  pahoConnect(host, port);
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
  pahoSubscribe(topicFilter);
};


function getOrCreateNode(elParent, topicPath, topicNode) {
  /* create HTML tree node, if necessary */
  let elNode = document.getElementById(topicPath);
  if(elNode == null) {
    // the HTML for the node doesn't exist yet, create it
    elNode = document.createElement("div");
    elNode.setAttribute("id", topicPath);
    elNode.classList.add("topicNode");
    // The HTML element for the name of the node
    const elNodeName = document.createElement("span");
    elNodeName.classList.add("topicName");
    elNodeName.innerText = topicNode;
    
    elNode.appendChild(elNodeName);
    elParent.appendChild(elNode);
  }
  return elNode;
}

function setNodeValue(elNode, value) {
  /* set the MQTT value of the HTML node */
  let elNodeValue = elNode.getElementsByClassName("topicValue")[0];
  if(elNodeValue == null) {
    // the HTML for the value of the topic doesn't exist yet, create it
    elNodeValue = document.createElement("span");
    elNodeValue.classList.add("topicValue");
    elNode.appendChild(elNodeValue);
  }
  elNodeValue.innerText = value;
  restart_animation(elNodeValue);
}

function restart_animation(el) {
  /* restart CSS animation */
  el.style.animation = 'none';
  el.offsetHeight; // trigger reflow
  el.style.animation = null; 
}

function updateTopic(topic, value) {
  /* place the topic inside a tree and display its value */
  // where to start to display the result :
  let elParent = document.getElementById("result");
  // split the topic in its components : "nodes" of the tree
  const topicNodes = topic.split("/");
  
  let topicPath = "";
  let elNode;
  let elNodeName;
  let elValue;
  
  for(const topicNode of topicNodes) {
    /* Iterate the components of the topic path :
     * "$SYS/broker/clients/total" => $SYS, broker, clients, total
     * Turn these elements into "nodes" of the tree
    */
    // build the path, starting from the root and ending to the current node
    topicPath += topicNode;
    // get HTML element for the current node, create it if necessary
    elNode = getOrCreateNode(elParent, topicPath, topicNode);
    // prepare for next iteration to go down 1 level
    elParent = elNode;
    topicPath += "/";
  }
  // only the final node corresponds to the topic and holds a value
  setNodeValue(elNode, value);
}

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
    updateTopic(topic, value);
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
