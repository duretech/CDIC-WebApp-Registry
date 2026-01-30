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
import Services from "../../api/api";
import * as _ from "lodash";

function Selfscreenchild(props) {
    const location = useLocation();
    const history = useHistory();
    const { t } = useTranslation()
    const [currentID,setCurrentID] = useState('')
    const [topics,Settopics] = useState('')

    useEffect(() => {
        Settopics(props.childs)
        // getApiData(props.id)
    }, [])

    function getApiData(id){
        let params = {
            communityId: localStorage.getItem("CommunityId"),
            contentId: id,
            languageId: localStorage.getItem("langId"),
            roleId: JSON.parse(localStorage.getItem("obj")).roleId,
            userId: JSON.parse(localStorage.getItem("obj")).userId,
          };
          Services.getRoleWiseContent(params).then((res) => {
            try {
              if (res.data.status == 200) {
                
                console.log(res.data.data.childs)
                Settopics(res.data.data.childs)
                
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

    function loadTopics(t){
        var htmlDoc = "";
        if (t.contentList && t.contentList.length !== 0) {
          if (t.contentList[0].description) {
            htmlDoc = t.contentList[0].description;
          } else if (t.contentList[0].shortDesc) {
            htmlDoc = t.contentList[0].shortDesc;
          }
        }
        return (
            <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography >{t.contentName}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          
            <div className="gklistdetails-root">     
                <div className='gkdiv' dangerouslySetInnerHTML={{ __html: htmlDoc }} />
            </div>
            <div className="knowledge-accordian-row">
                  {t.haschild && <Selfscreenchild id={t.contentId} childs={t.childContents}/>}
            </div> 
          </Typography>
        </AccordionDetails>
      </Accordion>
        )
    }

    function renderTopics(){
        if(topics){

            return topics.map((t)=>{
                return loadTopics(t)
            })
        }
    }

    return(
        <div>
        {
            renderTopics()
        }
        
        </div>
    )
}

export default Selfscreenchild