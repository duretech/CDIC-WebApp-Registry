import React,{Component} from 'react';


class Loader extends Component{
	
	render(){
		if(this.props.isLoading){
			return(
				<div className='loading'>
					
				</div>
			);
		}
		return null;
	}
}

export default Loader;