/* jshint module:true */

import * as utils from './utils.js';

export const tree = (function buildmodule_tree() {
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
    utils.CssUtils.restart_animation(elNodeValue);
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

  return {
    updateTopic : updateTopic
  };
})();

