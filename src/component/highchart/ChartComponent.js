import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import treemap from 'highcharts/modules/treemap';
/*import drilldown from "highcharts/modules/drilldown.js";
import ItemSeries from 'highcharts/modules/item-series';
ItemSeries(Highcharts)
drilldown(Highcharts);*/
require("highcharts/modules/exporting")(Highcharts);
treemap(Highcharts);
const ChartComponent = ({ options, styleObj }) => {
  //console.log(styleObj);
  // console.log(options);
  return (
    <div style={{ width: styleObj.width, height: styleObj.height }}>
      <HighchartsReact
        highcharts={Highcharts}
        allowChartUpdate={true}
        options={options}
        //style={{ overflow: "scroll" }}
      />
    </div>
  );
};

export default ChartComponent;
