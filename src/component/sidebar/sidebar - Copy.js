import React,{Component} from 'react';
import logo from '../../assets/images/logo.svg';
import DashBoardRoutes from '../../routes/dashboardroutes';
import MenuItem from './menuitem';

class SideBar extends Component{

	constructor(props){
		super(props);
		this.aMenuLinks = DashBoardRoutes.map((prop,key) => {
			if(!prop.redirect){
				return(
					<MenuItem 
						key = {key}
						routes = {prop}
					/>
				);
			}
			return null;
		});	
	}

	render(){
		return(
			<div className='sidebar'>
				<div className='sidebar-background'></div>
				<div className="logo">
					<img src={logo} alt='logo' />
					<a href='https://web.imonitorplus.com' className='logo-text'>
						Imonitir Pro
					</a>
				</div>
				<div className="sidebar-wrapper">
					<ul className="nav">
	        			{this.aMenuLinks}
	        		</ul>	
				</div>
			</div>
		);
	}
}

export default SideBar;