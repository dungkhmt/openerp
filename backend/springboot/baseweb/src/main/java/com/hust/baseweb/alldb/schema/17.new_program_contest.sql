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
    last_updated_stamp         timestamp DEFAULT current_date ,
    created_stamp              timestamp DEFAULT current_date ,
    solution text,
    level_order int,
    correct_solution_source_code text,
    correct_solution_language varchar(10),
    solution_checker_source_code text,
    solution_checker_source_language varchar(10),
    is_public bool,
    constraint pk_contest_problem_new primary key (problem_id),
    constraint fk_contest_problem_new foreign key (created_by_user_login_id) references user_login(user_login_id)
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
    last_updated_stamp         timestamp DEFAULT current_date ,
    created_stamp              timestamp DEFAULT current_date ,
    constraint pk_source_code_new primary key(problem_source_code_id),
    constraint fk_contest_problem_new foreign key (contest_problem_id) references contest_problem_new(problem_id)
);


create table test_case_new
(
    test_case_id  UUID NOT NULL default uuid_generate_v1(),
    test_case_point int,
    test_case text,
    correct_answer text,
    contest_problem_id varchar(60),
    last_updated_stamp         timestamp DEFAULT current_date ,
    created_stamp              timestamp DEFAULT current_date ,
    constraint pk_contest_problem_test_case_new primary key (test_case_id),
    constraint fk_contest_problem_test_case_problem_id_new foreign key (contest_problem_id) references contest_problem_new(problem_id)
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
    constraint fk_problem_submission_id_new primary key(problem_submission_id),
    constraint fk_problem_id_new foreign key (problem_id) references contest_problem_new(problem_id),
    constraint fk_user_login_id_new foreign key (submitted_by_user_login_id) references user_login(user_login_id)
);

-- drop table problem_submission,  test_case,  contest_problem, problem_source_code;

create table contest_new
(
    contest_id varchar (100) not null ,
    contest_name varchar (100),
    contest_solving_time int,
    user_create_id varchar (60),
    try_again BOOLEAN,
    public BOOLEAN,
    last_updated_stamp         timestamp DEFAULT current_date ,
    created_stamp              timestamp DEFAULT current_date ,
    constraint pk_contest_id_new primary key (contest_id),
    constraint fk_user_create_contest_new foreign key (user_create_id) references user_login(user_login_id)
);

create table contest_contest_problem_new
(
    contest_id varchar (100) not null ,
    problem_id varchar (100) not null ,
    last_updated_stamp         timestamp DEFAULT current_date ,
    created_stamp              timestamp DEFAULT current_date ,
    constraint fk_contest_id_contest_contest_problem_new foreign key (contest_id) references contest_new(contest_id),
    constraint fk_problem_id_contest_contest_problem_new foreign key (problem_id) references contest_problem_new(problem_id)
);

create table contest_submission_new
(
    contest_submission_id  UUID NOT NULL default uuid_generate_v1(),
    contest_id varchar (100) not null ,
    problem_id varchar (100) not null ,
    user_submission_id varchar (100) not null ,
--     problem_submission_id UUID,
    status varchar (20),
    point int,
    test_case_pass varchar (20),
    source_code text,
    source_code_language varchar (10),
    runtime bigint ,
    memory_usage float ,
    last_updated_stamp         date default current_date ,
    created_stamp              date default current_date ,
    constraint pk_contest_submission_id_contest_submission_new primary key (contest_submission_id),
    constraint fk_contest_id_contest_submission_new foreign key (contest_id) references contest_new(contest_id),
    constraint fk_problem_id_contest_submission_new foreign key (problem_id) references contest_problem_new(problem_id),
    constraint fk_user_submission_id_contest_submission_new foreign key (user_submission_id) references user_login(user_login_id)
--     constraint fk_problem_submission_id_contest_submission_new foreign key(problem_submission_id) references problem_submission_new(problem_submission_id)
);

create table user_submission_contest_result_new
(
--     user_submission_contest_result_id UUID NOT NULL default uuid_generate_v1(),
    contest_id varchar (100) not null ,
    user_id varchar (100) not null,
    point int not null,
    email varchar(20),
    full_name varchar(50),
    last_updated_stamp         date default current_date ,
    created_stamp              date default current_date ,
    constraint pk_user_submission_result_id_user_submission_result_new primary key (contest_id, user_id),
    constraint fk_contest_id_user_submission_result_new foreign key (contest_id) references contest_new(contest_id),
    constraint fk_user_id_user_submission_result_new foreign key (user_id) references user_login(user_login_id)
);

create table user_registration_contest_new
(
    user_registration_contest_id UUID NOT NULL default uuid_generate_v1(),
    user_id varchar (100) not null ,
    contest_id varchar (100) not null ,
    status varchar (20) not null,
    constraint fk_user_id_user_registration_contest_new foreign key (user_id) references user_login(user_login_id),
    constraint fk_contest_id_user_registration_contest_new foreign key (contest_id) references contest_new(contest_id)
);
