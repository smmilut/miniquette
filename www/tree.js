/* jshint module:true */

import * as utils from './utils.js';

export const tree = (function buildmodule_tree() {
  // where to start to display the result :
  let elRoot = document.getElementById("result");
  let historySizeStr = 3;
  
  function getOrCreateNode(elParent, topicPath, topicNode) {
    /* create HTML tree node, if necessary */
    let elNode = document.getElementById(topicPath);
    if(elNode == undefined) {
      /* the HTML for the node doesn't exist yet, create it */
      elNode = document.createElement("div");
      elNode.setAttribute("id", topicPath);
      elNode.classList.add("topicNode");
      // The HTML element for the name of the node
      const elNodeName = document.createElement("span");
      elNodeName.classList.add("topicName");
      elNodeName.innerText = topicNode;
      
      // add to the tree
      elNode.appendChild(elNodeName);
      elParent.appendChild(elNode);
    }
    return elNode;
  }

  function setNodeValue(elNode, value) {
    /* set the MQTT value of the HTML node */
    
    let elNodeValues = elNode.getElementsByClassName("topicValues")[0];
    if(elNodeValues == undefined) {
      /* the HTML for the values list of the topic doesn't exist yet, create it */
      elNodeValues = document.createElement("div");
      elNodeValues.classList.add("topicValues");
      // add to the tree
      elNode.appendChild(elNodeValues);
    }
    
    /* add/cycle value to history */
    // remove previous
    //while(elNodeValues.getElementsByClassName("historyValue").length >= historySizeStr) {
      //elNodeValues.removeChild(elNodeValues.childNodes[0]);
    //}
    let elListHisto = elNodeValues.getElementsByClassName("historyValue");
    for(let i = 0; i < elListHisto.length; i++) {
      let el = elListHisto[i];
      if(elListHisto.length - i >= historySizeStr) {
        // remove previous
        elNodeValues.removeChild(el);
      } else {
        // fade old ones
        el.classList.add("oldHistory");
      }
    }
    // add new
    let elHisto = document.createElement("div");
    elHisto.classList.add("historyValue");
    let elNodeValue = document.createElement("span");
    elNodeValue.classList.add("topicValue");
    let elNodeDate = document.createElement("span");
    elNodeDate.classList.add("valueDate");
    // add to the tree
    elHisto.appendChild(elNodeValue);
    elHisto.appendChild(elNodeDate);
    elNodeValues.appendChild(elHisto);
    // update MQTT value
    elNodeValue.innerText = value;
    
    let dateNowStr = utils.DateUtils.getTimestampStr(new Date());
    elNodeDate.innerText = dateNowStr;
  }

  function updateTopic(topic, value) {
    /* place the topic inside a tree and display its value */
    
    // where to start to display the result :
    let elParent = elRoot;
    // split the topic in its components : "nodes" of the tree
    let topicNodes = topic.split("/");
    
    // init loop
    let topicPath = "";
    let elNode;
    
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

