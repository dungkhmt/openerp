package com.hust.baseweb.applications.bigdataanalysis.entity;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder

@Table(name = "data_quality_check_master")

public class DataQualityCheckMaster {
    @Id
    @Column(name="id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name="rule_id")
    private String ruleId;

    @Column(name="created_by_user_login_id")
    private String createdByUserLoginId;

    @Column(name="meta_data")
    private String metaData;

    @Column(name="table_name")
    private String tableName;

    @Column(name="created_stamp")
    private Date createdStamp;

}
