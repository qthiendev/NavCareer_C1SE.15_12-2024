import React, { useState } from 'react';

function SignIn() {
    return (
        <div className="signin-container">
            <form action="">
                <h1>Login</h1>

                <div>
                    <input type="text" placeholder="Username" required />
                </div>

                <div>
                    <input type="password" placeholder="Password" required />
                </div>

                <div>
                    <a href="#">Forgot Password?</a>
                </div>

                <div>
                    <button type="submit">Login</button>
                </div>
                
                <div>
                    <a href="/signup">Sign Up</a>
                </div>

            </form>
        </div>
    )
};

export default SignIn;