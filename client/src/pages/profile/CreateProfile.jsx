import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateProfile.css';

const ProfileForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        gender: '',
        birthDay: '',
        birthMonth: '',
        birthYear: '',
        email: '',
        address: ''
    });
    const [errors, setErrors] = useState({});
    const [noti, setNoti] = useState(null);
    const [aid, setAid] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkProfileStatus = async () => {
            try {
                const authResponse = await axios.get('http://localhost:5000/auth/status', { withCredentials: true });

                if (!authResponse.data.sign_in_status) {
                    navigate('/signin');
                    return;
                }

                setAid(authResponse.data.aid);

                const profileResponse = await axios.get(`http://localhost:5000/profile/read?user_id=self`, { withCredentials: true });
                if (profileResponse.data.user_full_name) {
                    navigate(`/profile/self`);
                }

            } catch (error) {
                console.error('Failed to check profile status:', error);
            } finally {
                setLoading(false);
            }
        };

        checkProfileStatus();
    }, [navigate]);

    // Validation logic
    const validateForm = () => {
        const newErrors = {};
    
        // Họ và tên
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Họ và tên không được để trống.";
        } else if (/[@#$%]/.test(formData.fullName) || formData.fullName.length > 50) {
            newErrors.fullName = "Họ và tên không được chứa ký tự đặc biệt và tối đa 50 ký tự.";
        }
    
        // Số điện thoại
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Số điện thoại phải là 10 chữ số.";
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Số điện thoại phải là 10 chữ số.";
        }
    
        // Email
        if (!formData.email.trim()) {
            newErrors.email = "Email không được để trống.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ.";
        }
    
        // Giới tính
        if (!formData.gender) {
            newErrors.gender = "Vui lòng chọn giới tính.";
        }
    
        // Ngày sinh
        if (!formData.birthDay || !formData.birthMonth || !formData.birthYear) {
            newErrors.birthDate = "Vui lòng chọn đầy đủ ngày, tháng, năm sinh.";
        } else {
            const today = new Date();
            const birthDate = new Date(formData.birthYear, formData.birthMonth - 1, formData.birthDay);
    
            if (isNaN(birthDate.getTime()) || birthDate.getDate() !== parseInt(formData.birthDay)) {
                newErrors.birthDate = "Ngày sinh không hợp lệ.";
            } else {
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                const dayDiff = today.getDate() - birthDate.getDate();
    
                const isUnder16 = age < 16 || (age === 16 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));
    
                if (birthDate > today) {
                    newErrors.birthDate = "Ngày sinh không được là ngày trong tương lai.";
                } else if (isUnder16) {
                    newErrors.birthDate = "Tuổi phải từ 16 trở lên.";
                }
            }
        }
    
        // Địa chỉ liên lạc
        if (!formData.address.trim()) {
            newErrors.address = "Địa chỉ không được để trống.";
        } else if (formData.address.length > 50) {
            newErrors.address = "Địa chỉ tối đa 50 ký tự.";
        }
    
        setErrors(newErrors);
    
        // Form is valid if there are no errors
        return Object.keys(newErrors).length === 0;
    };
    
    

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const formattedBirthdate = `${formData.birthDay}/${formData.birthMonth}/${formData.birthYear}`;

            const formSubmissionData = {
                user_full_name: formData.fullName,
                user_birthdate: formattedBirthdate,
                user_gender: formData.gender,
                user_email: formData.email,
                user_phone_number: formData.phoneNumber,
                user_address: formData.address,
            };

            try {
                await axios.post('http://localhost:5000/profile/create', formSubmissionData, { withCredentials: true });
                navigate(`/profile/self`);
            } catch (error) {
                setNoti('Tạo hồ sơ thất bại. Vui lòng thử lại.');
                console.error('Failed to create profile:', error);
            }
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="profile-form-container">
            <div className="image-section">
                <img src="/img/prf-inf.png" alt="profile form" />
            </div>

            <div className="form-section">
                <h2 className="form-title">Thông tin hồ sơ</h2>
                <form className="profile-form" onSubmit={handleFormSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Họ và tên</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="Nhập họ và tên..."
                            />
                            {errors.fullName && <h4 className='prf-error'>{errors.fullName}</h4>}
                        </div>

                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                placeholder="Nhập số điện thoại..."
                            />
                            {errors.phoneNumber && <h4 className='prf-error'>{errors.phoneNumber}</h4>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Giới tính</label>
                            <select name="gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                <option value="">Chọn giới tính</option>
                                <option value="1">Nam</option>
                                <option value="0">Nữ</option>
                            </select>
                            {errors.gender && <h4 className='prf-error'>{errors.gender}</h4>}
                        </div>

                        <div className="form-group" id='create-date-selects'>
                            <label>Ngày sinh</label>
                            <div>
                                <select name="birthDay" value={formData.birthDay} onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}>
                                    <option value="">Ngày</option>
                                    {[...Array(31).keys()].map((d) => (
                                        <option key={d+1} value={d+1}>{d+1}</option>
                                    ))}
                                </select>

                                <select name="birthMonth" value={formData.birthMonth} onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}>
                                    <option value="">Tháng</option>
                                    {[...Array(12).keys()].map((m) => (
                                        <option key={m+1} value={m+1}>{m+1}</option>
                                    ))}
                                </select>

                                <select style={{margin: 0}} name="birthYear" value={formData.birthYear} onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}>
                                    <option value="">Năm</option>
                                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.birthDate && <h4 className='prf-error'>{errors.birthDate}</h4>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Email"
                            />
                            {errors.email && <h4 className='prf-error'>{errors.email}</h4>}
                        </div>

                        <div className="form-group">
                            <label>Địa chỉ liên lạc</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Địa chỉ liên lạc"
                            />
                            {errors.address && <h4 className='prf-error'>{errors.address}</h4>}
                        </div>
                    </div>

                    {noti && <div className="error-message" style={{ color: 'red' }}>{noti}</div>}
                    <button className="crpf-submit-button">Tạo hồ sơ</button>             
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;
