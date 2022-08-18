package com.hust.baseweb.applications.sscm.tmscontainer.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.ExportOrder;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Variant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExportLineItemResponse {

    private int id;

    private Integer variantId;

    private Integer productId;

    private Variant variant;

    private BigDecimal quantity;

    private BigDecimal totalQuantity;

    private BigDecimal retailPrice;

    private Integer exportId;

    private ExportOrder exportOrder;

    private String status;

    private BigDecimal total;

    private List<ExportShelfVariantResponse> exportShelfVariantResponses;

    private Date updateAt;

    private Date createAt;

}
