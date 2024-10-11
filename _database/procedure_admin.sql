use NavCareerDB
go

if object_id('ReadAllUser', 'P') is not null drop procedure ReadAllUser;
go
create procedure ReadAllUser
as
begin

	select a.[authentication_id],
		convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', a.[account])) as [account],
		convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', a.[password])) as [password],
		convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', a.[identifier_email])) as [identifier_email],
		a.[is_active] as [auth_status],
		az.[role],
		u.[user_id],
		u.[user_full_name],
		u.[birthdate],
		u.[gender],
		u.[email],
		u.[phone_number],
		u.[is_active] as [user_status]
	from Authentications a
		left join Users u on u.authentication_id = a.authentication_id
		left join Authorizations az on az.authorization_id = a.authorization_id
end
go

grant execute on dbo.ReadAllUser to [NAV_ADMIN];
go
