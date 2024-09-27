// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import './SignIn.css'; // Create a CSS file for styling
import { FaUser, FaLock } from "react-icons/fa";
function SignIn() {


    return (
        <div className="warpper">
           <form action="">
            <h1>Login</h1>
            <div className="input-box">
            <input type="text" placeholder="Username"  required/>
            <FaUser className="icon" />

            </div>
            <div className="input-box">
            <input type="password" placeholder="Password"  required/>
            <FaLock className="icon"/>
            </div>
            <div className="remember-forgot">
                <label><input type="checkbox" />Remember Me</label>
                <a href="#">Forgot Password?</a>
            </div>
            <button type="submit">Login</button>
            <div className="register-link">
                <p>Dont have an account ? <a href="#">Register</a></p>
            </div>
           </form>
        </div>
    );
}

export default SignIn;
