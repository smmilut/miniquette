import * as Utils from "./utils.js";
import * as Controller from "./controller.js";

/** Callback for the Connection form */
function getConnectionFormData({
    inputHostId = "inputHost",
    inputPortId = "inputPort",
} = {}) {
    return {
        host: document.getElementById(inputHostId).value,
        port: parseInt(document.getElementById(inputPortId).value),
    };
}
function connectFormHost() {
    const { host, port } = getConnectionFormData();
    Controller.connectHost(host, port);
}

/**  Callback for the Subscribe form  */
function getTopicsFormData({ topicFilterId = "topicFilter", } = {}) {
    // get form data
    return document.getElementById(topicFilterId).value;
}

function subscribeFormTopic() {
    const topicFilter = getTopicsFormData();
    Controller.subscribeTopic(topicFilter);
}

function getDefaultHost() {
    const urlParametersHost = Utils.getUrlParameter("host");
    if (urlParametersHost) {
        return urlParametersHost;
    } else if (location.hostname !== undefined && location.hostname.length > 0) {
        /* we are hosted on a server, we assume that the MQTT broker runs on the same machine */
        return location.hostname;
    } else {
        return "localhost";
    }
}

function getDefaultPort() {
    const urlParametersPort = Utils.getUrlParameter("port");
    if (urlParametersPort) {
        return urlParametersPort;
    } else {
        return "1884";
    }
}

function setDefaultHostPort() {
    const defaultHost = getDefaultHost();
    const inputHostEl = document.getElementById("inputHost");
    inputHostEl.defaultValue = defaultHost;
    inputHostEl.value = defaultHost;
    const defaultPort = getDefaultPort();
    const inputPortEl = document.getElementById("inputPort");
    inputPortEl.defaultValue = defaultPort;
    inputPortEl.value = defaultPort;
}

export function init() {
    setDefaultHostPort();
    const connectionFormEl = document.getElementById("connectionForm");
    connectionFormEl.addEventListener("submit", function onConnectionSubmit(event) {
        // stop the regular form submission
        event.preventDefault();
        connectFormHost();
    });

    const topicFormEl = document.getElementById("topicForm");
    topicFormEl.addEventListener("submit", function onSubscribeSubmit(event) {
        // stop the regular form submission
        event.preventDefault();
        subscribeFormTopic();
    });
}