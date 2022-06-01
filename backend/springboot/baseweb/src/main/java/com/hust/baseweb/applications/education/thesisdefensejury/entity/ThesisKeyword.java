package com.hust.baseweb.applications.education.thesisdefensejury.entity;


import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Data
@Table(name = "thesis_keyword") // Entity map voi bang thesis_keyword
@NoArgsConstructor
public class ThesisKeyword {
    @Id
    @Column(name = "thesis_id")
    private UUID thesis;


    @Column(name = "keyword")
    private String keyword;

}
