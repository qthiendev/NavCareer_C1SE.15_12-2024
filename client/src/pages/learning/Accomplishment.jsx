import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Accomplishment.css';

function Accomplishment() {
    return (
        <div className="accomplishment-container">
            <div className="certificate-container">

                <div className="certificate-header">
                    <h1>Certificate of Completion</h1>
                    <div className="logo">NavCareer</div>
                </div>

                <div className="certificate-body">
                    <p>This is to certify that</p>
                    <h2 className="recipient-name">[base on gender Mr/Ms]. [User full name]</h2>
                    <p>has successfully completed the</p>
                    <h3 className="course-name">[Name of course here]</h3>
                </div>

                <div className="certificate-footer">
                    <div className="seal">Seal</div>

                    <div className="signatures">

                        <div className="signature">
                            <p>Course Provider</p>
                            <p>Signature</p>
                        </div>

                        <div className="signature">
                            <p>NavCareer Representative</p>
                            <p>Signature</p>
                        </div>

                    </div>
                    <p className="certificate-id">ID: [Cert id here]</p>
                </div>
            </div>
        </div>
    );
}
export default Accomplishment;