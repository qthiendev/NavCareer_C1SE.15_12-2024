import { useState, useEffect } from 'react';
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
    const [error, setError] = useState({}); // Sử dụng `error` thay vì `errors`
    const navigate = useNavigate();

    useEffect(() => {
        const checkBanStatus = async () => {
            try {
                await axios.get('http://localhost:5000/admin/user/ban/check?procedure_name=UpdateProfile', { withCredentials: true });
                setBanChecked(true);
            } catch (error) {
                console.log(error);
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
                setAvatarPreview(response.data.avatar);
                setDay(birthdate.getDate());
                setMonth(birthdate.getMonth() + 1);
                setYear(birthdate.getFullYear());
                setLoading(false);
            } catch {
                setError((prev) => ({ ...prev, general: 'Failed to fetch profile data.' }));
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
            if (file.size > 56 * 1024) {
                alert('File size should not exceed 56 KB. Please choose a smaller image.');
                return;
            }
            if (file.type === 'image/png' || file.type === 'image/jpeg') {
                setAvatarPreview(URL.createObjectURL(file));
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    avatar: file,
                }));
            } else {
                alert('Vui lòng chọn ảnh có định dạng PNG hoặc JPEG.');
            }
        }
    };

    const handleValidation = () => {
        const newError = {};
    
        // Họ và tên
        if (!profile.user_full_name?.trim()) {
            newError.user_full_name = "Họ và tên không được để trống.";
        } else if (/[@#$%]/.test(profile.user_full_name) || profile.user_full_name.length > 50) {
            newError.user_full_name = "Họ và tên không được chứa ký tự đặc biệt và tối đa 50 ký tự.";
        }
    
        // Số điện thoại
        if (!profile.user_phone_number?.trim()) {
            newError.user_phone_number = "Số điện thoại phải là 10 chữ số.";
        } else if (!/^\d{10}$/.test(profile.user_phone_number)) {
            newError.user_phone_number = "Số điện thoại phải là 10 chữ số.";
        }
    
        // Email
        if (!profile.user_email?.trim()) {
            newError.user_email = "Email không được để trống.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.user_email)) {
            newError.user_email = "Email không hợp lệ.";
        }
    
        // Giới tính
        if (profile.user_gender === null || profile.user_gender === '' || profile.user_gender === undefined) {
            newError.user_gender = "Vui lòng chọn giới tính.";
        }
    
        // Ngày sinh
        if (!day || !month || !year) {
            newError.user_birthdate = "Vui lòng chọn đầy đủ ngày, tháng, năm sinh.";
        } else {
            const today = new Date();
            const birthDate = new Date(year, month - 1, day);
    
            if (isNaN(birthDate.getTime()) || birthDate.getDate() !== parseInt(day)) {
                newError.user_birthdate = "Ngày sinh không hợp lệ.";
            } else {
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                const dayDiff = today.getDate() - birthDate.getDate();
    
                const isUnder16 = age < 16 || (age === 16 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));
    
                if (birthDate > today) {
                    newError.user_birthdate = "Ngày sinh không được là ngày trong tương lai.";
                } else if (isUnder16) {
                    newError.user_birthdate = "Tuổi phải từ 16 trở lên.";
                }
            }
        }
    
        // Địa chỉ liên lạc
        if (!profile.user_address?.trim()) {
            newError.user_address = "Địa chỉ không được để trống.";
        } else if (profile.user_address.length > 50) {
            newError.user_address = "Địa chỉ tối đa 50 ký tự.";
        }
    
        setError(newError);
        return Object.keys(newError).length === 0;
    };    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (handleValidation()) {
            const formattedBirthdate = `${day}/${month}/${year}`;
            const formData = new FormData();
            formData.append('user_full_name', profile.user_full_name);
            formData.append('user_alias', profile.user_alias);
            formData.append('user_bio', profile.user_bio);
            formData.append('user_birthdate', formattedBirthdate);
            formData.append('user_gender', profile.user_gender);
            formData.append('user_email', profile.user_email);
            formData.append('user_phone_number', profile.user_phone_number);
            formData.append('user_status', profile.user_status);
            formData.append('user_address', profile.user_address);
      
            if (profile.avatar) {
                formData.append('avatar', profile.avatar);
            }
        
            try {
                await axios.put(
                    'http://localhost:5000/profile/update',
                    formData,
                    { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
                );
                alert('Cập nhật hồ sơ thành công.');
                navigate(-1);
            } catch {
                setError((prev) => ({ ...prev, general: 'Cập nhật hồ sơ thất bại. Vui lòng thử lại.' }));
            }
        } else {
            console.log('Xác thực không thành công. Vui lòng sửa lỗi.');
        }
    };
    
    if (loading) return <div>Loading...</div>;

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i);


    return (
        <div className='profile-container'>
            <div className="view-left-panel">
                <div className="view-profile-header">
                    <img
                        src={profile.avatar}            
                        alt="Avatar"
                        className="view-profile-avatar"
                    />
                    <h2 className="view-profile-name">{profile.user_full_name}</h2>  
                    <p className="view-profile-bio">{profile.user_bio ? profile.user_bio : 'Have no bio.'}</p>  
                    {/* Lấy theo data người dùng đã điền khi đăng ký tài khoản */}
                    <button className="view-share-profile-btn">
                        <img src="/img/student_profile/share_icon.svg" alt="Share" className="share-icon" /> {/* Icon chia sẻ */}
                        Chia sẻ hồ sơ
                    </button>
                </div>

                <div className='update-information'>
                    <h3>THÔNG TIN</h3>
                    <div className="update-info-item">
                        <img src="/img/student_profile/name_icon.svg" alt="Name Icon" className="info-icon" />
                        <p>{profile.user_full_name}</p>
                    </div>
                    <div className="update-info-item">
                        <img src="/img/student_profile/email_icon.svg" alt="Email Icon" className="info-icon" />
                        <p>{profile.user_email}</p>
                    </div>
                    <div className="update-info-item">
                        <img src="/img/student_profile/birthday_icon.svg" alt="Birdthday Icon" className="update-info-icon" />
                        <p> {new Date(profile.user_birthdate).toLocaleDateString()}</p>
                    </div>
                    <div className="update-info-item">
                        <img src="/img/student_profile/joinday_icon.svg" alt="Joinday Icon" className="update-info-icon" />
                        <p>{new Date(profile.user_created_date).toLocaleDateString()}</p>
                    </div>
                    <div className="update-info-item">
                        <img src="/img/student_profile/gender_icon.svg" alt="Gender Icon" className="update-info-icon" />
                        <p>{profile.user_gender ? 'Nam' : 'Nữ'}</p>
                    </div>
                    <div className="update-info-item">
                        <img src="/img/student_profile/address_icon.svg" alt="Address Icon" className="update-info-icon" />
                        <p>{profile.user_address}</p>
                    </div>
                    <div className="update-info-item">
                        <img src="/img/student_profile/phone_icon.svg" alt="Tel Icon" className="update-info-icon" />
                        <p>{profile.user_phone_number}</p>
                    </div>
                </div>

                <div className='update-information'>
                    <h3>GIỚI THIỆU</h3>
                    <p>Đây là phần giới thiệu chi tiết về cá nhân, công ty, hoặc tổ chức.</p>
                </div>

                <div className='update-information'>
                    <h3>CHỨNG CHỈ</h3>
                    <p>Danh sách các chứng chỉ, bằng cấp hoặc chứng nhận có liên quan.</p>
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
                            {error.user_full_name && <h1 className="error-message">{error.user_full_name}</h1>}
                        </div>

                        <div className='form-group'>
                            <label htmlFor='email'>Email</label>
                            <input
                                type='email'
                                id='email'
                                name='user_email'
                                value={profile?.user_email || ''}
                                onChange={handleInputChange}
                            />
                            {error.user_email && <h1 className="error-message">{error.user_email}</h1>}
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
                            {error.user_status && <h1 className="error-message">{error.user_status}</h1>}
                        </div>
                        <div className='form-group'>
                            <label>Ngày tham gia:</label>
                            <p>{new Date(profile?.user_created_date).toLocaleDateString()}</p>
                            {error.user_created_date && <h1 className="error-message">{error.user_created_date}</h1>}
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
                            {error.user_birthdate && <h1 className="error-message">{error.user_birthdate}</h1>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor='user_gender'>Giới tính</label>
                            <select
                                id='user_gender'
                                name='user_gender'
                                value={profile?.user_gender}
                                onChange={handleInputChange}
                            >
                                <option value=''>Chọn giới tính</option>
                                <option value={true}>Nam</option>
                                <option value={false}>Nữ</option>
                            </select>
                            {error.user_gender && <h1 className="error-message">{error.user_gender}</h1>}
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
                            {error.user_phone_number && <h1 className="error-message">{error.user_phone_number}</h1>}
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
                            {error.user_address && <h1 className="error-message">{error.user_address}</h1>}
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
                    {/* <div className='links-section'>
                        <h2>Đường dẫn đính kèm</h2>
                        {['website', 'twitter', 'linkedin', 'youtube', 'facebook'].map((platform) => (
                            <div className='link-input' key={platform}>
                                <label htmlFor={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
                                <input type='text' id={platform} placeholder='Label' />
                            </div>
                        ))}
                    </div> */}
                    <button className='update-profile-btn'>Lưu hồ sơ</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateProfile;
