import * as utils from './utils.js';
import * as Controller from './controller.js';

/** where to start to display the result */
let elRoot = document.getElementById("result");
/** how many history entries to display for string values */
const historySizeStr = 3;

function createNode(elParent, topicPath, topicNode) {
  const elNode = document.createElement("div");
  elNode.setAttribute("id", topicPath);
  elNode.classList.add("topicNode");
  // The HTML element for the name of the node
  const elNodeName = document.createElement("span");
  elNodeName.classList.add("topicName");
  elNodeName.innerText = topicNode;

  // add to the tree
  elNode.appendChild(elNodeName);
  elParent.appendChild(elNode);
  return elNode;
}

/** create HTML tree node, if necessary */
function getOrCreateNode(elParent, topicPath, topicNode) {
  let elNode = document.getElementById(topicPath);
  if (elNode === undefined || elNode === null) {
    /* the HTML for the node doesn't exist yet, create it */
    elNode = createNode(elParent, topicPath, topicNode);
  }
  return elNode;
}

/** return the HTML for the symbol representing how the MQTT value has changed :
 *  - increased
 *  - decreased
 *  - constant
 *  - no previous value
 *  - text value 
 */
function getChangeSymbol(valueStr, previousStr) {
  const valueNum = parseFloat(valueStr);
  const previousValueNum = parseFloat(previousStr);
  if (Number.isNaN(valueNum)) {
    return "☰";
  } else if (Number.isNaN(previousValueNum)) {
    return "◇";
  } else {
    const delta = valueNum - previousValueNum;
    if (delta < 0) {
      return "↘";
    } else if (delta > 0) {
      return "↗";
    } else {
      return "→";
    }
  }
}

function getChangeSymbolEl(valueStr, previousStr) {
  const elChangeSymbol = document.createElement("span");
  elChangeSymbol.classList.add("changeSymbol");
  elChangeSymbol.innerText = getChangeSymbol(valueStr, previousStr);
  return elChangeSymbol;
}

/** set the MQTT value of the HTML node */
function setNodeValue(elNode, value) {
  let elNodeValues = elNode.getElementsByClassName("topicValues")[0];
  if (elNodeValues === undefined ||elNodeValues === null) {
    /* the HTML for the values list of the topic doesn't exist yet, create it */
    elNodeValues = document.createElement("div");
    elNodeValues.classList.add("topicValues");
    // add to the tree
    elNode.appendChild(elNodeValues);
  }

  let previousValue;
  /* add/cycle value to history */
  const elListHisto = elNodeValues.getElementsByClassName("historyValue");
  for (let i = 0; i < elListHisto.length; i++) {
    let el = elListHisto[i];
    if (elListHisto.length - i >= historySizeStr) {
      // remove previous
      elNodeValues.removeChild(el);
    } else {
      // fade old ones
      el.classList.add("oldHistory");
    }
    // get previous MQTT value
    previousValue = el.getElementsByClassName("topicValue")[0].innerText;
  }

  // check if value increased/decreased
  const elChangeSymbol = getChangeSymbolEl(value, previousValue);

  // add new
  const elHisto = document.createElement("div");
  elHisto.classList.add("historyValue");
  const elNodeValue = document.createElement("span");
  elNodeValue.classList.add("topicValue");
  const elNodeDate = document.createElement("span");
  elNodeDate.classList.add("valueDate");
  // add to the tree
  elHisto.appendChild(elNodeValue);
  elHisto.appendChild(elChangeSymbol);
  elHisto.appendChild(elNodeDate);
  elNodeValues.appendChild(elHisto);
  // update MQTT value
  elNodeValue.innerText = value;

  let dateNowStr = utils.DateUtils.getTimestampStr(new Date());
  elNodeDate.innerText = dateNowStr;
}

/** place the topic inside a tree and display its value */
export function updateTopic(data) {
  /** where to start to display the result */
  let elParent = elRoot;
  // split the topic in its components : "nodes" of the tree
  const topicNodes = data.topic.split("/");

  // init loop
  let topicPath = "";
  let elNode;

  for (const topicNode of topicNodes) {
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
  setNodeValue(elNode, data.value);

  // remove last "/"
  topicPath = topicPath.substring(0, topicPath.length - 1);
  // create or update chart
  Controller.updateChart(topicPath, data);
}
