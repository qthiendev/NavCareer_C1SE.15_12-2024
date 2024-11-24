USE [NavCareerDB]
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('CreateModule', 'P') is not null drop procedure CreateModule;
go

create procedure CreateModule @aid int, @module_name nvarchar(max), @course_id int
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

	declare @latest_module_ordinal int;

	select @latest_module_ordinal = [module_ordinal] + 1
	from Modules
	where [course_id] = @course_id
	order by [module_ordinal]

	if (@latest_module_ordinal is null) set @latest_module_ordinal = 0

	insert into Modules ([module_name], [module_created_date], [module_ordinal], [course_id])
	values(@module_name, getdate(), @latest_module_ordinal,@course_id);

	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check];
		return;
	end

	select 'FAILED' as [check];
end

go
-- execute CreateModule 1, N'Test Name', 1
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ChangeModuleOrdinal', 'P') is not null drop procedure ChangeModuleOrdinal;
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

    set @IsBanned = dbo.IsUserBanned(@aid, 'UpdateCourse');
    
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
	@module_id int,
    @module_name nvarchar(max)
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

	update Modules
	set [module_name] = @module_name
	where [course_id] = @course_id
		and [module_id] = @module_id

	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check];
		return;
	end

	select 'FAILED' as [check];
end
go
-- UpdateModule 1, 2, 0, 'Test'
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('DeleteModule', 'P') is not null drop procedure DeleteModule;
go

create procedure DeleteModule
    @aid int,
    @course_id int,
    @module_id int
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

    -- Delete the specified module
    delete from Modules
    where [course_id] = @course_id
        and [module_id] = @module_id;

    if @@ROWCOUNT = 1
    begin
        update Modules
		set [module_ordinal] = [module_ordinal] - 1
		where [module_id] > @module_id
			and [course_id] = @course_id

        select 'SUCCESSED' as [check];
        return;
    end

    select 'FAILED' as [check];
end
go
-- DeleteModule 1, 0 ,8
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('CreateCollection', 'P') is not null drop procedure CreateCollection;
go

create procedure CreateCollection @aid int, @collection_name nvarchar(max), @collection_type_id int, @module_id int
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
	where [authentication_id] = @aid;

	if @user_id is null
    begin
        select 'U_UID' as [check];
        return;
    end

    if not exists (select 1 from Modules where [module_id] = @module_id)
    begin
        select 'U_MID' as [check];
        return;
    end

	declare @latest_collection_ordinal int;

	select @latest_collection_ordinal = [collection_ordinal] + 1
	from Collections
	where [module_id] = @module_id
	order by [collection_ordinal]

	if (@latest_collection_ordinal is null) set @latest_collection_ordinal = 0

	insert into Collections([collection_name], [collection_created_date], [collection_ordinal], [collection_type_id], [module_id])
	values(@collection_name, getdate(), @latest_collection_ordinal, @collection_type_id, @module_id);

	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check];
		return;
	end

	select 'FAILED' as [check];
end

go
-- execute CreateModule 1, N'Test Name', 1
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ChangeCollectionOrdinal', 'P') is not null drop procedure ChangeCollectionOrdinal;
go

create procedure ChangeCollectionOrdinal 
    @aid int, 
    @module_id int, 
    @collection_id_1 int, 
    @collection_id_2 int
as
begin
    declare @IsBanned BIT;
    declare @user_id int;
    declare @ordinal_1 int, @ordinal_2 int;
    declare @check_status nvarchar(50) = 'SUCCESSED';

    set @IsBanned = dbo.IsUserBanned(@aid, 'UpdateCourse');
    
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

    if not exists (select 1 from Modules where [module_id] = @module_id)
    begin
        select 'U_MID' as [check];
        return;
    end

	select @ordinal_1 = [collection_ordinal]
    from Collections
    where [collection_id] = @collection_id_1 and [module_id] = @module_id;

    select @ordinal_2 = [collection_ordinal] 
    from Collections
    where [collection_id] = @collection_id_2 and [module_id] = @module_id;

    if @ordinal_1 is null or @ordinal_2 is null
    begin
        select 'U_ORD' as [check];
        return;
    end

    begin try
        begin transaction;
 
        update Collections
        set [collection_ordinal] = @ordinal_2 
        where collection_id = @collection_id_1 and [module_id] = @module_id;

		if @@ROWCOUNT = 0 rollback transaction;

        update Collections
        set [collection_ordinal] = @ordinal_1 
        where collection_id = @collection_id_2 and [module_id] = @module_id;

		if @@ROWCOUNT = 0 rollback transaction;

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
-- execute ChangeCollectionOrdinal 1, 0, 14, 15
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('UpdateCollection', 'P') is not null drop procedure UpdateCollection;
go

create procedure UpdateCollection
    @aid int,
    @module_id int,
	@collection_id int,
    @collection_name nvarchar(max),
	@collection_type_id int
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
	where [authentication_id] = @aid;

	if @user_id is null
    begin
        select 'U_UID' as [check];
        return;
    end

    if not exists (select 1 from Modules where [module_id] = @module_id)
    begin
        select 'U_MID' as [check];
        return;
    end

	if not exists (select 1 from Collections where [collection_id] = @collection_id)
    begin
        select 'U_CID' as [check];
        return;
    end

	update Collections
	set [collection_name] = @collection_name,
		[collection_type_id] = @collection_type_id
	where [collection_id] = @collection_id
		and [module_id] = @module_id

	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check];
		return;
	end

	select 'FAILED' as [check];
end
go
-- UpdateModule 1, 2, 0, 'Test'
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('DeleteCollection', 'P') is not null drop procedure DeleteCollection;
go

create procedure DeleteCollection
    @aid int,
    @module_id int,
    @collection_id int
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
    where [authentication_id] = @aid;

    if @user_id is null
    begin
        select 'U_UID' as [check];
        return;
    end

    if not exists (select 1 from Modules where [module_id] = @module_id)
    begin
        select 'U_MID' as [check];
        return;
    end

	if not exists (select 1 from Collections where [collection_id] = @collection_id)
    begin
        select 'U_CID' as [check];
        return;
    end

    delete from Collections
    where [collection_id] = @collection_id
        and [module_id] = @module_id;

    if @@ROWCOUNT = 1
    begin
        update Collections
		set [collection_ordinal] = [collection_ordinal] - 1
		where [collection_id] > @collection_id
			and [module_id] = @module_id

        select 'SUCCESSED' as [check];
        return;
    end

    select 'FAILED' as [check];
end
go
-- DeleteModule 1, 0 ,8
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('CreateMaterial', 'P') is not null drop procedure CreateMaterial;
go

create procedure CreateMaterial @aid int, @material_content nvarchar(max), @material_type_id int, @collection_id int
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
	where [authentication_id] = @aid;

	if @user_id is null
    begin
        select 'U_UID' as [check];
        return;
    end

    if not exists (select 1 from Collections where [collection_id] = @collection_id )
    begin
        select 'U_CID' as [check];
        return;
    end

	declare @latest_material_ordinal int;

	select @latest_material_ordinal = [material_ordinal] + 1
	from Materials
	where [collection_id] = @collection_id
	order by [material_ordinal]

	if (@latest_material_ordinal is null) set @latest_material_ordinal = 0

	insert into Materials([material_content], [material_ordinal], [material_type_id], [collection_id])
	values(@material_content, @latest_material_ordinal, @material_type_id, @collection_id);

	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check];
		return;
	end

	select 'FAILED' as [check];
end

go
-- execute CreateModule 1, N'Test Name', 1
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ChangeMaterialOrdinal', 'P') is not null drop procedure ChangeMaterialOrdinal;
go

create procedure ChangeMaterialOrdinal 
    @aid int, 
    @collection_id int, 
    @material_id_1 int, 
    @material_id_2 int
as
begin
    declare @IsBanned BIT;
    declare @user_id int;
    declare @ordinal_1 int, @ordinal_2 int;
    declare @check_status nvarchar(50) = 'SUCCESSED';

    set @IsBanned = dbo.IsUserBanned(@aid, 'UpdateCourse');
    
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

    if not exists (select 1 from Collections where [collection_id] = @collection_id )
    begin
        select 'U_CID' as [check];
        return;
    end

	select @ordinal_1 = [material_ordinal]
    from Materials
    where [material_id] = @material_id_1 and [collection_id] = @collection_id;

    select @ordinal_2 = [material_ordinal] 
    from Materials
    where [material_id] = @material_id_2 and [collection_id] = @collection_id;

    if @ordinal_1 is null or @ordinal_2 is null
    begin
        select 'U_ORD' as [check];
        return;
    end

    begin try
        begin transaction;
 
        update Materials
        set [material_ordinal] = @ordinal_2 
        where material_id = @material_id_1 and [collection_id] = @collection_id;

		if @@ROWCOUNT = 0 rollback transaction;

        update Materials
        set [material_ordinal] = @ordinal_1 
        where material_id = @material_id_2 and [collection_id] = @collection_id;

		if @@ROWCOUNT = 0 rollback transaction;

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
-- execute ChangeCollectionOrdinal 1, 0, 14, 15
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('UpdateMaterial', 'P') is not null drop procedure UpdateMaterial;
go

create procedure UpdateMaterial
    @aid int,
    @collection_id int,
	@material_id int,
    @material_content nvarchar(max),
	@material_type_id int
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
	where [authentication_id] = @aid;

	if @user_id is null
    begin
        select 'U_UID' as [check];
        return;
    end

    if not exists (select 1 from Collections where [collection_id] = @collection_id)
    begin
        select 'U_CID' as [check];
        return;
    end

	if not exists (select 1 from Materials where [material_id] = @material_id)
    begin
        select 'U_MID' as [check];
        return;
    end

	update Materials
	set [material_content] = @material_content,
		[material_type_id] = @material_type_id
	where [material_id] = @material_id
		and [collection_id] = @collection_id

	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check];
		return;
	end

	select 'FAILED' as [check];
end
go
-- UpdateCollection 1, 2, 0, 'Test'
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('DeleteMaterial', 'P') is not null drop procedure DeleteMaterial;
go

create procedure DeleteMaterial
    @aid int,
    @collection_id int,
    @material_id int
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
    where [authentication_id] = @aid;

    if @user_id is null
    begin
        select 'U_UID' as [check];
        return;
    end

    if not exists (select 1 from Collections where [collection_id] = @collection_id)
    begin
        select 'U_MID' as [check];
        return;
    end

	if not exists (select 1 from Materials where [material_id] = @material_id)
    begin
        select 'U_CID' as [check];
        return;
    end

    delete from Materials
    where [material_id] = @material_id
        and [collection_id] = @collection_id;

    if @@ROWCOUNT = 1
    begin
        update Materials
		set [material_ordinal] = [material_ordinal] - 1
		where [material_id] > @material_id
			and [collection_id] = @collection_id

        select 'SUCCESSED' as [check];
        return;
    end

    select 'FAILED' as [check];
end
go
-- DeleteCollection 1, 0 ,8
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
grant execute on dbo.CreateModule to [NAV_ESP];
grant execute on dbo.ChangeModuleOrdinal to [NAV_ESP];
grant execute on dbo.UpdateModule to [NAV_ESP];
grant execute on dbo.DeleteModule to [NAV_ESP];

grant execute on dbo.CreateCollection to [NAV_ESP];
grant execute on dbo.ChangeCollectionOrdinal to [NAV_ESP];
grant execute on dbo.UpdateCollection to [NAV_ESP];
grant execute on dbo.DeleteCollection to [NAV_ESP];

grant execute on dbo.CreateMaterial to [NAV_ESP];
grant execute on dbo.ChangeMaterialOrdinal to [NAV_ESP];
grant execute on dbo.UpdateMaterial to [NAV_ESP];
grant execute on dbo.DeleteMaterial to [NAV_ESP];