package com.hust.baseweb.applications.sscm.tmscontainer.model;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.ShelfVariant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExportShelfVariantResponse {

    private int id;

    private Integer shelfVariantId;

    private Integer exportLineItemId;

    private BigDecimal quantity;

    private Boolean exported;

    private ShelfVariant shelfVariant;

    private Integer shelfNum;

    private String status;

}
