import React, { useEffect, useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import _ from "lodash";

const healthThresholds = {
  hba1c: { referenceLower: 3, referenceUpper: 6.5, redLower: 3, redUpper: 14 },
  totalCholesterol: { referenceLower: 125, referenceUpper: 193, redLower: 125, redUpper: 300 },
  bloodGlucoseFasting: { referenceLower: 90, referenceUpper: 130, redLower: 90, redUpper: 135 },
  randomBloodGlucose: { referenceLower: 4.4, referenceUpper: 7.8, redLower: 4.4, redUpper: 16.7 },
  triglycerides: { referenceLower: 50, referenceUpper: 90, redLower: 50, redUpper: 500 },
  tsh: { referenceLower: 0.4, referenceUpper: 4.0, redLower: 0.4, redUpper: 8.0 },
  bloodPressureSystole: { referenceLower: 90, referenceUpper: 120, redLower: 90, redUpper: 140 },
  bloodPressureDiastole: { referenceLower: 60, referenceUpper: 80, redLower: 60, redUpper: 90 },
  bmi: { referenceLower: 18.5, referenceUpper: 25, redLower: 18.5, redUpper: 25 }
};

const HealthMetricIndicator = ({ prevValue, currValue, metric, filterObject }) => {
    console.log(prevValue, currValue, 'values')
  const [referenceRange, setReferenceRange] = useState({});
  
  useEffect(() => {
    if (!filterObject || filterObject.length === 0) return;

    let temp = {};

    filterObject.forEach((filter) => {
      if (!filter.dataElement || !filter.dataElement.id) return;

      const id = filter.dataElement.id;
      temp[id] = {};

      const findValue = (description) =>
        Number(_.find(filter.dataElement.attributeValues, { attribute: { description } })?.value) || null;

      temp[id].referenceLower = findValue("Reference Range Low");
      temp[id].referenceUpper = findValue("Reference Range High");
      temp[id].redUpper = findValue("highRange");
      temp[id].redLower = findValue("lowRange");
    });
    console.log(temp, 'temp')
    setReferenceRange(temp);
  }, [filterObject]);

  const getArrowIndicator = () => {
    const metricThresholds = referenceRange?.[metric] || healthThresholds[metric];
  
    if (!metricThresholds) {
      console.error(`No thresholds found for metric: ${metric}`);
      return {
        arrow: <ArrowForwardIcon style={{ color: "grey", fontSize: 24 }} />,
        tooltip: "Unknown metric"
      };
    }
  
    const { referenceLower, referenceUpper, redLower, redUpper } = metricThresholds;
    console.log(referenceLower, referenceUpper, redLower, redUpper, currValue, prevValue);
  
    if (prevValue === "NA") {
      if (currValue > redUpper) {
        return {
          arrow: <ArrowUpwardIcon style={{ color: "#800000", fontSize: 24 }} />,
          tooltip: "Critical health alert (dangerously high)"
        };
      }
      if (currValue < redLower) {
        return {
          arrow: <ArrowDownwardIcon style={{ color: "#800000", fontSize: 24 }} />,
          tooltip: "Critical health alert (dangerously low)"
        };
      }
      if (currValue < referenceLower) {
        return {
          arrow: <ArrowDownwardIcon style={{ color: "red", fontSize: 24 }} />,
          tooltip: "Below healthy range, needs attention"
        };
      }
      if (currValue >= referenceLower && currValue <= referenceUpper) {
        return {
          arrow: <ArrowForwardIcon style={{ color: "green", fontSize: 24 }} />,
          tooltip: "Healthy range"
        };
      }
      return {
        arrow: <ArrowForwardIcon style={{ color: "grey", fontSize: 24 }} />,
        tooltip: "First-time reading, needs monitoring"
      };
    }
  
    if (prevValue === currValue) {
      return {
        arrow: <ArrowForwardIcon style={{ color: "grey", fontSize: 24 }} />,
        tooltip: "No change"
      };
    }
  
    const increasing = currValue > prevValue;
    const decreasing = currValue < prevValue;
    const bothInReferenceRange = prevValue >= referenceLower && prevValue <= referenceUpper && 
                                 currValue >= referenceLower && currValue <= referenceUpper;
  
    if (currValue > redUpper) {
      return {
        arrow: <ArrowUpwardIcon style={{ color: "#800000", fontSize: 24 }} />,
        tooltip: "Critical health alert (dangerously high)"
      };
    }
  
    if (currValue < redLower) {
      return {
        arrow: <ArrowDownwardIcon style={{ color: "#800000", fontSize: 24 }} />,
        tooltip: "Critical health alert (dangerously low)"
      };
    }
  
    if (bothInReferenceRange) {
      return {
        arrow: increasing 
          ? <ArrowUpwardIcon style={{ color: "#ffdf00", fontSize: 24 }} />
          : <ArrowDownwardIcon style={{ color: "#ffdf00", fontSize: 24 }} />,
        tooltip: increasing ? "Increasing but within healthy range" : "Decreasing but within healthy range"
      };
    }
  
    if (currValue >= referenceLower && currValue <= referenceUpper) {
      return {
        arrow: increasing
          ? <ArrowUpwardIcon style={{ color: "green", fontSize: 24 }} />
          : <ArrowDownwardIcon style={{ color: "green", fontSize: 24 }} />,
        tooltip: "Healthy trend",
      };
    }
  
    if (increasing && currValue > referenceUpper && currValue <= redUpper) {
      return {
        arrow: <ArrowUpwardIcon style={{ color: "red", fontSize: 24 }} />,
        tooltip: "Deteriorating health"
      };
    }

    if (currValue <= referenceLower) {
        return {
          arrow: <ArrowDownwardIcon style={{ color: "red", fontSize: 24 }} />,
          tooltip: "Deteriorating health"
        };
      }
      if (currValue 
        >= referenceUpper) {
        return {
          arrow: <ArrowUpwardIcon style={{ color: "red", fontSize: 24 }} />,
          tooltip: "Deteriorating health"
        };
      }
    return {
      arrow: <ArrowForwardIcon style={{ color: "grey", fontSize: 24 }} />,
      tooltip: "Stable reading"
    };
  };
  

  const { arrow, tooltip } = getArrowIndicator();

  return (
    <Tooltip title={tooltip} arrow>
      <div className="flex items-center space-x-2">
        {arrow}
      </div>
    </Tooltip>
  );
};

export default HealthMetricIndicator;