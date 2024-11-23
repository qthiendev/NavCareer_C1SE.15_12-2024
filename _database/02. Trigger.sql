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

execute CreateAuthentication 'nav_admin', 'nav_admin', 'nav_admin@gmail.com', 1, 1;         
execute CreateAuthentication 'nav_esp', 'nav_esp', 'nav_esp@gmail.com', 2, 1;
execute CreateAuthentication 'nav_student', 'nav_student', 'nav_student@gmail.com', 3, 1;
execute CreateAuthentication 'qthiendev', 'qthiendev', 'trinhquythien.dev@gmail.com', 1, 1;
execute CreateAuthentication 'KeyPhan', '123456', 'mynameispro164@gmail.com', 1, 1;
execute CreateAuthentication 'phvbarca', '123456', 'phamhavy9b@gmail.com', 1, 1;
EXECUTE CreateAuthentication 'hoangphuc', 'hoangphuc', 'hoangphuc109@example.net', 2, 1;
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
(N'Daniel Rodriguez', N'gdavis', N'bevans@example.net', '1992-05-07', 0, N'1488408658', N'328 William Trail, Port Ryan, CT 77141', getdate(),  6),
(N'Trần Minh Anh', N'manh', N'minh.anh@gmail.com', '1990-06-20', 0, N'0123456783', N'Cần Thơ', GETDATE(), 3),
(N'Nguyễn Văn A', N'nva', N'nguyenvana@example.com', '1985-09-10', 1, N'0978123456', N'Hà Nội', GETDATE(), 3),
(N'James Smith', N'jsmith', N'jsmith@example.com', '1987-03-22', 1, N'1234567890', N'101 Main Street, Springfield', GETDATE(), 4),
(N'Maria Garcia', N'mgarcia', N'mgarcia@example.com', '1995-12-11', 0, N'2345678901', N'555 Elm Street, Austin', GETDATE(), 5),
(N'Lisa Brown', N'lbrown', N'lbrown@example.com', '1993-07-30', 0, N'3456789012', N'789 Pine Road, Denver', GETDATE(), 6),
(N'Thomas Lee', N'tlee', N'tlee@example.com', '2000-04-17', 1, N'4567890123', N'67 Maple Ave, San Francisco', GETDATE(), 2),
(N'Anna Davis', N'adavis', N'adavis@example.com', '1988-10-05', 0, N'5678901234', N'12 Ocean Drive, Miami', GETDATE(), 5),
(N'John Walker', N'jwalker', N'jwalker@example.com', '1992-01-18', 1, N'6789012345', N'23 Hilltop Rd, Chicago', GETDATE(), 3),
(N'Nguyễn Thị Thu', N'tthu', N'ngthu@gmail.com', '1989-05-15', 0, N'0123456798', N'Đồng Nai', GETDATE(), 3),
(N'Trần Hoàng Long', N'hlong', N'thlong@gmail.com', '1991-08-22', 1, N'0123456799', N'Quảng Ngãi', GETDATE(), 3),
(N'Mark Johnson', N'mjohnson', N'mjohnson@example.com', '1990-03-07', 1, N'0987654321', N'123 Elm St, Boston', GETDATE(), 4),
(N'Sarah Wilson', N'swilson', N'swilson@example.com', '1995-07-19', 0, N'0987654322', N'456 Pine Rd, Seattle', GETDATE(), 5),
(N'Chris Evans', N'cevans', N'cevans@example.com', '1993-11-03', 1, N'0987654323', N'789 Sunset Blvd, Los Angeles', GETDATE(), 6),
(N'Maria Hernandez', N'mhernandez', N'mhernandez@example.com', '1996-04-28', 0, N'0987654324', N'321 Ocean Ave, San Diego', GETDATE(), 5),
(N'Võ Minh Hiếu', N'mhieu', N'vmhieu@gmail.com', '1999-01-09', 1, N'0123456790', N'Hà Tĩnh', GETDATE(), 2),
(N'Lê Văn Tâm', N'vtam', N'levtam@gmail.com', '1992-03-25', 1, N'0981234567', N'Nghệ An', GETDATE(), 3),
(N'Hoàng Bích Ngọc', N'bngoc', N'hoangngoc@gmail.com', '1987-06-18', 0, N'0934567890', N'Đắk Lắk', GETDATE(), 3),
(N'Nguyễn Thanh Sơn', N'tson', N'nguyenthanhson@gmail.com', '1990-02-14', 1, N'0123456781', N'Hà Nội', GETDATE(), 2),
(N'Lê Thị Hồng Nhung', N'nhunglt', N'lthnhung@gmail.com', '1995-08-19', 0, N'0987654321', N'Hồ Chí Minh', GETDATE(), 3),
(N'Phạm Văn Hải', N'phamvh', N'pvh@gmail.com', '1988-11-30', 1, N'0912345678', N'Huế', GETDATE(), 3),
(N'Trần Thị Mai', N'maitt', N'mai.tt@gmail.com', '1993-06-15', 0, N'0938765432', N'Quảng Nam', GETDATE(), 2),
(N'Đỗ Văn An', N'an.dv', N'dvan@gmail.com', '1991-12-03', 1, N'0945678901', N'Đà Nẵng', GETDATE(), 2),
(N'Ngô Thị Thảo', N'thaont', N'ngothaont@gmail.com', '1997-01-22', 0, N'0976543210', N'Hà Tĩnh', GETDATE(), 3),
(N'Hoàng Anh Tú', N'anhth', N'hanht@gmail.com', '1986-09-25', 1, N'0956781234', N'Quảng Bình', GETDATE(), 3),
(N'Vũ Thị Lan', N'lanvu', N'vulan@gmail.com', '1994-07-17', 0, N'0981234560', N'Hải Phòng', GETDATE(), 2),
(N'Nguyễn Văn Tùng', N'tungnv', N'tungnv@gmail.com', '1990-05-10', 1, N'0967891234', N'Nghệ An', GETDATE(), 2),
(N'Phạm Thị Thu Hà', N'tha.pt', N'thapt@gmail.com', '1989-03-12', 0, N'0923456789', N'Bình Dương', GETDATE(), 3),
(N'Bùi Văn Hoàng', N'hoangbv', N'hoangbv@gmail.com', '1993-11-08', 1, N'0912347809', N'Cần Thơ', GETDATE(), 3),
(N'Nguyễn Thị Kim Ngân', N'kngan', N'nguyenthikngan@gmail.com', '1992-08-18', 0, N'0945789012', N'Bắc Ninh', GETDATE(), 2),
(N'Lê Minh Hùng', N'minhhung', N'lmhung@gmail.com', '1995-01-28', 1, N'0932167890', N'Đồng Nai', GETDATE(), 3),
(N'Trần Hoài Nam', N'namth', N'tranhoainam@gmail.com', '1996-04-03', 1, N'0962147890', N'Tây Ninh', GETDATE(), 2),
(N'Nguyễn Thanh Hương', N'thuongnt', N'nguyenthuong@gmail.com', '1994-02-20', 0, N'0954321789', N'Hà Nam', GETDATE(), 3),
(N'Đinh Quang Dũng', N'dqdung', N'dinhqdung@gmail.com', '1998-10-15', 1, N'0943126789', N'Hải Dương', GETDATE(), 2),
(N'Lê Thị Hòa', N'hoalt', N'lethih@gmail.com', '1987-12-21', 0, N'0987654321', N'Hòa Bình', GETDATE(), 3),
(N'Phạm Văn Quý', N'phamvq', N'phamvq@gmail.com', '1991-08-06', 1, N'0934568901', N'Sơn La', GETDATE(), 3),
(N'Trương Thị Phượng', N'phuongtt', N'truongtp@gmail.com', '1992-05-09', 0, N'0912345768', N'Khánh Hòa', GETDATE(), 2),
(N'Võ Văn Hùng', N'hungvv', N'vovanhung@gmail.com', '1993-03-18', 1, N'0976547891', N'An Giang', GETDATE(), 3);

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
(N'Giới thiệu tổng quan và cài đặt môi trường.', getdate(), 0, 0),
(N'Cú pháp và câu lệnh cơ bản.', getdate(), 1, 0);
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
(N'Giới thiệu về C++.', getdate(), 0, 0, 0),
(N'Cài đặt môi trường.', getdate(), 1, 0, 0),
(N'Bắt đầu nhanh.', getdate(), 2, 0, 0),
(N'Kiểm tra.', getdate(), 3, 1, 0);

insert into Collections ([collection_name], [collection_created_date], [collection_ordinal], [collection_type_id], [module_id])
values
(N'Cú pháp và câu lệnh.', getdate(), 0, 0, 1),
(N'In ra màn hình.', getdate(), 1, 0, 1),
(N'Chú thích.', getdate(), 2, 0, 1),
(N'Biến và hằng.', getdate(), 3, 0, 1),
(N'Nhập từ bàn phím.', getdate(), 4, 0, 1),
(N'Kiểm tra.', getdate(), 5, 1, 1);
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
(N'---

### C++ là gì?

- C++ là ngôn ngữ đa nền tảng có thể được sử dụng để tạo các ứng dụng hiệu suất cao.
- C++ được phát triển bởi Bjarne Stroustrup, như một phần mở rộng của ngôn ngữ C.
- C++ cung cấp cho người lập trình mức độ kiểm soát cao đối với tài nguyên hệ thống và bộ nhớ.
- Ngôn ngữ này đã được cập nhật 5 lần chính vào các năm 2011, 2014, 2017, 2020 và 2023 thành C++11, C++14, C++17, C++20 và C++23.',
0, 0, 0),

(N'cpp.png',
1, 1, 0),

(N'---

### Tại sao nên sử dụng C++

- C++ là một trong những ngôn ngữ lập trình phổ biến nhất thế giới.
- C++ có thể được tìm thấy trong các hệ điều hành, Giao diện người dùng đồ họa và các hệ thống nhúng ngày nay.
- C++ là ngôn ngữ lập trình hướng đối tượng mang lại cấu trúc rõ ràng cho chương trình và cho phép tái sử dụng mã, giảm chi phí phát triển.
- C++ có tính di động và có thể được sử dụng để phát triển các ứng dụng có thể thích ứng với nhiều nền tảng.
- C++ rất thú vị và dễ học!
- Vì C++ gần với C, C# và Java nên các lập trình viên dễ dàng chuyển sang C++ hoặc ngược lại.',
2, 0, 0),

(N'---

### Sự khác biệt giữa C và C++

- C++ được phát triển như một phần mở rộng của C và cả hai ngôn ngữ đều có cú pháp gần như giống nhau.
- Sự khác biệt chính giữa C và C++ là C++ hỗ trợ các lớp và đối tượng, trong khi C thì không.', 
3, 0, 0),

(N'cvscpp.png', 
4, 1, 0),

(N'---

### Cài đặt môi trường

Để bắt đầu sử dụng C++, bạn cần hai thứ:
- Một trình soạn thảo văn bản, như [Notepad](https://notepad-plus-plus.org/), để viết mã C++.
- Một trình biên dịch, như [GCC](https://gcc.gnu.org/), để dịch mã C++ sang ngôn ngữ mà máy tính có thể hiểu được.
- Có nhiều trình soạn thảo văn bản và trình biên dịch để lựa chọn. Trong hướng dẫn này, chúng tôi sẽ sử dụng IDE (xem hướng dẫn bên dưới).', 
0, 0, 1),

(N'install-codeblock.mp4', 
1, 2, 1),

(N'> Nguồn video: [Cài đặt Code::Blocks (codeblocks) | Lập trình C/C++](https://www.youtube.com/watch?v=FVJHK9NLh1Q)
> 
> Cài đặt Code::Block: [codeblocks.org](https://www.codeblocks.org/downloads/binaries/#imagesoswindows48pnglogo-microsoft-windows)', 
2, 0, 1),

(N'---

### Khởi động nhanh C++

Hãy tạo tệp C++ đầu tiên của chúng tôi.

Mở Codeblocks và đi tới **File > New > Empty File**.

Viết mã C++ sau và lưu tệp dưới dạng myfirstprogram.cpp (**File > Save File as**):

> myfirstprogram.cpp
> ```
> 
> #include <iostream>
> using namespace std;
> 
> int main() {
>	cout << "Hello World!";
>	return 0;
> }
> 
> ```

Đừng lo lắng nếu bạn không hiểu đoạn mã trên - chúng ta sẽ thảo luận chi tiết về nó trong các chương sau. Hiện tại, hãy tập trung vào cách chạy mã.

Trong Codeblocks, nó sẽ trông như thế này:
', 
0, 0, 2),

('codeblocks2020.png', 
1, 1, 2),

(N'Sau đó vào **Build > Build and Run** để chạy (thực thi) chương trình. Kết quả sẽ giống như thế này:

```

Hello World!  
Process returned 0 (0x0) execution time : 0.011 s  
Press any key to continue.

```

**Chúc mừng!** Bây giờ bạn đã viết và thực thi chương trình C++ đầu tiên của mình.
', 
2, 0, 2),

(N'Câu hỏi 1', 
0, 3, 3),
(N'Câu hỏi 2', 
1, 3, 3),
(N'Câu hỏi 3', 
3, 3, 3);
go

insert into Materials ([material_content], [material_ordinal], [material_type_id], [collection_id])
values
(N'---

### Cú pháp

Hãy chia nhỏ đoạn mã sau để hiểu rõ hơn:

> Ví dụ
> ```
> 
> #include <iostream>
> using namespace std;
> 
> int main() {
>	cout << "Hello World!";
>	return 0;
> }
> 
> ```

==Giải thích==

- **Dòng 1**: `#include <iostream>` là thư viện tệp tiêu đề cho phép chúng ta làm việc với các đối tượng đầu vào và đầu ra, chẳng hạn như `cout` (được sử dụng trong dòng 5). Tệp tiêu đề thêm chức năng cho chương trình C++.

- **Dòng 2**: `use namespace std` có nghĩa là chúng ta có thể sử dụng tên cho các đối tượng và biến từ thư viện chuẩn.

> *Đừng lo lắng nếu bạn không hiểu cách hoạt động của `#include <iostream>` và `use namespace std.` Chỉ cần nghĩ về nó như một thứ gì đó (gần như) luôn xuất hiện trong chương trình của bạn.*

- **Dòng 3**: Dòng trống. C++ bỏ qua khoảng trắng. Nhưng chúng tôi sử dụng nó để làm cho mã dễ đọc hơn.

- **Dòng 4**: Một thứ khác luôn xuất hiện trong chương trình C++ là `int main()`. Đây được gọi là một chức năng. Bất kỳ mã nào bên trong dấu ngoặc nhọn `{}` sẽ được thực thi.

- **Dòng 5**: `cout` là một đối tượng được sử dụng cùng với toán tử chèn `<<` để xuất/in văn bản. Trong ví dụ của chúng tôi, nó sẽ xuất ra "Hello World!".

> - *C++ phân biệt chữ hoa chữ thường: "cout" và "Cout" có nghĩa khác nhau.*
> - *Mọi câu lệnh C++ đều kết thúc bằng dấu chấm phẩy `;`.*
> - *Phần thân của `int main()` cũng có thể được viết là: `int main () { cout << "Xin chào thế giới!"; trả về 0; }`*
> - *Trình biên dịch bỏ qua khoảng trắng. Tuy nhiên, nhiều dòng làm cho mã dễ đọc hơn.*

- **Dòng 6**: `return 0;` kết thúc chức năng chính.

- **Dòng 7**: Đừng quên thêm dấu ngoặc nhọn đóng `}` để kết thúc hàm chính.

---

### Bỏ qua Namespace

Bạn có thể thấy một số chương trình C++ chạy mà không có thư viện vùng tên tiêu chuẩn. Dòng `use namespace std` có thể được bỏ qua và thay thế bằng từ khóa `std`, theo sau là toán tử `::` cho một số đối tượng:

> Ví dụ
> ```
> 
> #include <iostream>
> 
> int main() {
>	std::cout << "Hello World!";
>	return 0;
> }
> 
> ```

Bạn có muốn bao gồm thư viện không gian tên tiêu chuẩn hay không là tùy thuộc vào bạn.

---

### Câu lệnh

Một **chương trình máy tính** là một danh sách các "hướng dẫn" được máy tính "thực thi".

Trong ngôn ngữ lập trình, các hướng dẫn lập trình này được gọi là **câu lệnh**.

Câu lệnh sau "hướng dẫn" trình biên dịch in dòng chữ "Hello world!" ra màn hình:

> Ví dụ
> ```
> 
> std::cout << "Hello World!";
> 
> ```

Điều quan trọng là bạn kết thúc câu lệnh bằng dấu chấm phẩy `;`

Nếu quên dấu chấm phẩy `;` sẽ xảy ra lỗi và chương trình sẽ không chạy:

> Ví dụ
> ```
> 
> std::cout << "Hello World!"
> 
> ```

> Kết quả
> ```
> 
> error: expected '';'' before ''return''
> 
> ```

---

### Đa lệnh

Hầu hết các chương trình C++ đều chứa nhiều câu lệnh.

Các câu lệnh được thực hiện, từng câu một, theo thứ tự như khi chúng được viết:

> Ví dụ
> ```
> 
> cout << "Hello World!";
> cout << "Have a good day!";
> return 0;
> 
> ```

- Câu lệnh đầu tiên được thực thi trước (in "Hello World!" ra màn hình).
- Sau đó, câu lệnh thứ hai được thực thi (in "Chúc một ngày tốt lành!" ra màn hình).
- Và cuối cùng, câu lệnh thứ ba được thực thi (kết thúc chương trình C++ thành công).

Bạn sẽ tìm hiểu thêm về các câu lệnh khi đọc hướng dẫn này. Hiện tại, chỉ cần nhớ luôn kết thúc chúng bằng dấu chấm phẩy để tránh bất kỳ lỗi nào.

**Sắp tới**: Chương tiếp theo sẽ hướng dẫn bạn cách kiểm soát đầu ra và cách chèn dòng mới để dễ đọc hơn.
',
0, 0, 4),
(N'---

### In văn bản

Đối tượng `cout`, cùng với toán tử `<<`, được sử dụng để xuất giá trị và in văn bản.
Chỉ cần nhớ bao quanh văn bản bằng dấu ngoặc kép `""`:

> Ví dụ
> ```
> 
> #include <iostream>
> using namespace std;
> 
> int main() {
>	cout << "Hello World!";
>	return 0;
> }
> 
> ```

> Kết quả
> ```
> 
> Hello World!
> 
> ```

Bạn có thể thêm bao nhiêu đối tượng `cout` tùy thích. Tuy nhiên, lưu ý rằng nó không chèn dòng mới vào cuối đầu ra:

> Ví dụ
> ```
> 
> #include <iostream>
> using namespace std;
> 
> int main() {
>	cout << "Hello World!";
>	cout << "I am learning C++";
>	return 0;
> }
> 
> ```

> Kết quả
> ```
> 
> Hello World!I am learning C++
> 
> ```

---

### In số

Bạn cũng có thể sử dụng `cout` để in số.
Tuy nhiên, không giống như văn bản, chúng ta ==không đặt số trong dấu ngoặc kép==:

> Ví dụ
> ```
> 
> #include <iostream>
> using namespace std;
> 
> int main() {
>	cout << 3;
>	return 0;
> }
> 
> ```

> Kết quả
> ```
> 
> 3
> 
> ```

Bạn cũng có thể thực hiện các phép tính toán học.

==Chúng tôi khuyến khích bạn tạo thói quen để phép tính trong ngoặc.==

> Ví dụ
> ```
> 
> #include <iostream>
> using namespace std;
> 
> int main() {
>	cout << (3 + 3);
>	return 0;
> }
> 
> ```

> Kết quả
> ```
> 
> 6
> 
> ```

Bạn có thể kết hợp cả văn bản và số.

> Ví dụ
> ```
> 
> #include <iostream>
> using namespace std;
> 
> int main() {
>	cout << "3 + 3 = " << (3 + 3);
>	return 0;
> }
> 
> ```

> Kết quả
> ```
> 
> 3 + 3 = 6
> 
> ```

---

### Xuống dòng mới

Để chèn một dòng mới vào đầu ra của bạn, bạn có thể sử dụng ký tự `\n`:

> Ví dụ
> ```
> 
> #include <iostream>
> using namespace std;
> 
> int main() {
>	cout << "Hello World! \n";
>	cout << "I am learning C++";
>	return 0;
> }
> 
> ```

> Kết quả
> ```
> 
> Hello World! 
> I am learning C++
> 
> ```

Bạn cũng có thể sử dụng toán tử `<<` khác và đặt ký tự `\n` sau văn bản, như sau:

> Ví dụ
> ```
> 
> #include <iostream>
> using namespace std;
> 
> int main() {
>	cout << "Hello World!" << "\n";
>	cout << "I am learning C++";
>	return 0;
> }
> 
> ```

> Kết quả
> ```
> 
> Hello World! 
> I am learning C++
> 
> ```

**Mẹo:** Hai ký tự \n nối tiếp nhau sẽ tạo thành một dòng trống:

> Ví dụ
> ```
> 
> #include <iostream>
> using namespace std;
> 
> int main() {
>	cout << "Hello World!" << "\n\n";
>	cout << "I am learning C++";
>	return 0;
> }
> 
> ```

> Kết quả
> ```
> 
> Hello World! 
> 
> I am learning C++
> 
> ```

Một cách khác để chèn một dòng mới là sử dụng trình thao tác `endl`:

> Ví dụ
> ```
> 
> #include <iostream>
> using namespace std;
> 
> int main() {
>	cout << "Hello World!" << endl;
>	cout << "I am learning C++";
>	return 0;
> }
> 
> ```

> Kết quả
> ```
> 
> Hello World!
> I am learning C++
> 
> ```

> Cả `\n` và `endl` đều được sử dụng để ngắt dòng. Tuy nhiên, `\n` được sử dụng nhiều nhất.
> 
> Nhưng `\n` chính xác là gì?
> Ký tự dòng mới `\n` được gọi là **chuỗi thoát** và nó buộc con trỏ thay đổi vị trí của nó về đầu dòng tiếp theo trên màn hình. Điều này dẫn đến một dòng mới.
> 
> Ví dụ về các chuỗi thoát hợp lệ khác là:

| Chuỗi thoát | Mô tả |
| ----------- | ----------- |
| `\t` | Tạo tab ngang |
| `\\` | Chèn ký tự dấu gạch chéo ngược (\) |
| `\"` | Chèn một ký tự trích dẫn kép |
',
0, 0, 5),
(N'---

> Chú thích có thể được sử dụng để giải thích mã C++ và làm cho nó dễ đọc hơn. Nó cũng có thể được sử dụng để ngăn việc thực thi khi kiểm tra mã thay thế. Chú thích có thể được viết một dòng hoặc nhiều dòng.

### Chú thích một dòng

Nhận xét một dòng bắt đầu bằng hai dấu gạch chéo lên `//`.

Bất kỳ văn bản nào giữa `//` và cuối dòng đều bị trình biên dịch bỏ qua (sẽ không được thực thi).

Ví dụ này sử dụng nhận xét một dòng trước một dòng mã:

> Ví dụ
> ```
> 
> // This is a comment
> cout << "Hello World!" << endl;
> 
> ```

Ví dụ này sử dụng nhận xét một dòng ở cuối dòng mã:

> Ví dụ
> ```
> 
> cout << "Hello World!" << endl; // This is a comment
> 
> ```

---

### Chú thích nhiều dòng

Chú thích nhiều dòng bắt đầu bằng `/*` và kết thúc bằng `*/`.

Mọi văn bản giữa `/`* và `*/` sẽ bị trình biên dịch bỏ qua:

> Ví dụ
> ```
> 
> /* The code below will print the words Hello World!
> to the screen, and it is amazing */
> cout << "Hello World!";
> 
> ```

> Chú thích một dòng hay nhiều dòng?
> 
> - *Tùy thuộc vào bạn mà bạn muốn sử dụng. Thông thường, chúng ta sử dụng `// Chu thich` cho những bình luận ngắn và `/* Chu thich */` cho những bình luận dài hơn.*
',
0, 0, 6),
(N'---

### Biến trong C++

Biến là nơi chứa các giá trị dữ liệu.

Trong C++, có nhiều **loại biến** khác nhau (được xác định bằng các từ khóa khác nhau), ví dụ:

- `int` - lưu trữ số nguyên (số nguyên), không có số thập phân, chẳng hạn như 123 hoặc -123
- `double` - lưu trữ số dấu phẩy động, với số thập phân, chẳng hạn như 19,99 hoặc -19,99
- `char` - lưu trữ các ký tự đơn, chẳng hạn như ''a'' hoặc ''B''. Giá trị Char được bao quanh bởi dấu ngoặc đơn
- `string` - lưu trữ văn bản, chẳng hạn như "Xin chào thế giới". Giá trị chuỗi được bao quanh bởi dấu ngoặc kép
- `bool` - lưu trữ các giá trị với hai trạng thái: đúng hoặc sai

---

### Khai báo (Tạo) Biến

Để tạo một biến, hãy chỉ định loại và gán cho nó một giá trị:

> Cú pháp
> ```
> 
> type variableName = value;
> 
> ```

Trong đó ==loại== là một trong các loại C++ (chẳng hạn như `int`) và ==variableName== là tên của biến (chẳng hạn như **x** hoặc **myName**). **Dấu bằng** được dùng để gán ==value== (giá trị) cho biến.

Để tạo một biến lưu trữ một số, hãy xem ví dụ sau:

> Ví dụ
> ```
> 
> int myNum = 15;
> cout << myNum;
> 
> ```

> Kết quả
> ```
> 
> 15
> 
> ```

Bạn cũng có thể khai báo một biến mà không cần gán giá trị và gán giá trị sau:

> Ví dụ
> ```
> 
> int myNum;
> myNum = 15;
> cout << myNum;
> 
> ```

> Kết quả
> ```
> 
> 15
> 
> ```

Lưu ý rằng nếu bạn gán giá trị mới cho biến hiện có, nó sẽ ghi đè giá trị trước đó:

> Ví dụ
> ```
> 
> int myNum = 15;
> myNum = 10;
> cout << myNum;
> 
> ```

> Kết quả
> ```
> 
> 10
> 
> ```

---

### Các loại khác

Khai báo của các loại dữ liệu khác:

> Ví dụ
> ```
> 
> int myNum = 5;               // Integer (whole number without decimals)
> double myFloatNum = 5.99;    // Floating point number (with decimals)
> char myLetter = ''D'';         // Character
> string myText = "Hello";     // String (text)
> bool myBoolean = true;       // Boolean (true or false)
> 
> ```

> Bạn sẽ tìm hiểu thêm về các kiểu riêng lẻ trong chương [Kiểu dữ liệu](https://www.example.com).

---

### Hiển thị các biến

Đối tượng `cout` được sử dụng cùng với toán tử `<<` để hiển thị các biến.

Để kết hợp cả văn bản và một biến, hãy tách chúng bằng toán tử `<<`:

> Ví dụ
> ```
> 
> int myAge = 35;
> cout << "I am " << myAge << " years old.";
> 
> ```

> Kết quả
> ```
> 
> I am 35 years old.
> 
> ```

---

### Cộng các giá trị biến dạng số

Để cộng một biến vào một biến khác, bạn có thể sử dụng toán tử `+`:

> Ví dụ
> ```
> 
> int x = 5;
> int y = 6;
> int sum = x + y;
> cout << sum;
> 
> ```

> Kết quả
> ```
> 
> 11
> 
> ```

---

### Khai báo nhiều biến

Để khai báo nhiều biến **cùng loại**, hãy sử dụng danh sách được phân tách bằng dấu phẩy:

> Ví dụ
> ```
> 
> int x = 5, y = 6, z = 50;
> cout << x + y + z;
> 
> ```

> Kết quả
> ```
> 
> 61
> 
> ```

---

### Một giá trị cho nhiều biến

Bạn cũng có thể gán **cùng một giá trị** cho nhiều biến trên một dòng:

> Ví dụ
> ```
> 
> int x, y, z;
> x = y = z = 50;
> cout << x + y + z;
> 
> ```

> Kết quả
> ```
> 
> 150
> 
> ```

---

### Quy tắc đặt tên biến

==Nguyên tắc chung khi đặt tên biến là:==

- Tên có thể chứa chữ cái, chữ số và dấu gạch dưới(`a`, `a_b`, `a_2_b`)
- Tên phải bắt đầu bằng một chữ cái hoặc dấu gạch dưới (`_a_b`)
- Tên có phân biệt chữ hoa chữ thường (`ab` và `aB` là các biến khác nhau)
- Tên không được chứa khoảng trắng hoặc ký tự đặc biệt như !, #, %, v.v.
- Các từ dành riêng (như từ khóa C++, chẳng hạn như `int`) không thể được sử dụng làm tên

Tất cả các biến C++ phải được **xác định** bằng **tên duy nhất**.

Giá trị nhận dạng có thể là tên ngắn (như x và y) hoặc tên mô tả nhiều hơn (age, sum, totalValues).

Lưu ý: Nên sử dụng tên mô tả để tạo mã dễ hiểu và dễ bảo trì:

> Ví dụ
> ```
> 
> // Tốt
> int minutesPerHour = 60;
> 
> // Tạm ổn, nhưng rất khó để biết m hiện tại đang đại diện cho cái gì
> int m = 60;
> 
> ```

---

### Hằng số

Khi bạn không muốn người khác (hoặc chính mình) thay đổi giá trị biến hiện có, hãy sử dụng từ khóa `const` (điều này sẽ khai báo biến là "không đổi", nghĩa là **không thể thay đổi** và **chỉ đọc**):

> Ví dụ
> ```
> 
> const int myNum = 15;  // myNum sẽ luôn có giá trị là 15
> myNum = 10;  // Cố gắn gán giá trị cho hằng sẽ gây lỗi
> 
> ```

> Kết quả
> ```
> 
> error: assignment of read-only variable ''myNum''
> 
> ```

Bạn phải luôn khai báo biến là hằng số khi bạn có các giá trị khó có thể thay đổi:

> Ví dụ
> ```
> 
> const int minutesPerHour = 60;
> const float PI = 3.14;
> 
> ```

Khi bạn khai báo một biến không đổi, nó phải được gán một giá trị:

> Ví dụ
> ```
> 
> const int minutesPerHour;
> minutesPerHour = 60; // error
> 
> ```

> Kết quả
> ```
> 
> error: uninitialized const ''minutesPerHour'' [-fpermissive]
>    5 |   const int minutesPerHour;
>      |             ^~~~~~~~~~~~~~
> prog.cpp:6:18: error: assignment of read-only variable ''minutesPerHour''
>    6 |   minutesPerHour = 60;
>      |   ~~~~~~~~~~~~~~~^~~~
> 
> ```
', 
0, 0, 7),
(N'---

### Nhập từ bàn phím.

Bạn đã biết rằng `cout` được sử dụng để xuất (in) các giá trị. Bây giờ chúng ta sẽ sử dụng `cin` để lấy dữ liệu đầu vào của người dùng.

`cin` là biến được xác định trước để đọc dữ liệu từ bàn phím bằng toán tử trích xuất `>>`.

Trong ví dụ sau, người dùng có thể nhập một số được lưu trong biến `x`. Sau đó chúng ta in giá trị của `x`:

> Ví dụ
> ```
> 
> int x; 
> cout << "Type a number: ";
> cin >> x; // Lấy dữ liệu từ người dùng từ bàn phím
> cout << "Your number is: " << x; // In dữ liệu
> 
> ```

> Kết quả
> ```
> 
> Type a number
> 10
> Your number is 10
> 
> ```

> Lưu ý
> 
> - `cout` được phát âm là "see-out". Được sử dụng cho đầu ra và sử dụng toán tử chèn `<<`
> - `cin` được phát âm là "see-in". Được sử dụng để nhập liệu và sử dụng toán tử trích xuất `>>`

---

### Tạo một máy tính đơn giản

Trong ví dụ này, người dùng phải nhập hai số. Sau đó chúng ta in tổng bằng cách tính (cộng) hai số:

> Ví dụ
> ```
> 
> int x, y;
> int sum;
> cout << "Type a number: ";
> cin >> x;
> cout << "Type another number: ";
> cin >> y;
> sum = x + y;
> cout << "Sum is: " << sum;
> 
> ```

> Kết quả
> ```
> 
> Type a number
> 10
> Type another number
> 20
> Sum is: 30
> 
> ```
', 0, 0, 8),

(N'Câu hỏi 1', 0, 3, 9),
(N'Câu hỏi 2', 1, 3, 9),
(N'Câu hỏi 3', 2, 3, 9),
(N'Câu hỏi 4', 3, 3, 9),
(N'Câu hỏi 5', 4, 3, 9),
(N'Câu hỏi 6', 5, 3, 9),
(N'Câu hỏi 7', 6, 3, 9),
(N'Câu hỏi 8', 7, 3, 9),
(N'Câu hỏi 9', 8, 3, 9),
(N'Câu hỏi 10', 9, 3, 9);
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
(N'Bạn đã cài đặt Code::Blocks chưa?', 0, 0, 11),
(N'Bạn đã chạy chương trình ''Hello World'' chưa?', 1, 0, 12),
(N'Bạn đã sẵn sàng để học lập trình C++ chưa?', 2, 0, 13);
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
insert into Answers ([answer_description], [answer_ordinal], [answer_is_right], [question_id])
values
(N'Đẫ cài đặt', 0, 1, 0),
(N'Chưa cài đặt', 1, 0, 0),

(N'Đã chạy', 0, 1, 1),
(N'Chưa chạy.', 1, 0, 1),

(N'Đã sẵn sàng.', 0, 1, 2),
(N'Chưa sẵn sàng.', 1, 0, 2);
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
insert into Questions ([question_description], [question_ordinal], [question_type_id], [material_id])
values
(N'Câu lệnh nào sau đây dùng để hiển thị nội dung ra màn hình trong C++?', 3, 0, 19),
(N'Khi nào chúng ta nên sử dụng "const" cho biến trong C++?', 4, 0, 20),
(N'Lệnh nào sẽ kết thúc một hàm trong C++?', 5, 0, 21),
(N'Trong chương trình "Hello World", dòng nào định nghĩa điểm bắt đầu của chương trình?', 6, 0, 22),
(N'Trong C++, loại dữ liệu nào phù hợp để lưu trữ số thập phân?', 7, 0, 23),
(N'Các thành phần nào là cần thiết để chạy một chương trình C++ cơ bản?', 8, 1, 24),
(N'Câu lệnh nào sau đây là cần thiết để nhập dữ liệu từ bàn phím trong C++?', 9, 1, 25),
(N'Các đặc điểm nào là đúng khi sử dụng biến "int" trong C++?', 10, 1, 26),
(N'Lệnh nào dưới đây có thể được dùng để chèn một dòng mới trong C++?', 11, 1, 27),
(N'Khi khai báo một biến, yếu tố nào cần phải có?', 12, 1, 28);
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
insert into Answers ([answer_description], [answer_ordinal], [answer_is_right], [question_id])
values
(N'cout << "Hello World!";', 0, 1, 3),
(N'cin >> "Hello World!";', 1, 0, 3),
(N'printf("Hello World!");', 2, 0, 3),

(N'Khi không muốn giá trị biến thay đổi', 0, 1, 4),
(N'Khi muốn biến có giá trị ngẫu nhiên', 1, 0, 4),
(N'Khi muốn biến có giá trị thay đổi thường xuyên', 2, 0, 4),

(N'return;', 0, 1, 5),
(N'cout << "Kết thúc";', 1, 0, 5),
(N'int end();', 2, 0, 5),

(N'int main()', 0, 1, 6),
(N'#include <iostream>', 1, 0, 6),
(N'using namespace std;', 2, 0, 6),

(N'int', 0, 0, 7),
(N'double', 1, 1, 7),
(N'string', 2, 0, 7),

(N'#include <iostream>', 0, 1, 8),
(N'using namespace std;', 1, 1, 8),
(N'int main()', 2, 1, 8),
(N'cout << "Hello World!";', 3, 0, 8),

(N'cin', 0, 1, 9),
(N'cout', 1, 0, 9),
(N'get()', 2, 1, 9),
(N'scanf()', 3, 0, 9),

(N'Lưu trữ số nguyên', 0, 1, 10),
(N'Lưu trữ số thập phân', 1, 0, 10),
(N'Không bao gồm dấu chấm thập phân', 2, 1, 10),
(N'Bao gồm chuỗi ký tự', 3, 0, 10),

(N'\n', 0, 1, 11),
(N'endl', 1, 1, 11),
(N'tab', 2, 0, 11),
(N'new line()', 3, 0, 11),

(N'Kiểu dữ liệu', 0, 1, 12),
(N'Tên biến', 1, 1, 12),
(N'Giá trị mặc định', 2, 0, 12),
(N'Ký tự đặc biệt', 3, 0, 12);
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
insert into Enrollments([enrollment_date], [enrollment_is_complete], [user_id], [course_id])
values (getdate(), 0, 2, 0);
go
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
INSERT INTO Fields ([field_name])
VALUES
(N'Kỹ sư Robot công nghiệp'),
(N'Kỹ thuật viên ô tô điện'),
(N'Kỹ thuật viên lắp đặt năng lượng mặt trời'),
(N'Nhân viên kỹ thuật xây dựng'),
(N'Kỹ thuật viên vận hành máy CNC'),
(N'Nhà nghiên cứu di truyền học'),
(N'Nhà phân tích dữ liệu khoa học xã hội'),
(N'Nhà nghiên cứu trí tuệ nhân tạo'),
(N'Nhà vật lý học'),
(N'Nhà sinh học biển'),
(N'Nhà thiết kế đồ họa 3D'),
(N'Nhà thiết kế nội thất'),
(N'Nhạc sĩ điện tử'),
(N'Nhiếp ảnh gia chuyên nghiệp'),
(N'Nhà thiết kế thời trang'),
(N'Chuyên gia tâm lý học lâm sàng'),
(N'Chuyên viên tư vấn giáo dục'),
(N'Nhân viên công tác xã hội'),
(N'Giảng viên kỹ năng mềm'),
(N'Chuyên viên truyền thông xã hội'),
(N'Chuyên gia khởi nghiệp công nghệ'),
(N'Quản lý chuỗi cung ứng'),
(N'Chuyên viên marketing số'),
(N'Quản lý dự án'),
(N'Chuyên gia thương mại điện tử'),
(N'Nhân viên quản trị dữ liệu'),
(N'Chuyên viên kiểm toán CNTT'),
(N'Chuyên viên quản trị nhân sự'),
(N'Chuyên viên xử lý tài liệu pháp lý'),
(N'Nhân viên kế toán quản trị');
GO

------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
