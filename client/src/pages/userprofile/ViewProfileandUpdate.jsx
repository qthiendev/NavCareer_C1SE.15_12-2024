// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './ViewProfileandUpdate.css';
const ViewProfile = () =>{
    const [data, setData] = useState({
        user_id: "",
        user_name: "",
        email: "",
        birthdate: "",
        gender: "",
        phone_num: "",
        address: "",
        date_joined: "",
        resource_url: "",
        auth_method: "",
      });
    
      const [edit, setEdit] = useState(true);  // Initially set to true so fields are editable
    
      const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
      };
    
      const handleUpdate = () => {
        setEdit(false);
        // Add save logic here
        console.log("Updated data:", data);
      };
    
      return (
        <div className="profile-cnt">
          <h2>Profile</h2>
          <div className="profile-field">
            <label>User ID:</label>
            {edit ? (
              <input
                type="text"
                name="user_id"
                value={data.user_id}
                onChange={handleChange}
              />
            ) : (
              <span>{data.user_id}</span>
            )}
          </div>
          <div className="profile-field">
            <label>User Name:</label>
            {edit ? (
              <input
                type="text"
                name="user_name"
                value={data.user_name}
                onChange={handleChange}
              />
            ) : (
              <span>{data.user_name}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Email:</label>
            {edit ? (
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
              />
            ) : (
              <span>{data.email}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Birthdate:</label>
            {edit ? (
              <input
                type="date"
                name="birthdate"
                value={data.birthdate}
                onChange={handleChange}
              />
            ) : (
              <span>{data.birthdate}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Gender:</label>
            {edit ? (
              <select name="gender" value={data.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <span>{data.gender}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Phone:</label>
            {edit ? (
              <input
                type="text"
                name="phone_num"
                value={data.phone_num}
                onChange={handleChange}
              />
            ) : (
              <span>{data.phone_num}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Address:</label>
            {edit ? (
              <input
                type="text"
                name="address"
                value={data.address}
                onChange={handleChange}
              />
            ) : (
              <span>{data.address}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Date Joined:</label>
            {edit ? (
              <input
                type="date"
                name="date_joined"
                value={data.date_joined}
                onChange={handleChange}
              />
            ) : (
              <span>{data.date_joined}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Resource URL:</label>
            {edit ? (
              <input
                type="url"
                name="resource_url"
                value={data.resource_url}
                onChange={handleChange}
              />
            ) : (
              <span>{data.resource_url}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Auth Method:</label>
            {edit ? (
              <input
                type="text"
                name="auth_method"
                value={data.auth_method}
                onChange={handleChange}
              />
            ) : (
              <span>{data.auth_method}</span>
            )}
          </div>
          <div className="profile-actions">
            {edit ? (
              <button onClick={handleUpdate}>Save</button>
            ) : (
              <button onClick={() => setEdit(true)}>Update</button>
            )}
          </div>
        </div>
    );
};
export default ViewProfile;