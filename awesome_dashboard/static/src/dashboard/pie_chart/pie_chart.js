import { Component, onWillStart, useRef, onMounted, onWillUnmount, useEffect } from "@odoo/owl";
import { loadJS } from "@web/core/assets";
import { getColor } from "@web/core/colors/colors";

export class PieChart extends Component {
    static template = "awesome_dashboard.PieChart";
    static props = {
        label: String,
        data: Object,
    };

    setup() {
        this.canvasRef = useRef("canvas");
        onWillStart(() => loadJS("/web/static/lib/Chart/Chart.js"));

        onMounted(() => {
            this.renderChart();
        });

        onWillUnmount(() => {
            if (this.chart) {
                this.chart.destroy();
            }
        });

        useEffect(
            () => {
                if (!this.chart) {
                    this.renderChart();
                } else {
                    this.updateChart();
                }

            },
            () => [this.props.data]
        )
    }

    getChartData() {
        const labels = Object.keys(this.props.data);
        const data = Object.values(this.props.data);
        const colors = labels.map((_, index) => getColor(index, "light", "sm"));

        return [labels, data, colors]
    }

    renderChart() {
        const [ labels, data, colors ] = this.getChartData();
        
        this.chart = new Chart(this.canvasRef.el, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: this.props.label,
                        data: data,
                        backgroundColor: colors,
                    },
                ],
            },
        });
    }

    updateChart() {
        const [ _, data, colors ] = this.getChartData();

        this.chart.data.datasets = [
            {
                label: this.props.label,
                data: data,
                colors: colors
            }
        ];

        this.chart.update();
    }
}