package com.hust.baseweb.applications.programmingcontest.composite;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class CompositeContestProblemId implements Serializable {
    private String contestId;
    private String problemId;
}
