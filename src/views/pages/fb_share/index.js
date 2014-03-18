import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Helmet} from "react-helmet";

import {
    logo,
} from '../../../assets/images';
import './style.css';


class FBShare extends Component {
	generateImageSrc(){
		const { params } = this.props.match;
		if(!params){ return ""; }
		let src='https://s3.amazonaws.com/accelerlist-media-share/';
		src = src + params.user_id + '/';
		src = src + params.image_id;
		return src;
	}

    render() {
        return (
			<div className="view">
				<Helmet>
					<meta
						property="og:image"
						content={this.generateImageSrc()}
					/>
				</Helmet>
                <form className="main-form" onSubmit={this.handleSubmit}>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="logo"><img src={logo} alt="logo" /></div>
								<br />
								<img
									alt="FB Shared"
									src={this.generateImageSrc()}
								/>
                            </div>
                        </div>
                        <div className="copyright">
                            2018 Copyright <span>AccelerList</span>.
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
export default connect(
    state => ({
    }),
	{
	}
)(FBShare)
