/* eslint-disable no-useless-escape */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import * as Scroll from "react-scroll";
import {
  Element
} from "react-scroll";

import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Footer from './footer';
import HeaderMenu from './header_menu'
import {
  prev,
  arrow,
  heroUnitImage,
  keyFeature1,
  boxContent,
  flagUs,
  flagCanada,
  flagUk,
  facebookGroup,
  people,
  box,
  leaves,
  analytics
} from "../../../assets/images";

import "./main.css";

import landingAction from "../../../redux/landing/actions";
const { bFrontItemListedCount } = landingAction;

let ScrollLink = Scroll.Link;

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputEmail: "",
    };
  }
  componentDidMount() {
	this.props.bFrontItemListedCount();
  }

  toggleMobileNav = () => {
    var element = document.getElementById("main-nav");
    element.classList.toggle("mobile-nav-active");
  };
  startNow = () => {
    let email = document.getElementById("start_email").value;

    // console.log(this.validateEmail(email));
    // if (this.validateEmail(email)) {
    this.props.history.push({
      pathname: "/register",
      state: { userEmail: email }
    });
    // } else {

    // }
  };
  onKeyPressInput = e => {
    let email = document.getElementById("start_email").value;

    if (e.key === "Enter") {
      this.props.history.push({
        pathname: "/register",
        state: { userEmail: email }
      });
    }
  };
  validateEmail = email => {
    var re = /^(([^<>()[\]\\.,;:\s@\x22]+(\.[^<>()[\]\\.,;:\s@\x22]+)*)|(\x22.+\x22))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  render() {
    console.log(JSON.stringify(prev));
    return (
      <div id="wrapper" className="landing">
        {/* -- header -- */}
        <header>
          <HeaderMenu toggleMobileNav={this.toggleMobileNav} />
          {/* -- hero unit --*/}
          <div className="hero-unit">
            <div className="container">
              <h2 className="hero-title">
                The <em>NEW</em> standard for Amazon product listing.
              </h2>
              <p className="hero-description">
                Leverage the fastest Amazon product listing software in the
                industry. We 10X your Amazon business. Talk to us in our private
                Facebook group and sell more product.
              </p>
              <form className="form-trial">
                <h3 className="title">
                  <img src={arrow} alt="" className="arrow" /> Start{" "}
                  <span className="white">FREE</span> two week trial
                </h3>
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    id="start_email"
                    placeholder="Enter your best email right here to get started..."
                    onKeyPress={this.onKeyPressInput}
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="btn"
                      onClick={this.startNow}
                    >
                      START NOW!
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="features">
              <div className="left">
                <ul className="feature-list">
                  <li>
                    <h4 className="feature-title">
                      Lightning <span role="img" aria-label="lightning">⚡️</span> fast listing
                    </h4>
                    <p className="feature-description">
                      We don’t slow down on large batches . List hundreds of
                      items in minutes.
                    </p>
                  </li>
                  <li>
                    <h4 className="feature-title">
                      Instant business reports <span role="img" aria-label="report">📊</span>
                    </h4>
                    <p className="feature-description">
                      Get the sales data you need when you need it.
                    </p>
                  </li>
                  <li>
                    <h4 className="feature-title">Free box content tool <span role="img" aria-label="box">📦</span></h4>
                    <p className="feature-description">
                      We don’t charge for box content and our solution is easy
                      to use
                    </p>
                  </li>
                </ul>
              </div>
              <div className="center">
                <img className="hero-img" src={heroUnitImage} alt="" />
              </div>
              <div className="right">
                <ul className="feature-list">
                  <li>
                    <h4 className="feature-title">Printer Magic <span role="img" aria-label="magic">🔮</span></h4>
                    <p className="feature-description">
                      We work with Dymo and Zebra printers. (Rollo and Brother
                      coming soon)
                    </p>
                  </li>
                  <li>
                    <h4 className="feature-title">
                      Split <span role="img" aria-label="No Problem">🤸</span> shipments no problem
                    </h4>
                    <p className="feature-description">
                      Handle them like an Olympic gymnast with our holding area
                      tech.
                    </p>
                  </li>
                  <li>
                    <h4 className="feature-title">Private Facebook Support</h4>
                    <p className="feature-description">
                      Talk and interact directly with the founders who are
                      sellers just like you.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <ScrollLink
              activeClass="active"
              to="metricCta"
              spy={true}
              smooth={true}
              offset={50}
              duration={500}
              className="scroll-link"
            >
              <a href="#metric-cta" className="arrow-down">
                <svg
                  width="21px"
                  height="20px"
                  viewBox="20 20 21 20"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M39.7072568,31.1125846 C40.0975811,30.7212471 40.0975811,30.0877006 39.7072568,29.697364 C39.3169326,29.3060264 38.6850266,29.3060264 38.2957006,29.697364 L31.8578462,36.1429233 C31.5433906,36.4581952 30.9983342,36.2350027 30.9983342,35.7896185 L30.9983342,20.9838486 C30.9983342,20.4313721 30.5590946,20 30.0080486,20 L30.0040555,20 C29.4530095,20 29.0017907,20.4313721 29.0017907,20.9838486 L29.0017907,35.7896185 C29.0017907,36.2350027 28.4717084,36.4581952 28.1572528,36.1429233 L21.7004312,29.6663372 C21.3111053,29.2749997 20.6811958,29.2749997 20.2908715,29.6663372 L20.2918698,29.6663372 C19.9025438,30.0566739 19.9025438,30.6902203 20.2928681,31.0815578 L28.6034803,39.4137444 L28.6034803,39.4137444 C29.3831305,40.1954185 30.6479408,40.1954185 31.427591,39.4137444 C31.6072799,39.2325881 39.887944,30.9314284 39.7072568,31.1125846"
                    id="arrow_down-[#360]"
                    stroke="none"
                    fill="#64CB31"
                    fill-rule="evenodd"
                  />
                </svg>
              </a>
            </ScrollLink>
          </div>
          {/*-- end hero unit --*/}
          <svg
            className="bg-line-chart"
            width="1383px"
            height="564px"
            viewBox="0 0 1383 564"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient x1="50%" y1="45.3414243%" x2="50%" y2="100%" id="linearGradient-1">
                <stop stopColor="#FFFFFF" stopOpacity="0.2" offset="0%"></stop>
                <stop stopColor="#FFFFFF" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
            </defs>
            <g
              id="Homepage"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              <g
                id="Homepage-2.0"
                transform="translate(-34.000000, -235.000000)"
              >
                <g id="hero-unit">
                  <g id="hero-unit-bg">
                    <g
                      id="line-chart"
                      transform="translate(36.000000, 241.000000)"
                    >
                      <polygon
                        id="Line-Area"
                        fill="url(#linearGradient-1)"
                        points="0.574074074 557.37218 113.981481 504.590226 197.074074 429.894737 304.259259 397.278195 425 381 519 319 634 299 722 235 848 263 942 153 1063 172 1157 108 1273 87 1371 6 1371 556"
                      />
                      <polyline
                        id="Line"
                        stroke="#FFFFFF"
                        stroke-width="3"
                        stroke-linecap="square"
                        opacity="0.25"
                        points="0.574074074 555.37218 113.981481 502.590226 197.074074 427.894737 304.259259 395.278195 425 379 519 317 634 297 722 233 848 261 942 151 1063 170 1157 106 1273 85 1371 4"
                      />
                      <g
                        className="chart-point"
                        transform="translate(108.814815, 495.684211)"
                        stroke="#FFFFFF"
                        stroke-opacity="0.2"
                        stroke-width="12"
                        fill="#1C384A"
                        fill-opacity="0.8"
                      >
                        <ellipse
                          id="Oval-Copy-5"
                          cx="6.25925926"
                          cy="6.27819549"
                          rx="5.74074074"
                          ry="6.27819549"
                        />
                      </g>
                      <g
                        className="chart-point"
                        transform="translate(194.185185, 420.360902)"
                        stroke="#FFFFFF"
                        stroke-opacity="0.2"
                        stroke-width="12"
                        fill="#1C384A"
                        fill-opacity="0.8"
                      >
                        <ellipse
                          id="Oval-Copy-5"
                          cx="6.25925926"
                          cy="6.27819549"
                          rx="5.74074074"
                          ry="6.27819549"
                        />
                      </g>
                      <g
                        className="chart-point"
                        transform="translate(299.518519, 389.000000)"
                        stroke="#FFFFFF"
                        stroke-opacity="0.2"
                        stroke-width="12"
                        fill="#1C384A"
                        fill-opacity="0.8"
                      >
                        <ellipse
                          id="Oval-Copy-5"
                          cx="6.25925926"
                          cy="6.27819549"
                          rx="5.74074074"
                          ry="6.27819549"
                        />
                      </g>
                      <g
                        className="chart-point"
                        transform="translate(418.518519, 373.000000)"
                        stroke="#FFFFFF"
                        stroke-opacity="0.2"
                        stroke-width="12"
                        fill="#1C384A"
                        fill-opacity="0.8"
                      >
                        <ellipse
                          id="Oval-Copy-5"
                          cx="6.25925926"
                          cy="6.27819549"
                          rx="5.74074074"
                          ry="6.27819549"
                        />
                      </g>
                      <g
                        className="chart-point"
                        transform="translate(512.518519, 310.000000)"
                        stroke="#FFFFFF"
                        stroke-opacity="0.2"
                        stroke-width="12"
                        fill="#1C384A"
                        fill-opacity="0.8"
                      >
                        <ellipse
                          id="Oval-Copy-5"
                          cx="6.25925926"
                          cy="6.27819549"
                          rx="5.74074074"
                          ry="6.27819549"
                        />
                      </g>
                      <g
                        className="chart-point"
                        transform="translate(629.000000, 290.000000)"
                        stroke="#FFFFFF"
                        stroke-opacity="0.2"
                        stroke-width="12"
                        fill="#1C384A"
                        fill-opacity="0.8"
                      >
                        <ellipse
                          id="Oval-Copy-5"
                          cx="6.25925926"
                          cy="6.27819549"
                          rx="5.74074074"
                          ry="6.27819549"
                        />
                      </g>
                      <g
                        className="chart-point"
                        transform="translate(716.000000, 227.000000)"
                        stroke="#FFFFFF"
                        stroke-opacity="0.2"
                        stroke-width="12"
                        fill="#1C384A"
                        fill-opacity="0.8"
                      >
                        <ellipse
                          id="Oval-Copy-5"
                          cx="6.25925926"
                          cy="6.27819549"
                          rx="5.74074074"
                          ry="6.27819549"
                        />
                      </g>
                      <g
                        className="chart-point"
                        transform="translate(841.000000, 254.000000)"
                        stroke="#FFFFFF"
                        stroke-opacity="0.2"
                        stroke-width="12"
                        fill="#1C384A"
                        fill-opacity="0.8"
                      >
                        <ellipse
                          id="Oval-Copy-5"
                          cx="6.25925926"
                          cy="6.27819549"
                          rx="5.74074074"
                          ry="6.27819549"
                        />
                      </g>
                      <g
                        className="chart-point"
                        transform="translate(936.000000, 145.000000)"
                        stroke="#FFFFFF"
                        stroke-opacity="0.2"
                        stroke-width="12"
                        fill="#1C384A"
                        fill-opacity="0.8"
                      >
                        <ellipse
                          id="Oval-Copy-5"
                          cx="6.25925926"
                          cy="6.27819549"
                          rx="5.74074074"
                          ry="6.27819549"
                        />
                      </g>
                      <g
                        className="chart-point"
                        transform="translate(1056.000000, 163.000000)"
                        stroke="#FFFFFF"
                        stroke-opacity="0.2"
                        stroke-width="12"
                        fill="#1C384A"
                        fill-opacity="0.8"
                      >
                        <ellipse
                          id="Oval-Copy-5"
                          cx="6.25925926"
                          cy="6.27819549"
                          rx="5.74074074"
                          ry="6.27819549"
                        />
                      </g>
                      <g
                        className="chart-point"
                        transform="translate(1151.000000, 101.000000)"
                        stroke="#FFFFFF"
                        stroke-opacity="0.2"
                        stroke-width="12"
                        fill="#1C384A"
                        fill-opacity="0.8"
                      >
                        <ellipse
                          id="Oval-Copy-5"
                          cx="6.25925926"
                          cy="6.27819549"
                          rx="5.74074074"
                          ry="6.27819549"
                        />
                      </g>
                      <g
                        className="chart-point"
                        transform="translate(1266.000000, 78.000000)"
                        stroke="#FFFFFF"
                        stroke-opacity="0.2"
                        stroke-width="12"
                        fill="#1C384A"
                        fill-opacity="0.8"
                      >
                        <ellipse
                          id="Oval-Copy-5"
                          cx="6.25925926"
                          cy="6.27819549"
                          rx="5.74074074"
                          ry="6.27819549"
                        />
                      </g>
                      <g
                        className="chart-point"
                        transform="translate(1363.000000, 0.000000)"
                        stroke="#FFFFFF"
                        stroke-opacity="0.2"
                        stroke-width="12"
                        fill="#1C384A"
                        fill-opacity="0.8"
                      >
                        <ellipse
                          id="Oval-Copy-5"
                          cx="6.25925926"
                          cy="6.27819549"
                          rx="5.74074074"
                          ry="6.27819549"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </header>
        {/* -- end header --*/}
        {/*-- main -- */}
        <div className="main">
          <div className="container">
            {/* -- metric cta --*/}
            <Element name="metricCta" className="element">
              <section className="metric-cta" id="metric-cta">
                <h3 className="title">
                  <span className="number">
                    <CountUp end={this.props.item_count} duration={5} separator="," />
                  </span>{" "}
                  <span className="subtitle">
                    Items Listed on Amazon Using AccelerList
                  </span>
                </h3>
                <Link to="/register" className="btn btn-cta">
                  TRY IT FOR FREE
                </Link>
              </section>
            </Element>
            {/* -- metric cta --*/}
            {/* -- key feature --*/}
            <section className="key-feature">
              <div className="text">
                <h3 className="feature-title">
                Fresh <img
                  src={leaves}
                  alt="leaves_pic"
                  style={{ width: "40px", marginBottom: "15px" }}
                /> data
                </h3>
                <p className="feature-description">
					The latest Amazon pricing from their API along other data points and research options
                </p>
                <ul className="feature-detail-list">
                  <li>Auto set ROI minimum prices to keep profit</li>
                  <li>Know which price has the Buy Box</li>
                  <li>Amazon on the listing? We let you know...</li>
                </ul>
                <Link to="/register" className="btn btn-cta">
                  TRY IT FOR FREE
                </Link>
              </div>
              <div className="media">
                <img src={keyFeature1} alt="" />
              </div>
            </section>
            {/* -- end key feature --*/}
            {/* -- key feature left --*/}
            <section className="key-feature left-media">
              <div className="text">
                <h3 className="feature-title">
                  <img
                    src={box}
                    alt="box_pic"
                    style={{ width: "40px", marginRight: "15px" }}
                  />
                  Box Content simple
                </h3>
                <p className="feature-description">
                  {`We make Amazon\'s box content look easy.
                  You won\'t ever worry about 2D barcodes or
                  manifests again with our free solution.`}
                </p>
                <ul className="feature-detail-list">
                  <li>{`Create 2D barcodes for huge shipment plans`}</li>
                  <li>We auto sync your shipments for ease of use</li>
                  <li>
                    Feeling roboty <span role="img" aria-label="lightning">🤖</span> ? Send contents with our API
                    menthod and save the labels
                  </li>
                </ul>
                <Link to="/register" className="btn btn-cta">
                  TRY IT FOR FREE
                </Link>
              </div>
              <div className="media">
                <img src={boxContent} alt="" />
              </div>
            </section>
            {/* -- end key feature left --*/}
            {/* -- key feature --*/}
            <section className="key-feature">
              <div className="text">
                <h3 className="feature-title">
                  Profit
                  <img
                    src={analytics}
                    alt="analytics_pic"
                    style={{ width: "30px", margin: "15px", marginTop: "0px" }}
                  />
                  analytics to go
                </h3>
                <p className="feature-description">
                  Upload your confusing Amazon sales reports
                  and automagically <span role="img" aria-label="lightning">✨</span> have clarity.
                </p>
                <ul className="feature-detail-list">
                  <li>Profit and Loss reports that make sense</li>
                  <li>One page income statement your CPA needs</li>
                  <li>{`Analytics you\'re business needs for free`}</li>
                </ul>
                <Link to="/register" className="btn btn-cta">
                  TRY IT FOR FREE
                </Link>
              </div>
              <div className="media">
                <img src={keyFeature1} alt="" />
              </div>
            </section>
            {/*-- end key feature --*/}
            {/*-- support marketplace --*/}
            <section className="center">
              <h3 className="section-title">
                and AccelerList supports many marketplaces
              </h3>
              <p className="section-subtitle">
                Get country-specific Amazon product sales data in markets
                including USA, Canada and United Kingdom
              </p>
              <div className="flags">
                <img src={flagUs} alt="United States" />
                <img src={flagCanada} alt="Canada" />
                <img src={flagUk} alt="United Kingdom" />
              </div>
            </section>
            {/*-- end support marketplace --*/}
            {/*-- facebook group --*/}
            <section className="center">
              <h3 className="section-title">
                Access our private Facebook Group for support. We love our
                community and don’t mind talking to you.
              </h3>
              <img src={facebookGroup} className="img-fluid" alt="" />
            </section>
            {/*-- end of facbook group --*/}

            {/*-- our customers --*/}
            <section className="center">
              <h3 className="section-title">
                We love our customers and they love us too
              </h3>
              <img src={people} className="img-fluid" alt="" />
            </section>
            {/*-- end our customers --*/}

            {/*-- pricing table --*/}
            <section className="center" id="pricing_table">
              <h3 className="section-title">Try web app pricing plan</h3>
              <p className="section-subtitle">Try FREE for 2 weeks</p>
              <div className="pricing-table mt-4">
                {/*-- pricing table left --*/}
                <div className="pricing-box">
                  <h4 className="pricing-title">Monthly</h4>
                  <p className="banner">14 Days FREE Trial</p>
                  <ul className="feature-list">
                    <li>List items onto the Amazon marketplace as merchant fulfilled or FBA</li>
                    <li>Kickass customer support. Talk and interact with the founders in our private Facebook group.</li>
                    <li>Join a growing community of Amazon sellers making thousands of dollars.</li>
                    <li>List products faster than any other Amazon listing application out there</li>
                  </ul>
                  <div className="pricing-footer">
                    <a href="/register/monthly" className="btn btn-cta">
                      <span className="currency">$</span>
                      34
                      <span className="period"> / month</span>
                    </a>
                  </div>
                </div>
                {/*-- end pricing table left --*/}
                {/*-- pricing table right --*/}
                <div className="pricing-box recommended">
                  <p className="advantage"><span>Steal two months from us!</span>
                    <svg
                      width="75px"
                      height="74px"
                      viewBox="44 52 75 74"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M69.3256597,100.966123 C69.3480233,101.325379 69.3725394,101.686539 69.4043701,102.045602 C69.2250554,101.809528 69.0464516,101.57199 68.8721329,101.331963 C69.0090096,101.237233 69.1387061,101.138258 69.2591006,101.029341 C69.2826266,101.006202 69.3041492,100.986161 69.3256597,100.966123 Z M78.4621626,73.4982954 C72.0927091,79.6585082 68.0509318,87.1548825 66.0355969,94.6489486 C64.8414358,99.0906388 64.3440152,103.591031 64.5350524,107.998669 C64.4192045,107.947406 64.2749374,107.910596 64.1191397,107.885919 C64.0663815,107.854394 63.9221616,107.798657 63.8728032,107.759851 C63.7376905,107.654848 63.6139425,107.537761 63.4784957,107.431593 C62.9596115,107.025573 61.9790428,107.062127 61.2757028,107.165455 C60.1861629,107.326564 59.1200508,107.591917 58.1240684,108.069172 C57.8215111,108.21393 56.531187,108.860068 56.8008628,109.290893 C59.6626562,113.834265 63.8188716,117.591623 67.4613358,121.669044 C67.9488153,122.216466 70.0272302,121.649492 70.6603974,121.467934 C71.4598895,121.238683 73.1539713,120.72139 73.4809607,119.942944 C76.015538,113.906408 79.5972097,107.586014 85.3146151,102.820738 C86.4043173,101.913114 84.4638865,101.839061 83.8411963,101.909174 C82.4286096,102.067086 80.7398305,102.560162 79.6633348,103.456433 C76.3766433,106.194436 73.7470941,109.432471 71.6057675,112.841959 C68.9137119,99.9265434 72.3522189,84.9518562 83.40649,73.6339923 C86.1409806,70.8361915 89.2266348,68.4597187 92.8059248,66.4006757 C92.846178,66.379046 92.9056988,66.3481091 92.9840526,66.3029444 C93.2212125,66.1731546 93.4610879,66.0488911 93.7001034,65.9210908 C94.1826975,65.6667042 94.67298,65.4239827 95.1655015,65.1856632 C95.5933946,64.9784845 96.0300587,64.7839221 96.4659865,64.5895708 C96.4279284,64.6093103 96.9387568,64.39096 96.9776627,64.3747598 C97.2370872,64.2663269 97.4974589,64.1651861 97.7588505,64.0624931 C98.2853385,63.8560447 98.8185684,63.6640553 99.351304,63.4759889 C99.3984407,63.4586903 99.6403571,63.3792347 99.7857614,63.329975 C100.004168,63.2585214 100.221524,63.1924131 100.440445,63.1233338 C100.996069,62.9526629 101.557868,62.7978738 102.12018,62.6454599 C102.3154,62.5932648 102.511122,62.5434463 102.708352,62.4931964 C102.719149,62.492622 103.231036,62.3685377 103.289867,62.3554506 C104.380401,62.1083135 106.438631,61.6126954 106.937332,60.5870469 C107.420702,59.592274 104.928626,59.9210223 104.418463,60.0370465 C94.491807,62.2933564 85.3529215,66.8317575 78.4621626,73.4982954 Z" id="Fill-121-Copy" stroke="none" fill-opacity="0.3" fill="#FFFFFF" fill-rule="evenodd" transform="translate(81.881623, 90.896351) scale(-1, 1) rotate(-78.000000) translate(-81.881623, -90.896351) "></path>
                    </svg>
                  </p>
                  <h4 className="pricing-title">Annual</h4>
                  <p className="banner">Save BIG with our annual package</p>
                  <p className="subtitle">Monthly Package plus:</p>
                  <ul className="feature-list">
                    <li>Create and customize condition notes across multiple product categories</li>
                    <li>Access to all FBA warehouse codes before you ship</li>
                    <li>Replenish Items on the fly</li>
                    <li>See active inventory items & inventory health analytics and insights</li>
                  </ul>
                  <div className="pricing-footer">
                    <a href="/register/annual" className="btn btn-cta">
                      <span className="currency">$</span>
                      340
                      <span className="period"> / year</span>
                    </a>
                  </div>
                </div>
                {/*-- end pricing table right --*/}

              </div>
            </section>
            {/*-- end pricing table --*/}

          </div>
        </div>
        <Footer />
      </div >
    );
  }
}


export default connect(
    state => ({
		item_count: state.Landing.get("item_count")
    }),
    { bFrontItemListedCount }
)(Landing);
