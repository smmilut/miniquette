/* jshint module:true */

import * as chartJs from './node_modules/chart.js/dist/Chart.bundle.js';

export const charts = (function buildChartModule(){
  const charts = Object.create(null);
  
  function getCreateChart(topicPath){
    /*  get or create the chart */
    let c = charts[topicPath];
    if(c == undefined) {
      /* chart doesn't exist, create it */
      let elNode = document.getElementById(topicPath);
      let elChartDiv = document.createElement("div");
      let elChartCanvas = document.createElement("canvas");
      let canvasContext = elChartCanvas.getContext('2d');
      c = new Chart(canvasContext, {
          type: 'line',
          options: {
              scales: {
                  xAxes: [{
                      type: 'time',
                      distribution: 'linear',
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
              backgroundColor: 'grey',
              borderColor: 'white',
              cubicInterpolationMode: 'monotone',
              pointRadius: 2,
            }],
          },
      });
      charts[topicPath] = c;
      elChartDiv.appendChild(elChartCanvas);
      elNode.appendChild(elChartDiv);
    }
    return c;
  }
  
  function updateChart(topicPath, data) {
    /* update the chart, and create it if necessary */
    let valueNum = parseFloat(data.value);
    if(!Number.isNaN(valueNum)) {
      /* it's number, let's make a chart */
      let c = getCreateChart(topicPath);
      c.data.datasets[0].data.push({ t: data.date, y: valueNum});
      c.update();
      return c;
    } else {
      return;
    }
  }
  
  return {
    getCreateChart: getCreateChart,
    updateChart: updateChart,
  }
})();

