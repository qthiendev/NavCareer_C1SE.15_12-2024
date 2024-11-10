use NavCareerDB;

if object_id('ReadCollection', 'P') is not null drop procedure ReadCollection;
go
create procedure ReadCollection @course_id int, @module_ordinal int, @collection_ordinal int
as
begin
	select m.[module_id],
		clt.[collection_type_id],
		clt.[collection_type_name],
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
        left join CollectionTypes clt on clt.[collection_type_id] = cl.[collection_type_id]
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
        left join CollectionTypes clt on clt.[collection_type_id] = cl.[collection_type_id]
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
if object_id('ReadEnrollmentOf', 'P') is not null drop procedure ReadEnrollmentOf;
go
create procedure ReadEnrollmentOf @aid int, @course_id int
as
begin
	
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'ReadEnrollmentOf');
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

	if not exists ( select 1 from Courses where [course_id] = @course_id)
	begin
		select 'U_CID' as [check]
		return;
	end

	if not exists (select 1 from Enrollments where [user_id] = @user_id and [course_id] = @course_id)
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
		and e.[course_id] = @course_id
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('CreatePayment', 'P') is not null drop procedure CreatePayment;
go
create procedure CreatePayment @aid int, @payment_transaction_id nvarchar(max), @payment_description nvarchar(max)
as
begin

	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreatePayment');
    if @IsBanned = 1 
	begin
		select 'BANNED' as [check];
		return;
	end

	insert into Payments ([payment_transaction_id], [payment_description], [payment_date], [authentication_id])
	values (@payment_transaction_id, @payment_description, getdate(), @aid);

	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check];
		return;
	end

	select 'FAILED' as [check];
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ReadPayment', 'P') is not null drop procedure ReadPayment;
go
create procedure ReadPayment @aid int, @payment_transaction_id nvarchar(max)
as
begin
	select [payment_id], [payment_description], [payment_transaction_id], [payment_date], [authentication_id]
	from Payments
	where [payment_transaction_id] = @payment_transaction_id and [authentication_id] = @aid
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('UpdatePayment', 'P') is not null drop procedure UpdatePayment;
go
create procedure UpdatePayment @aid int, @payment_transaction_id nvarchar(max)
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'UpdatePayment');
    if @IsBanned = 1 
	begin
		select 'BANNED' as [check];
		return;
	end

	update Payments
	set [payment_state] = 1
	where [payment_transaction_id] = @payment_transaction_id and [authentication_id] = @aid


	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check];
		return;
	end

	select 'FAILED' as [check];
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('CreateTracking', 'P') is not null drop procedure CreateTracking;
go
create procedure CreateTracking @aid int, @enrollment_id int, @collection_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateTracking');
    if @IsBanned = 1 
	begin
		select 'BANNED' as [check];
		return;
	end

	if not exists (select 1 from Enrollments where [enrollment_id] = @enrollment_id)
	begin
		select 'U_EID' as [check];
		return;
	end

	if exists (select 1 from UserTracking where [enrollment_id] = @enrollment_id and [collection_id] = @collection_id)
	begin
		select 'E_TID' as [check];
		return;
	end

	insert into UserTracking ([enrollment_id], [collection_id])
	values (@enrollment_id, @collection_id);

	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check];
		return;
	end

	select 'FAILED' as [check];
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ReadTracking', 'P') is not null drop procedure ReadTracking;
go
create procedure ReadTracking @aid int, @enrollment_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'ReadTracking');
    if @IsBanned = 1 
	begin
		select 'BANNED' as [check];
		return;
	end

	if not exists (select 1 from Enrollments where [enrollment_id] = @enrollment_id)
	begin
		select 'U_EID' as [check];
		return;
	end

	select [tracking_id], [enrollment_id], [collection_id]
	from UserTracking
	where [enrollment_id] = @enrollment_id
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('CreateGrade', 'P') is not null drop procedure CreateGrade;
go
create procedure CreateGrade @aid int, @enrollment_id int, @module_id int, @grade int
as
begin
	declare @IsBanned BIT;

	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateGrade');

    if @IsBanned = 1 
	begin
		select 'BANNED' as [check];
		return;
	end

	declare @user_id int;

	select @user_id = [user_id]
	from Users
	where [authentication_id] = @aid

	if not exists (select 1 from Enrollments where [enrollment_id] = @enrollment_id and [user_id] = @user_id)
	begin
		select 'BANNED' as [check];
		return;
	end

	insert into Grades ([grade_number], [graded_date], [enrollment_id], [module_id])
	values (@grade, getdate(), @enrollment_id, @module_id);

	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check];
		return;
	end

	select 'FAILED' as [check];
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ReadGrade', 'P') is not null drop procedure ReadGrade;
go
create procedure ReadGrade @aid int, @enrollment_id int, @module_id int
as
begin
	declare @IsBanned BIT;

	set @IsBanned = dbo.IsUserBanned(@aid, 'ReadGrade');

    if @IsBanned = 1 
	begin
		select 'BANNED' as [check];
		return;
	end

	select [grade_id], [grade_number], [graded_date], [enrollment_id], [module_id]
	from Grades
	where [enrollment_id] = @enrollment_id and [module_id] = @module_id
end
go
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

grant execute on dbo.ReadEnrollmentOf to [NAV_ADMIN];
grant execute on dbo.ReadEnrollmentOf to [NAV_ESP];
grant execute on dbo.ReadEnrollmentOf to [NAV_STUDENT];

grant execute on dbo.CreatePayment to [NAV_ADMIN];
grant execute on dbo.CreatePayment to [NAV_ESP];
grant execute on dbo.CreatePayment to [NAV_STUDENT];

grant execute on dbo.ReadPayment to [NAV_ADMIN];
grant execute on dbo.ReadPayment to [NAV_ESP];
grant execute on dbo.ReadPayment to [NAV_STUDENT];

grant execute on dbo.UpdatePayment to [NAV_ADMIN];
grant execute on dbo.UpdatePayment to [NAV_ESP];
grant execute on dbo.UpdatePayment to [NAV_STUDENT];

grant execute on dbo.CreateTracking to [NAV_ADMIN];
grant execute on dbo.CreateTracking to [NAV_ESP];
grant execute on dbo.CreateTracking to [NAV_STUDENT];

grant execute on dbo.ReadTracking to [NAV_ADMIN];
grant execute on dbo.ReadTracking to [NAV_ESP];
grant execute on dbo.ReadTracking to [NAV_STUDENT];

grant execute on dbo.ReadGrade to [NAV_ADMIN];
grant execute on dbo.ReadGrade to [NAV_ESP];
grant execute on dbo.ReadGrade to [NAV_STUDENT];

grant execute on dbo.CreateGrade to [NAV_ADMIN];
grant execute on dbo.CreateGrade to [NAV_ESP];
grant execute on dbo.CreateGrade to [NAV_STUDENT];