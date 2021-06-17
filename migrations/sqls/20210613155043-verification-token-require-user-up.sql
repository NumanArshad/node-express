
alter table request_reset_password_tokens
alter column token
set not NULL,
alter column user_id
set not NULL;

