import React, { useRef, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Grid } from "@mui/material";
import { Button } from "@dhis2/ui";
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@mui/material/Tooltip';
import { withTranslation, Trans, useTranslation } from "react-i18next";


const Glucose = (props) => {
    const { t, i18n } = useTranslation();   
    const { selectedYear } = props; 
    const glucoseChart = Array.isArray(props?.dashboardLineChart) ? props.dashboardLineChart : [];

    // Separate the data
    const randomBloodGlucose = glucoseChart.filter(item => item.indicatornames.includes("Random Blood Glucose"));
    const fastBloodGlucose = glucoseChart.filter(item => item.indicatornames.includes("Fast Blood Glucose"));

    // Function to format the series data
    function formatSeriesData(data) {
        const totalCounts = data.reduce((sum, item) => sum + item.counts, 0);
    return data.map(item => {
        const name = item.indicatornames.split('-')[0];
        const percent = Math.round(((item.counts / totalCounts) * 100).toFixed(2));
        return {
            value:item.counts,
            name: "",
            y: percent,
            color: name.includes("High") ? "#ff779e" : name.includes("Target")?"#203864":"#00acb1"
        };
        });
    }
// Fasting Blood Glucose Pie Chart
const piechart1 = {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        backgroundColor: null,
        height: '320', // Adjusted height for better spacing
    },
    exporting: {
        enabled: window.document.body.clientWidth > 800, // Disable exporting on mobile
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
    legend: {
        enabled: true,
    },
    credits: {
        enabled: false,
    },
    title: {
        text: t('FASTING BLOOD GLUCOSE'),
        distance: -50,
        align: 'center',
        verticalAlign: 'middle',
        y: 100,
        style: {
            fontSize: '1.1em',
        },
    },
    tooltip: {
        enabled: false,
    },
    accessibility: {
        point: {
            valueSuffix: '%',
        },
    },
    plotOptions: {
        pie: {
            // size: '90%', // Increased size for better visibility
            // innerSize: '70%', // Adjusted inner size for balance
            dataLabels: {
                enabled: true,
                format: '{point.y}% ({point.value})',
                connectorColor: 'silver',
                color: 'black',
                style: {
                    fontSize: window.document.body.clientWidth > 800 ? '11px' : '7px', // Ensure font size isn't too large
                },
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '75%'],
             size: '110%'
        },
    },
    series: [
        {
            type: 'pie',
            name: 'High (Poor control)',
            color: "#ff779e",
            innerSize: '50%', // Consistent with the plotOptions innerSize
            data: formatSeriesData(fastBloodGlucose),
        },
    ],
};

// Random Blood Glucose Pie Chart
const piechart2 = {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        backgroundColor: null,
        height: '320', // Increased height for more space
    },
    exporting: {
        enabled: window.document.body.clientWidth > 800, // Disable exporting on mobile,
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
    legend: {
        enabled: true,
    },
    credits: {
        enabled: false,
    },
    title: {
        text: t('RANDOM BLOOD GLUCOSE'),
        distance: -50,
        align: 'center',
        verticalAlign: 'middle',
        y: 100,
        style: {
            fontSize: '1.1em',
        },
    },
    tooltip: {
        enabled: false,
    },
    accessibility: {
        point: {
            valueSuffix: '%',
        },
    },
    plotOptions: {
        pie: {
            // size: '90%', // Increased size for better visibility
            // innerSize: '70%', // Adjusted inner size to match the chart size reduction
            dataLabels: {
                enabled: true,
                format: '{point.y}% ({point.value})',
                connectorColor: 'silver',
                color: 'black',
                allowOverlap: true, // Prevent labels from being cut off
                style: {
                    fontSize: window.document.body.clientWidth > 800 ? '11px' : '7px',
                },
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '75%'],
             size: '110%'
        },
    },
    series: [
        {
            type: 'pie',
            name: 'High (Poor control)',
            color: "#ff779e",
            innerSize: '50%', // Keep this aligned with the chart's size reduction
            data: formatSeriesData(randomBloodGlucose),
        },
    ],
};
return (
    <div className="">
        <div className="main-second-section mb-2">            
            <div className="heading">
                <h4 className="mt-0 mb-0"> {t("PATIENTS WITH CONTROLLED AND UNCONTROLLED GLUCOSE")} ({t("FOR YEAR")} {selectedYear}) </h4>
            </div>     
            <div className="main-icon">
                <Tooltip title={t("Blood glucose levels (both random and fasting) of patients over time.")}>
                    <InfoIcon className="info-icon" />
                </Tooltip>
            </div>                   
        </div>

        <Grid 
          container 
          spacing={2} 
          sx={{ 
            flexDirection: { xs: 'column', sm: 'row' }  // Stack charts on mobile (xs)
          }}
        >
            <Grid item xs={12} sm={6}>
                <div>
                    <HighchartsReact highcharts={Highcharts} options={piechart1} />
                </div>
            </Grid>
            <Grid item xs={12} sm={6}>
                <div>
                    <HighchartsReact highcharts={Highcharts} options={piechart2} />
                </div>
            </Grid>
        </Grid>
        <div className="glucoseMainLegend">
        <div className="main-glucose-legend">
   
        <div className="glucose-legend mx-24px">
        <p className="glucose-legend-c common-legend"></p>
        <p className="commonLabelLegend">{t("Target Range (Good control)")}</p>
        </div>
        
         </div>
        <div className="glucose-legend mx-24px">
            <p className="glucose-legend-unc common-legend"></p>
            <p className="commonLabelLegend">{t("High (Poor control)")}</p>
        </div>
        <div className="glucose-legend mx-24px">
            <p className="glucose-legend-na common-legend"></p>
            <p className="commonLabelLegend">{t("Needs Attention")}</p>
        </div>
        </div>
</div>
  
);
};

export default Glucose;