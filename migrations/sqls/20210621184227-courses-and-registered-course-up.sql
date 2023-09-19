/* Replace with your SQL commands */
create table if not exists courses (id serial PRIMARY KEY, name varchar(50) not null UNIQUE);


create table if not EXISTS teacher_courses (id serial PRIMARY KEY, course_id int not null, teacher_id int not null,
                                            FOREIGN KEY (course_id) REFERENCES courses(id),
                                            FOREIGN KEY (teacher_id) REFERENCES users(id));


create table if not EXISTS register_courses (id serial PRIMARY KEY, course_id int not null, student_id int not null,
                                             FOREIGN KEY (course_id) REFERENCES teacher_courses(id),
                                             FOREIGN KEY (student_id) REFERENCES users(id));