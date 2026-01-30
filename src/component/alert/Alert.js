import React, {Component} from 'react';
import { connect } from "react-redux";

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';

import CloseIcon from '@material-ui/icons/Close';

import '../../assets/css/formStyle.css'

  import {
    AlertComponent
} from '../../redux/actions/action';

class Alert extends Component {
    constructor(props){
        super(props);
        this.state = {
          
        }
        
        this.closeAlert = this.closeAlert.bind(this)
    }
    closeAlert = () => {
        this.props.AlertComponent(true)
      }
    render() {
        let alertMessage = this.props.alertMessage
        let alertStructure = 
        <div className="modaloverlay">
    <div className="modalcardholder">
        <Card className="modalcard">
    <CardHeader
      className="modalheader"
        action={
          <IconButton aria-label="close">
            <CloseIcon />
          </IconButton>
        }
        title=""
      />
      <CardContent>
        <Typography className="modaltext" gutterBottom>
        {alertMessage} 
        </Typography>
      </CardContent>
      <CardActions className="modalfooter">
        <Button className="modalactionbtn" onClick={() => this.closeAlert()}>Ok</Button>
      </CardActions>
    </Card>
    </div>
    </div>
        
        
        
        return alertStructure
    }
}
export default connect(null, {AlertComponent})(Alert);
