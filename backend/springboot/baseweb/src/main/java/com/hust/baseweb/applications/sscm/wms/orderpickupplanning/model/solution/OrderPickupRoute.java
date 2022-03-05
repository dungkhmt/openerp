package com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.solution;

import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.Order;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderPickupRoute {
    private int index;
    private List<OrderPickupRouteElement> routeElements;
    private double length;
    private int numberPoints;
    private List<Order> servedOrders;
    public void computeDescription(){
        for(OrderPickupRouteElement e: routeElements){
            e.setDescription();
        }
    }
    public String name(){
        return "OrderPickupRoute";
    }
    public void print(){
        System.out.print(name() + "::print route " + index);
        for(OrderPickupRouteElement e: routeElements)
            System.out.print(" [shelf " + e.getShelfID() + "] ");
    }
}
