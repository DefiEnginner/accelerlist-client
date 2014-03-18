import React from 'react'
import {
    logo,
    youtubeLogo,
    instagramLogo,
    facebookLogo,
    twitterLogo
} from "../../../../assets/images";
import './style.css'
const Footer = () => (
    <footer>
        <div className="container">
            <div className="logo">
                <a href="about:blank" onClick={e => e.preventDefault()}>
                    <img src={logo} alt="logo_img" />
                </a>
            </div>

            <div className="copyright">
                2018 Copyright <span>AccelerList</span>.
            </div>

            <ul className="socials">
                <li>
                    <a href="about:blank" onClick={e => e.preventDefault()}>
                        <img src={youtubeLogo} alt="youtube_img" />
                    </a>
                </li>
                <li>
                    <a href="about:blank" onClick={e => e.preventDefault()}>
                        <img src={instagramLogo} alt="instagram_img" />
                    </a>
                </li>
                <li>
                    <a href="about:blank" onClick={e => e.preventDefault()}>
                        <img src={facebookLogo} alt="facebook_img" />
                    </a>
                </li>
                <li>
                    <a href="about:blank" onClick={e => e.preventDefault()}>
                        <img src={twitterLogo} alt="twitter_img" />
                    </a>
                </li>
            </ul>
        </div>
    </footer>
)

export default Footer