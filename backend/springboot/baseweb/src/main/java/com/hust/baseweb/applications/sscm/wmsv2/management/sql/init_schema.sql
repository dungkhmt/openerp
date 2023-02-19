-- show all tables
select *
from pg_catalog.pg_tables;

-- describe table
select *
from information_schema.columns
where table_name = 'inventory_item';

-- install uuid generate function
create
    extension if not exists "uuid-ossp";
-- SELECT * FROM pg_extension;
select uuid_generate_v1();
---
create table wmsv2_inventory_item
(
    inventory_item_id      uuid           not null default uuid_generate_v1() primary key,
    product_id             uuid           not null,
    lot_id                 varchar(60)    not null,
    warehouse_id            uuid           not null,
    bay_id                 uuid           NOT NULL,
    quantity_on_hand_total decimal(18, 2) not null, -- Do hàng hóa có thể tính theo cân nặng nên quantity có data type là decimal
    import_price           decimal(18, 2) not null,
    export_price           decimal(18, 2),
    currency_uom_id        varchar(60)    not null, -- TODO: check lai voi database hien tai cua team
    datetime_received      timestamp      not null default current_timestamp,
    expire_date            timestamp,
    uom_id                 varchar(60),
    last_updated_stamp     timestamp,
    created_stamp          timestamp               default CURRENT_TIMESTAMP,
    description            varchar(100)
--     status_id                  VARCHAR(60),
--     datetime_manufactured      TIMESTAMP,
--     activation_valid_thru      TIMESTAMP,
--     unit_cost                  DECIMAL(18, 6),
--     available_to_promise_total DECIMAL(18, 6),
);

create table wmsv2_inventory_item_detail
(
    inventory_item_detail_id uuid           not null default uuid_generate_v1() primary key,
    inventory_item_id        uuid           not null,
    quantity_on_hand_diff    decimal(18, 2) not null,
    effective_date           timestamp      not null default current_timestamp
);

create table wmsv2_warehouse
(
    warehouse_id uuid         not null default uuid_generate_v1() primary key,
    name        varchar(100) not null,
    code        varchar(100),
    width       int,
    length      int,
    address     varchar(100),
    longitude  decimal(20, 14),
    latitude   decimal(20, 14)
);

create table wmsv2_product
(
    product_id  uuid         not null default uuid_generate_v1() primary key,
    code        varchar(60)  not null,
    name        varchar(100) not null,
    description varchar(100),
    volume      decimal(18, 2),
    weight      decimal(18, 2)
);

create table wmsv2_bay
(
    bay_id      uuid        not null default uuid_generate_v1() primary key,
    warehouse_id uuid        not null,
    code        varchar(60) not null,
    x           int         not null,
    y           int         not null,
    x_long       int         not null,
    y_long       int         not null
);

create table wmsv2_product_warehouse
(
    product_warehouse_id uuid not null default uuid_generate_v1() primary key,
    product_id          uuid not null,
    warehouse_id         uuid not null,
    quantity_on_hand    decimal(18, 2)
);

alter table wmsv2_bay
    add constraint fk_bay_warehouse_id foreign key (warehouse_id) references wmsv2_warehouse (warehouse_id);

-- alter table wmsv2_warehouse rename column facility to code;
-- TODO: Add constraint for tables
