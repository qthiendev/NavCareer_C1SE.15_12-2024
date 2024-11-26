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

	if exists (select 1 from Courses where [user_id] = @user_id)
	begin
		if not exists (select 1 from Enrollments where [user_id] = @user_id and [course_id] = @course_id)
		begin
			insert into Enrollments([enrollment_date], [enrollment_is_complete], [user_id], [course_id])
			values
			(getdate(), 0, @user_id, @course_id);
		end

		update [Grades]
		set [grade_number] = 0
		where [enrollment_id] = (
			select [enrollment_id]
			from Enrollments 
			where [user_id] = @user_id
				and [course_id] = @course_id)
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
-- ReadEnrollmentOf 1, 0 
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
if object_id('CheckAccomplishment', 'P') is not null drop procedure CheckAccomplishment;
go

create procedure CheckAccomplishment @aid int, @enrollment_id int
as
begin
    declare @IsBanned BIT;

    set @IsBanned = dbo.IsUserBanned(@aid, 'CheckAccomplishment');

    if @IsBanned = 1 
    begin
        select 'BANNED' as [check];
        return;
    end

    declare @user_id int;

    select @user_id = [user_id]
    from Users
    where [authentication_id] = @aid;

    if not exists (select 1 from Enrollments where [enrollment_id] = @enrollment_id and [user_id] = @user_id)
    begin
        select 'BANNED' as [check];
        return;
    end

    if exists (select 1 from Accomplishments where [enrollment_id] = @enrollment_id)
    begin
		update Enrollments
		set [enrollment_is_complete] = 1
		where [enrollment_id] = @enrollment_id

        select 'E_AID' as [check];
        return;
    end

    declare @total_modules int, @qualified_modules int, @total_grade decimal(5,2);

    select @total_modules = count(*)
    from Modules m
    join Enrollments e on e.course_id = m.course_id
    where e.enrollment_id = @enrollment_id;

    select @qualified_modules = count(*), @total_grade = avg(max_grade)
    from (
        select max(g.grade_number) as max_grade
        from Grades g
        join Modules m on m.module_id = g.module_id
        where g.enrollment_id = @enrollment_id
        group by g.module_id
    ) as MaxGrades
    where max_grade >= 80;

    if @qualified_modules < @total_modules
    begin
        select 'U_AID' as [check];
        return;
    end

    declare @certificate_id varchar(24) = '';
    declare @characters varchar(36) = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    declare @i int = 0;

    while @i < 24
    begin
        set @certificate_id = @certificate_id + substring(@characters, cast(floor(rand() * 36) + 1 as int), 1);
        set @i = @i + 1;
    end

    insert into Accomplishments (
        [accomplishment_completion_date],
        [accomplishment_overall_grade],
        [accomplishment_certificate_id],
        [enrollment_id]
    )
    values(getdate(), @total_grade, @certificate_id, @enrollment_id);

    if @@ROWCOUNT = 1
    begin
		update Enrollments
		set [enrollment_is_complete] = 1
		where [enrollment_id] = @enrollment_id

		if @@ROWCOUNT = 1
		begin
			select 'SUCCESSED' as [check];
		end
		else 
		begin
			select 'FAILED' as [check];
		end
    end
    else
    begin
        select 'FAILED' as [check];
    end
end;
go
-- exec CheckAccomplishment 2, 0
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ReadAccomplishmentByEnrollment', 'P') is not null drop procedure ReadAccomplishmentByEnrollment;
go
create procedure ReadAccomplishmentByEnrollment @enrollment_id int
as
begin

	select [accomplishment_certificate_id]
	from Accomplishments
	where [enrollment_id] = @enrollment_id

end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ReadAccomplishment', 'P') is not null drop procedure ReadAccomplishment;
go
create procedure ReadAccomplishment @certificate_id nvarchar(max)
as
begin

	select a.[accomplishment_id], 
		a.[accomplishment_completion_date],
		a.[accomplishment_overall_grade],
		a.[accomplishment_certificate_id],
		e.[enrollment_id],
		c.[course_id],
		c.[course_name],
		uc.[user_id] as [provider_id],
		uc.[user_full_name] as provider_name,
		us.[user_id] as [student_id],
		us.[user_full_name] as student_name,
		us.[user_gender]
	from Accomplishments a
		join Enrollments e on e.[enrollment_id] = a.[enrollment_id]
		join Courses c on c.[course_id] = e.[course_id]
		join Users us on us.[user_id] = e.[user_id]
		join Users uc on uc.[user_id] = c.[user_id]
	where [accomplishment_certificate_id] = @certificate_id

end
go
-- ReadAccomplishment "72TH1SFBW83RA8X1U6JGJJ1A"
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

grant execute on dbo.CheckAccomplishment to [NAV_ADMIN];
grant execute on dbo.CheckAccomplishment to [NAV_ESP];
grant execute on dbo.CheckAccomplishment to [NAV_STUDENT];

grant execute on dbo.ReadAccomplishment to [NAV_ADMIN];
grant execute on dbo.ReadAccomplishment to [NAV_ESP];
grant execute on dbo.ReadAccomplishment to [NAV_STUDENT];
grant execute on dbo.ReadAccomplishment to [NAV_GUEST];

grant execute on dbo.ReadAccomplishmentByEnrollment to [NAV_ADMIN];
grant execute on dbo.ReadAccomplishmentByEnrollment to [NAV_ESP];
grant execute on dbo.ReadAccomplishmentByEnrollment to [NAV_STUDENT];
grant execute on dbo.ReadAccomplishmentByEnrollment to [NAV_GUEST];