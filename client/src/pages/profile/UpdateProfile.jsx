import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './UpdateProfile.css';

function UpdateProfile() {
    const [profile, setProfile] = useState({
        user_id: null,
        user_full_name: '',
        email: '',
        phone_number: '',
        address: '',
        gender: '',
        date_joined: '',
        is_active: 0, // Default as a number
    });

    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { user_id } = useParams();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/auth/status', { withCredentials: true });
                if (!response.data.sign_in_status || response.data.aid !== Number.parseInt(user_id)) {
                    navigate('/');
                }
            } catch (err) {
                console.error('Failed to check authentication status:', err);
            }
        };

        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/profile/read?auth_id=${user_id}`, { withCredentials: true });
                const birthdate = new Date(response.data.data.birthdate);
                setProfile({
                    user_id: response.data.data.authentication_id,
                    user_full_name: response.data.data.user_full_name,
                    email: response.data.data.email,
                    phone_number: response.data.data.phone_number,
                    address: response.data.data.address,
                    gender: response.data.data.gender,
                    date_joined: response.data.data.date_joined,
                    is_active: response.data.data.is_active ? 1 : 0, // Convert to 1 or 0
                });

                // Set the initial day, month, and year
                setDay(birthdate.getDate());
                setMonth(birthdate.getMonth() + 1); // Month is 0-based
                setYear(birthdate.getFullYear());

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch profile data.');
                setLoading(false);
            }
        };

        checkAuth();
        fetchProfileData();
    }, [user_id]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile({
            ...profile,
            [name]: name === 'is_active' ? Number(value) : value, // Convert is_active to a number
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Format birthdate as day/month/year
        const formattedBirthdate = `${day}/${month}/${year}`;
    
        try {
            await axios.put(
                `http://localhost:5000/profile/update`, 
                {
                    ...profile,
                    is_active: Number(profile.is_active), // Ensure is_active is sent as a number
                    birthdate: formattedBirthdate,
                },
                { withCredentials: true }
            );
    
            alert('Profile updated successfully!');
            navigate(`/profile/${profile.user_id}`);
        } catch (err) {
            setError('Failed to update profile.');
        }
    };
    

    if (loading) return <div>Loading...</div>;

    // Generate arrays for dropdowns
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: (new Date().getFullYear() - 1900 + 1) }, (_, i) => 1900 + i);

    return (
        <div className="profile-container">
            <div className="left-panel">
                <div className="profile-header">
                    <img
                        src="/img/student_profile/std_prf.png"             
                        alt="Avatar"
                        className="profile-avatar"
                    />
                    <h2 className="profile-name">huongdang123</h2>  
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
                <form className="user-profile-form" onSubmit={handleSubmit}>
                    <div className='form-row'>
                        <div className="form-group">
                            <label>Mã người dùng:</label>
                            <p>{profile.user_id}</p>
                        </div>
                        <div className="form-group">
                            <label>Ngày tham gia:</label>
                            <p>{profile.date_joined}</p>
                        </div>
                    </div>
                    <div className='form-row'>
                        <div className="form-group">
                            <label>Trạng thái tài khoản:</label>
                            <p>{profile.is_active ? "Active" : "Inactive"}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="gender">Giới tính</label>
                            <select
                                id="gender"
                                name="gender"
                                value={profile.gender}
                                onChange={handleInputChange}
                            >
                                <option value="true">Male</option>
                                <option value="false">Female</option>
                            </select>
                        </div>
                    </div>
                    <div className='form-row'>
                        <div className="form-group">
                            <label htmlFor="user_full_name">Họ và Tên</label>
                            <input
                                type="text"
                                id="user_full_name"
                                name="user_full_name"
                                value={profile.user_full_name}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={profile.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className='form-row'>
                        <div className="form-group">
                            <label htmlFor="phone_number">Số điện thoại</label>
                            <input
                                type="text"
                                id="phone_number"
                                name="phone_number"
                                value={profile.phone_number}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Address:</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={profile.address}
                                onChange={handleInputChange}
                            />
                        </div>

                    </div>
                    <div className="avatar-section">
                        <h3>Ảnh đại diện</h3>
                        <div className="avatar-preview">
                            {/* Hiển thị ảnh đại diện mặc định hoặc thông báo */}
                            <div className="avatar-placeholder">Chọn ảnh</div>
                        </div>
                        <div className="avatar-upload">
                            <label htmlFor="avatarUpload">Thêm/thay đổi ảnh đại diện của bạn</label>
                            <input type="file" id="avatarUpload" name="avatarUpload" />
                        </div>
                    </div>
                    {/* Đưa phần links-section vào bên trong form */}
                    <div className="links-section">
                        <h2>Đường dẫn đính kèm</h2>
                        <div >
                            <label htmlFor="website">Website</label>
                            <input type="text" id="website" placeholder="Label" />
                        </div>

                        <div>
                            <label htmlFor="twitter">X (twitter)</label>
                            <input type="text" id="twitter" placeholder="Label" />
                        </div>

                        <div>
                            <label htmlFor="linkedin">LinkedIn</label>
                            <input type="text" id="linkedin" placeholder="Label" />
                        </div>

                        <div>
                            <label htmlFor="youtube">YouTube</label>
                            <input type="text" id="youtube" placeholder="Label" />
                        </div>

                        <div>
                            <label htmlFor="facebook">Facebook</label>
                            <input type="text" id="facebook" placeholder="Label" />
                        </div>
                    </div>
                    {/* Nút submit ở cuối cùng */}
                    <button type="submit" className="save-profile-btn">Lưu hồ sơ</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateProfile;
