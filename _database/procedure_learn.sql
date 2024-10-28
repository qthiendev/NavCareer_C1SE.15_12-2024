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
grant execute on dbo.ReadCollection to [NAV_ADMIN];
grant execute on dbo.ReadCollection to [NAV_ESP];
grant execute on dbo.ReadCollection to [NAV_STUDENT];

grant execute on dbo.ReadFrame to [NAV_ADMIN];
grant execute on dbo.ReadFrame to [NAV_ESP];
grant execute on dbo.ReadFrame to [NAV_STUDENT];