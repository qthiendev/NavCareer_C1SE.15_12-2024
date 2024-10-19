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

                const { aid } = authResponse.data;

                setAid(aid);

                const profileResponse = await axios.get(`http://localhost:5000/profile/read?auth_id=${aid}`, { withCredentials: true });
                console.log(profileResponse);
                if (!Number.isNaN(profileResponse.data.data.user_id)) {
                    navigate(`/profile/${aid}`);
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
        
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Họ và tên không được để trống.";
        }

        if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "SDT phải là 10 chữ số.";
        }

        if (!formData.gender) {
            newErrors.gender = "Vui lòng chọn giới tính.";
        }

        if (!formData.birthDay || !formData.birthMonth || !formData.birthYear) {
            newErrors.birthDate = "Vui lòng chọn đầy đủ ngày, tháng, năm sinh.";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ.";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Địa chỉ không được để trống.";
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
                userFullName: formData.fullName,
                email: formData.email,
                birthdate: formattedBirthdate,
                gender: formData.gender,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
            };

            try {
                await axios.post('http://localhost:5000/profile/create', formSubmissionData, { withCredentials: true });
                navigate(`/profile/${aid}`);
            } catch (error) {
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
                                placeholder="Họ và tên"
                            />
                            {errors.fullName && <p className="error">{errors.fullName}</p>}
                        </div>

                        <div className="form-group">
                            <label>SDT</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                placeholder="Số điện thoại"
                            />
                            {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
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
                            {errors.gender && <p className="error">{errors.gender}</p>}
                        </div>

                        <div className="form-group">
                            <label>Ngày sinh</label>
                            <div className="date-selects">
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

                                <select name="birthYear" value={formData.birthYear} onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}>
                                    <option value="">Năm</option>
                                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.birthDate && <p className="error">{errors.birthDate}</p>}
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
                            {errors.email && <p className="error">{errors.email}</p>}
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
                            {errors.address && <p className="error">{errors.address}</p>}
                        </div>
                    </div>

                    <button type="submit" className="submit-button">Tạo hồ sơ</button>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;
