import React, { Component } from 'react';
import PropTypes from 'prop-types';

class WistiaEmbed extends Component {
  constructor(props) {
    super(props);
    const { hashedId, aspectRatio, ...embedOptions } = { ...this.props }
    window._wq = window._wq || [];
    window._wq.push({
      id: hashedId,
      options: embedOptions,
      onHasData: (video) => {
        this.handle = video;
      }
    });
  }

  render() {
    return (
      <div className="wistia_responsive_padding" style={{padding: `${this.props.aspectRatio ? this.props.aspectRatio : "56"}% 0 0 0`, position: 'relative'}}>
        <div className="wistia_responsive_wrapper" style={{height: '100%', left: '0', position: 'absolute', top: '0', width: '100%'}}>
          <div className={`wistia_embed wistia_async_${this.props.hashedId} videoFoam=true`}style={{height: '100%', width: '100%'}}>&nbsp;</div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    if (!document.getElementById("wistia_script")) {
      var wistiaScript = document.createElement("script");
      wistiaScript.id = "wistia_script"
      wistiaScript.type = "text/javascript"
      wistiaScript.src = "https://fast.wistia.com/assets/external/E-v1.js"
      wistiaScript.async = true
      document.body.appendChild(wistiaScript);
    }

  }

  componentWillUnmount() {
    this.handle && this.handle.remove();
  }
}

WistiaEmbed.propTypes = {
  hashedId: PropTypes.string.isRequired,
  aspectRatio: PropTypes.number
};

export default WistiaEmbed
