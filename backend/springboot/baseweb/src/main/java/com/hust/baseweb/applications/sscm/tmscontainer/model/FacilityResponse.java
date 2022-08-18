package com.hust.baseweb.applications.sscm.tmscontainer.model;


import com.hust.baseweb.applications.sscm.tmscontainer.entity.Facility;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Shelf;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.ShelfVariant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FacilityResponse {

    private Integer id;// facilityId

    private String code;

    private String name;

    private String address;

    private int facilityWidth;

    private int facilityLenght;

    private Date createAt;

    private List<Shelf> listShelf;

    private List<ShelfVariant> shelfVariants;

    private Date updateAt;

    public FacilityResponse(Facility facility) {
            this.code = facility.getCode();
            this.name = facility.getName();
            this.address = facility.getAddress();
            this.facilityWidth =facility.getFacilityWidth();
            this.facilityLenght = facility.getFacilityLenght();
            this.createAt = facility.getCreateAt();
            this.updateAt = facility.getUpdateAt();
    }
}
