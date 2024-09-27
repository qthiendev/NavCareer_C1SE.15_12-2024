// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import './SignIn.css'; // Create a CSS file for styling
function SignUp() {


    return (
        <div className="signup-container">
           <div className="signup-header">
            <div className="text"> Sign Up</div>
            <div className="underline"></div>
           </div>
           <div className="inputs">
            <div className="input">
                <img src='/img/user_icon.png' alt="" />
                <input type="text" placeholder="Name" />
            </div>
            <div className="input">
                <img src='/img/email_icon.png' alt="" />
                <input type="email" placeholder="Email Id" />
            </div>
            <div className="input">
                <img src='/img/pass_icon.png' alt="" />
                <input type="password" placeholder="Password" />
            </div>
           </div>
           <div className="forgot-password">Lost Password? <span>Click Here!</span></div>
           <div className="submit-container">
            <div className="submit">Sign Up</div>
            <div className="submit">Login</div>
            
           </div>
        </div>
    );
}

export default SignUp;
