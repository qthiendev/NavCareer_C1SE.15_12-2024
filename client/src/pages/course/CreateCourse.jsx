import React, { useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateCourse.css';
import PropTypes from 'prop-types';

// MentorCourse Component
const MentorCourse = ({
  property1,
  className,
  vector = "/assets/vector.svg",
}) => {
  const [state, dispatch] = useReducer(reducer, {
    property1: property1 || "frame-427318870",
  });

  return (
    <div className={`mentor-course ${state.property1} ${className}`}>
      {["frame-427318870", "frame-427319064", "frame-427319065", "frame-427319066"].includes(state.property1) && (
        <>
          <div className="div">
            {state.property1 === "frame-427318870" && <p className="text-wrapper">Các khoá học của bạn</p>}
            {state.property1 === "frame-427319064" && <p className="text-wrapper">Cập nhật thông tin khoá học</p>}
            {state.property1 === "frame-427319065" && <>Tạo khoá học mới</>}
            {state.property1 === "frame-427319066" && <>Doanh thu</>}
          </div>

          <img
            className="vector"
            alt="Vector"
            src={
              state.property1 === "frame-427319064" ? "/assets/vector-2.svg" :
              state.property1 === "frame-427319065" ? "/assets/vector-3.svg" :
              state.property1 === "frame-427319066" ? "/assets/vector-4.svg" :
              vector
            }
          />
        </>
      )}

      {state.property1 === "frame-427319116" && (
        <>
          <div className="frame">
            <div className="dropdown-list-button" onClick={() => dispatch("click")}>
              <p className="text-input">Cập nhật thông tin khoá học</p>
            </div>
            <div className="text-input-wrapper" onClick={() => dispatch("click_19")}>
              <div className="text-input">Tạo khoá học mới</div>
            </div>
            <div className="div-wrapper" onClick={() => dispatch("click_21")}>
              <div className="text-input">Doanh thu</div>
            </div>
          </div>
          <div className="frame-2">
            <p className="div">Các khoá học của bạn</p>
            <img className="vector" alt="Vector" src="/assets/vector-5.svg" />
          </div>
        </>
      )}
    </div>
  );
};

function reducer(state, action) {
  if (state.property1 === "frame-427319116") {
    switch (action) {
      case "click": return { property1: "frame-427319064" };
      case "click_19": return { property1: "frame-427319065" };
      case "click_21": return { property1: "frame-427319066" };
      default: return state;
    }
  }
  return state;
}

MentorCourse.propTypes = {
  property1: PropTypes.oneOf([
    "frame-427319066",
    "frame-427318870",
    "frame-427319116",
    "frame-427319064",
    "frame-427319065",
  ]),
  vector: PropTypes.string,
};
// CreateCourse Component
const CreateCourse = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [courseName, setCourseName] = useState('');
    const [courseShortDescription, setCourseShortDescription] = useState('');
    const [courseFullDescription, setCourseFullDescription] = useState('');
    const [courseDuration, setCourseDuration] = useState('');
    const [coursePrice, setCoursePrice] = useState('');
    const [error, setError] = useState(null);

    const [banChecked, setBanChecked] = useState(false);
    useEffect(() => {
        const checkBanStatus = async () => {
            try {
                const response = await axios.get('http://localhost:5000/admin/user/ban/check?procedure_name=CreateCourse', { withCredentials: true });
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

    const [espChecked, setESPChecked] = useState(false);
    useEffect(() => {
        const checkAuthorization = async () => {
            if (!banChecked) return;
            try {
                const response = await axios.get('http://localhost:5000/authz/esp', { withCredentials: true });
                if (response.status !== 200) {
                    navigate('/'); // Redirect if not authorized
                }
                setESPChecked(true);
            } catch (error) {
                console.error('Authorization check failed:', error);
                navigate('/');
            } finally {
                setLoading(false); // Set loading to false after the check
            }
        };

        checkAuthorization();
    }, [banChecked]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            course_name: courseName,
            course_short_description: courseShortDescription,
            course_full_description: courseFullDescription,
            course_duration: courseDuration,
            course_price: coursePrice,
        };

        try {
            const response = await axios.post('http://localhost:5000/course/create', formData, { withCredentials: true });
            if (response.status === 201 || response.status === 200) {
                navigate('/esp/course/view-all');
            }
        } catch (error) {
            console.error('Course creation failed:', error);
            setError('Failed to create course. Please try again.'); // Set error message
        }
    };

    if (loading) {
        return <p>Loading...</p>; // Show loading state
    }

    return (
        <div className="create-course">
           <div className="create-course">
      <div className="div">
        <img className="frame" alt="Frame" src={frame427318909} />

        <div className="group">
          <div className="overlap-group">
            <div className="frontend-profile">
              <img className="frame-3" alt="Frame" src={frame427319048} />
            </div>

            <div className="group-2">
              <div className="profile-wrapper">
                <div className="profile">Hồ sơ người dùng</div>
              </div>

              <MentorCourse
                className="mentor-course-instance"
                property1="frame-427318870"
                vector="image.svg"
              />
              <div className="my-reviews-wrapper">
                <div className="text-wrapper-2">Tin nhắn</div>
              </div>

              <div className="div-wrapper">
                <div className="text-wrapper-2">Liên hệ với Admin</div>
              </div>

              <div className="frame-4">
                <p className="text-wrapper-2">Đánh giá từ học viên</p>
              </div>
            </div>
          </div>
        </div>

        <div className="button">
          <div className="label">Tạo hồ sơ</div>
          <ArrowNarrowRight className="icon-arrow-narrow" color="white" />
        </div>
      </div>

      {/* User Profile Section */}
      <div className="frame">
        <img className="ellipse" alt="Ellipse" src={ellipse53} />

        <div className="john-doe"></div>

        <div className="button">
          <div className="label">Chia sẻ hồ sơ</div>
          <Share className="icon-share" color="#0F172A" />
        </div>
      </div>

      {/* Additional frames integrated here */}
      <div className="frame">
        <div className="text-wrapper">Thông tin khoá học</div>
        <div className="frontend-input-form">
          <div className="label"></div>
        </div>
      </div>

      <div className="frame">
        <div className="text-wrapper">Chứng chỉ</div>
        <div className="frontend-input-form">
          <div className="label"></div>
        </div>
      </div>

      <div className="frame">
        <div className="text-wrapper">Thêm/thay đổi ảnh</div>
        <p className="div">Thêm ảnh giới thiệu cho khoá học</p>

        <div className="overlap-group">
          <div className="image">
            <Icon className="icon-instance" />
          </div>
        </div>

        <div className="frontend-input-form">
          <div className="text-wrapper-2">Label</div>
        </div>

        <button className="button">
          <div className="label">Tải ảnh lên</div>
        </button>

        <button className="label-wrapper">
          <div className="label-2">Lưu ảnh</div>
        </button>
      </div>

      <div className="frame">
        <div className="text-wrapper">Giáo trình chi tiết</div>
        <div className="group">
          <div className="div">
            <img className="img" alt="Frame" src={frame427319115} />
            <p className="p">Thêm nội dung cho giáo trình</p>
          </div>
        </div>

        <div className="text-wrapper-2">Thêm/cập nhật bài giảng</div>
        <div className="text-wrapper-3">Chương 1</div>

        <div className="frontend-input-form">
          <div className="text-wrapper-4">Label</div>
        </div>

        <div className="image">
          <Icon className="icon-instance" />
        </div>

        <button className="button">
          <div className="label">Tải bài giảng lên</div>
        </button>

        <button className="label-wrapper">
          <div className="label-2">Lưu</div>
        </button>
      </div>
    </div>

            {/* Integrate MentorCourse component */}
            <MentorCourse
                className="mentor-course-instance"
                property1="frame-427318870"
                vector="image.svg"
            />
        </div>
    );
};

export default CreateCourse;
