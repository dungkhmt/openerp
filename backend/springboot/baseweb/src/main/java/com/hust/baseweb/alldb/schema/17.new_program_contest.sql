create table contest_problem_new
(
    problem_id varchar(100) not null,
    problem_name varchar(100) unique ,
    problem_description text, -- problem_statement
    created_by_user_login_id varchar(60),
    time_limit  int,
    memory_limit int,
    level_id varchar(60),
    category_id varchar(60),
    last_updated_stamp         timestamp DEFAULT CURRENT_TIMESTAMP,
    created_stamp              timestamp DEFAULT CURRENT_TIMESTAMP,
    solution text,
    correct_solution_source_code text,
    correct_solution_language varchar(10),
    constraint pk_contest_problem primary key (problem_id),
    constraint fk_contest_problem foreign key (created_by_user_login_id) references user_login(user_login_id)
);

create table problem_source_code_new
(
    problem_source_code_id varchar (70),
    base_source text,
    main_source text,
    problem_function_default_source text,
    problem_function_solution text,
    language varchar (10),
    contest_problem_id varchar(60),
    last_updated_stamp         timestamp DEFAULT CURRENT_TIMESTAMP,
    created_stamp              timestamp DEFAULT CURRENT_TIMESTAMP,
    constraint pk_source_code primary key(problem_source_code_id),
    constraint fk_contest_problem foreign key (contest_problem_id) references contest_problem_new(problem_id)
);


create table test_case_new
(
    test_case_id  UUID NOT NULL default uuid_generate_v1(),
    test_case_point int,
    test_case text,
    correct_answer text,
    contest_problem_id varchar(60),
    last_updated_stamp         timestamp DEFAULT CURRENT_TIMESTAMP,
    created_stamp              timestamp DEFAULT CURRENT_TIMESTAMP,
    constraint pk_contest_problem_test_case primary key (test_case_id),
    constraint fk_contest_problem_test_case_problem_id foreign key (contest_problem_id) references contest_problem_new(problem_id)
);

create table problem_submission_new
(
    problem_submission_id UUID NOT NULL default uuid_generate_v1(),
    problem_id  varchar(100) not null,
    submitted_by_user_login_id varchar(60),
    source_code text,
    source_code_language varchar (10),
    status varchar(20),
    score int,
    runtime varchar(10),
    memory_usage float ,
    test_case_pass varchar (10),
    created_stamp              varchar (25),
    constraint fk_problem_id foreign key (problem_id) references contest_problem(problem_id),
    constraint fk_user_login_id foreign key (submitted_by_user_login_id) references user_login(user_login_id)
);

-- drop table problem_submission,  test_case,  contest_problem, problem_source_code;

create table contest_new
(
    contest_id varchar (100) not null ,
    contest_name varchar (100),
    contest_solving_time int,
    user_create_id varchar (60),
    last_updated_stamp         timestamp DEFAULT CURRENT_TIMESTAMP,
    created_stamp              timestamp DEFAULT CURRENT_TIMESTAMP,
    constraint pk_contest_id_new primary key (contest_id),
    constraint fk_user_create_contest foreign key (user_create_id) references user_login(user_login_id)
);

create table contest_contest_problem_new
(
    contest_id varchar (100) not null ,
    problem_id varchar (100) not null ,
    last_updated_stamp         timestamp DEFAULT CURRENT_TIMESTAMP,
    created_stamp              timestamp DEFAULT CURRENT_TIMESTAMP,
    constraint fk_contest_id_contest_contest_problem_new foreign key (contest_id) references contest_new(contest_id),
    constraint fk_problem_id_contest_contest_problem_new foreign key (problem_id) references contest_problem_new(problem_id)
);
