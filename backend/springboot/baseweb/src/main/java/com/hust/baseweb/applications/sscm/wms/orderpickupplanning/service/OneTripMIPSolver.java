package com.hust.baseweb.applications.sscm.wms.orderpickupplanning.service;

import com.google.ortools.Loader;
import com.google.ortools.linearsolver.MPConstraint;
import com.google.ortools.linearsolver.MPObjective;
import com.google.ortools.linearsolver.MPSolver;
import com.google.ortools.linearsolver.MPVariable;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.*;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.solution.OrderPickupPlanningSolution;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.solution.OrderPickupRoute;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.solution.OrderPickupRouteElement;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.solution.OrderPickupRouteElementItemPickup;

import java.util.*;

public class OneTripMIPSolver {
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

    // modelling
    MPSolver solver;
    MPVariable[][] X;
    MPVariable[][] Y;// Y[k][i] is the accumulate amount of items picked up
    MPVariable[] D;// accumulate distance
    MPVariable obj;
    long timeLimit = 10000;

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

    }

    private void createSolverAndVariables() {
        X = new MPVariable[n+2][n+2];

        Loader.loadNativeLibraries();
        solver = MPSolver.createSolver(String.valueOf(MPSolver.OptimizationProblemType.SCIP_MIXED_INTEGER_PROGRAMMING));

        if (solver == null) {
            System.err.println("Could not create solver SCIP");
            return;
        }

        System.out.println("createSolverAndVariables, n = " + n);

        for (int i = 0; i <= n; i++) {
            for (int j = 1; j <= n+1; j++) {
                X[i][j] = solver.makeIntVar(0, 1, "x[" + j + "," + i + "]");
            }
        }
        obj = solver.makeIntVar(0, INF*1.0, "distance");


        int[] Q = new int[K];
        for(int k = 0; k < K; k++){
            Q[k] = 0;
            for(int i = 0;i <= n+1; i++)
                Q[k] += q[k][i];
        }
        // create variables y
        Y = new MPVariable[K][n+2];
        for(int i = 0; i <= n+1; i++){
            for(int k = 0; k < K; k++){
                Y[k][i] = solver.makeIntVar(0,Q[k],"y[" + k + "," + i + "]");
            }
        }
        double sumD = 0;
        for(int i = 0;i <= n+1; i++)
            for(int j = 0; j <= n+1; j++) {
                if(d[i][j] < INF)
                    sumD += d[i][j];
            }
        // create variable D
        D = new MPVariable[n+2];
        for(int i = 0; i <= n+1; i++)
            D[i] = solver.makeIntVar(0,sumD,"D[" + i + "]");


    }

    private void createFlowConstraints(){
        for(int i = 1;i <= n; i++){
            MPConstraint c = solver.makeConstraint(0, 0);
            for(int j = 0; j <= n; j++) {
                c.setCoefficient(X[j][i], 1);
            }
            for(int j = 1; j <= n+1; j++){
                c.setCoefficient(X[i][j],-1);
            }
        }
        MPConstraint c = solver.makeConstraint(1,1);
        for(int j = 1; j <= n+1; j++){
            c.setCoefficient(X[0][j],1);
        }

    }
    private void createAccumulateDistanceConstraints(){
        int M = 2*INF;//100000;
        for(int i = 0; i <= n; i++){
            for(int j = 1; j <= n+1; j++){
                MPConstraint c = solver.makeConstraint(-M,M - d[i][j]);
                c.setCoefficient(D[i],1);
                c.setCoefficient(D[j],-1);
                c.setCoefficient(X[i][j],M);

                c = solver.makeConstraint(-M-d[i][j],M);
                c.setCoefficient(D[i],1);
                c.setCoefficient(D[j],-1);
                c.setCoefficient(X[i][j],-M);
            }
        }
    }
    private void createAccumulateItemQtyConstraints(){
        int M = 2*INF;//1000000;
        for(int k = 0; k < K; k++) {
            for (int i = 0; i <= n; i++) {
                for (int j = 1; j <= n + 1; j++) {
                    MPConstraint c = solver.makeConstraint(-M, M - q[k][j]);
                    c.setCoefficient(Y[k][i], 1);
                    c.setCoefficient(Y[k][j], -1);
                    c.setCoefficient(X[i][j], M);

                    c = solver.makeConstraint(-M - q[k][j], M);
                    c.setCoefficient(Y[k][i], 1);
                    c.setCoefficient(Y[k][j], -1);
                    c.setCoefficient(X[i][j], -M);
                }
            }
        }

        for(int k = 0; k < K; k++){
            MPConstraint c = solver.makeConstraint(r[k],M);
            c.setCoefficient(Y[k][n+1],1);
        }

        for(int k = 0; k < K; k++){
            MPConstraint c = solver.makeConstraint(0,0);
            c.setCoefficient(Y[k][0],1);
        }
    }
    private void createObjective(){
        MPObjective objective = solver.objective();
        objective.setCoefficient(D[n+1],1);
        objective.setMinimization();
    }
    public String name(){
        return "MIPSolverOneRoute";
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
    private int findNext(int i){
        for(int j = 1; j <= n+1; j++)
        {
            if(X[i][j].solutionValue() > 0) return j;
        }
        return -1;
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

        createSolverAndVariables();
        createFlowConstraints();
        createAccumulateDistanceConstraints();
        createAccumulateItemQtyConstraints();
        createObjective();

        timeLimit = 1000000;
        solver.setTimeLimit(timeLimit);
        System.out.println("model created , start solving time limit = " + timeLimit);
        final MPSolver.ResultStatus resultStatus = solver.solve();


        if (resultStatus == MPSolver.ResultStatus.OPTIMAL) {
            System.out.println(name() + "solve --> OPTIMAL SOLVED!! " + solver.objective().value());
            /*
            for(int i = 0;i <= n; i++){
                for(int j = 1; j <= n+1; j++){
                    if(X[i][j].solutionValue() > 0)
                        System.out.println("X[" + i + "," + j + "] = " + X[i][j].solutionValue());
                }
            }
            for(int i = 0; i <= n+1; i++)
                System.out.println("D[" + i + "] = " + D[i].solutionValue());

            for(int i = 0; i <= n+1; i++){
                for(int k = 0; k < K; k++){
                    System.out.println("Y[" + k + "," + i + "] = " + Y[k][i].solutionValue());
                }
            }

             */
        }else{
            System.out.println(name() + "solve --> NOT SOLVED!! ");
        }

        List<OrderPickupRouteElement> l_route = new ArrayList();
        int i = 0;
        while(i != n+1){
            int j = findNext(i);
            if(j <= n) {
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
            i = j;
        }

        OrderPickupRoute route = new OrderPickupRoute();
        route.setRouteElements(l_route);
        route.setLength(solver.objective().value());
        route.setNumberPoints(l_route.size());
        //route.computeDescription();
        //OrderPickupPlanningSolution sol = new OrderPickupPlanningSolution();
        return route;


    }
    public OrderPickupRoute solve(List<Order> orders, List<Shelf> shelfs,
                                  List<DistanceElement> distances,
                                  String startLocationCode, String terminatingLocationCode){
        this.orders = orders;
        this.shelfs = shelfs;
        this.distances = distances;
        this.startLocationCode = startLocationCode;
        this.terminatingLocationCode = terminatingLocationCode;
        mapData();
        printData();
        //printMapData();

        createSolverAndVariables();
        createFlowConstraints();
        createAccumulateDistanceConstraints();
        createAccumulateItemQtyConstraints();
        createObjective();

        timeLimit = 1000000;
        solver.setTimeLimit(timeLimit);
        System.out.println("model created , start solving time limit = " + timeLimit);
        final MPSolver.ResultStatus resultStatus = solver.solve();


        if (resultStatus == MPSolver.ResultStatus.OPTIMAL) {
            System.out.println(name() + "solve --> OPTIMAL SOLVED!! " + solver.objective().value());
            /*
            for(int i = 0;i <= n; i++){
                for(int j = 1; j <= n+1; j++){
                    if(X[i][j].solutionValue() > 0)
                        System.out.println("X[" + i + "," + j + "] = " + X[i][j].solutionValue());
                }
            }
            for(int i = 0; i <= n+1; i++)
                System.out.println("D[" + i + "] = " + D[i].solutionValue());

            for(int i = 0; i <= n+1; i++){
                for(int k = 0; k < K; k++){
                    System.out.println("Y[" + k + "," + i + "] = " + Y[k][i].solutionValue());
                }
            }

             */
        }else{
            System.out.println(name() + "solve --> NOT SOLVED!! ");
        }

        List<OrderPickupRouteElement> l_route = new ArrayList();
        int i = 0;
        while(i != n+1){
            int j = findNext(i);
            if(j <= n) {
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
            i = j;
        }

        OrderPickupRoute route = new OrderPickupRoute();
        route.setRouteElements(l_route);
        route.setLength(solver.objective().value());
        route.setNumberPoints(l_route.size());
        //route.computeDescription();
        //OrderPickupPlanningSolution sol = new OrderPickupPlanningSolution();
        return route;

    }
}
