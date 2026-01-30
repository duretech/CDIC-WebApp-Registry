import React, { useState, useEffect } from 'react'
import { apiServices } from '../../../services/apiServices'
import Grid from '@material-ui/core/Grid';
import swal from 'sweetalert'
import OfflineDb from '../../../db'
import { useGlobalSpinnerActionsContext } from '../../../context/GlobalSpinnerContext'
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from "react-router-dom";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { useHistory } from "react-router";
import Typography from '@material-ui/core/Typography';
import imgUrl from "../../assets/images/imageUrl";
import Iframe from 'react-iframe'
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//Desktop screen css
import '../../assets/css/customdesktop.css';
import Services from "../../api/api";
import Selfscreenchild from './selfscreenchild'
import SearchBar from "material-ui-search-bar";

import FooterMenu from '../../../component/layout/FooterMenu'
import Loader from "../loaders/loader";
import * as _ from "lodash";
import Feedback from '../Feedback';
import { gaLogEvent, gaLogScreen } from "../../helpers/analytics";

function Selfscreen(props) {
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation()
  const [currentID, setCurrentID] = useState('')
  var [topics, Settopics] = useState('')
  var [ogtopics,Setogtopics] = useState('')
  var [searchtext,setSearchText] = useState('')
  const [isLoading,setLoading] = useState(false)
  useEffect(() => {
    gaLogEvent("Omnibus guidelines", '', '');
    gaLogScreen("Omnibus guidelines");
    var infocontent = JSON.parse(localStorage.getItem("menuList")).filter(obj => obj.path == "information")
    console.log(infocontent)
    infocontent[0].childs.map((i) => {
      console.log(i)
      if (i.name == 'Omni bus Guidelines') {
        setCurrentID(i.componentId)
        getApiData(i.componentId)
      }
    })
  }, [])

  function getApiData(id) {
    setLoading(true)
    let params = {
      communityId: localStorage.getItem("CommunityId"),
      contentId: id,
      languageId: localStorage.getItem("langId"),
    };
    Services.getContentHierearchy(params).then((res) => {
      try {
        if (res.data.status == 200) {

          console.log(res.data.data.childContents)
          Settopics(res.data.data.childContents)
          Setogtopics(res.data.data.childContents)
          setLoading(false)
        }
      } catch (err) {
        console.log("err::", err)

        var errorObj = {
          component: 'NewKnowledge',
          method: 'getKnowledgeableApiDetail',
          error: err
        }
      }
    });

  }

  function loadTopics(t) {
    var htmlDoc = "";
    if (t.contentList && t.contentList.length !== 0) {
      if (t.contentList[0].description) {
        htmlDoc = t.contentList[0].description;
      } else if (t.contentList[0].shortDesc) {
        htmlDoc = t.contentList[0].shortDesc;
      }
    }
    return (
      <Accordion className='selfscreenacc'>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className='selftitle oneuhcfont'>{t.contentName}</Typography>
        </AccordionSummary>
        <AccordionDetails className='selfacc'>
          <Typography>

            <div className="gklistdetails-root">
              <div className='gkdiv' dangerouslySetInnerHTML={{ __html: htmlDoc }} />
            </div>
            <div className="knowledge-accordian-row">
              {/* {t.hasChild && <Selfscreenchild id={t.contentId} searchtext={searchtext?searchtext:''} searchresult={searchresult}/>} */}
              {t.haschild && <Selfscreenchild id={t.contentId} childs={t.childContents} />}

            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    )
  }

  function handleBack() {
    window.history.back();
  }

  function searchresult(e){
    Settopics(e)
  }

  function handleOnSearch(e){
    let topicList = _.cloneDeep(topics);
    console.log("e1",topicList)
    let filtered = [];
    // setLoading(true)
    if (e.length == 0) {
      Settopics(ogtopics)
      // setLoading(false)
    }
    else {
      // var newtopics = ''
      // newtopics =  topicList.filter((f) => {
      //   console.log("e",e,f)
      //   var lf=f.contentName.toLowerCase()
      //   if (lf.includes(e.toLowerCase())) {
      //     return f
      //   }        
      // }) 
      // if(newtopics != ''){
      //   Settopics(newtopics)
      // }
      // else{
      //   setSearchText(e)
      // }
      // setLoading(false)
      var topicarr=[];
      var t=recursearch(topicList,e)
      topicarr.push(t)
      console.log("search",topicarr)
      Settopics(topicarr[0])
    }

  }

  function recursearch(paramt,e){
      var childt=[];   
      // console.log("parents",paramt,e)
      paramt.map((t)=>{
        // console.log("data",t.contentName.toLowerCase(),e.toLowerCase())
        if(t.contentName.toLowerCase().includes(e.toLowerCase())){
          childt.push(t)
        }else if(!t.contentName.toLowerCase().includes(e.toLowerCase()) && t.childContents!=null){
          // console.log("child",t)
          var newchild=recursearch(t.childContents,e)
          if(newchild.length>0){
            newchild.map((n)=>{
              childt.push(n)
            })
          }
        }
      })
      return childt
  }
  function cancelSearch(e) {
    Settopics(ogtopics)
  }

  function renderTopics() {
    if (topics) {

      return topics.map((t) => {
        return loadTopics(t)
      })
    }
  }

  return (
    <div className={window.cordova ? "omnibusinnerpage" : 'omnibusinnerpage windowdesktop'}>
      <Grid container className="gridcontainer omnibusinnergrid">
        {(localStorage.getItem('userrole') == "Patient" || localStorage.getItem('userrole') == "GuestUser") &&
          <Grid container xs={12} className='certinav'>

            <Grid xs={3} className='backimg' onClick={() => handleBack()}><img src={imgUrl.whiteback} className='backsvg' /></Grid>
            <Grid xs={6}>
              <Typography variant='subtitle1' className='regname oneuhcfont'>Omnibus Guidelines</Typography>
            </Grid>
            <Grid xs={3}>
            <Typography variant='body2' className='stepname parafont'><Feedback></Feedback></Typography>
            </Grid>

          </Grid>}
        <Grid xs={12} className='omniimggrid'>
          <div className='omniimgdiv'>
            <img src={imgUrl.omiguide} className='omni' />
          </div>
        </Grid>
        <Grid xs={12} className="omnubusguidelinemain">
          <div>
            <SearchBar
              placeholder='Search'
              className="omni-searchbar"
              onChange={(e)=>handleOnSearch(e)}
              onCancelSearch={()=>cancelSearch()}
            />
          </div>
          {isLoading ? (
              <Loader isLoading={isLoading} />
            ) : (
            renderTopics()
            )
          }
        </Grid>

        {(localStorage.getItem('userrole') == "Patient" || localStorage.getItem('userrole') == "GuestUser") ? 
        <Grid container xs={12} className="homebottomnav">
        {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="home-svg"  onClick={()=>(!window.location.pathname.includes('imonhome')?history.push('/layout/imonhome'):'')}>
            <img src={imgUrl.homesvg} />
            <Typography variant="caption" display="block">
              Home
            </Typography>
          </Grid>:<Grid xs={4} className="home-svg" onClick={()=>(!window.location.pathname.includes('imonhome')?history.push('/layout/imonhome'):'')}>
            <img src={imgUrl.homesvg} />
            <Typography variant="caption" display="block">
              Home
            </Typography>
          </Grid>}
          {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="journey-svg" onClick={()=>(!window.location.pathname.includes('myjourney')?history.push('/myjourney'):'')}>
            <img src={imgUrl.journeysvg} />
            <Typography variant="caption" display="block">
              My Journey
            </Typography>
          </Grid>:''}
          {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="near-svg" onClick={()=>(!window.location.pathname.includes('nearme')?history.push('/layout/nearme'):'')}>
            <img src={imgUrl.nearsvg} />
            <Typography variant="caption" display="block">
              Near Me
            </Typography>
          </Grid>:<Grid xs={4} className="near-svg" onClick={()=>(!window.location.pathname.includes('nearme')?history.push('/layout/nearme'):'')}>
            <img src={imgUrl.nearsvg} />
            <Typography variant="caption" display="block">
              Near Me
            </Typography>
          </Grid>}
          {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="guide-svg" onClick={()=>(!window.location.pathname.includes('getknowledgeable')?history.push('/layout/getknowledgeable'):'')}>
            <img src={imgUrl.guidesvg} />
            <Typography variant="caption" display="block">
              Guide
            </Typography>
          </Grid>:<Grid xs={4} className="guide-svg" onClick={()=>(!window.location.pathname.includes('getknowledgeable')?history.push('/layout/getknowledgeable'):'')}>
            <img src={imgUrl.guidesvg} />
            <Typography variant="caption" display="block">
              Guide
            </Typography>
          </Grid>}
          {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="connect-svg" onClick={()=>(!window.location.pathname.includes('peerchat')?history.push('/layout/peerchat'):'')}>
            <img src={imgUrl.connectsvg} />
            <Typography variant="caption" display="block">
              Connect
            </Typography>
          </Grid>:''}
          {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="screen-svg" onClick={()=>(!window.location.pathname.includes('aisurvey')?history.push('/layout/AiSurvey'):'')}>
            <img src={imgUrl.screensvg} />
            <Typography variant="caption" display="block">
              Survey
            </Typography>
          </Grid>:""}
        </Grid>
        :
          <FooterMenu></FooterMenu>}
      </Grid>

    </div>
  )
}

export default Selfscreen