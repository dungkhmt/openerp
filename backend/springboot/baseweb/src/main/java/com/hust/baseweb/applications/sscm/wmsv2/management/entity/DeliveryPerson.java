package com.hust.baseweb.applications.sscm.wmsv2.management.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "delivery_person")
public class DeliveryPerson {
    @Id
    private String userLoginId;
    private String fullName;
    private String phoneNumber;
}
