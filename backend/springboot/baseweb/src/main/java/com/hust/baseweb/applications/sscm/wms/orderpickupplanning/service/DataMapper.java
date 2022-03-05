package com.hust.baseweb.applications.sscm.wms.orderpickupplanning.service;

import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.DistanceElement;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.Order;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.OrderItem;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.Shelf;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.solution.OrderPickupRoute;

import java.util.*;

public class DataMapper {
    public static final int INF = 10000000;
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


    public void printData(){
        System.out.println(name() + "::printData");
        for(Shelf s: shelfs) s.println();
        for(Order o: orders) o.println();
    }
    private void mapData(){
        Map<String, Integer> mCode2Index = new HashMap();
        n = shelfs.size();
        for(int i = 0; i < shelfs.size(); i++){;
            mCode2Index.put(shelfs.get(i).getShelfID(),i+1);
            //System.out.println("Code2Index.put(" + shelfs.get(i).getShelfID() + "," + (i+1) + ")");

        }
        mCode2Index.put(startLocationCode,0);
        mCode2Index.put(terminatingLocationCode,n+1);
        //System.out.println("Code2Index.put(" + startLocationCode + "," + 0 + ")");
        //System.out.println("Code2Index.put(" + terminatingLocationCode + "," + (n+1) + ")");
        d = new double[n+2][n+2];
        for(int i = 0; i <= n+1; i++)
            for(int j = 0; j <= n+1; j++)
                d[i][j] = INF;
        Set<String> locationCodes = new HashSet<String>();
        //for(DistanceElement e: distances){
        for(int q = 0; q < distances.size(); q++){
            DistanceElement e = distances.get(q);
            if(mCode2Index.get(e.getFromlocationID()) != null && mCode2Index.get(e.getToLocaltionID()) != null) {
                int i = mCode2Index.get(e.getFromlocationID());
                int j = mCode2Index.get(e.getToLocaltionID());
                d[i][j] = e.getDistance();
                //System.out.println("distance[" + q + "] from " + e.getFromlocationID() + ", to " + e.getToLocaltionID() + " d[" + i + "," + j + "] = " + d[i][j]);
            }
        }
        K = 0;
        Set<String> setItemCodes = new HashSet<String>();
        for(int i = 0; i < orders.size(); i++){
            Order o = orders.get(i);
            Set<String> S = o.collects();
            for(String s: S) setItemCodes.add(s);
        }
        K = setItemCodes.size();
        listItemCodes = new ArrayList();
        for(String s: setItemCodes) listItemCodes.add(s);
        Map<String, Integer> mItemCode2Index = new HashMap();
        for(int i = 0; i < listItemCodes.size(); i++){
            mItemCode2Index.put(listItemCodes.get(i),i);
        }
        q = new int[K][n+2];// q[k][i]: amount of item k in shelf i
        r = new int[K]; // r[k] is the total request of item k
        for(int  k = 0; k < K; k++){
            r[k] = 0;
            for(int i = 0; i <= n+1; i++)
                q[k][i] = 0;
        }
        for(Shelf s: shelfs){
            int i = mCode2Index.get(s.getShelfID());
            for(OrderItem oi: s.getItems()){
                int k = mItemCode2Index.get(oi.getItemID());
                q[k][i] += oi.getQty();
            }
        }
        for(Order o: orders){
            for(OrderItem oi: o.getItems()){
                int k = mItemCode2Index.get(oi.getItemID());
                r[k] += oi.getQty();
            }

        }
        for(Order o: orders)
            o.computeDescription();

    }

    public String name(){
        return "DataMapper";
    }
    public void printMapData(){
        System.out.println("n = " + n + " K = " + K);
        for(int k = 0; k < K; k++){
            System.out.println("r[" + k + "] = " + r[k] + " ");
            for(int i = 1; i <= n; i++) System.out.print("q[" + k + "," + i + "] = " + q[k][i] + "  ");
            System.out.println();
        }
        System.out.println();
        for(int i = 0;i <= n+1; i++){
            for(int j = 0; j <= n+1; j++){
                System.out.print(d[i][j] + " ");
            }
            System.out.println();
        }
    }

    public void map(List<Order> orders, List<Shelf> shelfs,
                                  List<DistanceElement> distances,
                                  String startLocationCode, String terminatingLocationCode) {
        this.orders = orders;
        this.shelfs = shelfs;
        this.distances = distances;
        this.startLocationCode = startLocationCode;
        this.terminatingLocationCode = terminatingLocationCode;
        mapData();
        printData();
    }
}
