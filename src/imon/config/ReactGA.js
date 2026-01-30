//import ReactGA from 'react-ga';
// import { Router, Route, Switch } from 'react-router-dom';
import TagManager from 'react-gtm-module'
const history = require('history').createBrowserHistory();

class ReactGAClass {

  mobileAppInit() {
    TagManager.initialize({ gtmId: 'GTM-W92S4VW' })
    //TagManager.initialize({gtmId: 'G-4LFZJS2BX9'})
    // ReactGA.initialize('G-4LFZJS2BX9', {
    //   debug: true,
    //   titleCase: false});
    // console.log(history)
    history.listen((location, action) => {
      //ReactGA.pageview(location.hash);

      //TagManager.initialize({gtmId: 'G-4LFZJS2BX9'})
      // console.log(location.hash)
      // window.dataLayer = window.dataLayer || [];
      // window.dataLayer.push({
      //   event: 'Pageview',
      //   pagePath: '/layout/survey',
      //   pageTitle: 'survey',
      // });

      var args = {
        dataLayer: {
          event: 'page_view',
          pagePath: '/layout/services',
          page_title: 'services',
        },
        dataLayerName: "PageDataLayer"
      };
      TagManager.dataLayer(args);
      //TagManager.initialize({ gtmId: 'GTM-W92S4VW' })
    });
  }

  webappInit() {
    history.listen((location, action) => {
      console.log(location)
      var title = location.hash.split('/')
      // window.gtag('config', 'G-4LFZJS2BX9', {
      //   'page_title': title[title.length -1],
      //   'page_path': location.hash
      // });
    });
  }
}


const ReactGAInst = new ReactGAClass();
export default ReactGAInst;