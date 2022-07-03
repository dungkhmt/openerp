package com.hust.baseweb.applications.programmingcontest.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ModelStudentViewProblemDetail {
    private String problemName;
    private String problemStatement;
    private String createdByUserLoginId;
    private String createdByUserFullName;
    private Date createdStamp;
}
