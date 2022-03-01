package com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Shelf {
    private String shelfID;
    private List<OrderItem> items;
    public String name(){
        return "Shelf";
    }
    public void println(){

        System.out.print(name() + "::print shelf " + shelfID);
        for(OrderItem i: items){
            System.out.print(" [item " + i.getItemID() + " qty " + i.getQty() + "] ");
        }
        System.out.println();
    }
}
