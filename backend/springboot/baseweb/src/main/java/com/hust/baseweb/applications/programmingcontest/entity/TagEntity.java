package com.hust.baseweb.applications.programmingcontest.entity;

import lombok.*;

import javax.persistence.*;

import org.hibernate.annotations.GenericGenerator;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "tag")
public class TagEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "incrementDomain")
    @GenericGenerator(name = "incrementDomain", strategy = "increment")
    @Column(name = "tag_id")
    private Integer tagId;

    @Column(name = "name", unique = true)
    private String name;

    @Column(name = "description")
    private String description;

}
