import * as ChartJs from './node_modules/chart.js/dist/Chart.bundle.js';
import * as Utils from './utils.js';

const chartsCache = Utils.newDict();

export function init() {
  chartsCache.init();
}

function createChart() {
  /** All charts have the same configuration.
   * WARNING : it must be a different configuration object every time.
   */
  const chartConfig = {
    type: "line",
    options: {
      scales: {
        xAxes: [{
          type: "time",
          distribution: "linear",
          gridLines: {
            display: false,
          },
        }],
        yAxes: [{
          gridLines: {
            display: false,
          },
        }],
      },
      legend: {
        display: false,
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
      }],
    },
  };
  const chartCanvasEl = document.createElement("canvas");
  const canvasContext = chartCanvasEl.getContext("2d");
  return {
    chart: new Chart(canvasContext, chartConfig),
    htmlEl: chartCanvasEl,
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
    chart.data.datasets[0].data.push({ t: data.date, y: valueNum });
    chart.update();
  }
}
