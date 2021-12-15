CREATE TABLE status_type (
  status_type_id     VARCHAR(60) NOT NULL,
  parent_type_id     VARCHAR(60),
  description        TEXT,
  last_updated_stamp TIMESTAMP   ,
  created_stamp      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_status_type PRIMARY KEY (status_type_id),
  CONSTRAINT status_type_parent FOREIGN KEY (parent_type_id) REFERENCES status_type (status_type_id)
);
CREATE TABLE status (
  status_id          VARCHAR(60) NOT NULL,
  status_type_id     VARCHAR(60),
  status_code        VARCHAR(60),
  sequence_id        VARCHAR(60),
  description        TEXT,
  last_updated_stamp TIMESTAMP   ,
  created_stamp      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_status PRIMARY KEY (status_id),
  CONSTRAINT status_to_type FOREIGN KEY (status_type_id) REFERENCES status_type (status_type_id)
);
CREATE TABLE party_type (
  party_type_id      VARCHAR(60) NOT NULL,
  parent_type_id     VARCHAR(60),
  has_table          BOOLEAN,
  description        TEXT,
  last_updated_stamp TIMESTAMP   ,
  created_stamp      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_party_type PRIMARY KEY (party_type_id),
  CONSTRAINT party_type_par FOREIGN KEY (parent_type_id) REFERENCES party_type (party_type_id)
);
CREATE TABLE party (
                       party_id                    UUID NOT NULL default uuid_generate_v1(),
                       party_type_id               VARCHAR(60),
                       external_id                 VARCHAR(60),
                       description                 TEXT,
                       status_id                   VARCHAR(60),
                       created_date                TIMESTAMP   NULL,
                       created_by_user_login       VARCHAR(255),
                       last_modified_date          TIMESTAMP   NULL,
                       last_modified_by_user_login VARCHAR(255),
                       is_unread                   BOOLEAN,
                       last_updated_stamp          TIMESTAMP   ,
                       created_stamp               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       party_code                  VARCHAR(255),
                       CONSTRAINT pk_party PRIMARY KEY (party_id),
                       CONSTRAINT party_status_item FOREIGN KEY (status_id) REFERENCES status (status_id),
                       CONSTRAINT party_pty_typ FOREIGN KEY (party_type_id) REFERENCES party_type (party_type_id)
);
CREATE TABLE person (
  party_id                    UUID              NOT NULL,
  first_name                  VARCHAR(100),
  middle_name                 VARCHAR(100),
  last_name                   VARCHAR(100),
  gender                      CHARACTER(1),
  birth_date                  DATE,
  last_updated_stamp          TIMESTAMP                NULL,
  created_stamp               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_person PRIMARY KEY (party_id),
  CONSTRAINT person_party FOREIGN KEY (party_id) REFERENCES party (party_id)
);

CREATE TABLE user_login (
  user_login_id            VARCHAR(255)  NOT NULL,
  current_password         VARCHAR(60),
  otp_secret               VARCHAR(60),
  client_token             VARCHAR(512),
  password_hint            TEXT,
  is_system                BOOLEAN,
  enabled                  BOOLEAN,
  has_logged_out           BOOLEAN,
  require_password_change  BOOLEAN,
  disabled_date_time       TIMESTAMP     NULL,
  successive_failed_logins INTEGER,
  last_updated_stamp       TIMESTAMP     ,
  created_stamp            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  otp_resend_number        INT DEFAULT 0 NULL,
  party_id                 UUID,
  CONSTRAINT pk_user_login PRIMARY KEY (user_login_id),
  CONSTRAINT user_party FOREIGN KEY (party_id) REFERENCES party (party_id)
);

ALTER TABLE party
  ADD CONSTRAINT party_m_user_login FOREIGN KEY (last_modified_by_user_login) REFERENCES user_login (user_login_id);
ALTER TABLE party
  ADD CONSTRAINT party_c_user_login FOREIGN KEY (created_by_user_login) REFERENCES user_login (user_login_id);

CREATE TABLE security_group (
  group_id           VARCHAR(60) NOT NULL,
  description        TEXT,
  last_updated_stamp TIMESTAMP   ,
  created_stamp      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_security_group PRIMARY KEY (group_id)
);
CREATE TABLE security_permission (
  permission_id      VARCHAR(100) NOT NULL,
  description        TEXT,
  last_updated_stamp TIMESTAMP    ,
  created_stamp      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_security_permission PRIMARY KEY (permission_id)
);
CREATE TABLE security_group_permission (
  group_id           VARCHAR(60)  NOT NULL,
  permission_id      VARCHAR(100) NOT NULL,
  last_updated_stamp TIMESTAMP    ,
  created_stamp      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_security_group_permission PRIMARY KEY (group_id, permission_id),
  CONSTRAINT sec_grp_perm_grp FOREIGN KEY (group_id) REFERENCES security_group (group_id),
  CONSTRAINT sec_grp_perm_perm FOREIGN KEY (permission_id) REFERENCES security_permission (permission_id)
);
CREATE TABLE user_login_security_group (
  user_login_id      VARCHAR(255) NOT NULL,
  group_id           VARCHAR(60)  NOT NULL,
  last_updated_stamp TIMESTAMP    ,
  created_stamp      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_user_login_security_group PRIMARY KEY (user_login_id, group_id),
  CONSTRAINT user_secgrp_grp FOREIGN KEY (group_id) REFERENCES security_group (group_id),
  CONSTRAINT user_secgrp_user FOREIGN KEY (user_login_id) REFERENCES user_login (user_login_id)
);

CREATE TABLE application_type (
  application_type_id VARCHAR(60) NOT NULL,
  description         TEXT,
  last_updated_stamp  TIMESTAMP   ,
  created_stamp       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_application_type PRIMARY KEY (application_type_id)
);

CREATE TABLE application (
  application_id      VARCHAR(255) NOT NULL,
  application_type_id VARCHAR(255) NOT NULL,
  module_id           VARCHAR(255),
  permission_id       VARCHAR(255),
  description         TEXT,
  last_updated_stamp  TIMESTAMP    ,
  created_stamp       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_application PRIMARY KEY (application_id),
  CONSTRAINT application_application_type FOREIGN KEY (application_type_id) REFERENCES application_type (application_type_id),
  CONSTRAINT application_application_module FOREIGN KEY (module_id) REFERENCES application (application_id),
  CONSTRAINT application_permission FOREIGN KEY (permission_id) REFERENCES security_permission (permission_id)
);



