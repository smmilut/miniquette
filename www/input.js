import * as Controller from "./controller.js";

/** Callback for the Connection form */
function getConnectionFormData() {
    // get form data
    const host = document.getElementById("inputHost").value;
    const port = parseInt(document.getElementById("inputPort").value);
    Controller.connectHost(host, port);
}

/**  Callback for the Subscribe form  */
function getTopicsData() {
    // get form data
    const topicFilter = document.getElementById("topicFilter").value;
    Controller.subscribeTopic(topicFilter);
};

function getDefaultHost() {
    const urlParameters = new URLSearchParams(window.location.search);
    const urlParametersHost = urlParameters.get("host");
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
    const urlParameters = new URLSearchParams(window.location.search);
    const urlParametersPort = urlParameters.get("port");
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
        getConnectionFormData();
    });

    const topicFormEl = document.getElementById("topicForm");
    topicFormEl.addEventListener("submit", function onSubscribeSubmit(event) {
        // stop the regular form submission
        event.preventDefault();
        getTopicsData();
    });
}