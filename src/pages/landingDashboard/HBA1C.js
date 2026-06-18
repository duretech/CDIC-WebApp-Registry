import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@mui/material/Tooltip';
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { APP_LOCALE } from "../../assets/data/config";

const HBA1C = (props) => {
    const { t, i18n } = useTranslation();
    const { selectedYear } = props;
    const hBA1CChart = Array.isArray(props?.dashboardLineChart) ? props.dashboardLineChart : [];

    function getInsulinData(indicatorName, color) {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return {
            name: t(indicatorName),
            data: months.map(month => {
                const found = _.find(hBA1CChart, { indicatornames: indicatorName, months: month });
                return found ? found.counts : 0;
            }),
            color: color
        };
    }

    const categories = [
        t('Jan'),
        t('Feb'),
        t('Mar'),
        t('Apr'),
        t('May'),
        t('Jun'),
        t('Jul'),
        t('Aug'),
        t('Sep'),
        t('Oct'),
        t('Nov'),
        t('Dec')
    ];

    const plotOptions = APP_LOCALE === "CC006" ? {
        column: {
            stacking: 'percent',  // Enable stacking for CC006
            dataLabels: {
                enabled: true,
                formatter: function () {
                    let stackTotal = this.total || 0;  // Get total for the current stack (month)
                    let percentage = stackTotal > 0 ? ((this.y / stackTotal) * 100).toFixed(1) : 0;
                    return `<span style="font-size:10px;">${this.y} (${percentage}%)</span>`; // Display both count & percentage
                },
                style: {
                    fontWeight: 'bold',
                    color: 'black',
                    fontSize: '8px' // Adjust font size
                }
            },
            pointWidth: 70,
            pointPadding: 0.2,
            groupPadding: 0.05,
            borderWidth: 2
        }
    } : {
        column: {
            pointWidth: 20,
            pointPadding: 0.2,
            groupPadding: 0.1,
            borderWidth: 2
        }
    };


    const lineChart = {
        chart: {
            type: 'column',
            backgroundColor: null,
            height: '320',
        },
        title: {
            text: '',
            align: 'left'
        },
        exporting: {
        enabled: !window.cordova,
         menuItemDefinitions: {
            viewFullscreen: {
                text: t("View in full screen")
            },
            printChart: {
                text: t("Print Chart")
            },
            downloadPNG: {
                text: t("Download PNG image")
            },
            downloadJPEG: {
                text: t("Download JPEG image")
            },
            downloadPDF: {
                text: t("Download PDF document")
            },
            downloadSVG: {
                text: t("Download SVG vector image")
            }
            }
      },
        xAxis: {
            categories: categories,
            crosshair: true,
            accessibility: {
                description: 'Months'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: APP_LOCALE === "CC006" ? t("Percentage / Number") : '',
            },
        },
        credits: {
            enabled: false,
        },
        plotOptions: plotOptions,

        tooltip: {
            shared: true,
            useHTML: true,
            formatter: function () {
                let tooltip = `<b>${this.x}</b><br/>`;
                let total = this.points.reduce((sum, p) => sum + p.y, 0); // Get total for the month

                this.points.forEach(point => {
                    const percentage = ((point.y / total) * 100).toFixed(1);
                    tooltip += `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${point.y}</b> (${percentage}%)<br/>`;
                });
                return tooltip;
            }
        },
        series: APP_LOCALE === "GANDHIO"
            ? [
                getInsulinData("REGULAR", '#92C5F9'),
                getInsulinData("ASPART", '#AFDC8F'),
                getInsulinData("FIASP", '#203864'),
                getInsulinData("GLULISINE", '#F8AE54'),
                getInsulinData("LISPRO", '#B6A6E9'),
            ]
            : [
                {
                    name: t("Target Range (Good control)"),
                    data: [
                        _.find(hBA1CChart, { indicatornames: "Target Range (Good control)", months: "January" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Target Range (Good control)", months: "February" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Target Range (Good control)", months: "March" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Target Range (Good control)", months: "April" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Target Range (Good control)", months: "May" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Target Range (Good control)", months: "June" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Target Range (Good control)", months: "July" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Target Range (Good control)", months: "August" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Target Range (Good control)", months: "September" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Target Range (Good control)", months: "October" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Target Range (Good control)", months: "November" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Target Range (Good control)", months: "December" })?.counts || 0,
                    ],
                    color: "#203864",
                },
                {
                    name: t("High (Poor control)"),
                    data: [
                        _.find(hBA1CChart, { indicatornames: "High (Poor control)", months: "January" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "High (Poor control)", months: "February" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "High (Poor control)", months: "March" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "High (Poor control)", months: "April" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "High (Poor control)", months: "May" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "High (Poor control)", months: "June" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "High (Poor control)", months: "July" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "High (Poor control)", months: "August" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "High (Poor control)", months: "September" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "High (Poor control)", months: "October" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "High (Poor control)", months: "November" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "High (Poor control)", months: "December" })?.counts || 0,
                    ],
                    color: "#ff779e",
                },
                {
                    name: t("Needs Attention"),
                    data: [
                        _.find(hBA1CChart, { indicatornames: "Needs Attention", months: "January" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Needs Attention", months: "February" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Needs Attention", months: "March" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Needs Attention", months: "April" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Needs Attention", months: "May" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Needs Attention", months: "June" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Needs Attention", months: "July" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Needs Attention", months: "August" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Needs Attention", months: "September" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Needs Attention", months: "October" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Needs Attention", months: "November" })?.counts || 0,
                        _.find(hBA1CChart, { indicatornames: "Needs Attention", months: "December" })?.counts || 0,
                    ],
                    color: "#00acb1",
                },
            ]
    };

    return (
        <div>
            <div className="main-second-section mb-2">
                <div className="heading">
                    <h4 className="mt-0 mb-0">
                        {t("PATIENTS WITH CONTROLLED AND UNCONTROLLED HBA1C BY MONTH")}({t("For Year")} { selectedYear })
                    </h4>
                </div>
                <div className="main-icon">
                    <Tooltip title={t("HbA1C levels of patients over time.(Trend)")}>
                        <InfoIcon className="info-icon" />
                    </Tooltip>
                </div>
            </div>
            <HighchartsReact
                highcharts={Highcharts}
                options={lineChart}
            />
        </div>
    );
};

export default HBA1C;