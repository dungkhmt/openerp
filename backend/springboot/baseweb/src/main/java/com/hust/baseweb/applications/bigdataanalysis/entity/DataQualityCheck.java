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

@Table(name = "data_quality_check")
public class DataQualityCheck {
    @Id
    @Column(name="id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name="rule_id")
    private String ruleId;

    @Column(name="created_by_user_login_id")
    private String createdByUserLoginId;

    @Column(name="param1")
    private String param1;

    @Column(name="param2")
    private String param2;

    @Column(name="param3")
    private String param3;

    @Column(name="param4")
    private String param4;

    @Column(name="param5")
    private String param5;

    @Column(name="param6")
    private String param6;

    @Column(name="param7")
    private String param7;

    @Column(name="param8")
    private String param8;

    @Column(name="param9")
    private String param9;

    @Column(name="param10")
    private String param10;

    @Column(name="result")
    private String result;

    @Column(name="status_id")
    private String statusId;

    @Column(name="message")
    private String message;

    @Column(name="created_stamp")
    private Date createdStamp;

}
