/* Replace with your SQL commands */
create table if not exists users_roles (id serial PRIMARY KEY, user_id int not null, role_id int not null,
                                        FOREIGN KEY (user_id) REFERENCES users (id),
                                        FOREIGN key (role_id) REFERENCES roles (id))