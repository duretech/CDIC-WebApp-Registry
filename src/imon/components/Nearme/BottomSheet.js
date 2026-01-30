import React, { useState, useEffect, useRef } from "react";
import i18next from "i18next";
import { withTranslation, Trans } from "react-i18next";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import { Link, Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { removeSpacetoLowerCase } from '../../api/helper'
import Services from "../../api/api";
import { auth } from "../../service/firebase";
import MapmarList from "./MapmarList";
import GooglemarkerList from "./GooglemarkerList";
import Loader from '../loaders/loader.js';



function BottomSheets(props) {
  const { t } = props;
  const sheetRef = useRef(null);
  const abc = useRef(null);
  const [open, setOpen] = useState(false)
  const [blocking, setblocking] = useState(true)
  const [isExpanded, setExpanded] = React.useState(false);
  const [listopen, setListOpen] = useState(false)




  useEffect(() => {
    console.log(sheetRef)
    console.log(isExpanded)
    if (sheetRef && sheetRef.current) {
      requestAnimationFrame(() =>
        sheetRef.current.snapTo(({ height }) => height)
      );
    }
  }, [isExpanded]);


  // Ensure it animates in when loaded
  useEffect(() => {
    setOpen(props.open)
    setTimeout(() => { setListOpen(true) }, 1000)
  }, [props.open])

  function onDismiss() {
    setOpen(false)
    setListOpen(false)
    props.onDismiss()
  }


  function updatebottomsheet(flag) {
    setblocking(flag)
  }

  return (
    <div className="App">
      <BottomSheet
      className="mapbottomsheet"
        open={open}
        onDismiss={onDismiss}
        ref={sheetRef}
        blocking={blocking}
        defaultSnap={({ maxHeight }) => maxHeight / 1}
        snapPoints={({ maxHeight }) => [
          maxHeight - maxHeight / 10,
          maxHeight / 4,
          maxHeight * 0.6,
        ]}
      >
        {props.markerText == "imonitor" ? (
          <>
            {
              listopen ? (<MapmarList
                userposition={props.position}
                markerType={props.markerType}
                markerList={props.markerList}
                uuid={localStorage.getItem("CommunityId")}
              ></MapmarList> ) :(<Loader isLoading={true} />)
            }
          </>
        ) : (
          <GooglemarkerList
            userposition={props.position}
            markerList={props.markerList}
            uuid={localStorage.getItem("CommunityId")}
          ></GooglemarkerList>
        )}
      </BottomSheet>
    </div>
  );
}


const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    communityuid: storeState.communityId,
    langId: storeState.langId,
    componentbgcolor: storeState.componentbgcolor
  };
};



const transBottomSheets = withTranslation()(BottomSheets);
export default connect(mapStateToProps, {})(transBottomSheets);