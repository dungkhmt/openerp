package com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.solution;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderPickupPlanningSolution {
    private List<OrderPickupRoute> routes;
}
