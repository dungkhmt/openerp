package com.hust.baseweb.applications.sscm.wms.orderpickupplanning.service;

import com.google.ortools.Loader;
import com.google.ortools.linearsolver.MPConstraint;
import com.google.ortools.linearsolver.MPObjective;
import com.google.ortools.linearsolver.MPSolver;
import com.google.ortools.linearsolver.MPVariable;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.Order;

import java.util.*;

public class OrderPartitionMIPSolver {
    private MPVariable[][] x;// x[i][j] = 1 if order i is assigned to cluster j
    private int n;

    public List<List<Order>> solve(List<Order> orders, double weightCapacity){
        List<List<Order>> retList = new ArrayList();
        double[] w = new double[orders.size()];
        n = orders.size();
        //System.out.println(name() + "::solve n = " + n);
        for(int i = 0;i < orders.size(); i++){
            w[i] = 0;
            //System.out.println(name() + "::solve, order[" + i + "] orderID = " + orders.get(i).getOrderID());
            for(int j = 0; j < orders.get(i).getItems().size(); j++){
                w[i] += orders.get(i).getItems().get(j).getWeight();
                //System.out.println(name() + "::solve, order[" + i + "] orderID = " + orders.get(i).getOrderID()
                //+ " add item " + orders.get(i).getItems().get(j).getItemID() + " weight " + orders.get(i).getItems().get(j).getWeight() + " w = " + w[i]);
            }
        }

        x = new MPVariable[n][n];

        Loader.loadNativeLibraries();
        MPSolver solver = MPSolver.createSolver(String.valueOf(MPSolver.OptimizationProblemType.SCIP_MIXED_INTEGER_PROGRAMMING));

        if (solver == null) {
            System.err.println("Could not create solver SCIP");
            return null;
        }

        for(int i = 0; i < n; i++){
            for(int j = 0; j < n; j++){
                x[i][j] = solver.makeIntVar(0,1,"x[" + i + "," + j + "]");
            }
        }
        MPVariable z = solver.makeIntVar(0,n,"z");
        for(int i = 0; i < n; i++){
            MPConstraint c = solver.makeConstraint(1,1);
            for(int j = 0; j < n; j++)
                c.setCoefficient(x[i][j],1);
        }
        for(int j = 0; j < n; j++){
            MPConstraint c = solver.makeConstraint(0,weightCapacity);
            for(int i = 0; i < n; i++)
                c.setCoefficient(x[i][j],w[i]);
        }
        double INF = solver.infinity();
        for(int j = 0; j < n; j++){
            for(int i = 0; i < n; i++) {
                MPConstraint c = solver.makeConstraint(0, INF);
                c.setCoefficient(z, 1);
                c.setCoefficient(x[i][j],-j);
            }
        }
        MPObjective obj = solver.objective();
        obj.setMinimization();
        obj.setCoefficient(z,1);

        long timeLimit = 1000000;
        solver.setTimeLimit(timeLimit);
        System.out.println("model created , start solving time limit = " + timeLimit);
        final MPSolver.ResultStatus resultStatus = solver.solve();


        if (resultStatus == MPSolver.ResultStatus.OPTIMAL) {
            System.out.println(name() + "::solve, find OPTIMAL!!!, z = " + solver.objective().value());
            printSolutionX();
            int m = (int)solver.objective().value();
            for(int k = 0; k <= m; k++){
                List<Order> cluster = new ArrayList();
                for(int i = 0;i < n; i++){
                    if(x[i][k].solutionValue() > 0){
                        cluster.add(orders.get(i));
                        System.out.println(name() + "::solver, cluster " + k + " ADD order " + i + " weight = " + w[i]);
                    }
                }
                retList.add(cluster);
            }
        }

        return retList;
    }

    public void printSolutionX(){
        System.out.println(name() + "::printSolutionX");
        for(int i = 0;i < n; i++){
            for(int j = 0; j < n; j++){
                if(x[i][j].solutionValue() > 0){
                    System.out.println("X[" + i + "," + j + "] = " + x[i][j].solutionValue());
                }
            }
        }
    }
    public String name(){
        return "OrderPartitionMIPSolver";
    }
}
