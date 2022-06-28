package com.hust.baseweb.applications.sscm.tmscontainer.entity;


import com.hust.baseweb.applications.sscm.tmscontainer.model.FacilityRequest;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ShelfRequest;
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
@Table(name = "shelves")
@EntityListeners(AuditingEntityListener.class)

public class Shelves {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int shelfId;

    @Column(name="facility_id")
    private int facilityId;

    @Column(name= "x")
    private int x;

    @Column(name= "y")
    private int y;

    @Column(name= "width")
    private int width;

    @Column(name= "lenght")
    private int lenght;

    @LastModifiedDate
    private Date updateAt;

    @CreatedDate
    private Date createAt;

    public Shelves(ShelfRequest shelfRequest){
        this.facilityId = shelfRequest.getFacilityId();
        this.x = shelfRequest.getX();
        this.y = shelfRequest.getY();
        this.width = shelfRequest.getWidth();
        this.lenght = shelfRequest.getLenght();
    }
}
