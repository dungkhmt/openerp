package com.hust.baseweb.applications.whiteboard.entity;

import com.hust.baseweb.entity.UserLogin;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "whiteboard")
public class Whiteboard {
    @Id
    private String id;

    @Column(name = "name")
    private String name;

    @Column(name = "data")
    private String data;

    @OneToMany(mappedBy = "whiteboard")
    private Set<UserWhiteboard> userWhiteboards;

    @CreatedDate
    private Date createdDate;

    @CreatedBy
    private String createdBy;

    @LastModifiedDate
    private Date lastModifiedDate;

    @LastModifiedBy
    private String lastModifiedBy;
}
