use NavCareerDB;

delete from CourseField;
go
delete from Fields;			 
go
delete from CourseFeedbacks; 
go
delete from Accomplishments; 
go
delete from Grades;			 
go
delete from UserTracking;	 
go
delete from Enrollments;	 
go
delete from MaterialType;	 
go
delete from Answers;		 
go
delete from Questions;		 
go
delete from QuestionTypes;	 
go
delete from Materials;		 
go
delete from Collections;	 
go
delete from CollectionTypes; 
go
delete from Modules;		 
go
delete from Courses;		 
go
delete from SystemFeedbacks; 
go
delete from Users;			 
go
delete from AuthProcedureBanned;
go
delete from Authentications; 
go
delete from Authorizations;	 
go
delete from NavAnswers;		 
go
delete from NavQuestions;	 
go

if object_id('CreateAuthorization', 'P') is not null drop procedure CreateAuthorization;
go
create procedure CreateAuthorization @role nvarchar(max), @role_password varchar(max)
as
begin
    insert into Authorizations([role])
    values ( @role);

	if exists (select 1 from sys.server_principals where name = @role) 
	begin
		declare session_cursor cursor for
		select session_id
		from sys.dm_exec_sessions
		where login_name = @role;

		declare @session_id smallint;
		open session_cursor;
		fetch next from session_cursor into @session_id;

		while @@fetch_status = 0
		begin
			declare @sql nvarchar(100);
			set @sql = 'kill ' + cast(@session_id as nvarchar(5));
			exec sp_executesql @sql;
			fetch next from session_cursor into @session_id;
		end

		close session_cursor;
		deallocate session_cursor;

		declare @sql_disable_login nvarchar(max);
		set @sql_disable_login = 'alter login [' + @role + '] disable';
		exec sp_executesql @sql_disable_login;
	end

	if exists (select 1 from sys.server_principals where name = @role) 
	begin
		declare @sql_drop_login nvarchar(max);
		set @sql_drop_login = 'drop login [' + @role + ']';
		exec sp_executesql @sql_drop_login;
	end

	if exists (select 1 from sys.database_principals where name = @role) 
	begin
		declare @sql_drop_user nvarchar(max);
		set @sql_drop_user = 'drop user [' + @role + ']';
		exec sp_executesql @sql_drop_user;
	end

	declare @sql_create_login nvarchar(max);
	set @sql_create_login = 'create login [' + @role + '] with password = ''' + @role_password + '''';
	exec sp_executesql @sql_create_login;

	declare @sql_create_user nvarchar(max);
	set @sql_create_user = 'create user [' + @role + '] for login [' + @role + '] with default_schema = dbo';
	exec sp_executesql @sql_create_user;

	declare @sql_deny_alter nvarchar(max);
	set @sql_deny_alter = 'deny alter on SCHEMA::dbo to [' + @role + ']';
	exec sp_executesql @sql_deny_alter;
end
go

if object_id('CreateAuthentication', 'P') is not null drop procedure CreateAuthentication;
go
create procedure CreateAuthentication @account nvarchar(max), @password nvarchar(max), @identifier_email nvarchar(max), @authorization_id int, @auth_status bit
as
begin
    declare @authentication_id int;
	declare @encoded_account varbinary(max);
    declare @encoded_password varbinary(max);
	declare @encoded_identifier_email varbinary(max);

	set @encoded_account = EncryptByPassPhrase('NavCareerSecret', @account);
    set @encoded_password = EncryptByPassPhrase('NavCareerSecret', @password);
	set @encoded_identifier_email = EncryptByPassPhrase('NavCareerSecret', @identifier_email);
    
    insert into Authentications([account], [password], [identifier_email], [created_date], [authorization_id], [auth_status])
    values (@encoded_account, @encoded_password, @encoded_identifier_email, getdate(), @authorization_id, @auth_status);
end
go


insert into NavQuestions ([question_description])
values
(N'Bạn đánh giá thế nào về khả năng viết văn/ làm thơ của mình?'),
(N'Bạn đánh giá thế nào về khả năng học một ngôn ngữ mới của mình?'),
(N'Bạn thấy khả năng đọc và làm việc với giấy tờ, văn bản, tài liệu của mình như thế nào?'),
(N'Hãy đánh giá khả năng dùng lời nói để truyền đạt đến mọi người (Thuyết trình, hướng dẫn, giải thích,...)?');
go

insert into NavAnswers ([answer_description], [question_id])
values
(N'Rất thấp', 0),
(N'Thấp', 0),
(N'Cao', 0),
(N'Rất cao', 0),

(N'Rất thấp', 1),
(N'Thấp', 1),
(N'Cao', 1),
(N'Rất cao', 1),

(N'Rất thấp', 2),
(N'Thấp', 2),
(N'Cao', 2),
(N'Rất cao', 2),

(N'Rất thấp', 3),
(N'Thấp', 3),
(N'Cao', 3),
(N'Rất cao', 3);
go

execute CreateAuthorization 'NAV_GUEST', 'qT7i2W8pLk9eX3nZvC4dF5oG1rJ6yH9'; 
go						    
execute CreateAuthorization 'NAV_ADMIN', 'Uj6wV9pLm2Nz8RtY5bX3oF1KvQ4sM7n';
go						    
execute CreateAuthorization 'NAV_ESP', 'Pz5wK2yL8Qm3vR1Xt6fJ9nTgC4hS7uA';
go						    
execute CreateAuthorization 'NAV_STUDENT', 'mG4tR1qL7yU9fJ2dZ5nX8cHwP6kV3oB';
go

execute CreateAuthentication 'nav_admin', 'nav_admin', 'nav_admin@gmail.com', 1, 1;         
execute CreateAuthentication 'nav_esp', 'nav_esp', 'nav_esp@gmail.com', 2, 1;
execute CreateAuthentication 'nav_student', 'nav_student', 'nav_student@gmail.com', 3, 1;
execute CreateAuthentication 'qthiendev', 'qthiendev', 'trinhquythien.dev@gmail.com', 1, 1;
execute CreateAuthentication 'KeyPhan', '123456', 'mynameispro164@gmail.com', 1, 1;
execute CreateAuthentication 'phvbarca', '123456', 'phamhavy9b@gmail.com', 1, 1;
EXECUTE CreateAuthentication 'fadams', 'r%1jwIu8q@', 'cowancarlos@example.net', 2, 1;
EXECUTE CreateAuthentication 'gabriel30', ')y10OuKx31', 'rbaker@example.com', 3, 1;


------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
insert into AuthProcedureBanned ([procedure_name], [authentication_id])
values
(N'UpdateProfile', 5),
(N'CreateProfile', 5);
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
insert into Users ([user_full_name], [user_alias], [user_email], [user_birthdate], [user_gender], [user_phone_number], [user_address], [user_created_date], [authentication_id])
values
(N'admin 0', N'adm0', N'admin@gmail.com', getdate(), 1, N'0123456789', N'Đà Nẵng', getdate(), 0),
(N'education service provider 0', N'esp0', N'esp@gmail.com', getdate(), 0, N'0123456789', N'Đà Nẵng', getdate(), 1),
(N'student 0', N'std0', N'student@gmail.com', getdate(), 1, N'0123456789', N'Đà Nẵng', getdate(), 2),
(N'Trịnh Quý Thiện', N'qthiendev', N'trinhquythien.dev@gmail.com', getdate(), 1, N'0123456789', N'Đà Nẵng', getdate(), 3),
(N'Phan Công Khải', N'KhaiKey', N'mynameispro164@gmail.com', getdate(), 1, N'0123456789', N'Đà Nẵng', getdate(), 4),
(N'Phạm Hạ Vỹ', N'phamhavy', N'phamhavy9b@gmail.com', getdate(), 1, N'0123456789', N'Đà Nẵng', getdate(), 5),
(N'Daniel Rodriguez', N'gdavis', N'bevans@example.net', '1992-05-07', 0, N'1488408658', N'328 William Trail, Port Ryan, CT 77141', getdate(),  6);
go

------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
insert into SystemFeedbacks ([feedback_description], [feedback_date], [user_id])
values
(N'Need more course', getdate(), 2);
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
INSERT INTO Courses (
    [course_name],
    [course_short_description],
    [course_full_description],
    [course_price],
    [course_duration],
    [course_created_date],
    [course_piority_index],
    [user_id]
) 
VALUES
(
	N'Lập trình hướng đối tượng C++', 
	N'Khóa học về lập trình C++ cơ bản và hướng đối tượng với C++.', 
	N'C++ là ngôn ngữ lập trình hướng đối tượng được mở rộng từ ngôn ngữ C. Do vậy, C++ có ưu điểm là kế thừa được các điểm mạnh truyền thống của ngôn ngữ C như uyển chuyển, tương thích với các thiết bị phần cứng. Hiện nay, C++ là một ngôn ngữ lập trình phổ biến, được giảng dạy tại các trường đại học trong nước và trên thế giới và đặc biệt được sử dụng rộng rãi cho nhu cầu phát triển của công nghiệp phần mềm hiện nay. Tài liệu này không những nhằm giới thiệu cho sinh viên ngôn ngữ lập trình C++, mà còn mong muốn qua đó sinh viên có thể hiểu được tư tưởng của phương pháp lập trình hướng đối tượng nói chung. Nội dung của tài liệu bao gồm hai phần chính:
- Phần thứ nhất là lập trình nâng cao với C++, bao gồm lập trình C++ với con trỏ và mảng, các kiểu dữ liệu có cấu trúc cùng các thao tác vào ra trên tệp.
- Phần thứ hai là lập trình hướng đối tượng với C++, bao gồm các định nghĩa và các thaotác trên lớp đối tượng, tính kế thừa và tương ứng bội trong C++, cách sử dụng một số lớp cơ bản trong thư viện C++', 
	3000000, 
	N'3 tháng', 
    GETDATE(), 
    5, 
    1
),
(
    N'Lập trình Python', 
    N'Khóa học về lập trình Python.', 
    N'Khóa học này giới thiệu các nguyên tắc lập trình cơ bản và nâng cao thông qua ngôn ngữ Python, được biết đến với cú pháp dễ hiểu và khả năng ứng dụng rộng rãi. Học viên sẽ được học về các cấu trúc dữ liệu, lập trình hàm, lập trình hướng đối tượng và các thư viện phổ biến như NumPy và Pandas. Khóa học cũng bao gồm các dự án thực tiễn, giúp học viên áp dụng kiến thức vào giải quyết các bài toán thực tế trong lĩnh vực phân tích dữ liệu và phát triển ứng dụng. Sau khi hoàn thành khóa học, học viên sẽ có khả năng xây dựng các ứng dụng Python cơ bản và sẵn sàng cho các dự án lớn hơn.', 
    2000000, 
    N'5 tháng', 
    GETDATE(), 
    4, 
    1
)
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
insert into Modules ([module_name], [module_created_date], [module_ordinal], [course_id])
values
(N'Giới thiệu tổng quan về các phương pháp lập trình.', getdate(), 0, 0),
(N'Con trỏ và mảng.', getdate(), 1, 0);
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
insert into CollectionTypes ([collection_type_name])
values
('Lesson'),
('Quiz');
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
insert into Collections ([collection_name], [collection_created_date], [collection_ordinal], [collection_type_id], [module_id])
values
(N'Lập trình tuyến tính.', getdate(), 0, 0, 0),
(N'Lập trình hướng cấu trúc.', getdate(), 1, 0, 0),
(N'Lập trình hướng đối tượng.', getdate(), 2, 0, 0),
(N'Kiểm tra chương I.', getdate(), 3, 1, 0);
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
insert into MaterialType ([material_type_name])
values
('Text'),
('Image'),
('Video'),
('Question');
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
insert into Materials ([material_content], [material_ordinal], [material_type_id], [collection_id])
values
(N'Linear-Programming.mp4',
0, 2, 0),

(N'Đặc trưng cơ bản của lập trình tuyến tính là tư duy theo lối tuần tự. Chương trình sẽ được thực hiện theo thứ tự từ đầu đến cuối, lệnh này kế tiếp lệnh kia cho đến khi kết thúc chương trình.
- Lập trình tuyến tính có hai đặc trưng:
 + Đơn giản: chương trình được tiến hành đơn giản theo lối tuần tự, không phức tạp.
 + Đơn luồng: chỉ có một luồng công việc duy nhất, và các công việc được thực hiện tuần tự trong luồng đó.
- Tính chất
 + Ưu điểm: Do tính đơn giản, lập trình tuyến tính được ứng dụng cho các chương trình đơn giản và có ưu điểm dễ hiểu.
 + Nhược điểm: Với các ứng dụng phức tạp, người ta không thể dùng lập trình tuyến tính để giải quyết.
Ngày nay, lập trình tuyến tính chỉ tồn tại trong phạm vi các modul nhỏ nhất của các phương pháp lập trình khác. Ví dụ trong một chương trình con của lập trình cấu trúc, các lệnh cũng được thực hiện theo tuần tự từ đầu đến cuối chương trình con.',
1, 0, 0),

(N'linear-programming.png', 2, 1, 0),

(N'* Đặc trưng của lập trình hướng cấu trúc
	Trong lập trình hướng cấu trúc, chương trình chính được chia nhỏ thành các chương trình con và mỗi chương trình con thực hiện một công việc xác định. Chương trình chính sẽ gọi đến chương trình con theo một giải thuật, hoặc một cấu trúc được xác định trong chương trình chính. Các ngôn ngữ lập trình cấu trúc phổ biến là Pascal, C và C++. Riêng C++ ngoài việc có đặc trưng của lập trình cấu trúc do kế thừa từ C, còn có đặc trưng của lập trình hướng đối tượng. Cho nên C++ còn được gọi là ngôn ngữ lập trình nửa cấu trúc, nửa hướng đối tượng. Đặc trưng Đặc trưng cơ bản nhất của lập trình cấu trúc thể hiện ở mối quan hệ:
Chương trình = Cấu trúc dữ liệu + Giải thuật
Trong đó:
 - Cấu trúc dữ liệu là cách tổ chức dữ liệu cho việc xử lý bởi một hay nhiều chương trình nào đó.
 - Giải thuật là một quy trình để thực hiện một công việc xác định 
Trong chương trình, giải thuật có quan hệ phụ thuộc vào cấu trúc dữ liệu:
 - Một cấu trúc dữ liệu chỉ phù hợp với một số hạn chế các giải thuật.
 - Nếu thay đổi cấu trúc dữ liệu thì phải thay đổi giải thuật cho phù hợp.
 - Một giải thuật thường phải đi kèm với một cấu trúc dữ liệu nhất định.
Tính chất:
 - Mỗi chương trình con có thể được gọi thực hiện nhiều lần trong một chương trình chính.
 - Các chương trình con có thể được gọi đến để thực hiện theo một thứ tự bất kì, tuỳ thuộc vào giải thuật trong chương trình chính mà không phụ thuộc vào thứ tự khai báo của các chương trình con.
 - Các ngôn ngữ lập trình cấu trúc cung cấp một số cấu trúc lệnh điều khiển chương trình.
Ưu điểm:
 - Chương trình sáng sủa, dễ hiểu, dễ theo dõi.
 - Tư duy giải thuật rõ ràng.
Nhược điểm:
 - Lập trình cấu trúc không hỗ trợ mạnh việc sử dụng lại mã nguồn: Giải thuật luôn phụ thuộc chặt chẽ vào cấu trúc dữ liệu, do đó, khi thay đổi cấu trúc dữ liệu, phải thay đổi giải thuật, nghĩa là phải viết lại chương trình.
 - Không phù hợp với các phần mềm lớn: tư duy cấu trúc với các giải thuật chỉ phù hợp với các bài toán nhỏ, nằm trong phạm vi một modul của chương trình. Với dự án phần mềm lớn, lập trình cấu trúc tỏ ra không hiệu quả trong việc giải quyết mối quan hệ vĩ mô giữa các modul của phần mềm.
Vấn đề
Vấn đề cơ bản của lập trình cấu trúc là bằng cách nào để phân chia chương trình chính thành các chương trình con cho phù hợp với yêu cầu, chức năng và mục đích của mỗi bài toán. Thông thường, để phân rã bài toán trong lập trình cấu trúc, người ta sử dụng phương pháp thiết kế trên xuống (top-down).
* Phương pháp thiết kế trên xuống (top-down)
	Phương pháp thiết kế top-down tiếp cận bài toán theo hướng từ trên xuống dưới, từ tổng qúat đến chi tiết. Theo đó, một bài toán được chia thành các bài toán con nhỏ hơn. Mỗi bài toán con lại được chia nhỏ tiếp, nếu có thể, thành các bài toán con nhỏ hơn nữa. Quá trình này còn được gọi là quá trình làm mịn dần. Quá trình này sẽ dừng lại khi các bài toán con không cần chia nhỏ thêm nữa. Nghĩa là khi mỗi bài toán con đều có thể giải quyết bằng một chương trình con với một giải thuật đơn giản.
Ví dụ, sử dụng phương pháp top-down để giải quyết bài toán xây một căn nhà mới. Chúng ta có thể phân rã bài toán theo các bước như sau:
 - Ở mức thứ nhất, chia bài toán xây nhà thành các bài toán nhỏ hơn như làm móng, đổ cột, đổ trần, xây tường, lợp mái.
 - Ở mức thứ hai, phân rã các công việc ở mức thứ nhất như việc làm móng nhà có thể phân rã tiếp thành các công việc đào móng, gia cố nền, làm khung sắt, đổ bê tong; công việc đổ cột được phần rã thành ...
 - Ở mức thứ ba, phân rã các công việc của mức thứ hai như việc đào móng có thể phân chia tiếp thành các công việc như đo đạc, cắm mốc, chăng dây, đào và kiểm tra móng. Việc gia cố nền được phân rã thành... Quá trình phân rã có thể dừng ở mức này, bởi vì các công việc con thu được như đo đạc, cắm mốc, chăng dây, đào... có thể thực hiện được ngay, không cần chia nhỏ thêm nữa.
!Lưu ý:
 - Cùng sử dụng phương pháp top-down với cùng một bài toán, nhưng có thể cho ra nhiều kết quả khác nhau. Nguyên nhân là do sự khác nhau trong tiêu chí để phân rã một bài toán thành các bài toán con. Ví dụ, vẫn áp dụng phương pháp top-down để giải quyết bài toán xây nhà, nhưng nếu sử dụng một cách khác để phân chia bài toán, ta có thể thu được kết quả khác biệt so với phương pháp ban đầu:
 - Ở mức thứ nhất, chia bài toán xây nhà thành các bài toán nhỏ hơn như làm phần gỗ, làm phần sắt, làm phần bê tông và làm phần gạch.
 - Ở mức thứ hai, phân rã các công việc ở mức thứ nhất là làm phần gỗ có thể chia thành các công việc như xẻ gỗ, gia công gỗ, tạo khung, lắp vào nhà. Việc làm sắt có thể chia nhỏ thành...
Rõ ràng, với cách làm mịn thế này, ta sẽ thu được một kết quả khác hẳn với cách thức đã thực hiện ở phần trên.',
0, 0, 1),

(N'* Lập trình hướng đối tượng
Trong lập trình hướng đối tượng:
• Người ta coi các thực thể trong chương trình là các đối tượng và sau đó trừu tượng hoá đối tượng thành lớp đối tượng.
• Dữ liệu được tổ chức thành các thuộc tính của lớp. Nguời ta ngăn chặn việc thay đổi tuỳ tiện dữ liệu trong chương trình bằng các cách giới hạn truy nhập như chỉ cho phép truy nhập dữ liệu thông qua đối tượng, thông qua các phương thức mà đối tượng được cung cấp...
• Quan hệ giữa các đối tượng là quan hệ ngang hàng hoặc quan hệ kế thừa: Nếu lớp B kế thừa từ lớp A thì A được gọi là lớp cơ sở và B được gọi là lớp dẫn xuất.

Ngôn ngữ lập trình hướng đối tượng phổ biến hiện nay là Java, C++, C#...Mặc dù C++ cũng có
những đặc trưng cơ bản của lập trình hướng đối tượng nhưng vẫn không phải là ngôn ngữ lập
trình thuần hướng đối tượng.

Đặc trưng
Lập trình hướng đối tượng có hai đặc trưng cơ bản:
• Đóng gói dữ liệu: dữ liệu luôn được tổ chức thành các thuộc tính của lớp đối tượng. Việc truy nhập đến dữ liệu phải thông qua các phương thức của đối tượng lớp.
• Sử dụng lại mã nguồn: việc sử dụng lại mã nguồn được thể hiện thông qua cơ chế kế thừa. Cơ chế này cho phép các lớp đối tượng có thể kế thừa từ các lớp đối tượng khác. Khi đó, trong các lớp dẫn xuất, có thể sử dụng các phương thức (mã nguồn) của các lớp cơ sở mà không cần phải định nghĩa lại.

Ưu điểm
Lập trình hướng đối tượng có một số ưu điểm nổi bật:
• Không còn nguy cơ dữ liệu bị thay đổi tự do trong chương trình. Vì dữ liệu đã được đóng gói vào các đối tượng. Nếu muốn truy nhập vào dữ liệu phải thông qua các phương thức được cho phép của đối tượng.
• Khi thay đổi cấu trúc dữ liệu của một đối tượng, không cần thay đổi mã nguồn của các đối tượng khác, mà chỉ cần thay đổi một số thành phần của đối tượng dẫn xuất. Điều này hạn chế sự ảnh hưởng xấu của việc thay đổi dữ liệu đến các đối tượng khác trong chương trình.
• Có thể sử dụng lại mã nguồn, tiết kiệm tài nguyên, chi phí thời gian. Vì nguyên tắc kế thừa cho phép các lớp dẫn xuất sử dụng các phương thức từ lớp cơ sở như những phương thức của chính nó, mà không cần thiết phải định nghĩa lại.
• Phù hợp với các dự án phần mềm lớn, phức tạp.

Một số khái niệm cơ bản
Trong mục này, chúng ta sẽ làm quen với một số khái niệm cơ bản trong lập trình hướng đối tượng. Bao gồm:
• Khái niệm đối tượng (object)
• Khái niệm đóng gói dữ liệu (encapsulation)
• Khái niệm kế thừa (inheritance)
• Khái niệm đa hình (polymorphism)

Đối tượng (Object)
Trong lập trình hướng đối tượng, đối tượng được coi là đơn vị cơ bản nhỏ nhất. Các dữ diệu và cách xử lí chỉ là thành phần của đối tượng mà không được coi là thực thể. Một đối tượng chứa các dữ liệu của riêng nó, đồng thời có các phương thức (hành động) thao tác trên các dữ liệu đó: Đối tượng = dữ liệu + phương thức

Lớp (Class)
Khi có nhiều đối tượng giống nhau về mặt dữ liệu và phương thức, chúng được nhóm lại với nhau và gọi chung là lớp:
• Lớp là sự trừu tượng hoá của đối tượng
• Đối tượng là một thể hiện của lớp.

Đóng gói dữ liệu (Encapsulation)
• Các dữ liệu được đóng gói vào trong đối tượng. Mỗi dữ liệu có một phạm vi truy nhập riêng.
• Không thể truy nhập đến dữ liệu một cách tự do như lập trình cấu trúc
• Muốn truy nhập đến các dữ liệu đã được bảo vệ, phải thông qua các đối tượng, nghĩa là phải sử dụng các phương thức mà đối tượng cung cấp mới có thể truy nhập đến dữ liệu của đối tượng đó. Tuy nhiên, vì C++ chỉ là ngôn ngữ lập trình nửa đối tượng, cho nên C++ vẫn cho phép định nghĩa các biến dữ liệu và các hàm tự do, đây là kết quả kế thừa từ ngôn ngữ C, một ngôn ngữ lập trình thuần cấu trúc.

Kế thừa (Inheritance)
Tính kế thừa của lập trình hướng đối tượng cho phép một lớp có thể kế thừa từ một số lớp đã tồn tại. Khi đó, lớp mới có thể sử dụng dữ liệu và phương thức của các lớp cơ sở như là của mình. 
Ngoài ra, lớp dẫn xuất còn có thể bổ sung thêm một số dữ liệu và phương thức. Ưu điểm của kế thừa là khi thay đổi dữ liệu của một lớp, chỉ cần thay đổi các phương thức trong phạm vi lớp cơ sở mà không cần thay đổi trong các lớp dẫn xuất.

Đa hình (Polymorphsim)
Đa hình là khái niệm luôn đi kèm với kế thừa. Do tính kế thừa, một lớp có thể sử dụng lại các phương thức của lớp khác. Tuy nhiên, nếu cần thiết, lớp dẫn xuất cũng có thể định nghĩa lại một số phương thức của lớp cơ sở. 
Đó là sự nạp chồng phương thức trong kế thừa. Nhờ sự nạp chồng phương thức này, ta chỉ cần gọi tên phương thức bị nạp chồng từ đối tượng mà không cần quan tâm đó là đối tượng của lớp nào. Chương trình sẽ tự động kiểm tra xem đối tượng là thuộc kiểu lớp cơ sở hay thuộc lớp dẫn xuất, sau đó sẽ gọi phương thức tương ứng với lớp đó. Đó là tính đa hình.

* Lập trình hướng đối tượng trong C++
Vì C++ là một ngôn ngữ lập trình được mở rộng từ một ngôn ngữ lập trình cấu trúc C nên C++ được xem là ngôn ngữ lập trình nửa hướng đối tượng, nửa hướng cấu trúc.
Những đặc trưng hướng đối tượng của C++
• Cho phép định nghĩa lớp đối tượng.
• Cho phép đóng gói dữ liệu vào các lớp đối tượng. Cho phép định nghĩa phạm vi truy nhập dữ liệu của lớp bằng các từ khoá phạm vi: public, protected, private.
• Cho phép kế thừa lớp với các kiểu kế thừa khác nhau tuỳ vào từ khoá dẫn xuất.
• Cho phép lớp dẫn xuất sử dụng các phương thức của lớp cơ sở (trong phạm vi quy định).
• Cho phép định nghĩa chồng phương thức trong lớp dẫn xuất.

Những hạn chế hướng đối tượng của C++
Những hạn chế này là do C++ được phát triển từ một ngôn ngữ lập trình thuần cấu trúc C.
• Cho phép định nghĩa và sử dụng các biến dữ liệu tự do.
• Cho phép định nghĩa và sử dụng các hàm tự do.
• Ngay cả khi dữ liệu được đóng gói vào lớp, dữ liệu vẫn có thể truy nhập trực tiếp như dữ liệu tự do bởi các hàm bạn, lớp bạn (friend) trong C++.',
0, 0, 2),

(N'Câu hỏi 1', 0, 3, 3),
(N'Câu hỏi 2', 1, 3, 3),
(N'Câu hỏi 3', 2, 3, 3);
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
insert into QuestionTypes ([question_type_name])
values
(N'Multiple choice'),
(N'Multiple response');
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
insert into Questions ([question_description], [question_ordinal], [question_type_id], [material_id])
values
(N'Đâu là đặc trưng cơ bản của lập trình tuyến tính?', 0, 1, 5),
(N'Đâu là ưu điểm của lập trình hướng cấu trúc?', 1, 1, 6),
(N'Đâu Không phải là tính chất của lập trình hướng đối tượng?', 1, 0, 7);
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
insert into Answers ([answer_description], [answer_ordinal], [answer_is_right], [question_id])
values
(N'Đơn giản', 0, 1, 0),
(N'Đơn luồng', 1, 1, 0),
(N'Đơn điệu', 2, 0, 0),
(N'Đơn mục tiêu', 3, 0, 0),

(N'Chương trình sáng sủa, dễ hiểu, dễ theo dõi.', 0, 1, 1),
(N'Tư duy giải thuật rõ ràng.', 1, 1, 1),
(N'Không còn nguy cơ dữ liệu bị thay đổi tự do.', 2, 1, 1),

(N'Không còn nguy cơ dữ liệu bị thay đổi tự do.', 0, 1, 2),
(N'Không còn nguy cơ dữ liệu bị thay đổi tự do.', 1, 0, 2),
(N'Không còn nguy cơ dữ liệu bị thay đổi tự do.', 2, 0, 2),
(N'Không còn nguy cơ dữ liệu bị thay đổi tự do.', 3, 0, 2);
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
--insert into Enrollments([enrollment_id], [enrollment_date], [enrollment_is_complete], [user_id], [course_id])
--go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
--insert into UserTracking ([tracking_id], [enrollment_id], [collection_id]);
--go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
--insert into Grades([grade_id], [grade_number], [graded_date], [enrollment_id], [module_id]);
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
--insert Accomplishments ([accomplishment_id], [accomplishment_completion_date], [accomplishment_overall_grade], [accomplishment_certificate_id], [enrollment_id])
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
--insert into CourseFeedbacks ([feedback_id], [feedback_description], [feedback_date], [enrollment_id])
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
insert into Fields ([field_name])
values
(N'Programming'),
(N'C'),
(N'C++'),
(N'Python'),
(N'Automation'),
(N'Object-oriented'),
(N'Virtual machine');
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
insert into CourseField ([course_id], [field_id])
values
(0, 0),
(0, 1),
(0, 2);
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------