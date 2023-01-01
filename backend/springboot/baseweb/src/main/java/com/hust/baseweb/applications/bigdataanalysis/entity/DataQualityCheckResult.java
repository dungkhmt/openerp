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

@Table(name = "data_quality_check_result")

public class DataQualityCheckResult {
    @Id
    @Column(name="id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name="rule_id")
    private String ruleId;

    @Column(name="entity")
    private String entity;

    @Column(name="instance")
    private String instance;

    @Column(name="value")
    private String value;

    @Column(name="status")
    private String status;

    @Column(name="table_name")
    private String tableName;

    @Column(name="link_source")
    private String linkSource;

    @Column(name="created_stamp")
    private Date createdStamp;

}
