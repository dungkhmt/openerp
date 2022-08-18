package com.hust.baseweb.applications.sscm.tmscontainer.entity;


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

public class Shelf {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int shelfId;

    @Column(name="facility_id")
    private Integer facilityId;

    @Column(name= "x")
    private Integer x;

    @Column(name= "y")
    private Integer y;

    @Column(name= "width")
    private Integer width;

    @Column(name= "lenght")
    private Integer lenght;

    @Column(name= "status")
    private String status;

    @Column(name= "num")
    private Integer num;

    @LastModifiedDate
    private Date updateAt;

    @CreatedDate
    private Date createAt;

    public Shelf(ShelfRequest shelfRequest){
        this.shelfId = shelfRequest.getShelfId();
        this.facilityId = shelfRequest.getFacilityId();
        this.x = shelfRequest.getX();
        this.y = shelfRequest.getY();
        this.num = shelfRequest.getNum();
        this.width = shelfRequest.getWidth();
        this.lenght = shelfRequest.getLenght();
    }

    public void update(ShelfRequest shelfRequest){
//        this.shelfId = shelfRequest.getShelf_id();
//        this.facilityId = shelfRequest.getFacilityId();
        this.x = shelfRequest.getX();
        this.y = shelfRequest.getY();
        this.width = shelfRequest.getWidth();
        this.num = shelfRequest.getNum();
        this.lenght = shelfRequest.getLenght();
    }
}
