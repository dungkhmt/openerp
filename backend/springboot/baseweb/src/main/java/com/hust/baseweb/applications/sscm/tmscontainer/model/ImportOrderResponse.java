package com.hust.baseweb.applications.sscm.tmscontainer.model;

import com.hust.baseweb.applications.sscm.tmscontainer.utils.LineItemStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ImportOrderResponse {

    private int id;

    private List<ImportLineItemResponse> lineItems;

    private String code;

    private BigDecimal total;

    private Integer facilityId;

    private FacilityResponse facility;

    private String status;

    private Date updateAt;

    private Date createAt;


    public void updateStatusImport() {
        List<BigDecimal> changeList = lineItems.stream().map(importLineItemResponse -> {
            if (importLineItemResponse.getQuantity() == null) {
                importLineItemResponse.setQuantity(BigDecimal.ZERO);
            }
            if (importLineItemResponse.getCurrentQuantity() == null) {
                importLineItemResponse.setCurrentQuantity(BigDecimal.ZERO);
            }
            return importLineItemResponse.getQuantity().subtract(importLineItemResponse.getCurrentQuantity());
        }).collect(Collectors.toList());

        BigDecimal totalQuantity = lineItems.stream()
                            .map(ImportLineItemResponse::getQuantity)
                            .filter(i -> (i != null))
                            .reduce(BigDecimal.ZERO, BigDecimal::add);


        BigDecimal changeTotal = changeList.stream().reduce(BigDecimal.ZERO, BigDecimal::add);

        if (changeTotal.compareTo(BigDecimal.ZERO) == 0) {
            status = LineItemStatus.INIT;
        }else if(changeTotal.compareTo(totalQuantity) == 0){
            status = LineItemStatus.COMPLETE;
        } else{
            status = LineItemStatus.PROCESS;
        }

    }
}
