import React from 'react';
import Chart from 'chart.js';

class Graph extends React.Component {

    componentDidMount() {
        var ctx = document.getElementById("myChart");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Mar 1, 18", "Mar 7, 18", "Mar 14, 18", "Mar 28, 18", "Apr 1, 18"],
                datasets: [
                    {
                        label: '',
                        data: [345, 412, 174, 225, 150],
                        borderWidth: 0,
                        backgroundColor: '#36CACB'
                    },
                    {
                        label: '',
                        data: [74, 99, 32, 55, 32],
                        borderWidth: 0,
                        backgroundColor: '#FF9029'
                    }
                ]
            },
            options: {
                legend: false,
                tooltips: { enabled: false}, 
                scales: {
                    xAxes: [{ 
                        gridLines: { 
                            display: false,
                            color: '#9EA29C'
                        },
                        ticks: {
                            fontColor: '#9EA29C'
                        }
                    }],
                    yAxes: [{ 
                        gridLines: { 
                            display: false, 
                            color: '#9EA29C'
                        },
                        ticks: {
                            fontColor: '#9EA29C',
                            // Include a dollar sign in the ticks
                            callback: function(value, index, values) {
                                return '$' + value;
                            }
                        },
                        
                        
                    }],
                    
                },
            }
        });

        // Define a plugin to provide data labels
        Chart.plugins.register({
            afterDatasetsDraw: function(chart) {
                var ctx = chart.ctx;

                chart.data.datasets.forEach(function(dataset, i) {
                    var meta = chart.getDatasetMeta(i);
                    if (!meta.hidden) {
                        meta.data.forEach(function(element, index) {
                            // Draw the text in black, with the specified font
                            ctx.fillStyle = '#3A3F37';

                            var fontSize = 13;
                            var fontStyle = 'normal';
                            var fontFamily = 'Poppins';
                            ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                            // Just naively convert to string for now
                            var dataString = '$' + dataset.data[index].toString();

                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';

                            var padding = 5;
                            var position = element.tooltipPosition();
                            ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
                        });
                    }
                });
            }
        });
    }
    render() {
        return (
            <canvas id="myChart" width="575" height="315"></canvas>
        );
    }
    
}

Graph.propTypes = {

}
export default Graph;

