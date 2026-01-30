import React, { useState, useEffect } from 'react'
import Popup from 'react-animated-popup'
import Button from "@material-ui/core/Button";

const CVDCalculator = (props) => {
  const [visible, setVisible] = useState(true)
  const [cvdRiskValue, setCvdRiskValue] = useState(0)

  useEffect(() => {
    const cdvRisk = calculateCDVRisk2();
    if(cdvRisk){
      setCvdRiskValue(cdvRisk.toFixed(2))
    }
  }, []);

  useEffect(() => {
    if(visible){
      setTimeout(function(){
        const popupDiv = document.querySelector('.animated-popup');
        const parentDiv = popupDiv && popupDiv.parentNode;
        if(popupDiv){
          parentDiv.style.backgroundColor = "rgba(0,0,0,0.4)";
        }
      },100)
    }
}, [visible]);


  function calculateCDVRisk() {
    // Coefficients for the Framingham Risk Score calculation (hypothetical values)
    const coefficients = {
      age: 3.06117,
      male: 1.47582,
      female: 0.6585,
      smoking: 0.877,
      diabetes: 0.921,
      systolicBloodPressure: 1.93303,
      totalCholesterol: 0.962,
      hdlCholesterol: -0.657,
      intercept: -29.4,
    };
  
    // Get the gender coefficient
    const genderCoefficient = props.gender === "male" ? coefficients.male : coefficients.female;
  
    // Calculate log odds for each risk factor
    const logAge = coefficients.age * Math.log(props.age);
    const logGender = genderCoefficient * Math.log(genderCoefficient);
    const logSmoking = coefficients.smoking * props.smoking;
    const logDiabetes = coefficients.diabetes * props.diabetes;
    const logSystolicBP = coefficients.systolicBloodPressure * Math.log(props.systolicBloodPressure);
    const logTotalCholesterol = coefficients.totalCholesterol * Math.log(props.totalCholesterol);
    const logHDLCholesterol = coefficients.hdlCholesterol * Math.log(props.hdlCholesterol);
  
    // Calculate the log odds sum
    const logOddsSum =
      logAge + logGender + logSmoking + logDiabetes + logSystolicBP + logTotalCholesterol + logHDLCholesterol + coefficients.intercept;
  
    // Calculate the 10-year CVD risk using the Framingham Risk Score equation
    const tenYearRisk = 1 - Math.pow(0.88936, Math.exp(logOddsSum));
  
    // Convert the risk to percentage
    const riskPercentage = tenYearRisk * 100;
  
    return riskPercentage;
  }

  function calculateCDVRisk2() {
    const ageRisk = props.age * 0.05;
    const sbpRisk = props.systolicBloodPressure * 0.1;
    const cholesterolRisk = props.totalCholesterol * 0.01;
    const hdlcholesterolRisk = props.hdlCholesterol * 0.01;
    const smokingRisk = props.smoking || props.smoking == 1 ? 1 * 0.877 : 0;
    const diabetesRisk = props.diabetes || props.diabetes == 1 ? 1 * 0.921 : 0;
  
    const cvdRisk = ageRisk + sbpRisk + cholesterolRisk + hdlcholesterolRisk + smokingRisk + diabetesRisk;
    return cvdRisk;
  }

  function calculateCDVRisk3() {
  }

  const hidePopup = () =>{
    props.setopenCVDRisk(false)
    setVisible(false)
  }
  // const cdvRisk = calculateCDVRisk(age, gender, smoking, diabetes, systolicBloodPressure, totalCholesterol, hdlCholesterol);
  // console.log("10-year CVD risk: " + cdvRisk.toFixed(2) + "%");
  return (
    <div className='custom-popup'>
      <Popup className={window.cordova ? "animated-popup" : "animated-popup popup-width" } id="animated-popup" visible={visible} onClose={() => hidePopup()}>
        {/* <div className="bmibg"></div> */}
        <h1 align="center" className="popupbmi-title mT5 mTB">{props.name}'s CVD Risk</h1>
        <h1 className={"mT5 mTB"}><p align="center" className="popupbmi-result">
          {cvdRiskValue ? cvdRiskValue + "%" : '0%'}
        </p></h1>
        {/* <h3 className="mT5">{bmiresult && <p align="center" className={bmiresult.alertClass + " mT5 mTB"}>{bmiresult.label}</p>}</h3> */}
        <p align="center" className="mT0 mB0"><Button className="popup-btn" align="center" variant="contained" color="success" onClick={() => hidePopup()}>OK</Button></p>
      </Popup>
    </div>
  )
}

export default CVDCalculator

