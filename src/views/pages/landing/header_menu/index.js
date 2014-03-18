import React from 'react'
import { Link } from "react-router-dom";
import {
    logo,
    menu
} from "../../../../assets/images";

export default (props) => (
    <div className="container">
        <div className="mobile-topbar">
            <div className="logo">
                <h1 className="d-none">AccelerList</h1>
                <a href="about:blank" onClick={e => e.preventDefault()}>
                    <img src={logo} alt="logo_img" />
                </a>
            </div>
            <a onClick={props.toggleMobileNav} className="mobile-nav-toggle">
                <img src={menu} alt="menu_img" />
            </a>
        </div>

        <nav id="main-nav">
            <ul> 
                <li>
                    <a href="#pricing_table">Pricing</a>
                </li>
                <li>
                    <a href="http://blog.accelerlist.com">Blog</a>
                </li>
            </ul>
            <span className="separator">|</span>
            <Link to="/signin" className="btn btn-login">
                LOGIN
              </Link>
        </nav>
    </div>
)