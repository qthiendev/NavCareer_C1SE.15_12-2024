use NavCareerDB;

--- procedure
IF OBJECT_ID('ViewProfile', 'P') IS NOT NULL DROP PROCEDURE ViewProfile;
GO
CREATE PROCEDURE ViewProfile @auth_id INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if the user exists
    IF EXISTS (SELECT 1 FROM Users WHERE [authentication_id] = @auth_id)
    BEGIN
        -- Check if the user is active
        IF EXISTS (SELECT 1 FROM Users WHERE [authentication_id] = @auth_id AND [is_active] = 0)
        BEGIN
            RETURN;
        END
        
        -- If user exists and is active, return the profile data
        SELECT 
            [user_full_name], 
            [birthdate],
            [gender],
            [email], 
            [phone_number],
            [address], 
            [date_joined],
            [resource_url], 
            [authentication_id],
            [is_active] 
        FROM Users 
        WHERE [authentication_id] = @auth_id;
    END
    ELSE
    BEGIN
        -- Raise an error if the user is not found
        RAISERROR('User with ID %d not found.', 16, 1, @auth_id);
    END
END;
GO

--
IF OBJECT_ID('ViewProfileSignedIn', 'P') IS NOT NULL DROP PROCEDURE ViewProfileSignedIne;
GO
CREATE PROCEDURE ViewProfileSignedIn @aid int, @auth_id INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if the user exists
    IF EXISTS (SELECT 1 FROM Users WHERE [authentication_id] = @auth_id)
    BEGIN
        -- Check if the user is active
        IF EXISTS (SELECT 1 FROM Users WHERE [authentication_id] = @auth_id AND [is_active] = 0)
			and @aid != @auth_id
        BEGIN
            RETURN;
        END
        
        -- If user exists and is active, return the profile data
        SELECT 
            [user_full_name], 
            [birthdate],
            [gender],
            [email], 
            [phone_number],
            [address], 
            [date_joined],
            [resource_url], 
            [authentication_id],
            [is_active] 
        FROM Users 
        WHERE [authentication_id] = @auth_id;
    END
    ELSE
    BEGIN
        -- Raise an error if the user is not found
        RAISERROR('User with ID %d not found.', 16, 1, @auth_id);
    END
END;
GO




-- CREATE
if object_id('CreateProfile', 'P') is not null drop procedure CreateProfile;
go
create procedure CreateProfile 
	@aid int,
    @user_full_name NVARCHAR(MAX), 
    @birthdate DATETIME, 
    @gender BIT, 
    @email NVARCHAR(MAX), 
    @phone_number NVARCHAR(30), 
    @address NVARCHAR(MAX)
AS
BEGIN
    -- Declare a new ID for the user
	declare @IsBanned BIT;
    set @IsBanned = dbo.IsUserBanned(@aid, 'CreateProfile');
    if @IsBanned = 1 return;

	IF EXISTS (SELECT 1 FROM Users WHERE authentication_id = @aid)
    BEGIN
        RETURN;
    END
    -- Generate resource URL based on new user ID
	declare @newID int;
	select @newID = isnull(max([user_id]), -1) + 1 from Users;

    DECLARE @resource_url NVARCHAR(MAX) = trim('/profiles/_' + CAST(@aid AS NVARCHAR));

    -- Insert the new user into the Users table with the updated column order
    INSERT INTO Users (
        [user_id],  [user_full_name], [birthdate],  [gender],  [email], 
        [phone_number],  [address],  [date_joined],  [resource_url], [authentication_id],[is_active]
    )
    VALUES (@newID,  @user_full_name,  @birthdate,  @gender, @email,  @phone_number, @address, GETDATE(), TRIM(@resource_url), @aid, 1);

	select 'TRUE' as [check]
	from Users
	where 
		[user_full_name]=@user_full_name and 
		[birthdate] = @birthdate and
		[gender] = @gender and
		[email] = @email and
		[phone_number] = @phone_number and
		[address] = @address and
		[resource_url] = TRIM(@resource_url) AND
		[authentication_id] = @aid
END;
GO

--EXEC CreateProfile 
--   @aid=4,
--   @user_full_name = N'phúc đẹp trai ông trùng kéo viu số 1 việt nam ', 
--   @birthdate = '1995-05-15', 
--   @gender = 0,  -- Assuming 0 for female
--   @email = 'jane.doe@example.com', 
--   @phone_number = '0987654321', 
--   @address = '456 Another St' 


-- UPDATE

if object_id('UpdateProfile', 'P') is not null drop procedure UpdateProfile;
go
CREATE PROCEDURE UpdateProfile 
	@aid int,
    @user_id INT,  -- The ID of the user to be updated
    @user_full_name NVARCHAR(MAX), 
    @birthdate DATETIME, 
    @gender BIT, 
    @email NVARCHAR(MAX), 
    @phone_number NVARCHAR(30), 
    @address NVARCHAR(MAX),
	@is_active bit
AS
BEGIN
    -- Check if the user exists before attempting an update
	IF EXISTS (SELECT 1 FROM Users WHERE @user_id = @aid)
    BEGIN
		
		declare @IsBanned BIT;
		set @IsBanned = dbo.IsUserBanned(@aid, 'UpdateProfile');
		if @IsBanned = 1 return;

        DECLARE @resource_url NVARCHAR(MAX) = '/profiles/_' + CAST(@user_id AS NVARCHAR);

        -- Perform the update
        UPDATE Users
        SET 
            user_full_name = @user_full_name, 
            birthdate = @birthdate, 
            gender = @gender, 
            email = @email, 
            phone_number = @phone_number, 
            address = @address,
			is_active = @is_active
        WHERE 
            user_id = @user_id and 
            authentication_id = @aid

		select 'TRUE' as [check]
		from Users
		where 
		[user_full_name]=@user_full_name and 
		[birthdate] = @birthdate and
		[gender] = @gender and
		[email] = @email and
		[phone_number] = @phone_number and
		[address] = @address and
		[resource_url] = TRIM(@resource_url) AND
		[authentication_id] = @aid
    END
	else
	BEGIN
        -- Raise an error if the user is not found
        RAISERROR('User with ID %d not found.', 16, 1, @user_id);
    END
END;
GO

--EXEC UpdateProfile 
--    @aid = 4,                         
--	@user_id = 4,
--    @user_full_name = N'John Doe',    
--    @birthdate = '1990-01-01',        
--    @gender = 1,                      
--    @email = N'john.doe@example.com', 
--    @phone_number = N'123-456-7890',  
--    @address = N'123 Main St';        

-- DELETE

if object_id('SetStateProfile', 'P') is not null drop procedure SetStateProfile;
go
CREATE PROCEDURE SetStateProfile @aid int, @state bit
AS
BEGIN
    -- Check if the user exists before attempting a delete
    IF EXISTS (SELECT 1 FROM Users WHERE authentication_id = @aid)
    BEGIN
        -- Perform the delete
        update Users
		set [is_active] = @state
		where [authentication_id] = @aid;

		select 'TRUE' as [check]
		from Users
		where [authentication_id] = @aid
			and [is_active] = @state;
    END
    ELSE
    BEGIN
        -- Raise an error if the user is not found
        RAISERROR('User not found with ID %d', 16, 1, @aid);
    END
END;
GO

-- exec DeleteProfile 4


------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------

grant execute on dbo.[ViewProfile] to [NAV_GUEST]
grant execute on dbo.[ViewProfile] to [NAV_ADMIN]
grant execute on dbo.[ViewProfile] to [NAV_ESP]
grant execute on dbo.[ViewProfile] to [NAV_STUDENT]

grant execute on dbo.[ViewProfileSignedIn] to [NAV_ADMIN]
grant execute on dbo.[ViewProfileSignedIn] to [NAV_ESP]
grant execute on dbo.[ViewProfileSignedIn] to [NAV_STUDENT]

grant execute on dbo.[CreateProfile] to [NAV_ADMIN]
grant execute on dbo.[CreateProfile] to [NAV_ESP]
grant execute on dbo.[CreateProfile] to [NAV_STUDENT]

grant execute on dbo.[UpdateProfile] to [NAV_ADMIN]
grant execute on dbo.[UpdateProfile] to [NAV_ESP]
grant execute on dbo.[UpdateProfile] to [NAV_STUDENT]

grant execute on dbo.[SetStateProfile] to [NAV_ADMIN]
grant execute on dbo.[SetStateProfile] to [NAV_ESP]
grant execute on dbo.[SetStateProfile] to [NAV_STUDENT]


EXECUTE AS USER = 'NAV_GUEST';
--EXEC dbo.SignIn @account = 'qthiendev', @password = 'qthiendev';
--EXEC ViewProfile 5;
--select * from users
REVERT;
--declare @IsBanned BIT;
--set @IsBanned = dbo.IsUserBanned(@aid, 'CreateAuthorization');
--if @IsBanned = 1 return;