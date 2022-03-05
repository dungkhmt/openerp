package com.hust.baseweb.applications.sscm.wms.orderpickupplanning.service;

import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.Order;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.OrderItem;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.OrderPickupPlanningIM;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.Shelf;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.solution.OrderPickupPlanningSolution;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.solution.OrderPickupRoute;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.solution.OrderPickupRouteElement;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.solution.OrderPickupRouteElementItemPickup;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OptimizationSolver {
    public void propaggateRouteUpdateItem( List<Order> cluster, OrderPickupRoute route, OrderPickupPlanningIM I){
        Map<String, Integer> mItemCode2Qty = new HashMap();
        for(Order o: cluster){
            for(OrderItem oi: o.getItems()){
                String itemCode = oi.getItemID();
                int r = oi.getQty();
                if(mItemCode2Qty.get(itemCode) == null){
                    mItemCode2Qty.put(itemCode,r);
                }else{
                    mItemCode2Qty.put(itemCode,mItemCode2Qty.get(itemCode) + r);
                }
            }
        }
        Map<String, Shelf> mID2Shelf = new HashMap();
        for(Shelf s: I.getShelfs()){
            mID2Shelf.put(s.getShelfID(),s);
        }
        for(int i = 0;i < route.getRouteElements().size();i++){
            OrderPickupRouteElement e = route.getRouteElements().get(i);
            String shelfID = e.getShelfID();
            Shelf shelf = mID2Shelf.get(shelfID);
            System.out.println(name() + "::propaggateRouteUpdateItem, at shelf " + shelfID);
            List<OrderPickupRouteElementItemPickup> items = e.getItemPickups();
            for(int j = 0; j < items.size(); j++){
                OrderPickupRouteElementItemPickup ip = items.get(j);
                String itemCode = ip.getOrderItemID();
                for(OrderItem oi: shelf.getItems()){
                    if(oi.getItemID().equals(itemCode)){
                        if(mItemCode2Qty.get(itemCode) != null){
                            int req = mItemCode2Qty.get(itemCode);
                            if(oi.getQty() <= req) {
                                ip.setQty(oi.getQty());// amount of item to be picked up at current shelf
                                req = req - oi.getQty();
                                oi.setQty(0);
                                mItemCode2Qty.put(itemCode,req);

                                System.out.println(name() + "::propaggateRouteUpdateItem, at shelf " + shelfID +
                                                   " item " + itemCode + " reduce qty " + req + " pickup all amount " + ip.getQty());
                            }else if(req > 0){
                                ip.setQty(req); // amount of item to be picked up at current shelf
                                oi.setQty(oi.getQty() - req);
                                mItemCode2Qty.put(itemCode,0);
                                System.out.println(name() + "::propaggateRouteUpdateItem, at shelf " + shelfID +
                                                   " item " + itemCode + " reduce qty " + req + " pickup amount " + ip.getQty());
                            }
                        }
                    }
                }
            }
        }
    }

    public OrderPickupPlanningSolution solve(OrderPickupPlanningIM I){
        OneTripMIPSolver solver = new OneTripMIPSolver();
        OneTripGreedySolver greedySolver = new OneTripGreedySolver();
        OrderPartitionMIPSolver partitioner = new OrderPartitionMIPSolver();
        OrderPartitionGreedySolver greedyPartitioner = new OrderPartitionGreedySolver();
        //List<List<Order>> partitions = partitioner.solve(I.getOrders(), I.getParam().getWeightCapacity());
        List<List<Order>> partitions = greedyPartitioner.solve(I.getOrders(), I.getParam().getWeightCapacity(),1);

        OrderPickupPlanningSolution sol = new OrderPickupPlanningSolution();
        List<OrderPickupRoute> routes = new ArrayList();
        for(int k = 0; k < partitions.size(); k++) {
            List<Order> cluster = partitions.get(k);
            //OrderPickupRoute route = solver.solve(cluster,
            //                                      I.getShelfs(), I.getDistances(), I.getDoorIn(), I.getDoorOut());
            DataMapper DM = new DataMapper();
            DM.map(cluster,  I.getShelfs(), I.getDistances(), I.getDoorIn(), I.getDoorOut());
            DM.printMapData();
            //OrderPickupRoute route = solver.solve(DM);
            OrderPickupRoute route = greedySolver.solve(DM);

            route.setServedOrders(cluster);
            route.setIndex(k+1);
            routes.add(route);
            System.out.println(name() + "::solve, found route: "); route.print();
            propaggateRouteUpdateItem(cluster,route,I);
            route.computeDescription();
        }
        sol.setRoutes(routes);
        return sol;
    }
    public String name(){
        return "OptimizationSolver";
    }
}
