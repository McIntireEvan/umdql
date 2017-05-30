CREATE TABLE IF NOT EXISTS classes(
    course_id text PRIMARY KEY,
    course_name text,
    dept text,
    credits integer,
    gen_eds text[],
    description text
);