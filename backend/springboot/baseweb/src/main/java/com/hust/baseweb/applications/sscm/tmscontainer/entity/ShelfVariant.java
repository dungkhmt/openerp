package com.hust.baseweb.applications.sscm.tmscontainer.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@Table(name = "shelf_variants")
@EntityListeners(AuditingEntityListener.class)
public class ShelfVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name= "shelf_id")
    private Integer shelfId;

    @Column(name= "variant_id")
    private Integer variantId;

    @Column(name= "line_item_id")
    private Integer lineItemId;

    @Column(name= "quantity")
    private BigDecimal quantity;

    @LastModifiedDate
    private Date updateAt;

    @CreatedDate
    private Date createAt;


    /*

    them variant vào kệ

    truyển variant id , kệ id , nếu kệ có variant rồi thì thay đổi số lượng (find by variant id & shelf id )

    nếu chưa có thì thêm
    lấy ra hết thì set variantID, shelfId = null

    khi lấy/ thêm thì cập nhật lại onhand, available

    // onhand là tổng theo lotsDate

    // avai là trên kệ


     */
}
