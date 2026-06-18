import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { apiServices } from "../../services/apiServices";
import { useTranslation } from "react-i18next";

const SMRChart = ({ userData }) => {
    const [chartData, setChartData] = useState({ months: [], series: [] });
    const { t, i18n } = useTranslation();
    useEffect(() => {
      const staticMonths = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", 
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];
    const initializeData = (indicatorName) => staticMonths.map(() => 0);

        let requestPayload = {
          "param1":userData?.userData?.userData?.programOwners[0]?.program,
          "param2":userData?.userData?.userData?.orgUnit, 
          "param3":userData?.userData?.userData?.trackedEntityInstance
        };
        apiServices.postAPI("dashboardIndicator/getPatientData/get_custom_dashboard_smrdetails", requestPayload)
            .then((res) => {
                // const smrA = [], smrP = [], smrB = [], tv = [], spl = [], months = [];
                const smrA = initializeData("SMR - A");
                const smrP = initializeData("SMR - P");
                const smrB = initializeData("SMR - B");
                const tv = initializeData("TV (ml)");
                const spl = initializeData("SPL (cms)");

               res.data.data.forEach((item) => {
                    const monthIndex = staticMonths.indexOf(item.monthname.trim().toUpperCase());
                    if (monthIndex !== -1) {
                        switch (item.indicatornames.trim()) {
                            case "SMR - A": smrA[monthIndex] = parseInt(item?.indicatorvalue) || 0; break;
                            case "SMR - P": smrP[monthIndex] = parseInt(item?.indicatorvalue) || 0; break;
                            case "SMR - B": smrB[monthIndex] = parseInt(item?.indicatorvalue) || 0; break;
                            case "TV (ml)": tv[monthIndex] = parseInt(item?.indicatorvalue) || 0; break;
                            case "SPL (cms)": spl[monthIndex] = parseInt(item?.indicatorvalue) || 0; break;
                            default: break;
                        }
                    }
                });

                setChartData({
                    months: staticMonths,
                    series: [
                        { name: "SMR - A", data: smrA, color: "#ff779e" },
                        { name: "SMR - P", data: smrP, color: "#00acb1" },
                        { name: "SMR - B", data: smrB, color: "#002060" },
                        { name: "TV (ml)", data: tv, color: "#4472c4" },
                        { name: "SPL (cms)", data: spl, color: "#ed7d31" },
                    ],
                });
            })
            .catch((error) => console.error("API Fetch Error:", error));
    }, [userData]);

    const chartOptions = {
        chart: { type: "column", backgroundColor: "transparent", height: 500 },
        title: { text: "" },
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
        xAxis: { categories: chartData.months, title: { text: "Months" } },
        // yAxis: { min: 0, title: { text: "" }, labels: { enabled: false } },
        yAxis: { 
          min: 0, 
          title: { text: "" }, 
          labels: { enabled: false } 
      },
        credits: { enabled: false },
        legend: { reversed: false },
        plotOptions: {
            series: {
                stacking: "normal",
                dataLabels: { enabled: true },
                tooltip: { pointFormat: "{series.name}: {point.y}" },
            },
        },
        series: chartData.series,
    };

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default SMRChart;
