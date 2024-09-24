INSERT INTO Authorizations(authorization_id, description)
VALUES
(0, N'Admin'),
(1, N'Educational Service Provider'),
(2, N'Student');

INSERT INTO Authentications(authentication_id, account, password, identifier_email, created_date, authorization_id)
VALUES
(0, N'admin', N'adminpass', N'admin@example.com', GETDATE(), 0),
(1, N'educator1', N'educatorpass', N'educator1@example.com', GETDATE(), 1),
(2, N'student1', N'studentpass', N'student1@example.com', GETDATE(), 2),
(3, N'qthiendev', N'qthiendev', N'trinhquythien.dev@gmail.com', GETDATE(), 2);

INSERT INTO Users(user_id, user_name, email, birthdate, gender, phone_number, address, date_joined, avatar_img, cover_img, authentication_id)
VALUES
(0, 'Alice Smith', 'alice@example.com', GETDATE(), 1, '123-456-7890', '123 Main St', GETDATE(), NULL, NULL, 0),
(1, 'Bob Johnson', 'bob@example.com', GETDATE(), 0, '098-765-4321', '456 Elm St', GETDATE(), NULL, NULL, 1),
(2, 'Charlie Brown', 'charlie@example.com', GETDATE(), 1, '111-222-3333', '789 Pine St', GETDATE(), NULL, NULL, 2),
(3, N'Trịnh Quý Thiện', 'trinhquythien.dev@gmail.com', GETDATE(), 1, '0395075100', N'Cẩm Lệ, Đà Nẵng', GETDATE(), NULL, NULL, 3);

INSERT INTO Courses(course_id, course_name, course_description, duration, created_date, user_id)
VALUES 
(0, 'Introduction to Programming', 'Learn the basics of programming.', '3 months', GETDATE(), 2),
(1, 'Data Science Fundamentals', 'Introduction to data science concepts.', '2 months', GETDATE(), 2),
(2, 'Web Development Basics', 'Learn the basics of web development.', '1 month', GETDATE(), 2);

INSERT INTO Modules(module_id, module_ordinal, module_name, module_description, created_date, course_id)
VALUES
(0, 0, 'Module 1: Basics', 'Introduction to programming concepts.', GETDATE(), 0),
(1, 1, 'Module 2: Control Structures', 'Understanding loops and conditionals.', GETDATE(), 0),
(2, 0, 'Module 1: Data Science Overview', 'Introduction to data science.', GETDATE(), 1),
(3, 0, 'Module 1: Website Overview', 'Introduction to website.', GETDATE(), 2);

INSERT INTO CollectionTypes(collection_type_id, collection_name)
VALUES 
(0, 'Lesson'),
(1, 'Quiz');

INSERT INTO Collections(collection_id, collection_ordinal, collection_name, created_date, module_id, collection_type_id)
VALUES 
(0, 0, 'Introduction', GETDATE(), 0, 0),
(1, 1, 'Control Structures Article', GETDATE(), 0, 0),
(2, 2, 'Quiz', GETDATE(), 0, 1),
(3, 0, 'Control Structures Article', GETDATE(), 1, 0);

INSERT INTO EnrollmentStatus(status_id, status_description)
(0, 'Enrolled'),
(1, 'Completed');

INSERT INTO Enrollments(enrollment_id, student_id, course_id, enrollment_date, status_id)
VALUES 
(0, 3, 0, GETDATE(), 1),
(1, 3, 1, GETDATE(), 0);

INSERT INTO Grades(grade_id, enrollment_id, module_id, grade_number, graded_date)
VALUES 
(0, 0, 0, 85, GETDATE()),
(1, 0, 1, 90, GETDATE());

INSERT INTO Accomplishments(accomplishment_id, student_id, course_id, completion_date, overall_grade, certificate_id)
VALUES 
(0, 2, 1, GETDATE(), 87, 'CERT123'),
(1, 2, 2, GETDATE(), 90, 'CERT124');

INSERT INTO CourseFeedbacks (feedback_id, feedback_description, feedback_date, course_id, user_id)
VALUES 
(0, 'Great course, very informative!', GETDATE(), 0, 2);

INSERT INTO Fields (field_id, field_description)
VALUES 
(0, 'Programming'),
(1, 'Data Science'),
(2, 'Web Development'),
(3, 'Programmer');

INSERT INTO CourseField (course_field_id, course_id, field_id)
VALUES 
(0, 0, 0),
(1, 1, 1),
(2, 1, 0),
(3, 2, 2),
(4, 2, 0);

INSERT INTO UserField (user_field_id, user_id, field_id)
VALUES
(0, 1, 3);

INSERT INTO SystemFeedbacks (feedback_id, feedback_description, feedback_date, user_id)
VALUES 
(0, 'The platform is user-friendly.', GETDATE(), 1),
(1, 'More courses on data science would be great.', GETDATE(), 2);

INSERT INTO Materials(material_id, material_ordinal, text, image, video_url, question_id, collection_id)
VALUES 
(0, 0, 'Hello, and welcome to the second course of the Google Data Analytics Certificate program. You’re on an exciting journey!

In this part of the program, you’ll learn how data analysts use structured thinking to solve business problems. Then, you’ll explore how to ask effective questions and use the answers to tell a meaningful story about data. Finally, you’ll discover strategies for effectively communicating and collaborating with your stakeholders when defining a problem and presenting data insights. This will enable you to support and advance business goals with data!', NULL, null, null, 0),
(1, 1, NULL, 
    (SELECT * FROM OPENROWSET(BULK 'D:\Workspace\NavCareer_C1SE.15_12-2024\server\localResources\courses\bmRBqebdTR6YvLDNTJCL6Q_129fcd20b3e947dbae1e1eb79636b7f1_D4G001_2.png', SINGLE_BLOB) AS img), 
    NULL, NULL, 0),
(2, 2, null, NULL, 'testVid.mp4', null, 0);