package com.hust.baseweb.applications.sscm.wmsv2.management.model;

import com.hust.baseweb.applications.sscm.wmsv2.management.model.DeliveryTripDTO;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class ShipmentDTO {
    private String shipmentId;
    private String createdStamp;
    private String lastUpdatedStamp;
    private String createdBy;
    private Date expectedDeliveryStamp; // for create shipment request -> this field only

    private List<DeliveryTripDTO> trips;
}
