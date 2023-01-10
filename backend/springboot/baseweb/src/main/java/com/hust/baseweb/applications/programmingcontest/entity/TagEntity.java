package com.hust.baseweb.applications.programmingcontest.entity;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "tag")
public class TagEntity {

    @Id
    @Column(name = "tag_id")
    private String tagId;

    @Column(name = "name", unique = true)
    private String name;

    @Column(name = "description")
    private String description;

}
