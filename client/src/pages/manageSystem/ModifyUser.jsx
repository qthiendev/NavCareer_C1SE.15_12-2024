import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ModifyUser.css'; // Import the CSS styles

function ModifyUser() {
    const navigate = useNavigate();
    const location = useLocation();
    const userDataFromState = location.state?.userData || {};
    const [isAuthz, setAuthz] = useState(false);

    const [userData, setUserData] = useState({
        authentication_id: '',
        account: '',
        password: '',
        identifier_email: '',
        role: 'NAV_STUDENT', // Default role if not set
        auth_status: 'true', // Set to true by default
        user_full_name: '',
        user_alias: '',
        user_bio: '',
        user_gender: 'true', // Set gender to male (true) by default
        user_email: '',
        user_phone_number: '',
        user_address: '',
        user_status: 'true', // Set to active by default
    });

    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await axios.get('http://localhost:5000/authz/adm', { withCredentials: true });
                if (response.status !== 200) navigate('/');
                setAuthz(true);
            } catch (err) {
                console.error('Failed to check authentication status:', err);
                navigate('/');
            }
        };
        checkAdmin();
    }, [navigate]);

    useEffect(() => {
        if (userDataFromState && isAuthz) {
            const birthdate = new Date(userDataFromState.user_birthdate);
            const initialRole = userDataFromState.role || (userDataFromState.authorization_id === 1 ? 'NAV_ADMIN' :
                userDataFromState.authorization_id === 2 ? 'NAV_ESP' : 'NAV_STUDENT');
            setUserData({
                ...userDataFromState,
                role: initialRole,
                auth_status: userDataFromState.auth_status ? 'true' : 'false',
                user_gender: userDataFromState.user_gender ? 'true' : 'false',
                user_status: userDataFromState.user_status ? 'true' : 'false',
            });

            setDay(birthdate.getDate());
            setMonth(birthdate.getMonth() + 1);
            setYear(birthdate.getFullYear());
        }
    }, [isAuthz, userDataFromState]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const validatePassword = (password) => {
        return password.length >= 6; // Example validation rule
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validatePassword(userData.password)) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        const formattedBirthdate = `${year}-${month}-${day}`; // Change to YYYY-MM-DD format
        const authorization_id = userData.role === 'NAV_ADMIN' ? 1 :
            userData.role === 'NAV_ESP' ? 2 : 3;

        const dataToSend = {
            ...userData,
            user_birthdate: formattedBirthdate,
            authorization_id,
            authentication_id: Number(userData.authentication_id),
            auth_status: userData.auth_status === 'true' ? 1 : 0,
            user_gender: userData.user_gender === 'true' ? 1 : 0,
            user_status: userData.user_status === 'true' ? 1 : 0,
        };

        console.log(dataToSend);

        setLoading(true); // Set loading to true
        try {
            const response = await axios.post(
                'http://localhost:5000/admin/user/modify',
                dataToSend,
                { withCredentials: true }
            );
            alert(response.data.message);
            navigate('/admin/user/view-all');
        } catch (error) {
            console.error('Failed to update user:', error);
            alert(`Failed to update user: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: (new Date().getFullYear() - 1900 + 1) }, (_, i) => 1900 + i);

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="modify-user-container">
            <ul className="admin-nav">
                <li><a href="/admin">Trang chủ Admin</a></li>
                <li><a href="/">Trang chủ Hệ thống</a></li>
                <li><a href="/admin/user/view-all">Thông tin Người dùng</a></li>
                <li><a href="/admin/user/function/general">Phân quyền Chung</a></li>
                <li><a href="/admin/user/function/esp">Phân quyền ESP</a></li>
                <li><a href="/admin/user/view-all">Phân quyền Student</a></li>
                <li><a href="/admin/course/view-all">Thông tin Khóa học</a></li>
                <li><a href="admin/ManageCourseReport">Báo cáo Khóa học</a></li>
                <li><a href="/admin/ManageStudentReport">Chi tiết học viên</a></li>
            </ul>
            <h2>Modify User</h2>
            <form onSubmit={handleSubmit}>
                <div className="field-row">
                    <label>Authentication ID:</label>
                    <input className='input1'
                        type="text"
                        name="authentication_id"
                        value={userData.authentication_id}
                        readOnly
                    />
                </div>
                <div className="field-row">
                    <label>Account:</label>
                    <input className='input1'
                        type="text"
                        name="account"
                        value={userData.account}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="field-row">
                    <label>Password:</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input className='input1'
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            required
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
                    <input className='input1'
                        type="text"
                        name="identifier_email"
                        value={userData.identifier_email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="field-row">
                    <label>Role:</label>
                    <select className='User-Select'
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
                    <select className='User-Select'
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
                    <input className='input1'
                        type="text"
                        name="user_full_name"
                        value={userData.user_full_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="field-row">
                    <label>Alias:</label>
                    <input className='input1'
                        type="text"
                        name="user_alias"
                        value={userData.user_alias}
                        onChange={handleChange}
                    />
                </div>

                <div className="field-row">
                    <label>Bio:</label>
                    <input className='input1'
                        type="text"
                        name="user_bio"
                        value={userData.user_bio}
                        onChange={handleChange}
                    />
                </div>

                <div className="field-row">
                    <label>Birthdate:</label>
                    <div className="birthdate-fields">
                        <select className='User-Select'
                            name="day"
                            value={day}
                            onChange={(e) => setDay(parseInt(e.target.value, 10))}
                            required
                        >
                            <option value="">Day</option>
                            {days.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        <select className='User-Select'
                            name="month"
                            value={month}
                            onChange={(e) => setMonth(parseInt(e.target.value, 10))}
                            required
                        >
                            <option value="">Month</option>
                            {months.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <select className='User-Select'
                            name="year"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value, 10))}
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
                    <select className='User-Select'
                        name="user_gender"
                        value={userData.user_gender}
                        onChange={handleChange}
                    >
                        <option value="true">Male</option>
                        <option value="false">Female</option>
                    </select>
                </div>

                <div className="field-row">
                    <label>Email:</label>
                    <input className='input1'
                        type="email"
                        name="user_email"
                        value={userData.user_email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="field-row">
                    <label>Phone Number:</label>
                    <input className='input1'
                        type="tel"
                        name="user_phone_number"
                        value={userData.user_phone_number}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="field-row">
                    <label>Address:</label>
                    <input className='input1'
                        type="text"
                        name="user_address"
                        value={userData.user_address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="field-row">
                    <label>User Status:</label>
                    <select className='User-Select'
                        name="user_status"
                        value={userData.user_status}
                        onChange={handleChange}
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>

                <div className="field-row">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update User'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ModifyUser;
