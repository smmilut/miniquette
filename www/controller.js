import * as Input from "./input.js";
import * as Mqtt from "./mqtt.js";
import * as Tree from "./tree.js";
import * as Charts from './charts.js';

export function init() {
    terminalWrite("Terminal output on " + Date());
    Input.init();
    Tree.init();
    Charts.init();
}

export function terminalWrite(content, ...additionalContent) {
    console.log(content, ...additionalContent);
    const terminalEl = document.getElementById("terminal");
    terminalEl.innerHTML += "<p class=\"termentry\"># " + content + "</p>";
}

export function connectHost(host, port) {
    terminalWrite(`Asking to connect to ${host}:${port} ...`);
    Mqtt.connect(host, port);
}

export function subscribeTopic(topicFilter) {
    terminalWrite(`Asking to subscribe to ${topicFilter}`);
    try {
        Mqtt.subscribe(topicFilter, Tree.updateTopic);
    } catch (error) {
        terminalWrite(error.message, error);
    }
}

export function updateChart(topicPath, data) {
    Charts.updateChart(topicPath, data);
}