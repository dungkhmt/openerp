create table data_quality_check_rule(
    rule_id varchar(100),
    rule_description varchar(500),
    params varchar(2000),
    last_updated_stamp         timestamp DEFAULT CURRENT_TIMESTAMP,
    created_stamp              timestamp DEFAULT CURRENT_TIMESTAMP,

    constraint pk_data_quality_check_rule primary key(rule_id)
);

create table data_quality_check(
    id uuid not null default uuid_generate_v1(),
    rule_id varchar(100),
    created_by_user_login_id varchar(60),
    param1 varchar(100),
    param2 varchar(100),
    param3 varchar(100),
    param4 varchar(100),
    param5 varchar(100),
    param6 varchar(100),
    param7 varchar(100),
    param8 varchar(100),
    param9 varchar(100),
    param10 varchar(100),
    result varchar(500),
    status_id varchar(100),
    message text,
    last_updated_stamp         timestamp DEFAULT CURRENT_TIMESTAMP,
    created_stamp              timestamp DEFAULT CURRENT_TIMESTAMP,
    constraint pk_data_quality_check primary key (table_id),
    constraint fk_data_quality_check_rule foreign key(rule_id) references  data_quality_check_rule(rule_id),
    constraint fk_data_quality_check_created_by_user foreign key(created_by_user_login_id) references user_login(user_login_id)
);
