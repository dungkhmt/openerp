package com.hust.baseweb.applications.sscm.tmscontainer.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ShelfRequest {
    private int shelfId;
    private int facilityId;
    private int x;
    private int y;
    private int num;
    private String status;
    private int width;
    private int lenght;
}
