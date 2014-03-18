import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, } from "reactstrap";
import { openInNewTab, openInNewTabExtended } from "../../../../../helpers/utility";
import { ebayLogo } from "../../../../../assets/images";
import { amazonLogoCorssed } from "../../../../../assets/images";
import IconAdd from "react-icons/lib/md/add-circle";
import CreateCustomResearchButton from '../../batchModals/CreateCustomResearchButton.js';

class PriceTrackersButtonGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalCustomOpen: false,
      customVisible: true
    };
  }

	UNSAFE_componentWillMount(){
		const {
			ASIN,
			amazonUrl,
			camelCamelCamelBaseUrl,
			eBayUrl,
			itemName,
			amazonSellerCentralUrl,
			auto_show_amazon,
			auto_show_ebay,
		} = this.props;
		const camelUrl = "https://" + (camelCamelCamelBaseUrl || "camelcamelcamel.com") + "/product/" + ASIN;
		const primeUrl = "https://" + (amazonUrl || "www.amazon.com") + "/gp/offer-listing/" + ASIN + "/ref=olp_fsf?ie=UTF8&f_primeEligible=true";
		// &LH_Complete=1 - Completed Listings
		// &_sop=3 - sort Price: Highest First
		const eBaySearchUrl = `https://${(eBayUrl || "www.ebay.com")}/sch/?_nkw=${encodeURIComponent(itemName || ASIN).replace(/%20/g,'+')}&LH_Complete=1&_sop=3`;
		const amazonPrimeUrl = "https://" + (amazonSellerCentralUrl || "sellercentral.amazon.com") + "/productsearch/";
		this.setState({
			camelUrl: camelUrl,
			primeUrl: primeUrl,
			eBaySearchUrl: eBaySearchUrl,
			amazonPrimeUrl: amazonPrimeUrl,
		});

		if(auto_show_amazon){
			openInNewTabExtended(primeUrl, 'amazonPrime');
		}
		if(auto_show_ebay){
			openInNewTabExtended(eBaySearchUrl, 'ebaySearch');
		}
  }

  toggleModalCustom = () => {
    this.setState({
      modalCustomOpen: !this.state.modalCustomOpen
    })
  }

	render(){
    const {
      rootClassName,
	  userData,
    } = this.props;

    return (
      <div className={rootClassName || ""}>
		  {/*
        <a href="#a" onClick={openInNewTab.bind(null, this.state.keepaUrl)}>
          <Button className="btn-price-tracker" size="sm">
            <img
              src="https://cdn.keepa.com/img/i192.png"
              width="15"
              alt="Keepa" />
          </Button>
		</a>
			*/}
        <a href="#a" onClick={openInNewTab.bind(null, this.state.camelUrl)}>
          <Button className="btn-price-tracker" size="sm">
            <img
              src="https://d1i0o2gnhzh6dj.cloudfront.net/favicon.ico"
              width="15"
              alt="CamelCamelCamel" />
          </Button>
        </a>
        <a href="#a" onClick={openInNewTab.bind(null, this.state.primeUrl)}>
          <Button className="btn-price-tracker" size="sm" style={{paddingLeft: "2.5px", paddingRight: "2.5px"}}>
            <img
              src="https://images-na.ssl-images-amazon.com/images/G/01/ember/merchant/marketing/microsite/a-smile_favicon_223x137._V298484321_.png"
              alt="Amazon"
              width="25.5" />
          </Button>
        </a>
        <a href="#a" onClick={openInNewTab.bind(null, this.state.eBaySearchUrl)}>
          <Button
            className="btn-price-tracker"
            size="sm">
            <img
              src={ebayLogo}
              alt="ebayLogo"
              width="25" />
          </Button>
        </a>
        <a href="#a" onClick={openInNewTab.bind(null, this.state.amazonPrimeUrl)}>
          <Button
            className="btn-price-tracker"
            size="sm">
            <img
              src={amazonLogoCorssed}
              alt="amazonPrime"
              width="25" />
          </Button>
        </a>
		{userData && userData.settings['custom_research_buttons'] ?
		(JSON.parse(userData.settings["custom_research_buttons"]).map((rb, index) => {
			if(rb.visible){
				return (
					<a href="#a" onClick={openInNewTab.bind(null, rb.url.replace("{ASIN}", this.props.ASIN))}>
					  <Button
						className="btn-price-tracker"
						size="sm"><b>{rb.text}</b>
					  </Button>
					</a>
				)
			} else {
				return null;
			}
		})) : (null)}
        <Button color="link" onClick={this.toggleModalCustom}>
          <IconAdd size="18" />
        </Button>
		<CreateCustomResearchButton
			isOpen={this.state.modalCustomOpen}
			toggle={this.toggleModalCustom}
			newOpen={true}
		/>
      </div>
    )
	}
}

PriceTrackersButtonGroup.defaultProps = {
  ASIN: ""
}

PriceTrackersButtonGroup.propTypes = {
  ASIN: PropTypes.string.isRequired,
  itemName: PropTypes.string,
  rootClassName: PropTypes.string,
  amazonUrl: PropTypes.string,
  eBayUrll: PropTypes.string,
  camelCamelCamelBaseUrl: PropTypes.string,
}

export default connect(
  state => ({
    userData: state.Auth.get("userData")
  }),
  {
  }
)(PriceTrackersButtonGroup);
