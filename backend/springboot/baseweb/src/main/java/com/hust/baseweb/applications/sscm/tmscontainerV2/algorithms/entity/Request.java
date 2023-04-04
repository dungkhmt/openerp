package com.hust.baseweb.applications.sscm.tmscontainerV2.algorithms.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Request {
    private String earliestTimePickup; // 2023-02-03 10:30:00
    private String latestTimePickup; // 2023-02-03 11:00:00
    private String fromLocationID;

    private String earliestTimeDelivery; // 2023-02-03 10:30:00
    private String latestTimeDelivery; // 2023-02-03 11:00:00
    private String toLocationID;

    private String type;
    private List<String> containerIDs;

}
