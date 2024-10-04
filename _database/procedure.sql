--PROCEDURE

-- For author
create procedure ReadAlias @authorization_id int
as
begin
	select [alias]
	from Authorizations
	where [authorization_id] = @authorization_id;
end
go

-- For sign in
create procedure ReadAuthentication @account nvarchar(max), @password nvarchar(max)
as
begin
	select [authentication_id], [authorization_id]
    from Authentications
    where [account] = @account and [password] = @password;
end
go

-- For sign up
create procedure CreateAuthentication @account nvarchar(max), @password nvarchar(max), @identifier_email nvarchar(max), @authorization_id int
as
begin
	if (@account is null or @account = '')
		or (@password is null or @password = '')
		or (@identifier_email is null or @identifier_email = '') 
		or (@authorization_id is null)
    begin
		raiserror('Input(s) is missing!', 16, 1);
        return;
    end;

	declare @newID int;

	select top 1 @newID = [authentication_id] + 1
	from Authentications
	order by [authentication_id] desc;

	insert into Authentications ([authentication_id], [account], [password], [identifier_email], [created_date], [authorization_id])
    VALUES (@newID, @account, @password, @identifier_email, getdate(), @authorization_id);
end
go

-- for update authen
create procedure UpdateAuthentication @authentication_id int,
	@new_account nvarchar(max), 
	@current_password nvarchar(max), 
	@new_password nvarchar(max),
	@new_email nvarchar(max),
	@new_authorization_id int
as
begin
	update Authentications
	set [account] = @new_account,
		[password] = @new_password,
		[identifier_email] = @new_email,
		[authorization_id] = @new_authorization_id
	where [authentication_id] = @authentication_id
		and [password] = @current_password
end
go
-- for remove account

-- for read profile
create procedure ReadProfile @authentication_id int
as
begin

	select [user_id], 
		[user_name], 
		[email], 
		[birthdate], 
		[gender], 
		[phone_number], 
		[address], 
		[date_joined], 
		[resource_url]
	from Users
	where [authentication_id] = @authentication_id
end
go

-- for create profile
create procedure CreateProfile @user_name nvarchar(max), 
	@email nvarchar(max), 
	@birthdate datetime, 
	@gender bit, 
	@phone_number nvarchar(30), 
	@address nvarchar(max),
	@authentication_id int
as
begin
	
	declare @newId int;

	select top 1 @newId = [user_id] + 1
	from Users
	order by [user_id] desc

	declare @resource_url nvarchar(max) = '/profiles/_' + str(@newID);

	insert into Users ([user_id], [user_name], [email], [birthdate], [gender], [phone_number], [address], [date_joined], [resource_url], [authentication_id])
	values
	(@newId, @user_name, @email, @birthdate, @gender, @phone_number, @address, getdate(), trim(@resource_url), @authentication_id);

end
go
-- for update profile
-- for delete profile

-- for read course
create procedure ReadCourse @course_id int
as
begin
    SELECT 
        c.course_id,
        c.course_name,
        c.course_description,
        c.duration,
        c.created_date,
        c.provider_id,
        m.module_id,
        m.module_ordinal,
        m.module_name,
        m.created_date
    FROM Courses c
    LEFT JOIN Modules m ON c.course_id = m.course_id
    WHERE c.course_id = ISNULL(@course_id, c.course_id)
    ORDER BY c.course_id, m.module_ordinal;
END
GO
-- for create course
create procedure CreateCourse 
	@course_name nvarchar(max), 
	@course_description nvarchar(max), 
	@duration nvarchar(max),
	@provider_id int
as
begin
	if (@course_name is null or @course_name = '')
		or (@course_description is null or @course_description = '')
		or (@duration is null or @duration = '') 
		or (@provider_id is null)
    begin
        return;
    end;

	declare @userType int;

	select top 1 @userType = a2.authorization_id
	from Authentications a1
		join Authorizations a2 on a2.authorization_id = a1.authorization_id
		join Users u on u.authentication_id = a1.authentication_id
	where u.user_id = @provider_id

	if (@userType != 1)
	begin
		raiserror('User type is not provider', 16, 1);
        return;
    end;

	declare @newID int;

	select top 1 @newID = [course_id] + 1
	from Courses
	order by [course_id] desc;

	insert into Courses ([course_id], [course_name], [course_description], [duration], [created_date], [provider_id])
    VALUES (@newID, @course_name, @course_description, @duration, getdate(), @provider_id);
end
go
-- for update course
-- for delete course