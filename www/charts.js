import * as Utils from "./utils.js";

const chartsCache = Utils.newDict();

export function init() {
  chartsCache.init();
}

/**
 * All charts have the same configuration.
 * WARNING : This exists as a function because 
 *   it must be a different configuration object every time.
 * @returns {Object} a copy of the common chart configuration
 */
function getChartConfig() {
  return {
    type: "line",
    options: {
      scales: {
        x: {
          type: "time",
          distribution: "linear",
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      elements: {
        line: {
          fill: false,
          borderWidth: 1,
        },
      },
    },
    data: {
      datasets: [{
        backgroundColor: "grey",
        borderColor: "white",
        cubicInterpolationMode: "monotone",
        pointRadius: 2,
        data: [],
      }],
    },
  };
}

function createChart() {
  const chartConfig = getChartConfig();
  const htmlEl = document.createElement("canvas");
  const canvasContext = htmlEl.getContext("2d");
  const chart = new window.Chart(canvasContext, chartConfig);
  return {
    chart,
    htmlEl,
  };
}

function getCreateChart(topicPath) {
  let chart = chartsCache.get(topicPath);
  if (chart === undefined) {
    /* chart doesn't exist, create it */
    const newChart = createChart();
    chart = newChart.chart;
    chartsCache.set(topicPath, chart);
    const elNode = document.getElementById(topicPath);
    const elChartDiv = document.createElement("div");
    elChartDiv.appendChild(newChart.htmlEl);
    elNode.appendChild(elChartDiv);
  }
  return chart;
}

/** update the chart, and create it if necessary */
export function updateChart(topicPath, data) {
  const valueNum = parseFloat(data.value);
  if (Number.isNaN(valueNum)) {
    return;
  } else {
    /* it's number, let's make a chart */
    const chart = getCreateChart(topicPath);
    chart.data.datasets[0].data.push({ x: data.date, y: valueNum });
    chart.update();
  }
}
