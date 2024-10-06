use NavCareerDB;


--- procedure
if object_id('ViewProfile', 'P') is not null drop procedure ViewProfile;
go
create procedure ViewProfile @user_id int
as
begin
	select * from Users where user_id = @user_id
end
go

grant execute on dbo.[ViewProfile] to [NAV_GUEST]
grant execute on dbo.[ViewProfile] to [NAV_ADMIN]
grant execute on dbo.[ViewProfile] to [NAV_ESP]
grant execute on dbo.[ViewProfile] to [NAV_STUDENT]

EXECUTE AS USER = 'NAV_GUEST';
--EXEC dbo.SignIn @account = 'qthiendev', @password = 'qthiendev';
EXEC ViewProfile 1;
REVERT;
--declare @IsBanned BIT;
--set @IsBanned = dbo.IsUserBanned(@aid, 'CreateAuthorization');
--if @IsBanned = 1 return;