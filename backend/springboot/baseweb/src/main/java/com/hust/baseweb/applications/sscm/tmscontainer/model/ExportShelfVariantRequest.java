package com.hust.baseweb.applications.sscm.tmscontainer.model;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.ExportShelfVariant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExportShelfVariantRequest {

    private List<ExportShelfVariant> shelfVariants;

    private Integer exportLineItemId;

    private BigDecimal getQuantity; // số lượng cần lấy ra

    private BigDecimal sumQuantity; // tổng số lượng lấy trong các shelfVariant


}
