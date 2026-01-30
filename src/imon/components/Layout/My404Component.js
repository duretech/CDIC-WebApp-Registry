import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import { withTranslation, Trans } from "react-i18next";

class My404Component extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
		}
	}

	render() {
		const { t } = this.props;
		return (
			<div className="homemenu-page">
				<div>
					<Grid container spacing={3} className="gridcontainer">
						<Grid item xs={12} className="zero">
							<div className="padding10">{t('Page not found')}</div>
						</Grid>
					</Grid>
				</div>
			</div>

		);
	}
}


const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    communityuid: storeState.communityId,
    langId: storeState.langId,
    componentbgcolor: storeState.componentbgcolor
  };
};

const withRouterheader = withRouter(withTranslation()(My404Component));
export default connect(mapStateToProps, {})(withRouterheader);