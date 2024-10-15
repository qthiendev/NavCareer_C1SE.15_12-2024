import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewAllUser.css';

function ViewAllUser() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    // Check if the current user is an admin
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await axios.get('http://localhost:5000/authz/adm', { withCredentials: true });
                if (response.status !== 200)
                    navigate('/');
            } catch (err) {
                console.error('Failed to check authentication status:', err);
                navigate('/');
            }
        };
        checkAdmin();
    }, [navigate]);

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/admin/user/read', { withCredentials: true });
                setUsers(response.data.data);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            }
        };
        fetchUsers();
    }, []);


    const handleView = (userId) => {
        navigate(`/profile/view/${userId}`);
    };


    const handleModify = (userId) => {
        navigate(`admin/user/modify?user_id=${userId}`);
    };

    return (
        <div className="view-all-container">
            <div className="admin-home-container">

                <ul className="admin-nav">
                    <li><a href="/admin/user/view-all">Trang chủ Admin</a></li>
                    <li><a href="/">Trang chủ NavCareer</a></li>
                    <li><a href="/admin/user/view-all">Thông tin người dùng</a></li>
                </ul>

                <h2>User Information</h2>

                <table className="user-table">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map(user => (
                            <tr key={user.user_id}>
                                <td id="user_id">{user.user_id}</td>
                                <td id="user_full_name">{user.user_full_name}</td>
                                <td id="user_role">{user.role}</td>
                                <td id="user_email">{user.email}</td>
                                <td id="user_phone">{user.phone_number}</td>
                                <td id="user_status" className={user.user_status ? 'status-active' : 'status-inactive'}>
                                    {user.user_status ? 'Active' : 'Inactive'}
                                </td>
                                <td className="actions">
                                    <button onClick={() => handleView(user.user_id)}>View on page</button>
                                    <button onClick={() => handleModify(user.user_id)}>Modify</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>


                </table>
            </div>
        </div>
    );
}

export default ViewAllUser;
