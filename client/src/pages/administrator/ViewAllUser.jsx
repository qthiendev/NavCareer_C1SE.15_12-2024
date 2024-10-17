import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewAllUser.css';

function ViewAllUser() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [idFilter, setIdFilter] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    const [phoneFilter, setPhoneFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [uniqueRoles, setUniqueRoles] = useState([]);
    const navigate = useNavigate();

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
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/admin/user/read', { withCredentials: true });
                setUsers(response.data.data);
                setFilteredUsers(response.data.data);
                const roles = [...new Set(response.data.data.map(user => user.role))];
                setUniqueRoles(roles);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            }
        };
        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        filterUsers(query, idFilter, emailFilter, phoneFilter, roleFilter, statusFilter);
    };

    const filterUsers = (search, id, email, phone, role, status) => {
        const filtered = users.filter(user => {
            const matchesName = user.user_full_name.toLowerCase().includes(search);
            const matchesId = user.user_id.toString().includes(id);
            const matchesEmail = user.email.toLowerCase().includes(email.toLowerCase());
            const matchesPhone = user.phone_number.includes(phone);
            const matchesRole = role ? user.role === role : true;
            const matchesStatus = status ? (status === 'Active' ? user.user_status : !user.user_status) : true;
            return matchesName && matchesId && matchesEmail && matchesPhone && matchesRole && matchesStatus;
        });
        setFilteredUsers(filtered);
    };

    const handleIdFilterChange = (e) => {
        const id = e.target.value;
        setIdFilter(id);
        filterUsers(searchQuery, id, emailFilter, phoneFilter, roleFilter, statusFilter);
    };

    const handleEmailFilterChange = (e) => {
        const email = e.target.value;
        setEmailFilter(email);
        filterUsers(searchQuery, idFilter, email, phoneFilter, roleFilter, statusFilter);
    };

    const handlePhoneFilterChange = (e) => {
        const phone = e.target.value;
        setPhoneFilter(phone);
        filterUsers(searchQuery, idFilter, emailFilter, phone, roleFilter, statusFilter);
    };

    const handleRoleFilterChange = (e) => {
        const role = e.target.value;
        setRoleFilter(role);
        filterUsers(searchQuery, idFilter, emailFilter, phoneFilter, role, statusFilter);
    };

    const handleStatusFilterChange = (e) => {
        const status = e.target.value;
        setStatusFilter(status);
        filterUsers(searchQuery, idFilter, emailFilter, phoneFilter, roleFilter, status);
    };

    const handleView = (userId) => {
        navigate(`/profile/${userId}`);
    };

    const handleModify = (userId) => {
        const selectedUser = users.find(user => user.user_id === userId);
        navigate(`/admin/user/modify`, { state: { userData: selectedUser } });
    };

    return (
        <div className="view-all-container">
            <div className="view-all-admin-home-container">
                <ul className="view-all-admin-nav">
                    <li><a href="/admin">Trang chủ Admin</a></li>
                    <li><a href="/">Trang chủ NavCareer</a></li>
                    <li><a href="/admin/user/view-all">Thông tin người dùng</a></li>
                </ul>

                <h2>User Information</h2>

                <div className="view-all-search-filters">
                    <input
                        type="text"
                        placeholder="Filter by ID..."
                        value={idFilter}
                        onChange={handleIdFilterChange}
                        className="view-all-filter-input"
                    />

                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="view-all-filter-input"
                    />

                    <input
                        type="text"
                        placeholder="Filter by Email..."
                        value={emailFilter}
                        onChange={handleEmailFilterChange}
                        className="view-all-filter-input"
                    />

                    <input
                        type="text"
                        placeholder="Filter by Phone Number..."
                        value={phoneFilter}
                        onChange={handlePhoneFilterChange}
                        className="view-all-filter-input"
                    />

                    <select value={roleFilter} onChange={handleRoleFilterChange} className="view-all-filter-dropdown">
                        <option value="">Select Role</option>
                        {uniqueRoles.map((role, index) => (
                            <option key={index} value={role}>{role}</option>
                        ))}
                    </select>

                    <select value={statusFilter} onChange={handleStatusFilterChange} className="view-all-filter-dropdown">
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    
                </div>

                <table className="view-all-user-table">
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
                        {filteredUsers.map(user => (
                            <tr key={user.user_id}>
                                <td className="view-all-user-id">{user.user_id}</td>
                                <td className="view-all-user-full-name">{user.user_full_name}</td>
                                <td className="view-all-user-role">{user.role}</td>
                                <td className="view-all-user-email">{user.email}</td>
                                <td className="view-all-user-phone">{user.phone_number}</td>
                                <td className={`view-all-user-status ${user.user_status ? 'status-active' : 'status-inactive'}`}>
                                    {user.user_status ? 'Active' : 'Inactive'}
                                </td>
                                <td className="view-all-actions">
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
