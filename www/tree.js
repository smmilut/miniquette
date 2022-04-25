import * as Utils from './utils.js';
import * as Controller from './controller.js';

/** where to start to display the result */
let elRoot;
const options = {};
export function init({ parentId = "result", historySizeStr = 3, } = {}) {
  elRoot = document.getElementById(parentId);
  /** how many history entries to display for string values */
  options.historySizeStr = historySizeStr;
}

/**
 * Create the HTML ELement that will hold the tree node for this MQTT topic
 * @param {String} topicPath full MQTT topic of this node (e.g. "$SYS/broker/clients/total")
 * @param {String} topicNode final component of the `topicPath` (e.g. "total")
 * @returns {HTMLElement} tree node for this MQTT topic
 */
function createNode(topicPath, topicNode) {
  const elNode = document.createElement("div");
  elNode.setAttribute("id", topicPath);
  elNode.classList.add("topicNode");
  // The HTML element for the name of the node
  const elNodeName = document.createElement("span");
  elNodeName.classList.add("topicName");
  elNodeName.innerText = topicNode;
  // add to the tree
  elNode.appendChild(elNodeName);
  return elNode;
}

/** create HTML tree node, if necessary */
function getOrCreateNode(elParent, topicPath, topicNode) {
  let elNode = document.getElementById(topicPath);
  if (elNode === undefined || elNode === null) {
    /* the HTML for the node doesn't exist yet, create it */
    elNode = createNode(topicPath, topicNode);
    elParent.appendChild(elNode);
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
  } else if (previousStr === undefined || Number.isNaN(previousValueNum)) {
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

/**
 * Cycle the history if necessary, and return the previous value if available.
 * @param {HTMLElement} elNodeValues 
 * @returns {String | undefined} previous text value or undefined if no previous value exist
 */
function cycleHistoryAndGetPreviousVal(elNodeValues) {
  const elListHisto = elNodeValues.getElementsByClassName("historyValue");
  if (elListHisto.length > 0) {
    let el;
    for (let i = 0; i < elListHisto.length; i++) {
      el = elListHisto[i];
      if (elListHisto.length - i >= options.historySizeStr) {
        /// remove previous
        elNodeValues.removeChild(el);
      } else {
        /// fade old ones
        el.classList.add("oldHistory");
      }
    }
    return el.getElementsByClassName("topicValue")[0].innerText;
  } else {
    return undefined;
  }
}

/**
 * Create a new history entry for a new MQTT value
 * @returns {HTMLElement} HTML Element containing this MQTT history entry
 */
function newHistoryEntry(value, date, previousValue) {
  // check if value increased/decreased
  const elChangeSymbol = getChangeSymbolEl(value, previousValue);
  // add new
  const elNodeValue = document.createElement("span");
  elNodeValue.classList.add("topicValue");
  // update MQTT value
  const elNodeValueText = document.createTextNode(value);
  elNodeValue.appendChild(elNodeValueText);
  const elNodeDate = document.createElement("span");
  elNodeDate.classList.add("valueDate");
  const dateNowStr = Utils.getTimestampStr(date);
  elNodeDate.innerText = dateNowStr;
  // add to the tree
  const elHisto = document.createElement("div");
  elHisto.classList.add("historyValue");
  elHisto.appendChild(elNodeValue);
  elHisto.appendChild(elChangeSymbol);
  elHisto.appendChild(elNodeDate);
  return elHisto;
}

/** 
 * Get the HTML tree node that holds a MQTT value, or create it.
 * @param {HTMLElement} elNode parent element of the tree node
 * @returns {HTMLElement} HTML Element containing the MQTT history for this topic
 */
function getOrCreateNodeValue(elNode) {
  let elNodeValues = elNode.getElementsByClassName("topicValues")[0];
  if (elNodeValues === undefined || elNodeValues === null) {
    /* the HTML for the values list of the topic doesn't exist yet, create it */
    elNodeValues = document.createElement("div");
    elNodeValues.classList.add("topicValues");
    // add to the tree
    elNode.appendChild(elNodeValues);
  }
  return elNodeValues;
}

/** set the MQTT value of the HTML node */
function setNodeValue(elNode, value, date) {
  const elNodeValues = getOrCreateNodeValue(elNode)
  // get previous MQTT value
  const previousValue = cycleHistoryAndGetPreviousVal(elNodeValues);
  const elHisto = newHistoryEntry(value, date, previousValue);
  elNodeValues.appendChild(elHisto);
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
  setNodeValue(elNode, data.value, data.date);

  // remove last "/"
  topicPath = topicPath.substring(0, topicPath.length - 1);
  // create or update chart
  Controller.updateChart(topicPath, data);
}
