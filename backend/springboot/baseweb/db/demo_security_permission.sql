insert into security_group(group_id, description) values('ROLE_TMS_MANAGER','Management of Transportation System');
insert into security_permission(permission_id,description) values('DELIVERY_PLAN_CREATE','Creation of delivery plan and trips');
insert into security_group_permission(group_id, permission_id) values('ROLE_TMS_MANAGER','DELIVERY_PLAN_CREATE');
insert into security_group_permission(group_id, permission_id) values('ROLE_FULL_ADMIN','DELIVERY_PLAN_CREATE');
insert into application(application_id, application_type_id, module_id, permission_id, description) values 
('MENU_TMS','MENU',null,null,'Menu TMS');
insert into application(application_id, application_type_id, module_id, permission_id, description) values 
('MENU_TMS_CREATE_DELIVERY_PLAN','MENU','MENU_TMS','DELIVERY_PLAN_CREATE','Menu Create Delivery Plan');


insert into security_group(group_id, description) values('ROLE_SALES_ROUTE_MANAGER','Management of Sales Route');
insert into security_permission(permission_id,description) values('SALES_ROUTE_PLAN_CREATE','Creation of Sales Route');
insert into security_group_permission(group_id, permission_id) values('ROLE_SALES_ROUTE_MANAGER','SALES_ROUTE_PLAN_CREATE');
insert into security_group_permission(group_id, permission_id) values('ROLE_FULL_ADMIN','SALES_ROUTE_PLAN_CREATE');
insert into application(application_id, application_type_id, module_id, permission_id, description) values 
('MENU_SALES_ROUTE','MENU',null,null,'Menu Sales Route');
insert into application(application_id, application_type_id, module_id, permission_id, description) values 
('MENU_SALES_ROUTE_PLAN_CREATE','MENU','MENU_SALES_ROUTE','SALES_ROUTE_PLAN_CREATE','Menu Sales Route');
