/* Replace with your SQL commands */
create table if not exists roles (id serial PRIMARY KEY,
                                                    name varchar(10) unique not NULL);


insert into roles (name)
values('student')