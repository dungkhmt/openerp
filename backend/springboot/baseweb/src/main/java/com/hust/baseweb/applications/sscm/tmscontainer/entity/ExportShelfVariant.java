package com.hust.baseweb.applications.sscm.tmscontainer.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "export_shelf_variant")
@EntityListeners(AuditingEntityListener.class)
public class ExportShelfVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name= "shelf_variant_id")
    private Integer shelfVariantId;

    @Column(name= "export_line_item_id")
    private Integer exportLineItemId;

    @Column(name= "quantity")
    private BigDecimal quantity;

    @Column(name= "exported")
    private Boolean exported;

    @LastModifiedDate
    private Date updateAt;

    @CreatedDate
    private Date createAt;

}
