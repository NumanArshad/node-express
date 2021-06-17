/* Replace with your SQL commands */
create TABLE if not EXISTS request_reset_password_tokens(user_id int unique, token VARCHAR(10),
                                                         FOREIGN KEY (user_id) REFERENCES users(id));


alter table users add column active_status BOOLEAN DEFAULT FALSE,
alter column password type varchar(60),
alter column password
drop not null;