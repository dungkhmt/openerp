package com.hust.baseweb.applications.sscm.wms.orderpickupplanning.service;

import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.Order;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class OrderPartitionGreedySolver {
    Random R = new Random();
    public List<List<Order>> solve(List<Order> orders, double weightCapacity, int maxTrials) {
        List<List<Order>> retList = new ArrayList();
        double[] w = new double[orders.size()];
        int n = orders.size();
        //System.out.println(name() + "::solve n = " + n);
        for (int i = 0; i < orders.size(); i++) {
            w[i] = 0;
            //System.out.println(name() + "::solve, order[" + i + "] orderID = " + orders.get(i).getOrderID());
            for (int j = 0; j < orders.get(i).getItems().size(); j++) {
                w[i] += orders.get(i).getItems().get(j).getWeight();
                //System.out.println(name() + "::solve, order[" + i + "] orderID = " + orders.get(i).getOrderID()
                //+ " add item " + orders.get(i).getItems().get(j).getItemID() + " weight " + orders.get(i).getItems().get(j).getWeight() + " w = " + w[i]);
            }
        }
        int minSz = n;
        int[] index = new int[n];
        for(int trial = 1; trial <= maxTrials; trial++) {
            // shuffle weightCapacity
            for(int i = 0; i < n; i++) index[i] = i;
            for(int k = 1; k <= n; k++){
                int i = R.nextInt(n);
                int j = R.nextInt(n);
                double tmp = w[i]; w[i] = w[j]; w[j] = tmp;
                int t = index[i]; index[i] = index[j]; index[j] = t;
            }
            List<List<Order>> tmpRL = new ArrayList();
            double C = 0;
            List<Order> L = new ArrayList();
            tmpRL.add(L);
            for (int i = 0; i < n; i++) {
                if (C + w[i] > weightCapacity) {
                    L = new ArrayList();
                    L.add(orders.get(index[i]));
                    tmpRL.add(L);
                } else {
                    L.add(orders.get(index[i]));
                    C = C + w[i];
                }
            }
            if(minSz > tmpRL.size()){
                minSz = tmpRL.size();
                retList = tmpRL;
            }
        }
        return retList;
    }
}
