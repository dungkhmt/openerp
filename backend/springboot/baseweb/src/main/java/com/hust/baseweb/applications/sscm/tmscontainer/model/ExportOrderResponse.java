package com.hust.baseweb.applications.sscm.tmscontainer.model;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.Shelf;
import com.hust.baseweb.applications.sscm.tmscontainer.utils.LineItemStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExportOrderResponse {

    private int id;

    private List<ExportLineItemResponse> lineItems;

    private String code;

    private BigDecimal total;

    private Integer facilityId;

    private FacilityResponse facility;

    private String status;

    private Date updateAt;

    private Date createAt;


    public void updateStatusExport() {
        List<BigDecimal> changeList = lineItems.stream().map(exportLineItemResponse -> {
            if (exportLineItemResponse.getQuantity() == null) {
                exportLineItemResponse.setQuantity(BigDecimal.ZERO);
            }
            if (exportLineItemResponse.getTotalQuantity() == null) {
                exportLineItemResponse.setTotalQuantity(BigDecimal.ZERO);
            }
            return exportLineItemResponse.getTotalQuantity().subtract(exportLineItemResponse.getQuantity());
        }).collect(Collectors.toList());

        BigDecimal totalQuantity = lineItems.stream()
                                            .map(ExportLineItemResponse::getTotalQuantity)
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
