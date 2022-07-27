package com.hust.baseweb.applications.sscm.tmscontainer.model;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.Facility;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.LineItem;
import com.hust.baseweb.applications.sscm.tmscontainer.service.FacilitiesService;
import com.hust.baseweb.applications.sscm.tmscontainer.utils.LineItemStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ImportOrderResponse {

    private int id;

    private List<LineItemResponse> lineItems;

    private String code;

    private BigDecimal total;

    private Integer facilityId;

    private FacilityResponse facility;

    private String status;

    private Date updateAt;

    private Date createAt;


    public void updateStatusImport() {
        var changeList = lineItems.stream().map(lineItemResponse -> {
            if (lineItemResponse.getQuantity() == null) {
                lineItemResponse.setQuantity(BigDecimal.ZERO);
            }
            if (lineItemResponse.getCurrentQuantity() == null) {
                lineItemResponse.setCurrentQuantity(BigDecimal.ZERO);
            }
            return lineItemResponse.getQuantity().subtract(lineItemResponse.getCurrentQuantity());
        }).collect(Collectors.toList());

        var totalQuantity = lineItems.stream()
                            .map(LineItemResponse::getQuantity)
                            .filter(i -> (i != null))
                            .reduce(BigDecimal.ZERO, BigDecimal::add);


        var changeTotal = changeList.stream().reduce(BigDecimal.ZERO, BigDecimal::add);

        if (changeTotal.compareTo(BigDecimal.ZERO) == 0) {
            status = LineItemStatus.INIT;
        }else if(changeTotal.compareTo(totalQuantity) == 0){
            status = LineItemStatus.COMPLETE;
        } else{
            status = LineItemStatus.PROCESS;
        }

    }
}
