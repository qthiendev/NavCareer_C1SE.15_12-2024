﻿go
use master;
go
use NavCareerDB;
go

--phúc viết để làm chatbot
if object_id('GetAllCoursesByFieldName', 'P') is not null drop procedure GetAllCoursesByFieldName;
go
   
CREATE PROCEDURE GetAllCoursesByFieldName  @fieldName NVARCHAR(50)

AS
BEGIN
    SELECT
        c.course_name, 
        f.field_name,
        c.course_short_description,
        c.course_price,
        c.course_duration
    FROM 
        Courses c
    INNER JOIN 
        CourseField cf ON c.course_id = cf.course_id
    INNER JOIN 
        Fields f ON cf.field_id = f.field_id
    WHERE 
        f.field_name = @fieldName;
END;
GO
-- exec GetAllCoursesByFieldName @fieldName
 --exec GetAllCourses
 --lọc giá: từ khoảng đến khoảng

--select tên cái field
 if object_id('getField', 'P') is not null drop procedure getField;
go
create proc getField 
as
begin
	select Fields.field_name
	from Fields
end;
go
exec getField

 --lọc giá: từ khoảng đến khoảng

 if object_id('SortCoursesByFieldAndPrice', 'P') is not null drop procedure SortCoursesByFieldAndPrice;
go
CREATE PROCEDURE SortCoursesByFieldAndPrice
    @fieldName NVARCHAR(50) = NULL, 
    @min_price int = NULL,  
    @max_price int = NULL  
AS
BEGIN
    SELECT
        c.course_name, 
        f.field_name,
        c.course_short_description,
        c.course_price,
        c.course_duration
    FROM 
        Courses c
    INNER JOIN 
        CourseField cf ON c.course_id = cf.course_id
    INNER JOIN 
        Fields f ON cf.field_id = f.field_id
    WHERE 
        (f.field_name = @fieldName
        AND (@min_price IS NULL OR c.course_price >= @min_price)  -- Lọc theo giá tối thiểu
        AND (@max_price IS NULL OR c.course_price <= @max_price)) 
		or ((@min_price IS NULL OR c.course_price >= @min_price)  -- Lọc theo giá tối thiểu
        AND (@max_price IS NULL OR c.course_price <= @max_price)) -- Lọc theo giá tối đa
	order by course_price 
END;
GO

--EXEC SortCoursesByFieldAndPrice @fieldname='Lập Trình',@min_price=500, @max_price = 600 ;



if object_id('selectTop5Course', 'P') is not null drop procedure selectTop5Course;
go
create proc selectTop5Course
as
begin
	select top 5 
    c.[course_id],
    c.[course_name],
    c.[course_short_description],
    c.[course_price],
    c.[course_duration],
    count(e.[user_id]) as [enrollment_count]
from Courses c
left join Enrollments e on c.[course_id] = e.[course_id]
group by 
    c.[course_id],
    c.[course_name],
    c.[course_short_description],
    c.[course_price],
    c.[course_duration]
order by [enrollment_count] desc;
end;
go

--exec selectTop5Course
--cái này là recomment 

if object_id('ReadCourse', 'P') is not null drop procedure ReadCourse;
go
create procedure ReadCourse @course_id int
as
begin
	if not exists (
		select 1
		from Courses
		where [course_id] = @course_id)
	begin
		select 'U_CID' as [check]
		return;
	end

	select u.[user_id],
		u.[authentication_id],
		u.[user_full_name],
		u.[user_address],
		u.[user_birthdate],
		u.[user_email],
		u.[user_phone_number],
		c.[course_id],
		c.[course_name], 
		c.[course_short_description],
		c.[course_full_description],
		c.[course_price],
		c.[course_duration],
		c.[course_piority_index],
		c.[course_status],
		m.[module_ordinal],
		m.[module_name]
	from Courses c
		left join Modules m on m.[course_id] = c.[course_id]
		join Users u on u.[user_id] = c.[user_id]
	where c.course_id = @course_id
	order by m.[module_ordinal];
end
go
-- exec ReadCourse 0
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('CreateCourse', 'P') is not null drop procedure CreateCourse;
go
create procedure CreateCourse 
	@aid int, 
	@course_name nvarchar(max),
	@course_short_description nvarchar(max),
	@course_full_description nvarchar(max),
	@course_price int,
	@course_duration nvarchar(max)
as
begin
    declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateCourse');
    if @IsBanned = 1 
	begin
		select 'BANNED' as [check];
		return;
	end

	declare @user_id int;

	select @user_id = [user_id]
	from Users
	where [authentication_id] = @aid

	if (@user_id is null)
	begin
		select 'U_UID' as [check]
		return;
	end

	if not exists (
		select 1
		from Authentications auth join Authorizations authz on authz.authorization_id = auth.authorization_id
		where auth.authentication_id = @aid and authz.role = 'NAV_ESP')
	begin
		select 'U_ROLE' as [check]
		return;
	end

	if exists (
		select 1
		from Courses
		where [course_name] = @course_name)
	begin
		select 'EXISTED' as [check]
		return;
	end

    insert into Courses ([course_name],
		[course_short_description],
		[course_full_description],
		[course_price],
		[course_duration], 
		[course_created_date],
		[course_piority_index],
		[course_status],
		[user_id]
	)
    values
    (@course_name, @course_short_description, @course_full_description, @course_price, @course_duration, getdate(), 1, 1, @user_id);

	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check];
		return;
	end

	select 'FAILED' as [check];
end
go
-- exec CreateCourse 2, 'Test course name', 'Test short decrisption', 'Test full decrisption', 300000, '3 months', 5
-- exec ReadCourse 2
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('UpdateCourse', 'P') is not null drop procedure UpdateCourse;
go
create procedure UpdateCourse 
	@aid int,
	@course_id int,
	@course_name nvarchar(max),
	@course_short_description nvarchar(max),
	@course_full_description nvarchar(max),
	@course_price int,
	@course_duration nvarchar(max),
	@course_status bit
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'UpdateCourse');
    if @IsBanned = 1 
	begin
		select 'BANNED' as [check];
		return;
	end

	declare @user_id int;

	select @user_id = [user_id]
	from Users
	where [authentication_id] = @aid

	if (@user_id is null)
	begin
		select 'U_UID' as [check];
		return;
	end

	if not exists (
		select 1
		from Courses
		where [course_id] = @course_id)
	begin
		select 'U_CID' as [check];
		return;
	end

	if not exists (
		select 1
		from Authentications auth join Authorizations authz on authz.authorization_id = auth.authorization_id
		where auth.authentication_id = @aid and authz.role = 'NAV_ESP')
	begin
		select 'U_ROLE' as [check];
		return;
	end

	update Courses
	set [course_name] = @course_name,
		[course_short_description] = @course_short_description,
		[course_full_description] = @course_full_description,
		[course_price] = @course_price,
		[course_duration] = @course_duration, 
		[course_status] = @course_status
	where [user_id] = @user_id
		and [course_id] = @course_id
	
	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check];
		return;
	end

	select 'FAILED' as [check];
end
go

-- exec UpdateCourse 1, 2, 'Test course name1', 'Test short decrisption1', 'Test full decrisption1', 300000, '3 months', 1
-- exec ReadCourse 2
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ReadUserCourses', 'P') is not null drop procedure ReadUserCourses;
go
create procedure ReadUserCourses @aid int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'ReadUserCourses');
    if @IsBanned = 1 
	begin
		select 'BANNED' as [check];
		return;
	end

	declare @user_id int;

	select @user_id = [user_id]
	from Users
	where [authentication_id] = @aid;

	select [course_id],
		[course_name],
		[course_short_description],
		[course_full_description],
		[course_price],
		[course_duration],
		[course_created_date],
		[course_status]
	from Courses
	where [user_id] = @user_id
end
go
-- exec ViewUserCourses 1
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ChangeModuleOrdinal', 'P') is not null 
    drop procedure ChangeModuleOrdinal;
go

create procedure ChangeModuleOrdinal 
    @aid int, 
    @course_id int, 
    @module_id_1 int, 
    @module_id_2 int
as
begin
    declare @IsBanned BIT;
    declare @user_id int;
    declare @ordinal_1 int, @ordinal_2 int;
    declare @check_status nvarchar(50) = 'SUCCESSED';

    set @IsBanned = dbo.IsUserBanned(@aid, 'ChangeModuleOrdinal');
    
    if @IsBanned = 1 
    begin
        select 'BANNED' as [check];
        return;
    end

    select @user_id = [user_id]
    from Users
    where [authentication_id] = @aid;

    if @user_id is null
    begin
        select 'U_UID' as [check];
        return;
    end

    if not exists (select 1 from Courses where [course_id] = @course_id and [user_id] = @user_id)
    begin
        select 'U_CID' as [check];
        return;
    end

	select @ordinal_1 = module_ordinal 
    from Modules 
    where [module_id] = @module_id_1 and [course_id] = @course_id;

    select @ordinal_2 = module_ordinal 
    from Modules 
    where [module_id] = @module_id_2 and [course_id] = @course_id;

    if @ordinal_1 is null or @ordinal_2 is null
    begin
        select 'U_ORD' as [check];
        return;
    end

    begin try
        begin transaction;
 
        update Modules 
        set [module_ordinal] = @ordinal_2 
        where module_id = @module_id_1 and course_id = @course_id;

        update Modules 
        set [module_ordinal] = @ordinal_1 
        where module_id = @module_id_2 and course_id = @course_id;

        commit transaction;
        set @check_status = 'SUCCESSED';
        
    end try
    begin catch
        if @@trancount > 0
            rollback transaction;
        set @check_status = 'FAILED';
    end catch

    select @check_status as [check];
end
go

-- execute ChangeModuleOrdinal 1, 0, 0, 1
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('UpdateModule', 'P') is not null drop procedure UpdateModule;
go

create procedure UpdateModule
    @aid int, 
    @course_id int, 
    @modules nvarchar(max)
as
begin
    declare @isbanned bit;
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ReadFullCourse', 'P') is not null drop procedure ReadFullCourse;
go
create procedure ReadFullCourse @course_id int
as
begin
    if not exists (
        select 1
        from Courses
        where [course_id] = @course_id)
    begin
        select 'U_CID' as [check]
        return;
    end

    select u.[user_id],
		u.[authentication_id],
		u.[user_full_name],
		c.[course_id],
        c.[course_name], 
        c.[course_short_description],
        c.[course_full_description],
        c.[course_price],
        c.[course_duration],
        c.[course_status],
		m.[module_id],
        m.[module_ordinal],
        m.[module_name],
        clt.[collection_type_name],
		cl.[collection_id],
        cl.[collection_ordinal],
        cl.[collection_name],
        mat.[material_type_name],
		ma.[material_id],
        ma.[material_ordinal],
        ma.[material_content],
        qt.[question_type_name],
		q.[question_id],
        q.[question_ordinal],
        q.[question_description],
		a.[answer_id],
        a.[answer_ordinal],
        a.[answer_description],
        a.[answer_is_right]
    from Courses c
        left join Modules m on m.[course_id] = c.[course_id]
        left join Users u on u.[user_id] = c.[user_id]
        left join Collections cl on cl.[module_id] = m.[module_id]
        left join CollectionTypes clt on clt.[collection_type_id] = cl.[collection_id]
        left join Materials ma on ma.[collection_id] = cl.[collection_id]
        left join MaterialType mat on mat.[material_type_id] = ma.[material_type_id]
        left join Questions q on q.[material_id] = ma.[material_id]
        left join QuestionTypes qt on qt.[question_type_id] = q.[question_type_id]
        left join Answers a on a.[question_id] = q.[question_id]
    where c.course_id = @course_id
    order by m.[module_ordinal], cl.[collection_ordinal], ma.[material_ordinal], q.[question_ordinal], a.[answer_ordinal];
end
go

-- ReadFullCourse 0
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
grant execute on dbo.ReadCourse to [NAV_GUEST];
grant execute on dbo.ReadCourse to [NAV_ADMIN];
grant execute on dbo.ReadCourse to [NAV_ESP];
grant execute on dbo.ReadCourse to [NAV_STUDENT];

grant execute on dbo.CreateCourse to [NAV_ESP];
grant execute on dbo.UpdateCourse to [NAV_ESP];
grant execute on dbo.ReadUserCourses to [NAV_ESP];
grant execute on dbo.UpdateModule to [NAV_ESP];
grant execute on dbo.ReadFullCourse to [NAV_ESP];
grant execute on dbo.ChangeModuleOrdinal to [NAV_ESP];

grant execute on dbo.CreateCourse to [NAV_ADMIN];
grant execute on dbo.UpdateCourse to [NAV_ADMIN];
grant execute on dbo.ReadUserCourses to [NAV_ADMIN];
grant execute on dbo.UpdateModule to [NAV_ADMIN];
grant execute on dbo.ReadFullCourse to [NAV_ADMIN];
grant execute on dbo.ChangeModuleOrdinal to [NAV_ADMIN];


grant execute on dbo.GetAllCoursesByFieldName to [NAV_ADMIN];
grant execute on dbo.GetAllCoursesByFieldName to [NAV_ESP];
grant execute on dbo.GetAllCoursesByFieldName to [NAV_STUDENT];
grant execute on dbo.GetAllCoursesByFieldName to [NAV_GUEST];


grant execute on dbo.selectTop5Course to [NAV_ADMIN];
grant execute on dbo.selectTop5Course to [NAV_ESP];
grant execute on dbo.selectTop5Course to [NAV_STUDENT];
grant execute on dbo.selectTop5Course to [NAV_GUEST];

grant execute on dbo.getField to [NAV_ADMIN];
grant execute on dbo.getField to [NAV_ESP];
grant execute on dbo.getField to [NAV_STUDENT];
grant execute on dbo.getField to [NAV_GUEST];

grant execute on dbo.SortCoursesByFieldAndPrice to [NAV_ADMIN];
grant execute on dbo.SortCoursesByFieldAndPrice to [NAV_ESP];
grant execute on dbo.SortCoursesByFieldAndPrice to [NAV_STUDENT];
grant execute on dbo.SortCoursesByFieldAndPrice to [NAV_GUEST];