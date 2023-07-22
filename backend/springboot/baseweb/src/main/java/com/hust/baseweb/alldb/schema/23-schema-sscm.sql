create TABLE uom
(
    uom_id             VARCHAR(60) NOT NULL,
    uom_type_id        VARCHAR(60),
    abbreviation       VARCHAR(60),
    description        TEXT,
    last_updated_stamp TIMESTAMP,
    created_stamp      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_oum PRIMARY KEY (uom_id),
    CONSTRAINT fk_uom_type_id FOREIGN KEY (uom_type_id) REFERENCES uom_type (uom_type_id)
);

CREATE TABLE sscm_product_type
(
    product_type_id    VARCHAR(60) NOT NULL,
    parent_type_id     VARCHAR(60),
    description        TEXT,
    last_updated_stamp TIMESTAMP,
    created_stamp      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_sscm_product_type_id PRIMARY KEY (product_type_id),
    CONSTRAINT fk_sscm_parent_type_id FOREIGN KEY (parent_type_id) REFERENCES product_type (product_type_id)

);
CREATE TABLE sscm_product
(
    product_id                    VARCHAR(60) NOT NULL,
    product_type_id               VARCHAR(60),
    product_name                  VARCHAR(200),
    weight                        numeric,
    hs_thu                        int,
    hs_pal                        int,
    introductionDate              TIMESTAMP,
    quantity_uom_id               VARCHAR(60),
    weight_uom_id                 VARCHAR(60),
    width_uom_id                  VARCHAR(60),
    length_uom_id                 VARCHAR(60),
    height_uom_id                 VARCHAR(60),
    created_by_user_login_id      VARCHAR(60),
    primary_img                   uuid,
    description                   TEXT,
    last_updated_stamp            TIMESTAMP,
    created_stamp                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_sscm_product_id PRIMARY KEY (product_id),
    CONSTRAINT fk_sscm_product_type_id FOREIGN KEY (product_type_id) REFERENCES product_type (product_type_id),
    CONSTRAINT fk_sscm_created_by_user_login_id FOREIGN KEY (created_by_user_login_id) REFERENCES user_login (user_login_id),
    CONSTRAINT fk_sscm_quantity_uom_id FOREIGN KEY (quantity_uom_id) REFERENCES uom (uom_id),
    CONSTRAINT fk_sscm_weight_uom_id FOREIGN KEY (weight_uom_id) REFERENCES uom (uom_id),
    CONSTRAINT fk_sscm_length_uom_id FOREIGN KEY (length_uom_id) REFERENCES uom (uom_id),
    CONSTRAINT fk_sscm_width_uom_id FOREIGN KEY (width_uom_id) REFERENCES uom (uom_id),
    CONSTRAINT fk_sscm_height_uom_id FOREIGN KEY (height_uom_id) REFERENCES uom (uom_id),
    constraint fk_sscm_product_avatar_content foreign key (primary_img) references content (content_id)
);

CREATE TABLE sscm_facility_type
(
    facility_type_id   VARCHAR(60) NOT NULL,
    parent_type_id     VARCHAR(60),
    description        TEXT,
    last_updated_stamp TIMESTAMP,
    created_stamp      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_facility_type_id PRIMARY KEY (facility_type_id),
    CONSTRAINT fk_parent_type_id FOREIGN KEY (parent_type_id) REFERENCES facility_type (facility_type_id)

);

CREATE TABLE sscm_facility
(
    facility_id        VARCHAR(60) NOT NULL,
    facility_type_id   VARCHAR(60),
    parent_facility_id VARCHAR(60),
    facility_name      VARCHAR(100),
    contact_mech_id    UUID,
    opened_date        TIMESTAMP,
    closed_date        TIMESTAMP,
    description        TEXT,
    last_updated_stamp TIMESTAMP,
    created_stamp      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_sscm_facility_id PRIMARY KEY (facility_id),
    constraint fk_sscm_facility_contact_mech_id foreign key (contact_mech_id) references postal_address (contact_mech_id),
    CONSTRAINT fk_sscm_facility_type_id FOREIGN KEY (facility_type_id) REFERENCES facility_type (facility_type_id),
    CONSTRAINT fk_sscm_parent_facility_id FOREIGN KEY (parent_facility_id) REFERENCES facility (facility_id)
);

create table sscm_product_facility(
    product_id varchar(60) not null,
    facility_id varchar(60) not null,
    int qty,
    last_updated_stamp TIMESTAMP,
    created_stamp      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    constraint pk_sscm_product_facitliy primary key(product_id, facility_id),
    constraint fk_sscm_product_facility_product_id foreign key(product_id) references sscm_product(product_id),
    constraint fk_sscm_product_facility_facility_id foreign key(facility_id) references sscm_facility(facility_id),

);

create table sscm_inventory_item(
    inventory_item_id          UUID NOT NULL default uuid_generate_v1(),
    product_id                 VARCHAR(60),
    status_id                  VARCHAR(60),
    datetime_received          TIMESTAMP,
    datetime_manufactured      TIMESTAMP,
    expire_date                TIMESTAMP,
    activation_valid_thru      TIMESTAMP,
    facility_id                VARCHAR(60),
    lot_id                     VARCHAR(60),
    uom_id                     VARCHAR(60),
    unit_cost                  DECIMAL(18, 6),
    currency_uom_id            VARCHAR(60),
    quantity_on_hand_total     DECIMAL(18, 6),
    available_to_promise_total DECIMAL(18, 6),
    description                TEXT,
    last_updated_stamp         TIMESTAMP,
    created_stamp              TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_sscm_inventory_item_id PRIMARY KEY (inventory_item_id),
    CONSTRAINT fk_sscm_inventory_item_product_id FOREIGN KEY (product_id) REFERENCES sscm_product (product_id),
    CONSTRAINT fk_sscm_inventory_item_currency_uom_id FOREIGN KEY (currency_uom_id) REFERENCES uom (uom_id),
    CONSTRAINT fk_sscm_inventory_item_facility_id FOREIGN KEY (facility_id) REFERENCES sscm_facility (facility_id)

);
create table sscm_inventory_item_detail(
    inventory_item_detail_id UUID NOT NULL default uuid_generate_v1(),
    inventory_item_id        UUID NOT NULL,
    effective_date           TIMESTAMP,
    quantity_on_hand_diff    DECIMAL(18, 6),
    order_id                 VARCHAR(60),
    order_item_seq_id        VARCHAR(60),
    last_updated_stamp       TIMESTAMP,
    created_stamp            TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_sscm_inventory_item_detail PRIMARY KEY (inventory_item_detail_id),
    CONSTRAINT fk_sscm_inventory_item_detail_inventory_item_id FOREIGN KEY (inventory_item_id) REFERENCES sscm_inventory_item (inventory_item_id),
    CONSTRAINT fk_sscm_inventory_item_detail_order_id_order_item_seq_id FOREIGN KEY (order_id, order_item_seq_id) REFERENCES sscm_order_item (order_id, order_item_seq_id)

);

create table sscm_purchase_order(
    order_id varchar(60) not null,
    order_date timestamp,
    created_by_user_id varchar(60),
    status_id varchar(60),
    last_updated_stamp       TIMESTAMP,
    created_stamp            TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    constraint pk_sscm_purchase_order primary key(order_id)
    constraint fk_sscm_purchase_order_created_by_user_id foreign key(created_by_user_id) references user_login(user_login_id)
);

create table sscm_purchase_order_item(
    order_id varchar(60),
    order_item_seq_id varchar(10),
    product_id varchar(60),
    int qty,
    created_by_user_id varchar(60),
    status_id varchar(60),
    last_updated_stamp       TIMESTAMP,
    created_stamp            TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    constraint pk_sscm_purchase_order_item primary key(order_id, order_item_seq_id),
    constraint pk_sscm_purchase_order_item_created_by_user_id foreign key(created_by_user_id) references user_login(user_login_id)
);

create table sscm_receipt_bill(
    receipt_bill_id varchar(60) not null,
    order_id varchar(60),
    facility_id varchar(60),
    status_id varchar(60),
    created_by_user_id varchar(60),
    last_updated_stamp       TIMESTAMP,
    created_stamp            TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    constraint pk_sscm_receipt_bill primary(receipt_bill_id),
    constraint fk_sscm_receipt_bill_order_id foreign key(order_id) references sscm_purchase_order(order_id),
    constraint fk_sscm_receipt_bill foreign key(facility_id) references sscm_facility(facility_id)
);

create table sscm_receipt_bill_item(
    receipt_bill_id varchar(60) not null,
    receipt_bill_item_seq_id varchar(10) not null,
    order_id varchar(60),
    order_item_seq_id varchar(10),
    product_id varchar(60),
    int qty,
    int unit_price,
    effective_date timestamp,
    last_updated_stamp       TIMESTAMP,
    created_stamp            TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    constraint pk_sscm_receipt_bill_item primary key(receipt_bill_id, receipt_bill_item_seq_id),

);

create table sscm_sale_order(
    order_id             VARCHAR(60) NOT NULL,
    original_facility_id VARCHAR(60),
    created_by           VARCHAR(60),
    order_date           TIMESTAMP,
    currency_uom_id      VARCHAR(60),
    ship_to_address_id   UUID,
    grand_total          DECIMAL(18, 2),
    description          TEXT,
    exported             boolean,
    party_customer_id    uuid,
    vendor_id            uuid,
    sale_man_id          varchar(60),

    last_updated_stamp   TIMESTAMP,
    created_stamp        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_sscm_order PRIMARY KEY (order_id),
    CONSTRAINT fk_sscm_original_facility_id FOREIGN KEY (original_facility_id) REFERENCES sscm_facility (facility_id),
    constraint fk_sscm_order_address_id foreign key (ship_to_address_id) references postal_address (contact_mech_id),
    CONSTRAINT fk_sscm_currency_uom_id FOREIGN KEY (currency_uom_id) REFERENCES uom (uom_id),
    constraint fk_sscm_sscm_sale_order_sale_man_id foreign key(sale_man_id) references user_login(user_login_id)
);

create table sscm_sale_order_item(

);
