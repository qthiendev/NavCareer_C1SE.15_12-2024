use NavCareerDB;

if object_id('ReadCollection', 'P') is not null drop procedure ReadCollection;
go
create procedure ReadCollection @course_id int, @module_ordinal int, @collection_ordinal int
as
begin
	select clt.[collection_type_name],
		cl.[collection_id],
        cl.[collection_name],
        mat.[material_type_name],
        ma.[material_ordinal],
        ma.[material_content],
        qt.[question_type_name],
        q.[question_ordinal],
        q.[question_description],
        a.[answer_ordinal],
        a.[answer_description],
        a.[answer_is_right]
    from Courses c
        left join Modules m on m.[course_id] = c.[course_id]
        left join Collections cl on cl.[module_id] = m.[module_id]
        left join CollectionTypes clt on clt.[collection_type_id] = cl.[collection_id]
        left join Materials ma on ma.[collection_id] = cl.[collection_id]
        left join MaterialType mat on mat.[material_type_id] = ma.[material_type_id]
        left join Questions q on q.[material_id] = ma.[material_id]
        left join QuestionTypes qt on qt.[question_type_id] = q.[question_type_id]
        left join Answers a on a.[question_id] = q.[question_id]
    where c.[course_id] = @course_id and cl.[collection_ordinal] = @collection_ordinal and m.[module_ordinal] = @module_ordinal
    order by m.[module_ordinal], cl.[collection_ordinal], ma.[material_ordinal], q.[question_ordinal], a.[answer_ordinal];
end
go
-- ReadCollection 0, 0, 0
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ReadFrame', 'P') is not null drop procedure ReadFrame;
go
create procedure ReadFrame @course_id int
as
begin
	select m.[module_id],
		m.[module_ordinal],
		m.[module_name],
		clt.[collection_type_name],
		cl.[collection_id],
		cl.[collection_ordinal],
        cl.[collection_name]
    from Courses c
        left join Modules m on m.[course_id] = c.[course_id]
        left join Collections cl on cl.[module_id] = m.[module_id]
        left join CollectionTypes clt on clt.[collection_type_id] = cl.[collection_id]
    where c.[course_id] = @course_id
    order by m.[module_ordinal], cl.[collection_ordinal];
end
go
-- ReadFrame 0
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('CreateEnrollment', 'P') is not null drop procedure CreateEnrollment;
go
create procedure CreateEnrollment @aid int, @course_id int
as
begin
	
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateEnrollment');
    if @IsBanned = 1 
	begin
		select 'BANNED' as [check];
		return;
	end

	declare @user_id int;

	select @user_id = [user_id]
	from Users
	where [authentication_id] = @aid

	if not exists (select 1 from Users where [user_id] = @user_id)
	begin
		select 'U_UID' as [check];
		return;
	end

	if not exists ( select 1 from Courses where [course_id] = @course_id)
	begin
		select 'U_CID' as [check]
		return;
	end

	if (exists (select 1 from Users where [user_id] = @user_id AND [user_status] = 0)) and @aid != @user_id 
	begin
		select 'INACTIVE' as [check];
		return;
	end

	if exists (select 1 from Enrollments where [user_id] = @user_id and [course_id] = @course_id)
	begin
		select 'E_EID' as [check];
		return;
	end

	insert into Enrollments([enrollment_date], [enrollment_is_complete], [user_id], [course_id])
	values
	(getdate(), 0, @user_id, @course_id);

	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check]
		return;
	end

	select 'FAILED' as [check]

end
go

------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ReadEnrollment', 'P') is not null drop procedure ReadEnrollment;
go
create procedure ReadEnrollment @aid int
as
begin
	
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'ReadEnrollment');
    if @IsBanned = 1 
	begin
		select 'BANNED' as [check];
		return;
	end

	declare @user_id int;

	select @user_id = [user_id]
	from Users
	where [authentication_id] = @aid

	if (exists (select 1 from Users where [user_id] = @user_id AND [user_status] = 0)) and @aid != @user_id 
	begin
		select 'INACTIVE' as [check];
		return;
	end

	if not exists (select 1 from Users where [user_id] = @user_id)
	begin
		select 'U_UID' as [check];
		return;
	end

	if (select count(*) from Enrollments where [user_id] = @user_id) = 0
	begin
		select 'U_EID' as [check];
		return;
	end

	select e.[enrollment_id],
		e.[enrollment_date],
		e.[enrollment_is_complete],
		u.[user_id],
		c.[course_id],
		c.[course_name],
		c.[course_short_description],
		c.[course_price]
	from Enrollments e
		join Users u on u.[user_id] = e.[user_id]
		join Courses c on c.[course_id] = e.[course_id]
	where e.[user_id] = @user_id
end
go
--ReadEnrollment 1
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('UpdateEnrollment', 'P') is not null drop procedure UpdateEnrollment;
go
create procedure UpdateEnrollment @aid int
begin

end
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
grant execute on dbo.ReadCollection to [NAV_ADMIN];
grant execute on dbo.ReadCollection to [NAV_ESP];
grant execute on dbo.ReadCollection to [NAV_STUDENT];

grant execute on dbo.ReadFrame to [NAV_ADMIN];
grant execute on dbo.ReadFrame to [NAV_ESP];
grant execute on dbo.ReadFrame to [NAV_STUDENT];

grant execute on dbo.CreateEnrollment to [NAV_ADMIN];
grant execute on dbo.CreateEnrollment to [NAV_ESP];
grant execute on dbo.CreateEnrollment to [NAV_STUDENT];

grant execute on dbo.ReadEnrollment to [NAV_ADMIN];
grant execute on dbo.ReadEnrollment to [NAV_ESP];
grant execute on dbo.ReadEnrollment to [NAV_STUDENT];