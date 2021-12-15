INSERT INTO party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
VALUES ('AUTOMATED_AGENT', NULL, FALSE, 'Automated Agent', NOW(), NOW());
INSERT INTO party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
VALUES ('PERSON', NULL, TRUE, 'Person', NOW(), NOW());
INSERT INTO party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
VALUES ('PARTY_GROUP', NULL, TRUE, 'Party Group', NOW(), NOW());
INSERT INTO party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
VALUES ('BANK', 'PARTY_GROUP', TRUE, 'Bank', NOW(), NOW());
INSERT INTO party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
VALUES ('LEGAL_ORGANIZATION', 'PARTY_GROUP', FALSE, 'Legal Organization', '2017-01-03 10:11:27.885',
        '2017-01-03 10:11:27.608');
INSERT INTO party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
VALUES ('CORPORATION', 'LEGAL_ORGANIZATION', FALSE, 'Corporation', NOW(), NOW());
INSERT INTO party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
VALUES ('CUSTOMER_GROUP', 'PARTY_GROUP', FALSE, 'Customer Group', NOW(), NOW());
INSERT INTO party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
VALUES ('PARTY_DISTRIBUTOR', NULL, FALSE, 'Distributor', NOW(), NOW());
INSERT INTO party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
VALUES ('PARTY_RETAIL_OUTLET', NULL, FALSE, 'Distributor', NOW(), NOW());
INSERT INTO party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
VALUES ('PARTY_SUPPLIER', NULL, FALSE, 'Supplier', NOW(), NOW());
insert into party_type(party_type_id, description)
values ('COMPANY', 'Company');


INSERT INTO status_type (status_type_id, parent_type_id, description, last_updated_stamp, created_stamp)
VALUES ('PARTY_STATUS', NULL, 'Party status', NOW(), NOW());
INSERT INTO status_type (status_type_id, parent_type_id, description, last_updated_stamp, created_stamp)
VALUES ('MARRY_STATUS', NULL, 'Marry status', NOW(), NOW());
INSERT INTO status_type (status_type_id, parent_type_id, description, last_updated_stamp, created_stamp)
VALUES ('SERVICE_STATUS', NULL, 'Service status', NOW(), NOW());
INSERT INTO status (status_id, status_type_id, status_code, sequence_id, description, last_updated_stamp, created_stamp)
VALUES ('SINGLE', 'MARRY_STATUS', 'SINGLE', 0, 'Độc thân', NOW(), NOW());
INSERT INTO status (status_id, status_type_id, status_code, sequence_id, description, last_updated_stamp, created_stamp)
VALUES ('MARRIED', 'MARRY_STATUS', 'MARRIED', 0, 'Đã kết hôn', NOW(), NOW());
INSERT INTO status (status_id, status_type_id, status_code, sequence_id, description, last_updated_stamp, created_stamp)
VALUES ('DIVORCED', 'MARRY_STATUS', 'DIVORCED', 0, 'Đã ly dị', NOW(), NOW());
INSERT INTO status (status_id, status_type_id, status_code, sequence_id, description, last_updated_stamp, created_stamp)
VALUES ('PARTY_ENABLED', 'PARTY_STATUS', 'ENABLED', 0, 'Đã kích hoạt', NOW(), NOW());
INSERT INTO status (status_id, status_type_id, status_code, sequence_id, description, last_updated_stamp, created_stamp) VALUES ('PARTY_DISABLED', 'PARTY_STATUS', 'DISABLED', 0, 'Đã bị vô hiệu hóa', NOW(), NOW());

INSERT INTO security_group (group_id, description, last_updated_stamp, created_stamp) VALUES ('ROLE_SALE_MANAGER', 'Sale manager account owner access security group', '2017-01-03 10:12:23.879', '2017-01-03 10:12:23.878');
INSERT INTO security_group (group_id, description, last_updated_stamp, created_stamp) VALUES ('ROLE_ACCOUNTANT', 'Accountant account owner access security group', '2017-01-03 10:12:42.531', '2017-01-03 10:12:42.507');
INSERT INTO security_group (group_id, description, last_updated_stamp, created_stamp) VALUES ('ROLE_FULL_ADMIN', 'Full Admin group, has all general functional permissions.', '2017-01-03 10:12:23.994', '2017-01-03 10:12:23.993');
INSERT INTO security_permission (permission_id, description, last_updated_stamp, created_stamp) VALUES ('USER_CREATE','Create user permission',NOW(),NOW());
INSERT INTO security_permission (permission_id, description, last_updated_stamp, created_stamp) VALUES ('USER_VIEW','View user permission',NOW(),NOW());
INSERT INTO security_permission (permission_id, description, last_updated_stamp, created_stamp) VALUES ('ORDER_CREATE','Create order permission',NOW(),NOW());
INSERT INTO security_permission (permission_id, description, last_updated_stamp, created_stamp) VALUES ('ORDER_VIEW','View order permission',NOW(),NOW());
INSERT INTO security_permission (permission_id, description, last_updated_stamp, created_stamp) VALUES ('INVOICE_CREATE','Create order permission',NOW(),NOW());
INSERT INTO security_permission (permission_id, description, last_updated_stamp, created_stamp) VALUES ('INVOICE_VIEW','View order permission',NOW(),NOW());

INSERT INTO security_group_permission(group_id, permission_id, last_updated_stamp, created_stamp) VALUES ('ROLE_FULL_ADMIN','ORDER_VIEW',NOW(),NOW());
INSERT INTO security_group_permission(group_id, permission_id, last_updated_stamp, created_stamp) VALUES ('ROLE_FULL_ADMIN','ORDER_CREATE',NOW(),NOW());
INSERT INTO security_group_permission(group_id, permission_id, last_updated_stamp, created_stamp) VALUES ('ROLE_FULL_ADMIN','USER_CREATE',NOW(),NOW());
INSERT INTO security_group_permission(group_id, permission_id, last_updated_stamp, created_stamp) VALUES ('ROLE_FULL_ADMIN','USER_VIEW',NOW(),NOW());
INSERT INTO security_group_permission(group_id, permission_id, last_updated_stamp, created_stamp) VALUES ('ROLE_FULL_ADMIN','INVOICE_CREATE',NOW(),NOW());
INSERT INTO security_group_permission(group_id, permission_id, last_updated_stamp, created_stamp) VALUES ('ROLE_FULL_ADMIN','INVOICE_VIEW',NOW(),NOW());

INSERT INTO security_group_permission(group_id, permission_id, last_updated_stamp, created_stamp) VALUES ('ROLE_SALE_MANAGER','ORDER_CREATE',NOW(),NOW());
INSERT INTO security_group_permission(group_id, permission_id, last_updated_stamp, created_stamp) VALUES ('ROLE_SALE_MANAGER','ORDER_VIEW',NOW(),NOW());
INSERT INTO security_group_permission(group_id, permission_id, last_updated_stamp, created_stamp) VALUES ('ROLE_ACCOUNTANT','ORDER_VIEW',NOW(),NOW());
INSERT INTO security_group_permission(group_id, permission_id, last_updated_stamp, created_stamp) VALUES ('ROLE_ACCOUNTANT','INVOICE_CREATE',NOW(),NOW());
INSERT INTO security_group_permission(group_id, permission_id, last_updated_stamp, created_stamp) VALUES ('ROLE_ACCOUNTANT','INVOICE_VIEW',NOW(),NOW());

INSERT INTO application_type(application_type_id, description, last_updated_stamp, created_stamp) VALUES ('MENU','Menu application type', NOW(),NOW());
INSERT INTO application_type(application_type_id, description, last_updated_stamp, created_stamp) VALUES ('SCREEN','Screen application type', NOW(),NOW());
INSERT INTO application_type(application_type_id, description, last_updated_stamp, created_stamp) VALUES ('MODULE','Module application type', NOW(),NOW());
INSERT INTO application_type(application_type_id, description, last_updated_stamp, created_stamp) VALUES ('SERVICE','Service application type', NOW(),NOW());
INSERT INTO application_type(application_type_id, description, last_updated_stamp, created_stamp) VALUES ('ENTITY','Entity application type', NOW(),NOW());
INSERT INTO application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,created_stamp) VALUES ('MENU_USER','MENU',NULL ,NULL,'Menu user management',NOW(), NOW());
INSERT INTO application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,created_stamp) VALUES ('MENU_USER_CREATE','MENU','MENU_USER' ,'USER_CREATE','Menu user create',NOW(), NOW());
INSERT INTO application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,created_stamp) VALUES ('MENU_USER_LIST','MENU','MENU_USER' ,'USER_VIEW','Menu user list',NOW(), NOW());
INSERT INTO application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,created_stamp) VALUES ('MENU_ORDER','MENU',NULL ,NULL,'Menu order management',NOW(), NOW());
INSERT INTO application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,created_stamp) VALUES ('MENU_ORDER_LIST','MENU','MENU_ORDER' ,'ORDER_VIEW','Menu order list',NOW(), NOW());
INSERT INTO application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,created_stamp) VALUES ('MENU_ORDER_CREATE','MENU','MENU_ORDER' ,'ORDER_CREATE','Menu order create',NOW(), NOW());
INSERT INTO application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,created_stamp) VALUES ('MENU_INVOICE','MENU',NULL ,NULL,'Menu invoice management',NOW(), NOW());
INSERT INTO application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,created_stamp) VALUES ('MENU_INVOICE_CREATE','MENU','MENU_INVOICE' ,'INVOICE_CREATE','Menu invoice create',NOW(), NOW());
INSERT INTO application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,created_stamp) VALUES ('MENU_INVOICE_LIST','MENU','MENU_INVOICE' ,'INVOICE_VIEW','Menu invoice list',NOW(), NOW());

INSERT INTO application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,created_stamp) VALUES ('SCREEN_USER_CREATE','SCREEN',NULL ,'USER_CREATE','Screen user create',NOW(), NOW());
INSERT INTO application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,created_stamp) VALUES ('SCREEN_USER_UPDATE','SCREEN',NULL ,'USER_CREATE','Screen user update',NOW(), NOW());
INSERT INTO application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,created_stamp) VALUES ('SCREEN_USER_LIST','SCREEN',NULL,'USER_VIEW','Screen user list',NOW(), NOW());
INSERT INTO application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,created_stamp) VALUES ('SCREEN_USER_DETAIL','SCREEN',NULL,'USER_VIEW','Screen user detail',NOW(), NOW());
INSERT INTO application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,created_stamp) VALUES ('SCREEN_USER_EDIT_BUTTON','SCREEN',NULL,'USER_CREATE','Screen user edit button',NOW(), NOW());
INSERT INTO application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,created_stamp) VALUES ('SCREEN_USER_DELETE_BUTTON','SCREEN',NULL,'USER_CREATE','Screen user delete button',NOW(), NOW());

INSERT INTO party (party_id, party_type_id, external_id, description, status_id, created_date, created_by_user_login, last_modified_date, last_modified_by_user_login, is_unread, last_updated_stamp, created_stamp, party_code) VALUES ('bd6322f2-2121-11ea-81a8-979e2f76b5a4', 'PERSON', NULL, NULL, 'PARTY_ENABLED', NULL, NULL, NULL, NULL, FALSE, NOW(), NOW(), 'admin');
INSERT  INTO person (party_id, first_name, middle_name, last_name, gender, birth_date, last_updated_stamp, created_stamp) VALUES ('bd6322f2-2121-11ea-81a8-979e2f76b5a4','admin',',',',','M',NOW(),null,NOW());
INSERT INTO user_login (user_login_id, current_password, password_hint, is_system, enabled, has_logged_out, require_password_change, disabled_date_time, successive_failed_logins, last_updated_stamp, created_stamp, party_id) VALUES ( 'admin', '$2a$04$cqFXgdkB.8u2HwT3QUTVZuePtHdzi.rWFCjdgNbVB7l6vn/yAU7F6', NULL, FALSE, TRUE, FALSE, FALSE, NULL, NULL, NOW(), NOW(), 'bd6322f2-2121-11ea-81a8-979e2f76b5a4');
INSERT INTO user_login_security_group (user_login_id, group_id, last_updated_stamp, created_stamp) VALUES ('admin', 'ROLE_FULL_ADMIN', NOW(), NOW());

insert into party(party_type_id, status_id) values('COMPANY','PARTY_ENABLED');

