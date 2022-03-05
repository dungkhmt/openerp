package com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Order {
    private String orderID;
    private List<OrderItem> items;
    private String description;

    public void computeDescription(){
        description = "";
        for(OrderItem i: items){
            description += "[" + i.getItemID() + "," + i.getQty() + "," + i.getWeight() + "] ";
        }
    }
    public int countNbItems(){
        Set<String> S = new HashSet();
        for(OrderItem i: items){
            S.add(i.getItemID());
        }
        return S.size();
    }
    public Set<String> collects(){
        Set<String> S = new HashSet<String>();
        for(OrderItem i: items) S.add(i.getItemID());
        return S;
    }
    public String name(){
        return "Order";
    }
    public void println(){
        System.out.print(name() + "::println, order " + orderID );
        for(OrderItem i: items){
            System.out.print(" [item " + i.getItemID() + " qty " + i.getQty() + " weight " + i.getWeight() + "] ");
        }
        System.out.println();
    }
}
