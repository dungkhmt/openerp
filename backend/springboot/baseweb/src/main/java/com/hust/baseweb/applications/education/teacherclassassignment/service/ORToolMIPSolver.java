package com.hust.baseweb.applications.education.teacherclassassignment.service;

import java.io.PrintWriter;
import java.util.HashSet;

public class ORToolMIPSolver {
    private MapDataInput I;
    private MaxAssignedClassConstraintORToolMIPSolver maxAssignedClassConstraintORToolMIPSolver;
    private MaxPriorityClassAssignmentORToolMIPSolver maxPriorityClassAssignmentORToolMIPSolver;
    private MinWorkingDaysClassAssignmentORToolMIPSolver minWorkingDaysClassAssignmentORToolMIPSolver;

    private int[] assignment;
    private HashSet<Integer> notAssigned;
    public ORToolMIPSolver(MapDataInput I){
        this.I = I;
        maxAssignedClassConstraintORToolMIPSolver = new MaxAssignedClassConstraintORToolMIPSolver(I);
        maxPriorityClassAssignmentORToolMIPSolver = new MaxPriorityClassAssignmentORToolMIPSolver(I);
        minWorkingDaysClassAssignmentORToolMIPSolver = new MinWorkingDaysClassAssignmentORToolMIPSolver(I);
    }
    public String name(){
        return "ORToolMIPSolver";
    }
    public boolean testSolveOffline(String fo, int timeLimit){
        System.out.println(name() + "::testSolveOffline, fo = " + fo);
        maxAssignedClassConstraintORToolMIPSolver.setTimeLimit(timeLimit);
        boolean ok = maxAssignedClassConstraintORToolMIPSolver.solve();
        assignment = maxAssignedClassConstraintORToolMIPSolver.getSolutionAssignment();
        notAssigned= maxAssignedClassConstraintORToolMIPSolver.getNotAssignedClass();
        try{
            PrintWriter out = new PrintWriter(fo);
            int ans = 0;
            for(int i = 0; i < assignment.length; i++) {
                out.println(i + " " + assignment[i]);
                if(assignment[i] > -1) ans += 1;
            }
            out.println(ans);
            out.close();
        }catch(Exception e){
            e.printStackTrace();
        }
        return ok;
    }
    public boolean solve(String solver){
        System.out.println(name() + "::solve, solver = " + solver);
        boolean ok = maxAssignedClassConstraintORToolMIPSolver.solve();
        assignment = maxAssignedClassConstraintORToolMIPSolver.getSolutionAssignment();
        notAssigned= maxAssignedClassConstraintORToolMIPSolver.getNotAssignedClass();
        System.out.println("PHASE 1: maxAssignedClassConstraintORToolMIPSolver, priority = "
                           + maxAssignedClassConstraintORToolMIPSolver.getObjectivePriority()
        + " nbAssignedClass = " + maxAssignedClassConstraintORToolMIPSolver.getObjectiveNumberAssignedClass()
        );
        int nbAssignedClasses = I.n - notAssigned.size();

        //if(true) return ok;
        if(solver.equals("PRIORITY")) {
            System.out.println(name() + "::solve, solver = " + solver + " start priority solver");

            maxPriorityClassAssignmentORToolMIPSolver.setNbAssignedClasses(nbAssignedClasses);


            ok = maxPriorityClassAssignmentORToolMIPSolver.solve();
            assignment = maxPriorityClassAssignmentORToolMIPSolver.getSolutionAssignment();
            notAssigned = maxPriorityClassAssignmentORToolMIPSolver.getNotAssignedClass();

            System.out.println("PHASE 2: maxPriorityClassAssignmentORToolMIPSolver, priority = "
                               +
                               maxPriorityClassAssignmentORToolMIPSolver.getObjectivePriority()
                               +
                               " nbAssignedClass = " +
                               maxPriorityClassAssignmentORToolMIPSolver.getObjectiveNumberAssignedClass()
            );
        }
        else if(solver.equals("WORKDAYS")) {
            System.out.println(name() + "::solve, solver = " + solver + " start work days solver");
                minWorkingDaysClassAssignmentORToolMIPSolver.setNbAssignedClasses(nbAssignedClasses);
                ok = minWorkingDaysClassAssignmentORToolMIPSolver.solve();
                assignment = minWorkingDaysClassAssignmentORToolMIPSolver.getSolutionAssignment();
                notAssigned = minWorkingDaysClassAssignmentORToolMIPSolver.getNotAssignedClass();

                System.out.println("PHASE 3: minWorkingDaysClassAssignmentORToolMIPSolver, objectiveMinWorkingDays = " +
                                   minWorkingDaysClassAssignmentORToolMIPSolver.getObjectiveMinWorkingDays());
            }
        return ok;
    }
    public int[] getSolutionAssignment() {
        return assignment;
    }
    public HashSet<Integer> getNotAssignedClass(){
        return notAssigned;
    }


    public static void main(String[] args){
        System.out.println("ORToolMIPSolver start....");
        MapDataInput input = new MapDataInput();
        String fi = "D:/tmp/data-bca/3.txt";
        String fo = "D:/tmp/data-bca/3-out.txt";
        //String fi = "D:/tmp/data-bca/input/bca-1.txt";
        //input.genRandom(fi,500,50);
        input.loadDataFromPlanFile(fi);
        ORToolMIPSolver solver= new ORToolMIPSolver(input);
        //solver.solve("MAXCLASS");
        boolean ok = solver.testSolveOffline(fo,1000);

        input.checkSolution(fi,fo);
    }
}
