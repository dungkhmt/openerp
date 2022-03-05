package com.hust.baseweb.applications.sscm.wms.orderpickupplanning.service;

import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.DistanceElement;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.Order;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.Shelf;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.solution.OrderPickupRoute;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.solution.OrderPickupRouteElement;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.solution.OrderPickupRouteElementItemPickup;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

public class OneTripGreedySolver {
    List<Order> orders;
    List<Shelf> shelfs;
    List<DistanceElement> distances;
    List<String> listItemCodes;
    String startLocationCode;
    String terminatingLocationCode;


    int n;// number of shelf points 1, 2, ..., n
    // o is the start point, n+1 is the finish point
    int K;// number of items
    int[][] q;// q[k][i] is the amount of item k at point i
    int[] r;// r[k] is amount of item k requested
    double[][] d;// d[i][j] is the distance from point i to point j


    private int findNearestNextPoint(int cur, HashSet<Integer> R){
        System.out.println(name() + "::findNearestNextPoint, R.sz = " + R.size());
        for(int i: R) {
            for(int k = 0; k < K; k++){
                System.out.println(name() + "::findNearestNextPoint, item " + k + " r = " + r[k] + " available = " + q[k][i]);
            }
        }
        double minD = Integer.MAX_VALUE;
        int sel_point = -1;
        for(int i: R){
            boolean ok = false;
            for(int k = 0; k < K; k++){
                if(r[k] > 0 && q[k][i] > 0){// request is positive and shelf i has positive amount
                    ok = true; break;
                }
            }
            if(ok && minD > d[cur][i]){
                minD = d[cur][i];
                sel_point = i;
            }
        }
        return sel_point;
    }
    private boolean checkEmptyRequest(int[] r){
        for(int i = 0; i < r.length; i++)
            if(r[i] > 0) return false;
        return true;
    }
    public OrderPickupRoute solve(DataMapper DM){
        this.orders = DM.orders;
        this.shelfs = DM.shelfs;
        this.distances = DM.distances;
        this.startLocationCode = DM.startLocationCode;
        this.terminatingLocationCode = DM.terminatingLocationCode;
        this.listItemCodes = DM.listItemCodes;
        this.n = DM.n;// number of shelf points 1, 2, ..., n
        // 0 is the start point, n+1 is the finish point
        this.K = DM.K;// number of items
        this.q= DM.q;// q[k][i] is the amount of item k at point i
        this.r = DM.r;// r[k] is amount of item k requested
        this.d = DM.d;// d[i][j] is the distance from point i to point j


        List<Integer> routeIndex = new ArrayList();
        int cur = 0;
        double length = 0;
        HashSet<Integer> R = new HashSet();
        for(int i = 1; i <= n; i++) R.add(i);

        while(R.size() > 0){
            int next = findNearestNextPoint(cur,R);
            System.out.println(name() + "::solve, next = " + next);
            if(next == -1){
                System.out.println(name() + "::solve, next = " + next + " BREAK");
                break;
            }
            if(next != -1){
                // update requested
                R.remove(next);
                routeIndex.add(next);
                length = length + d[cur][next];
                cur  = next;
                for(int k = 0; k < K;k++){
                    if(r[k] <= q[k][next]){
                        r[k] = 0;
                    }else{
                        r[k] = r[k] - q[k][next];
                    }
                }
                if(checkEmptyRequest(r)){
                    System.out.println(name() + "::solve, collect enough items, break!!!");
                    break;
                }
            }
        }
        if(!checkEmptyRequest(r)) {
            System.out.println(name() + "::solve, cannot find feasible solution");
            return null;
        }

        List<OrderPickupRouteElement> l_route = new ArrayList();
        for(int i = 0; i < routeIndex.size(); i++){
            int j = routeIndex.get(i);
            OrderPickupRouteElement e = new OrderPickupRouteElement();
                Shelf s = shelfs.get(j - 1);
                e.setShelfID(s.getShelfID());
                List<OrderPickupRouteElementItemPickup> itemPickups = new ArrayList();
                for (int k = 0; k < K; k++) {
                    String itemCode = listItemCodes.get(k);
                    int qty = 0;//(int) Y[k][j].solutionValue();
                    OrderPickupRouteElementItemPickup ip = new OrderPickupRouteElementItemPickup(itemCode, qty);
                    itemPickups.add(ip);
                }
                e.setItemPickups(itemPickups);

                l_route.add(e);

        }

        OrderPickupRoute route = new OrderPickupRoute();
        route.setRouteElements(l_route);
        route.setLength(length);
        route.setNumberPoints(l_route.size());
        //route.computeDescription();
        //OrderPickupPlanningSolution sol = new OrderPickupPlanningSolution();
        return route;

    }
    public String name(){
        return "OneTripGreedySolver";
    }
}
