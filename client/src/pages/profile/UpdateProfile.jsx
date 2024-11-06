import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateProfile.css';

function UpdateProfile() {
    const [profile, setProfile] = useState({});
    const [avatarPreview, setAvatarPreview] = useState('');
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
                await axios.get('http://localhost:5000/admin/user/ban/check?procedure_name=UpdateProfile', { withCredentials: true });
                setBanChecked(true);
            } catch (error) {
                alert('BANNED');
                navigate(-1);
            }
        };
        checkBanStatus();
    }, [navigate]);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!banChecked) return;
            try {
                const response = await axios.get('http://localhost:5000/profile/read?user_id=self', { withCredentials: true });
                if (!response.data.user_full_name) {
                    navigate('/profile/create');
                    return;
                }

                const birthdate = new Date(response.data.user_birthdate);
                setProfile(response.data);
                setAvatarPreview(response.data.avatar); // Set initial avatar preview
                setDay(birthdate.getDate());
                setMonth(birthdate.getMonth() + 1);
                setYear(birthdate.getFullYear());
                setLoading(false);
            } catch {
                setError('Failed to fetch profile data.');
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [banChecked, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value === 'true' ? true : value === 'false' ? false : value,
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (30 KB = 30 * 1024 bytes)
            if (file.size > 50 * 1024) {
                alert('File size should not exceed 50 KB. Please choose a smaller image.');
                return;
            }
    
            // Check file type (only allow PNG and JPEG)
            if (file.type === 'image/png' || file.type === 'image/jpeg') {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAvatarPreview(reader.result);
                    setProfile((prevProfile) => ({
                        ...prevProfile,
                        avatar: reader.result, // Update the profile with the new avatar
                    }));
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please select a valid PNG or JPEG image.');
            }
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedBirthdate = `${day}/${month}/${year}`;
        try {
            await axios.put(
                'http://localhost:5000/profile/update',
                {
                    ...profile,
                    user_birthdate: formattedBirthdate,
                },
                { withCredentials: true }
            );
            alert('Profile updated successfully!');
            navigate(-1);
        } catch {
            setError('Failed to update profile.');
        }
    };

    if (loading) return <div>Loading...</div>;

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i);

    return (
        <div className='profile-container'>
            <div className='left-panel'>
                <div className='profile-header'>
                    <img src={avatarPreview || profile?.avatar} alt='Avatar' className='profile-avatar' />
                    <h2 className='profile-name'>{profile?.user_alias || profile?.user_full_name}</h2>
                    <p className='profile-bio'>{profile?.user_bio || 'Ở đây hơi vắng vẻ'}</p>
                    <button className='share-profile-btn'>
                        <img src='/img/student_profile/share_icon.svg' alt='Share' className='share-icon' />
                        Chia sẻ hồ sơ
                    </button>
                </div>
                <div className='profile-menu'>
                    <ul>
                        <li className='menu-item active'>Hồ sơ người dùng</li>
                        <li className='menu-item'>Các khoá học</li>
                        <li className='menu-item'>Giảng viên yêu thích</li>
                        <li className='menu-item'>Tin nhắn</li>
                        <li className='menu-item' style={{ border: 'none' }}>Liên hệ admin</li>
                    </ul>
                </div>
            </div>
            <div className='right-panel'>
                <form className='user-profile-form' onSubmit={handleSubmit}>
                    <div className='form-row'>
                        <div className='form-group'>
                            <label htmlFor='user_full_name'>Họ và Tên</label>
                            <input
                                type='text'
                                id='user_full_name'
                                name='user_full_name'
                                value={profile?.user_full_name || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='email'>Email</label>
                            <input
                                type='email'
                                id='email'
                                name='user_email'
                                value={profile?.user_email || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className='form-row'>
                        <div className='form-group'>
                            <label htmlFor='user_status'>Trạng thái tài khoản:</label>
                            <select
                                id='user_status'
                                name='user_status'
                                value={profile?.user_status}
                                onChange={handleInputChange}
                            >
                                <option value={true}>Hoạt động</option>
                                <option value={false}>Khóa</option>
                            </select>
                        </div>
                        <div className='form-group'>
                            <label>Ngày tham gia:</label>
                            <p>{new Date(profile?.user_created_date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className='form-row'>
                        <div className='form-group'>
                            <label>Ngày sinh</label>
                            <div id='update-date-selects'>
                                <select name='day' value={day} onChange={(e) => setDay(e.target.value)}>
                                    <option value=''>Ngày</option>
                                    {days.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                                <select name='month' value={month} onChange={(e) => setMonth(e.target.value)}>
                                    <option value=''>Tháng</option>
                                    {months.map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                <select name='year' value={year} onChange={(e) => setYear(e.target.value)}>
                                    <option value=''>Năm</option>
                                    {years.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='user_gender'>Giới tính</label>
                            <select
                                id='user_gender'
                                name='user_gender'
                                value={profile?.user_gender}
                                onChange={handleInputChange}
                            >
                                <option value={true}>Nam</option>
                                <option value={false}>Nữ</option>
                            </select>
                        </div>
                    </div>
                    <div className='form-row'>
                        <div className='form-group'>
                            <label htmlFor='phone_number'>Số điện thoại</label>
                            <input
                                type='text'
                                id='phone_number'
                                name='user_phone_number'
                                value={profile?.user_phone_number || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='address'>Địa chỉ</label>
                            <input
                                type='text'
                                id='address'
                                name='user_address'
                                value={profile?.user_address || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className='avatar-section'>
                        <h3>Ảnh đại diện</h3>
                        {avatarPreview && <img src={avatarPreview} alt='Avatar Preview' className='avatar-preview' />}
                        <div className='avatar-upload'>
                            <label htmlFor='avatarUpload'>Thêm/thay đổi ảnh đại diện của bạn</label>
                            <input type='file' id='avatarUpload' name='avatarUpload' accept='image/png, image/jpeg' onChange={handleAvatarChange} />
                        </div>
                    </div>
                    <div className='links-section'>
                        <h2>Đường dẫn đính kèm</h2>
                        {['website', 'twitter', 'linkedin', 'youtube', 'facebook'].map((platform) => (
                            <div className='link-input' key={platform}>
                                <label htmlFor={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
                                <input type='text' id={platform} placeholder='Label' />
                            </div>
                        ))}
                    </div>
                    <button type='submit' className='save-profile-btn'>Lưu hồ sơ</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateProfile;
