package com.hust.baseweb.applications.bigdataanalysis.entity;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder

@Table(name = "data_quality_check_rule")

public class DataQualityCheckRule {
    @Id
    @Column(name="rule_id")
    private String ruleId;

    @Column(name="rule_description")
    private String ruleDescription;

    @Column(name="params")
    private String params;

}
