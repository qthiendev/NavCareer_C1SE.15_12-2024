import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewProfile.css';

function ViewProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatable, setUpdatable] = useState(false);
    const navigate = useNavigate();
    const { user_id } = useParams();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/auth/status', { withCredentials: true });
                setUpdatable(response.data.aid === Number.parseInt(user_id));
            } catch (err) {
                console.error('Failed to check authentication status:', err);
            }
        };

        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/profile/read?user_id=${user_id}`, { withCredentials: true });
                if (!response.data) {
                    navigate('/profile/create');
                }
                setProfile(response.data);
                setLoading(false);
            } catch (err) {
                navigate('/profile/create');
            }
        };

        fetchProfile();
        checkAuth();

    }, [user_id, navigate]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!profile) {
        return <div>No profile data available.</div>;
    }
    return (
        <div className="view-profile-container">
            <div className="view-left-panel">
                <div className="view-profile-header">
                    <img
                        src="/img/student_profile/std_prf.png"             
                        alt="Avatar"
                        className="view-profile-avatar"
                    />
                    <h2 className="view-profile-name">{profile.user_full_name}</h2>  
                    {/* Lấy theo data người dùng đã điền khi đăng ký tài khoản */}
                    <button className="view-share-profile-btn">
                        <img src="/img/student_profile/share_icon.svg" alt="Share" className="share-icon" /> {/* Icon chia sẻ */}
                        Chia sẻ hồ sơ
                    </button>
                </div>
                <div className="view-profile-menu">
                    <ul>
                        <li className="view-menu-item active">Hồ sơ người dùng</li>
                        <li className="view-menu-item">Các khoá học</li>
                        <li className="view-menu-item">Giảng viên yêu thích</li>
                        <li className="view-menu-item">Tin nhắn</li>
                        <li style={{'border':'none'}} className="view-menu-item">Liên hệ admin</li>
                    </ul>
                </div>
            </div>

            <div className="view-right-panel">
                <div className="view-user-profile-info">
                    <div className='view-information'>
                        <div className='view-form-row'>
                            <div className="view-form-group">
                                <p><label htmlFor="fullname">Họ và tên: </label>{profile.user_full_name}</p>
                            </div>
                            <div className="view-form-group">
                                <p><label htmlFor="email">Email: </label>{profile.email}</p>
                            </div>
                        </div>
                        <div className='view-form-row'>
                            <div className="view-form-group">
                                <p><label>Ngày sinh: </label> {new Date(profile.birthdate).toLocaleDateString()}</p>
                            </div>
                            <div className="view-form-group">
                                <p><label htmlFor="date_joined">Ngày tham gia: </label>{new Date(profile.date_joined).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className='view-form-row'>
                            <div className="view-form-group">
                                <p><label htmlFor="is_active">Trạng thái tài khoản: </label>{profile.is_active ? 'Hoạt động' : 'Không hoạt động'}</p>
                            </div>
                            <div className="view-form-group">
                                <p><label htmlFor="gender">Giới tính: </label>{profile.gender === 'M' ? 'Nam' : 'Nữ'}</p>
                            </div>
                        </div>
                        <div className='view-form-row'>
                            <div style={{margin: 0}} className="view-form-group">
                                <p><label htmlFor="phone_number">Số điện thoại: </label>{profile.phone_number}</p>
                            </div>
                            <div style={{margin: 0}} className="view-form-group">
                                <p><label htmlFor="address">Địa chỉ: </label>{profile.address}</p>
                            </div>
                        </div>
                    </div>


                    <div className="view-links-section">
                        <h2>Đường dẫn đính kèm</h2>
                        <div className='view-link-input'>
                            <label htmlFor="website">Website</label>
                            <p>Đây là link website</p>
                        </div>

                        <div className='view-link-input'>
                            <label htmlFor="twitter">X (twitter)</label>
                            <p>Đây là link twitter</p>
                        </div>

                        <div className='view-link-input'>
                            <label htmlFor="linkedin">LinkedIn</label>
                            <p>Đây là link LinkedIn</p>
                        </div>

                        <div className='view-link-input'>
                            <label htmlFor="youtube">YouTube</label>
                            <p>Đây là link YouTube</p>
                        </div>

                        <div className='view-link-input'>
                            <label htmlFor="facebook">Facebook</label>
                            <p>Đây là link Facebook</p>
                        </div>
                    </div>
                    {updatable && (
                        <button className="view-btn-edit" onClick={() => navigate(`/profile/${user_id}/update`)}>
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewProfile;