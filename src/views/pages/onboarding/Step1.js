import React, { Fragment } from 'react';

const Step1 = ({ goal, changeState }) => (
    <Fragment>
        <div className="inner-body">
            <div className="goals">
                <div onClick={() => changeState("goal", "most_competitive_price")} className="goal-box" style={{ backgroundColor: `${goal === "most_competitive_price" ? 'rgba(255, 187, 34, 0.12)' : 'initial'}`}}>
                    <svg 
                        width="120px" 
                        height="120px" 
                        xmlns="http://www.w3.org/2000/svg" 
                        xmlnsXlink="http://www.w3.org/1999/xlink">
                        <polyline id="Shape" stroke="none" fillOpacity="0.949999988" fill="#FFBB22" fillRule="evenodd" 
                        points="120 45.914 78.608 39.6 60 0 41.393 39.6 0 45.914 29.944 76.574 22.857 120 60 99.486 97.144 120 90.056 76.574 120 45.914"></polyline>
                    </svg>
                    <h5 className="goal-title">MOST <br/> COMPETITIVE PRICE</h5>
                </div>
                <div onClick={() => changeState("goal", "maximize_profit")} className="goal-box" style={{ backgroundColor: `${goal === "maximize_profit" ? 'rgba(255, 187, 34, 0.12)' : 'initial'}`}}>
                    <svg 
                        width="128px" 
                        height="128px" 
                        viewBox="358 258 128 128"
                        xmlns="http://www.w3.org/2000/svg" 
                        xmlnsXlink="http://www.w3.org/1999/xlink">
                        <g id="icon" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(362.000000, 262.000000)">
                            <rect id="Rectangle-path" strokeOpacity="0.949999988" stroke="#FFBB22" strokeWidth="8" x="0" y="0" width="120" height="120"></rect>
                            <path d="M114.772,2.772 L85.472,2.772 C84.4861624,2.7707884 83.5962858,3.36246165 83.216,4.272 C82.8355431,5.17893204 83.0440947,6.22604297 83.743,6.918 L95.461,18.572 L65.561,50.584 L52.638,42.02 C51.6679091,41.3789589 50.3811013,41.5067211 49.556,42.326 L0.715,90.872 C0.018675065,91.5672564 -0.188486394,92.6143665 0.190643362,93.5223921 C0.569773117,94.4304177 1.46002341,95.0193232 2.444,95.013 C3.0911563,95.0132923 3.71236153,94.7585586 4.173,94.304 L51.595,47.165 L64.581,55.765 C65.5766894,56.4280094 66.9061425,56.2717775 67.721,55.396 L98.921,21.996 L113.045,36.036 C113.504337,36.4931282 114.125959,36.7498304 114.774,36.75 C116.117294,36.7511201 117.208844,35.6662758 117.216,34.323 L117.216,5.199 C117.211038,3.85402239 116.116979,2.76757381 114.772,2.772 Z" id="Shape" fillOpacity="0.949999988" fill="#FFBB22"></path>
                        </g>
                    </svg>
                    <h5 className="goal-title">WIN THE BUY BOX <br />MAXIMAZE PROFIT</h5>
                </div>
                <div onClick={() => changeState("goal", "stay_competitive")} className="goal-box" style={{ backgroundColor: `${goal === "stay_competitive" ? 'rgba(255, 187, 34, 0.12)' : 'initial'}`}}>                                
                    <svg 
                        width="128px" 
                        height="128px" 
                        viewBox="256 98 128 128" 
                        xmlns="http://www.w3.org/2000/svg" 
                        xmlnsXlink="http://www.w3.org/1999/xlink">
                        <g id="Group" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(260.000000, 102.000000)">
                            <rect id="Rectangle-path" strokeOpacity="0.949999988" stroke="#FFBB22" strokeWidth="8" x="0" y="0" width="120" height="120"></rect>
                            <polygon id="Shape" fillOpacity="0.949999988" fill="#FFBB22" points="71.521 46.947 59.798 22 48.076 46.947 22 50.926 40.864 70.24 36.399 97.596 59.799 84.674 83.199 97.596 78.734 70.24 97.598 50.926"></polygon>
                        </g>
                    </svg>
                    <h5 className="goal-title">WIN THE BUY BOX <br/>STAY COMPETITIVE</h5>
                </div>  
            </div>
        </div>
        
    </Fragment>
)

export default Step1;