import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './UpdateProfile.css';

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
        <div className="profile-container">
            <div className="left-panel">
                <div className="profile-header">
                    <img
                        src="/img/student_profile/std_prf.png"             
                        alt="Avatar"
                        className="profile-avatar"
                    />
                    <h2 className="profile-name">{profile.user_alias || profile.trim() !== '' ? profile.user_alias : profile.user_full_name}</h2>
                    <p className="profile-bio">{profile.user_bio ? profile.user_bio : "Ở đây hơi vắng vẻ"}</p>  
                    {/* Lấy theo data người dùng đã điền khi đăng ký tài khoản */}
                    <button className="share-profile-btn">
                        <img src="/img/student_profile/share_icon.svg" alt="Share" className="share-icon" /> {/* Icon chia sẻ */}
                        Chia sẻ hồ sơ
                    </button>
                </div>
                <div className="profile-menu">
                    <ul>
                        <li className="menu-item active">Hồ sơ người dùng</li>
                        <li className="menu-item">Các khoá học</li>
                        <li className="menu-item">Giảng viên yêu thích</li>
                        <li className="menu-item">Tin nhắn</li>
                        <li style={{'border':'none'}} className="menu-item">Liên hệ admin</li>
                    </ul>
                </div>
            </div>

            <div className="right-panel">
                <div className="user-profile-info">
                    <div className='form-row'>
                        <div className="form-group">
                            <label>Ngày sinh:</label>
                            <p> {new Date(profile.user_birthdate).toLocaleDateString()}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="date_joined">Ngày tham gia:</label>
                            <p>{new Date(profile.user_created_date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className='form-row'>
                        <div className="form-group">
                            <label htmlFor="is_active">Trạng thái tài khoản:</label>
                            <p>{profile.user_status ? 'Hoạt động' : 'Không hoạt động'}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="gender">Giới tính:</label>
                            <p>{profile.user_gender === 'M' ? 'Nam' : 'Nữ'}</p>
                        </div>
                    </div>
                    <div className='form-row'>
                        <div className="form-group">
                            <label htmlFor="fullname">Họ và tên:</label>
                            <p>{profile.user_full_name}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <p>{profile.user_email}</p>
                        </div>
                    </div>
                    <div className='form-row'>
                        <div className="form-group">
                            <label htmlFor="phone_number">Số điện thoại:</label>
                            <p>{profile.user_phone_number}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Địa chỉ:</label>
                            <p>{profile.user_address}</p>
                        </div>
                    </div>

                    <div className="links-section">
                        <h2>Đường dẫn đính kèm</h2>
                        <div className='link-input'>
                            <label htmlFor="website">Website</label>
                            <p>Đây là link website</p>
                        </div>

                        <div className='link-input'>
                            <label htmlFor="twitter">X (twitter)</label>
                            <p>Đây là link twitter</p>
                        </div>

                        <div className='link-input'>
                            <label htmlFor="linkedin">LinkedIn</label>
                            <p>Đây là link LinkedIn</p>
                        </div>

                        <div className='link-input'>
                            <label htmlFor="youtube">YouTube</label>
                            <p>Đây là link YouTube</p>
                        </div>

                        <div className='link-input'>
                            <label htmlFor="facebook">Facebook</label>
                            <p>Đây là link Facebook</p>
                        </div>
                    </div>
                    {updatable && (
                        <button className="btn-edit" onClick={() => navigate(`/profile/update`)}>
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewProfile;