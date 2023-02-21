insert into application_type (application_type_id, description, last_updated_stamp, created_stamp)
values ('MENU', 'Menu application type', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

insert into security_permission (permission_id, description, last_updated_stamp, created_stamp)
values ('WMSv2_CREATE_FACILITY', 'Create new facility', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

insert into application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,
                         created_stamp)
values ('MENU_WMSv2', 'MENU', NULL, NULL, 'Menu warehouse management version 2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('MENU_WMSv2_CREATE_FACILITY', 'MENU', 'MENU_WMSv2', 'WMSv2_CREATE_FACILITY', 'Menu create new facility',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

insert into security_group (group_id, description, last_updated_stamp, created_stamp, group_name)
values ('ROLE_WMSv2_ADMIN', 'WMS v2', current_timestamp, current_timestamp, 'Quản trị kho phiên bản 2')
ON CONFLICT DO NOTHING;

insert into security_group_permission (group_id, permission_id, last_updated_stamp, created_stamp)
values ('ROLE_WMSv2_ADMIN', 'WMSv2_CREATE_FACILITY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- For admin testing account
insert into user_login_security_group (user_login_id, group_id, last_updated_stamp, created_stamp)
values ('admin', 'ROLE_WMSv2_ADMIN', current_timestamp, current_timestamp)
ON CONFLICT DO NOTHING;

insert into security_permission (permission_id, description, last_updated_stamp, created_stamp)
values ('WMSv2_VIEW_FACILITY', 'See all facilities', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

insert into application (application_id, application_type_id, module_id, permission_id, description, last_updated_stamp,
                         created_stamp)
values ('MENU_WMSv2_VIEW_FACILITY', 'MENU', 'MENU_WMSv2', 'WMSv2_VIEW_FACILITY', 'Menu warehouse management version 2',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

insert into security_group_permission (group_id, permission_id, last_updated_stamp, created_stamp)
values ('ROLE_WMSv2_ADMIN', 'WMSv2_VIEW_FACILITY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

insert into party_type (party_type_id, parent_type_id, has_table, description, last_updated_stamp, created_stamp)
values ('PERSON', null, true, 'Person', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
on conflict do nothing;

insert into party (party_id, party_type_id, external_id, description, status_id, created_date, created_by_user_login,
                   last_modified_date, last_modified_by_user_login, is_unread, last_updated_stamp, created_stamp,
                   party_code, name)
values ('287db6a8-2783-11ea-b1c9-54bf64436441', 'PERSON', null, null, null, null, null, null, null, false,
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null, null)
on conflict do nothing;

insert into user_login (user_login_id, current_password, otp_secret, client_token, password_hint, is_system, enabled,
                        has_logged_out, require_password_change, disabled_date_time, successive_failed_logins,
                        last_updated_stamp, created_stamp, otp_resend_number, party_id, email)
values ('admin', '$2a$10$FnkpL3dXh8MXx3nD6yzy7egkmHQ5Evk7BxRPgdrSv1Fh0uPUYmoGu', null, null, null, false, true, false,
        false, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, '287db6a8-2783-11ea-b1c9-54bf64436441', null)
on conflict do nothing;
