DROP TABLE classes;
CREATE TABLE IF NOT EXISTS classes(
    course_id text PRIMARY KEY,
    name text,
    dept_id text,
    semester text,
    credits integer,
    grading_method text[],
    core text[],
    gen_ed text[],
    description text
);