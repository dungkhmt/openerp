alter table user_register
    rename column full_name to first_name;

alter table user_register
    add middle_name varchar(100);

alter table user_register
    add last_name varchar(100);

