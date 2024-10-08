// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Đảm bảo đã cài đặt axios
import './ViewProfileandUpdate.css';

const ViewProfile = () => {
    const [data, setData] = useState({
        user_id: "",
        user_name: "",
        email: "",
        birthdate: "",
        gender: "",
        phone_num: "",
        address: "",
        date_joined: "",
        resource_url: "",
        auth_method: "",
    });

    const [edit, setEdit] = useState(false); // Khởi tạo trạng thái chỉnh sửa là false

    // Hàm fetch thông tin người dùng
    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('http://localhost:5000/profile/read');
            setData(response.data); // Giả sử response.data chứa thông tin người dùng
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    // Gọi fetchUserProfile khi component được mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        setEdit(false);
        try {
            const response = await axios.post('http://localhost:5000/profile/update', {
                user_id: data.user_id,
                user_name: data.user_name,
                email: data.email,
                birthdate: data.birthdate,
                gender: data.gender,
                phone_num: data.phone_num,
                address: data.address,
                resource_url: data.resource_url,
                auth_method: data.auth_method,
            });

            if (response.status === 200) {
                console.log("Profile updated successfully");
            } else {
                console.error("Failed to update profile");
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="profile-cnt">
            <h2>Profile</h2>
            <div className="profile-field">
                <label>User ID:</label>
                {edit ? (
                    <input
                        type="text"
                        name="user_id"
                        value={data.user_id}
                        onChange={handleChange}
                        readOnly
                    />
                ) : (
                    <span>{data.user_id}</span>
                )}
            </div>
            <div className="profile-field">
                <label>User Name:</label>
                {edit ? (
                    <input
                        type="text"
                        name="user_name"
                        value={data.user_name}
                        onChange={handleChange}
                    />
                ) : (
                    <span>{data.user_name}</span>
                )}
            </div>
            <div className="profile-field">
                <label>Email:</label>
                {edit ? (
                    <input
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                    />
                ) : (
                    <span>{data.email}</span>
                )}
            </div>
            <div className="profile-field">
                <label>Birthdate:</label>
                {edit ? (
                    <input
                        type="date"
                        name="birthdate"
                        value={data.birthdate}
                        onChange={handleChange}
                    />
                ) : (
                    <span>{data.birthdate}</span>
                )}
            </div>
            <div className="profile-field">
                <label>Gender:</label>
                {edit ? (
                    <select name="gender" value={data.gender} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                ) : (
                    <span>{data.gender}</span>
                )}
            </div>
            <div className="profile-field">
                <label>Phone:</label>
                {edit ? (
                    <input
                        type="text"
                        name="phone_num"
                        value={data.phone_num}
                        onChange={handleChange}
                    />
                ) : (
                    <span>{data.phone_num}</span>
                )}
            </div>
            <div className="profile-field">
                <label>Address:</label>
                {edit ? (
                    <input
                        type="text"
                        name="address"
                        value={data.address}
                        onChange={handleChange}
                    />
                ) : (
                    <span>{data.address}</span>
                )}
            </div>
            <div className="profile-field">
                <label>Date Joined:</label>
                {edit ? (
                    <input
                        type="date"
                        name="date_joined"
                        value={data.date_joined}
                        onChange={handleChange}
                        readOnly
                    />
                ) : (
                    <span>{data.date_joined}</span>
                )}
            </div>
            <div className="profile-field">
                <label>Resource URL:</label>
                {edit ? (
                    <input
                        type="url"
                        name="resource_url"
                        value={data.resource_url}
                        onChange={handleChange}
                    />
                ) : (
                    <span>{data.resource_url}</span>
                )}
            </div>
            <div className="profile-field">
                <label>Auth Method:</label>
                {edit ? (
                    <input
                        type="text"
                        name="auth_method"
                        value={data.auth_method}
                        onChange={handleChange}
                    />
                ) : (
                    <span>{data.auth_method}</span>
                )}
            </div>
            <div className="profile-actions">
                {edit ? (
                    <button onClick={handleUpdate}>Save</button>
                ) : (
                    <button onClick={() => setEdit(true)}>Update</button>
                )}
            </div>
        </div>
    );
};

export default ViewProfile;
