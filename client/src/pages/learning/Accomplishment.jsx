import React from 'react';
import './Accomplishment.css';

function Accomplishment() {
    const userFullName = "John Doe"; // Replace with dynamic data later
    const courseName = "React Development Course"; // Replace with dynamic data later
    const certId = "123456"; // Replace with dynamic data later
    const gender = "Male"; // Replace with dynamic data later
    const genderPrefix = gender === 'Male' ? 'Mr.' : 'Ms.';

    return (
        <div className="accomplishment-container">
            <div className="certificate-container">
                <div className="certificate-header">
                    <h1>Certificate of Completion</h1>
                    <div className="certificate-logo">NavCareer</div>
                </div>

                <div className="certificate-body">
                    <p>This is to certify that</p>
                    <h2 className="recipient-name">
                        {genderPrefix} {userFullName}
                    </h2>
                    <p>has successfully completed the</p>
                    <h3 className="course-name">{courseName}</h3>
                </div>

                <div className="certificate-footer">
                    <div className="seal"></div>

                    <div className="signatures">
                        <div className="signature">
                            <p>Course Provider</p>
                            <img className="signature-img" src="https://onlinepngtools.com/images/examples-onlinepngtools/handwritten-signature.png" alt="Signature 1" />
                            <p>John Doe</p>
                        </div>

                        <div className="signature">
                            <p>NavCareer Representative</p>
                            <img className="signature-img" src="https://cdn.prod.website-files.com/61d7de73eec437f52da6d699/62161cf7328ad280841f653f_esignature-signature.png" alt="Signature 2" />
                            <p>Trinh Quy Thien</p>
                        </div>
                    </div>
                    <p className="certificate-id">ID: {certId}</p>
                </div>
            </div>
        </div>
    );
}

export default Accomplishment;
