go
use master;
go
use NavCareerDB;
go

--phúc viết để làm chatbot
if object_id('GetAllCourses', 'P') is not null drop procedure GetAllCourses;
go
create procedure GetAllCourses
as
begin
	select
		c.[course_id],
		c.[course_name], 
		c.[course_short_description],
		c.[course_price],
		c.[course_duration]
	from Courses c
end
go
 --exec GetAllCourses
 --lọc giá: từ khoảng đến khoảng
 if object_id('GetCoursesByPriceRange', 'P') is not null drop procedure GetCoursesByPriceRange;
go
create procedure GetCoursesByPriceRange @min_price decimal(10, 2), @max_price decimal(10, 2)
as
begin
	select
		c.[course_id],
		c.[course_name], 
		c.[course_short_description],
		c.[course_price],
		c.[course_duration]
	from Courses c
	where c.[course_price] between @min_price and @max_price
	order by c.course_price
end
go
--exec GetCoursesByPriceRange 1500000, 3000000
--lọc giá lớn hơn khoảng 
if object_id('GetCoursesAbovePrice', 'P') is not null drop procedure GetCoursesAbovePrice;
go
create procedure GetCoursesAbovePrice @min_price decimal(10, 2)
as
begin
	select
		c.[course_id],
		c.[course_name], 
		c.[course_short_description],
		c.[course_price],
		c.[course_duration]
	from Courses c
	where c.[course_price] > @min_price
	order by c.course_price
end
go
-- exec GetCoursesAbovePrice 2000000
-- lọc giá bé hơn khoảng
if object_id('GetCoursesBelowPrice', 'P') is not null drop procedure GetCoursesBelowPrice;
go
create procedure GetCoursesBelowPrice @max_price decimal(10, 2)
as
begin
	select
		c.[course_id],
		c.[course_name], 
		c.[course_short_description],
		c.[course_price],
		c.[course_duration]
	from Courses c
	where c.[course_price] < @max_price
	order by c.course_price
end
go
-- exec GetCoursesBelowPrice 2500000

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
if object_id('UpdateModule', 'P') is not null drop procedure UpdateModule;
go

create procedure UpdateModule
    @aid int, 
    @course_id int, 
    @modules nvarchar(max)
as
begin
    declare @isbanned bit;
    set @isbanned = dbo.IsUserBanned(@aid, 'UpdateCourse');
    
    if @isbanned = 1 
    begin
        select 'BANNED' as [check];
        return;
    end

    declare @user_id int;

    select @user_id = [user_id]
    from Users
    where [authentication_id] = @aid;

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
        from Authentications auth 
        join Authorizations authz on authz.authorization_id = auth.authorization_id
        where auth.authentication_id = @aid and authz.role = 'NAV_ESP')
    begin
        select 'U_ROLE' as [check];
        return;
    end

    begin try
        begin transaction;

        -- Delete existing modules for the course
        delete from [Modules]
        where course_id = @course_id;

        -- Check if deletion was successful
        if @@rowcount = 0
        begin
            rollback transaction;
            select 'U_MODULE' as [check];
            return;
        end

        declare @json nvarchar(max) = @modules;
        declare @available_id int;
        declare @inserted_count int = 0;

        -- Temporary table to hold new modules
        create table #NewModules (
            module_ordinal int,
            module_name nvarchar(255)
        );

        -- Insert the JSON data into the temporary table
        insert into #NewModules (module_ordinal, module_name)
        select 
            ordinal,
            modulename
        from openjson(@json)
        with (
            ordinal int '$.module_ordinal',
            modulename nvarchar(255) '$.module_name'
        );

        -- Get the count of new modules
        declare @count int = (select count(*) from #NewModules);

        -- Find the first missing module_id starting from 0
        set @available_id = (
            select min(missing_id)
            from (
                select n.number as missing_id
                from master.dbo.spt_values n
                where n.type = 'P' and n.number >= 0 and n.number <= (select isnull(max(module_id), -1) from [Modules])
                and not exists (
                    select 1
                    from [Modules] m
                    where m.module_id = n.number
                )
            ) as MissingIDs
        );

        -- If no missing ID is found, get the next ID based on the max existing module_id
        if @available_id is null
        begin
            set @available_id = (
                select isnull(max(module_id), -1) + 1 from [Modules]
            );
        end

        -- Loop to insert new modules based on the available IDs
        while @inserted_count < @count
        begin
            -- Check if the available module_id already exists in the existing modules
            if not exists (select 1 from [Modules] where module_id = @available_id)
            begin
                -- Insert the new module with this ID
                insert into [Modules] (module_id, module_ordinal, module_name, course_id)
                select 
                    @available_id,
                    nm.module_ordinal,
                    nm.module_name,
                    @course_id
                from #NewModules nm
                where nm.module_ordinal = @inserted_count;

                set @inserted_count = @inserted_count + 1;
            end

            set @available_id = @available_id + 1; -- Move to the next ID
        end

        -- Check the total number of inserted records after the loop
        declare @actual_inserted_count int = (select count(*) from [Modules] where course_id = @course_id);

        if @actual_inserted_count < @count
        begin
            rollback transaction;
            select 'FAILED' as [check];
            return;
        end

        commit transaction;
    end try
    begin catch
        rollback transaction;
        throw;
    end catch

    select 'SUCCESSED' as [check];
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

grant execute on dbo.CreateCourse to [NAV_ADMIN];
grant execute on dbo.UpdateCourse to [NAV_ADMIN];
grant execute on dbo.ReadUserCourses to [NAV_ADMIN];
grant execute on dbo.UpdateModule to [NAV_ADMIN];
grant execute on dbo.ReadFullCourse to [NAV_ADMIN];


grant execute on dbo.GetAllCourses to [NAV_ADMIN];
grant execute on dbo.GetAllCourses to [NAV_ESP];
grant execute on dbo.GetAllCourses to [NAV_STUDENT];
grant execute on dbo.GetAllCourses to [NAV_GUEST];

grant execute on dbo.[GetCoursesByPriceRange] to [NAV_ADMIN];
grant execute on dbo.[GetCoursesByPriceRange] to [NAV_ESP];
grant execute on dbo.[GetCoursesByPriceRange] to [NAV_STUDENT];
grant execute on dbo.[GetCoursesByPriceRange] to [NAV_GUEST];

grant execute on dbo.GetCoursesAbovePrice to [NAV_ADMIN];
grant execute on dbo.GetCoursesAbovePrice to [NAV_ESP];
grant execute on dbo.GetCoursesAbovePrice to [NAV_STUDENT];
grant execute on dbo.GetCoursesAbovePrice to [NAV_GUEST];

grant execute on dbo.GetCoursesBelowPrice to [NAV_ADMIN];
grant execute on dbo.GetCoursesBelowPrice to [NAV_ESP];
grant execute on dbo.GetCoursesBelowPrice to [NAV_STUDENT];
grant execute on dbo.GetCoursesBelowPrice to [NAV_GUEST];

grant execute on dbo.selectTop5Course to [NAV_ADMIN];
grant execute on dbo.selectTop5Course to [NAV_ESP];
grant execute on dbo.selectTop5Course to [NAV_STUDENT];
grant execute on dbo.selectTop5Course to [NAV_GUEST];