import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateProfile.css';

function UpdateProfile() {
    const [profile, setProfile] = useState();
    const [banChecked, setBanChecked] = useState(false);

    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const checkBanStatus = async () => {
            try {
                const response = await axios.get('http://localhost:5000/admin/user/ban/check?procedure_name=UpdateProfile', { withCredentials: true });
                console.log(response);
                setBanChecked(true);
            } catch (error) {
                console.error('Failed to check ban status:', error);
                alert('BANNED');
                navigate(-1);
            }
        };

        checkBanStatus();
    }, []);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!banChecked) return;
            try {
                const response = await axios.get(`http://localhost:5000/profile/read?user_id=self`, { withCredentials: true });
                if (!response.data.user_full_name) {
                    navigate('/profile/create');
                    return;
                }
                
                const birthdate = new Date(response.data.user_birthdate);

                setProfile(response.data);

                setDay(birthdate.getDate());
                setMonth(birthdate.getMonth() + 1);
                setYear(birthdate.getFullYear());

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch profile data.');
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [banChecked]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile({
            ...profile,
            [name]: name === 'user_status' ? Number(value) : value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Format birthdate as day/month/year
        const formattedBirthdate = `${day}/${month}/${year}`;
        console.log({
            dataSend: {
                user_full_name: profile?.user_full_name,
                user_alias: profile?.user_alias,
                user_birthdate: formattedBirthdate,
                user_gender: Number(profile?.user_gender),
                user_email: profile?.user_email,
                user_phone_number: profile?.user_phone_number,
                user_address: profile?.user_address,
                user_status: Number(profile?.user_status),
            }
        });
        try {
            await axios.put(
                `http://localhost:5000/profile/update`,
                {
                    user_full_name: profile?.user_full_name,
                    user_alias: profile?.user_alias,
                    user_bio: profile?.user_bio,
                    user_birthdate: formattedBirthdate,
                    user_gender: profile?.user_gender,
                    user_email: profile?.user_email,
                    user_phone_number: profile?.user_phone_number,
                    user_address: profile?.user_address,
                    user_status: profile?.user_status,
                },
                { withCredentials: true }
            );

            alert('Profile updated successfully!');
            navigate(-1);
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
                        src={profile?.avatar}
                        alt="Avatar"
                        className="profile-avatar"
                    />
                    <h2 className="profile-name">{profile?.user_alias || profile?.trim() !== '' ? profile?.user_alias : profile?.user_full_name}</h2>
                    <p className="profile-bio">{profile?.user_bio ? profile?.user_bio : "Ở đây hơi vắng vẻ"}</p>  
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
                        <li style={{ 'border': 'none' }} className="menu-item">Liên hệ admin</li>
                    </ul>
                </div>
            </div>

            <div className="right-panel">
                <form className="user-profile-form" onSubmit={handleSubmit}>
                    <div className='form-row'>
                        <div className="form-group">
                            <label htmlFor="user_status">Trạng thái tài khoản:</label>
                            <select
                                id="status"
                                name="status"
                                value={profile?.user_status ? "true" : "false"}
                                onChange={handleInputChange}
                            >
                                <option value="true">Hoạt động</option>
                                <option value="false">Khóa</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Ngày tham gia:</label>
                            <p>{new Date(profile?.user_created_date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className='form-row'>
                        <div className="form-group">
                            <label>Ngày sinh</label>
                            <div className="date-selects">
                                <select name="day" value={day} onChange={(e) => setDay(e.target.value)}>
                                    <option value="">Ngày</option>
                                    {days.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>

                                <select name="month" value={month} onChange={(e) => setMonth(e.target.value)}>
                                    <option value="">Tháng</option>
                                    {months.map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>

                                <select name="year" value={year} onChange={(e) => setYear(e.target.value)}>
                                    <option value="">Năm</option>
                                    {years.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="gender">Giới tính</label>
                            <select
                                id="gender"
                                name="gender"
                                value={profile?.user_gender ? "1" : "0"}
                                onChange={handleInputChange}
                            >
                                <option value="1">Nam</option>
                                <option value="0">Nữ</option>
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
                                value={profile?.user_full_name}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={profile?.user_email}
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
                                value={profile?.user_phone_number}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Địa chỉ:</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={profile?.user_address}
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
                        <div className='link-input'>
                            <label htmlFor="website">Website</label>
                            <input type="text" id="website" placeholder="Label" />
                        </div>

                        <div className='link-input'>
                            <label htmlFor="twitter">X (twitter)</label>
                            <input type="text" id="twitter" placeholder="Label" />
                        </div>

                        <div className='link-input'>
                            <label htmlFor="linkedin">LinkedIn</label>
                            <input type="text" id="linkedin" placeholder="Label" />
                        </div>

                        <div className='link-input'>
                            <label htmlFor="youtube">YouTube</label>
                            <input type="text" id="youtube" placeholder="Label" />
                        </div>

                        <div className='link-input'>
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