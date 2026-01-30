import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { setLangID } from '../../redux/actions/appActions'

// Inspired by the former Facebook spinners.
const useStylesFacebook = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  top: {
    color: '#1a90ff',
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  progresstext: {
    fontSize: '14px',
  },
  circle: {
    strokeLinecap: 'round',
  },
}));

function CircularProgressWithLabel(props) {
  const classes = useStylesFacebook();
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="static"
        color="#0a8182"
        className={classes.bottom}
        size={50}
        thickness={4}
        {...props}
        value={100} {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="" className={classes.progresstext} component="div" color="">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}


CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and static variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};




function CircularStatic(props) {
  console.log(props)
  // let [progress, setProgress] = React.useState(props.onBoardPer);
  // console.log(progress)
  // React.useEffect(() => {
   
  // }, []);
  return <CircularProgressWithLabel value={props.onBoardPer} />;
}


const mapStateToProps = state => {
  let { storeState } = state;
  console.log(storeState)
  return {
    communityuid: storeState.communityId,
    langId: storeState.langId,
    onBoardPer: storeState.onBoardPer,
  };
}

export default connect(mapStateToProps)(CircularStatic)