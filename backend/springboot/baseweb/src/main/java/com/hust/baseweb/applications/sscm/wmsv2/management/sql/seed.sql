insert into security_permission (permission_id, description, last_updated_stamp, created_stamp)
values ('WMSv2_CREATE_FACILITY', 'Create new facility', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

insert into application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,
                         created_stamp)
values ('MENU_WMSv2', 'MENU', NULL, NULL, 'Menu warehouse management version 2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('MENU_WMSv2_CREATE_FACILITY', 'MENU', 'MENU_WMSv2', 'WMSv2_CREATE_FACILITY', 'Menu create new facility',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

insert into security_group (group_id, description, last_updated_stamp, created_stamp, group_name)
values ('ROLE_WMSv2_ADMIN', 'WMS v2', current_timestamp, current_timestamp, 'Quản trị kho phiên bản 2');

insert into security_group_permission (group_id, permission_id, last_updated_stamp, created_stamp)
values ('ROLE_WMSv2_ADMIN', 'WMSv2_CREATE_FACILITY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- For admin testing account
insert into user_login_security_group (user_login_id, group_id, last_updated_stamp, created_stamp)
values ('admin', 'ROLE_WMSv2_ADMIN', current_timestamp, current_timestamp);

insert into security_permission (permission_id, description, last_updated_stamp, created_stamp)
values ('WMSv2_VIEW_FACILITY', 'See all facilities', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
insert into application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,
                         created_stamp)
values ('MENU_WMSv2_VIEW_FACILITY', 'MENU', 'MENU_WMSv2', 'WMSv2_VIEW_FACILITY', 'Menu warehouse management version 2',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
insert into security_group_permission (group_id, permission_id, last_updated_stamp, created_stamp)
values ('ROLE_WMSv2_ADMIN', 'WMSv2_VIEW_FACILITY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
