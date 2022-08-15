package com.hust.baseweb.applications.sscm.tmscontainer.entity;

import com.hust.baseweb.applications.sscm.tmscontainer.model.FacilityRequest;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@Table(name = "facilities")
@EntityListeners(AuditingEntityListener.class)
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int facilityId;

    @Column(name= "code")
    private String code;

    @Column(name= "name")
    private String name;

    @Column(name= "facility_width")
    private int facilityWidth;

    @Column(name= "facility_lenght")
    private int facilityLenght;

    @Column(name= "address")
    private String address;

    @LastModifiedDate
    private Date updateAt;

    @CreatedDate
    private Date createAt;

    public Facility(FacilityRequest facilityRequest){
        this.code = facilityRequest.getCode();
        this.name = facilityRequest.getName();
        this.address = facilityRequest.getAddress();
        this.facilityLenght = facilityRequest.getFacilityLenght();
        this.facilityWidth = facilityRequest.getFacilityWidth();
    }
}
