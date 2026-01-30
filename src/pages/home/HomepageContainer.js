// import React, { useEffect } from 'react'
// import NewHomePage from "../home/NewThemeHomePage";
// import MobileHomePage from '../home/MobileHomePage';

// const HomepageContainer = () => {
//   if(window.document.body.clientWidth < 800 || window.cordova) {
//     return <NewHomePage/>
//   }
//   return <NewHomePage/>
// }

// export default HomepageContainer;

import React, { useEffect, useState } from 'react';
import NewHomePage from "../home/NewThemeHomePage";
import DropHomePage from "../home/NewThemeHomePageDrop";
import MobileHomePage from '../home/MobileHomePage';
import OfflineDb from "../../db";

const HomepageContainer = () => {
  const [component, setComponent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
     const storedRoles = sessionStorage.getItem("userRoles");
     const isDrop = storedRoles?.split(",").includes("DROP-HCP");
      console.log("isDrop",isDrop)

      const isMobile = window.document.body.clientWidth < 800 || window.cordova;

      if (isMobile) {
        setComponent(isDrop ? <DropHomePage /> : <NewHomePage />);
      } else {
        setComponent(isDrop ? <DropHomePage /> : <NewHomePage />);
      }
    };

    fetchData();
  }, []);

  return component || <div>Loading...</div>; // Show loading while waiting
};

export default HomepageContainer;
