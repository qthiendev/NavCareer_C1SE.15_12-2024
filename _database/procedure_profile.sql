﻿use NavCareerDB;

--- procedure
if object_id('ViewProfile', 'P') is not null drop procedure ViewProfile;
go

--READ

CREATE PROCEDURE ViewProfile @user_id INT
AS
BEGIN
    -- Check if the user exists
    IF EXISTS (SELECT 1 FROM Users WHERE user_id = @user_id)
    BEGIN
        -- If user exists, return the profile data
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
        WHERE user_id = @user_id;
    END
    ELSE
    BEGIN
        -- Raise an error if the user is not found
        RAISERROR('User with ID %d not found.', 16, 1, @user_id);
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

    DECLARE @newId INT;

    -- Find the next available user_id (either a gap or the next sequential value)
    SELECT TOP 1 @newId = t1.user_id + 1
    FROM Users t1
    LEFT JOIN Users t2 ON t1.user_id + 1 = t2.user_id
    WHERE t2.user_id IS NULL
    ORDER BY t1.user_id;

    -- If no gap is found, assign the next available user_id
    IF @newId IS NULL
    BEGIN
        SELECT @newId = ISNULL(MAX(user_id), 0) + 1 FROM Users;
    END

    -- Generate resource URL based on new user ID
    DECLARE @resource_url NVARCHAR(MAX) = '/profiles/_' + CAST(@newId AS NVARCHAR);

    -- Insert the new user into the Users table with the updated column order
    INSERT INTO Users (
        [user_id],  [user_full_name], [birthdate],  [gender],  [email], 
        [phone_number],  [address],  [date_joined],  [resource_url], [authentication_id],[is_active]
    )
    VALUES (@newId,  @user_full_name,  @birthdate,  @gender, @email,  @phone_number, @address, GETDATE(), TRIM(@resource_url), @aid, 1);

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
    @address NVARCHAR(MAX)
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
            address = @address 
        WHERE 
            user_id = @user_id and 
            authentication_id = @aid and 
			is_active = 1


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

if object_id('DeleteProfile', 'P') is not null drop procedure DeleteProfile;
go
CREATE PROCEDURE DeleteProfile
    @user_id INT  -- The ID of the user to be deleted
AS
BEGIN
    -- Check if the user exists before attempting a delete
    IF EXISTS (SELECT 1 FROM Users WHERE user_id = @user_id)
    BEGIN
        -- Perform the delete
        DELETE FROM Users
        WHERE user_id = @user_id;
    END
    ELSE
    BEGIN
        -- Raise an error if the user is not found
        RAISERROR('User not found with ID %d', 16, 1, @user_id);
    END
END;
GO

-- exec DeleteProfile 4


grant execute on dbo.[ViewProfile] to [NAV_GUEST]
grant execute on dbo.[ViewProfile] to [NAV_ADMIN]
grant execute on dbo.[ViewProfile] to [NAV_ESP]
grant execute on dbo.[ViewProfile] to [NAV_STUDENT]

grant execute on dbo.[ViewProfile] to [NAV_GUEST]
grant execute on dbo.[CreateProfile] to [NAV_ADMIN]
grant execute on dbo.[CreateProfile] to [NAV_ESP]
grant execute on dbo.[CreateProfile] to [NAV_STUDENT]

grant execute on dbo.[ViewProfile] to [NAV_GUEST]
grant execute on dbo.[UpdateProfile] to [NAV_ADMIN]
grant execute on dbo.[UpdateProfile] to [NAV_ESP]
grant execute on dbo.[UpdateProfile] to [NAV_STUDENT]

grant execute on dbo.[ViewProfile] to [NAV_GUEST]
grant execute on dbo.[DeleteProfile] to [NAV_ADMIN]
grant execute on dbo.[DeleteProfile] to [NAV_ESP]
grant execute on dbo.[DeleteProfile] to [NAV_STUDENT]


EXECUTE AS USER = 'NAV_ADMIN';
--EXEC dbo.SignIn @account = 'qthiendev', @password = 'qthiendev';
--EXEC ViewProfile 5;
--select * from users
REVERT;
--declare @IsBanned BIT;
--set @IsBanned = dbo.IsUserBanned(@aid, 'CreateAuthorization');
--if @IsBanned = 1 return;