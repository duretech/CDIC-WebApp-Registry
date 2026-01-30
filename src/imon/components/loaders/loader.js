import React, { Component } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import RecLoader from "react-loader-spinner";
import { connect } from "react-redux";
class Loader extends Component {
  render() {
    const { templateID } = this.props;
      return (
        <div className="loading">
          <RecLoader visible={this.props.isLoading} type="ThreeDots" color={templateID == 2 ? this.props.componentbgcolor : '#000'} height={80} width={80} />
        </div>
      );
    }
    
  
}

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
    componentbgcolor: storeState.componentbgcolor
  };
};

export default connect(mapStateToProps, {})(Loader);
