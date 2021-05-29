/* Replace with your SQL commands */
CREATE TABLE if not exists users (id serial PRIMARY KEY,
                                                    username VARCHAR(50) unique not null,
                                                                                email VARCHAR(50) not null,
                                                                                                  password VARCHAR(10) unique not null)