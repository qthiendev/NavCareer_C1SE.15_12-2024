import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ModifyUser.css'; // Import the CSS styles

function ModifyUser() {
    const navigate = useNavigate();
    const location = useLocation();
    const userDataFromState = location.state?.userData || {};

    const [userData, setUserData] = useState({
        authentication_id: '',
        account: '',
        password: '',
        identifier_email: '',
        role: 'NAV_STUDENT', // Default role if not set
        auth_status: 'true', // Set to true by default
        user_full_name: '',
        gender: 'true', // Set gender to male (true) by default
        email: '',
        phone_number: '',
        address: '',
        user_status: 'active', // Set to active by default
    });

    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Step 1: Password visibility state

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await axios.get('http://localhost:5000/authz/adm', { withCredentials: true });
                if (response.status !== 200) navigate('/');
            } catch (err) {
                console.error('Failed to check authentication status:', err);
                navigate('/signin');
            }
        };
        checkAdmin();
    }, [navigate]);

    useEffect(() => {
        if (userDataFromState) {
            const birthdate = new Date(userDataFromState.birthdate);
            const initialRole = userDataFromState.role || (userDataFromState.authorization_id === 1 ? 'NAV_ADMIN' :
                                                            userDataFromState.authorization_id === 2 ? 'NAV_ESP' : 'NAV_STUDENT');
            setUserData({
                ...userDataFromState,
                role: initialRole, // Use role from state or map from authorization_id
                auth_status: userDataFromState.auth_status ? 'true' : 'false', // Convert boolean to string
                gender: userDataFromState.gender ? 'true' : 'false', // Convert boolean to string
                user_status: userDataFromState.user_status === 'active' ? 'active' : 'inactive', // Set status
            });

            // Set initial day, month, and year
            setDay(birthdate.getDate());
            setMonth(birthdate.getMonth() + 1); // Month is 0-based
            setYear(birthdate.getFullYear());
        }
    }, [userDataFromState]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedBirthdate = `${day}/${month}/${year}`;
        const authorization_id = userData.role === 'NAV_ADMIN' ? 1 :
                                  userData.role === 'NAV_ESP' ? 2 : 3;

        // Convert boolean-like values to 1 or 0
        const dataToSend = {
            ...userData,
            birthdate: formattedBirthdate,
            authorization_id,
            authentication_id: Number(userData.authentication_id), // Ensure authentication_id is a number
            auth_status: userData.auth_status === 'true' ? 1 : 0, // Convert to 1 or 0
            gender: userData.gender === 'true' ? 1 : 0, // Convert to 1 or 0
            user_status: userData.user_status === 'active' ? 1 : 0, // Convert to 1 or 0
        };

        try {
            const response = await axios.post(
                'http://localhost:5000/admin/user/modify',
                dataToSend,
                { withCredentials: true }
            );
            if (response.status === 200) {
                alert(response.data.message);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Failed to update user:', error);
            alert('Failed to update user.');
        }
    };

    // Generate arrays for dropdowns
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: (new Date().getFullYear() - 1900 + 1) }, (_, i) => 1900 + i);

    // Step 2: Create toggle function
    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="modify-user-container"> {/* Apply the CSS class */}
            <h2>Modify User</h2>
            <form onSubmit={handleSubmit}>
                <div className="field-row">
                    <label>Authentication ID:</label>
                    <input
                        type="text"
                        name="authentication_id"
                        value={userData.authentication_id}
                        readOnly
                    />
                </div>
                <div className="field-row">
                    <label>Account:</label>
                    <input
                        type="text"
                        name="account"
                        value={userData.account}
                        onChange={handleChange}
                    />
                </div>
                <div className="field-row">
                    <label>Password:</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type={showPassword ? 'text' : 'password'} // Step 3: Conditional input type
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                        />
                        <button 
                            type="button" 
                            onClick={toggleShowPassword}
                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
                <div className="field-row">
                    <label>Identifier Email:</label>
                    <input
                        type="text"
                        name="identifier_email"
                        value={userData.identifier_email}
                        onChange={handleChange}
                    />
                </div>
                <div className="field-row">
                    <label>Role:</label>
                    <select
                        name="role"
                        value={userData.role}
                        onChange={handleChange}
                    >
                        <option value="NAV_ADMIN">NAV_ADMIN</option>
                        <option value="NAV_ESP">NAV_ESP</option>
                        <option value="NAV_STUDENT">NAV_STUDENT</option>
                    </select>
                </div>
                <div className="field-row">
                    <label>Auth Status:</label>
                    <select
                        name="auth_status"
                        value={userData.auth_status}
                        onChange={handleChange}
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
                <div className="field-row">
                    <label>Full Name:</label>
                    <input
                        type="text"
                        name="user_full_name"
                        value={userData.user_full_name}
                        onChange={handleChange}
                    />
                </div>
                <div className="field-row">
                    <label>Birthdate:</label>
                    <div className="birthdate-fields">
                        <select
                            name="day"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            required
                        >
                            <option value="">Day</option>
                            {days.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        <select
                            name="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            required
                        >
                            <option value="">Month</option>
                            {months.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <select
                            name="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            required
                        >
                            <option value="">Year</option>
                            {years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="field-row">
                    <label>Gender:</label>
                    <select
                        name="gender"
                        value={userData.gender}
                        onChange={handleChange}
                    >
                        <option value="true">Male</option>
                        <option value="false">Female</option>
                    </select>
                </div>
                <div className="field-row">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="field-row">
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={userData.phone_number}
                        onChange={handleChange}
                    />
                </div>
                <div className="field-row">
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={userData.address}
                        onChange={handleChange}
                    />
                </div>
                <div className="field-row">
                    <label>User Status:</label>
                    <select
                        name="user_status"
                        value={userData.user_status}
                        onChange={handleChange}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div className="field-row">
                    <button type="submit">Modify User</button>
                </div>
            </form>
        </div>
    );
}

export default ModifyUser;
