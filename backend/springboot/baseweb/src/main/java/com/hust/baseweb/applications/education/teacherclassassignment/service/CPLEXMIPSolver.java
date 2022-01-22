/*

package com.hust.baseweb.applications.education.teacherclassassignment.service;

import com.hust.baseweb.applications.education.teacherclassassignment.model.AlgoTeacherAssignmentIM;
import ilog.concert.IloException;
import ilog.concert.IloIntVar;
import ilog.concert.IloLinearNumExpr;
import ilog.concert.IloNumVar;
import ilog.cplex.IloCplex;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CPLEXMIPSolver extends BaseMIPSolver {

    private int maxOfMinLoad, minOfMaxLoad;  // max, min credit per teacher (from result of phase 1 and 2).

    private int boundOfThisRound; // Bound of total load of teachers in optimal rounds.

    private short[] teachersOfThisRound;

    private ArrayList<Double> optimalSD = new ArrayList<>();

    private List<String> failInOptimalRound;

    // Modelling.
    private double time = 0;

    private IloCplex solver;

    private IloNumVar bound;

    private IloLinearNumExpr[] totalLoadOfTeacher;

    private IloIntVar[] loadEqualBound;

    private IloIntVar[][] x;

    public CPLEXMIPSolver(AlgoTeacherAssignmentIM im) {
        super(im);
        failInOptimalRound = new ArrayList<>();
    }

    @Override
    public void solve() {
        super.preProcessing();
        phase1();
        phase2();
        phase3();
    }

    private void initModelAndSetUpFirst2Constrains() throws IloException {
        // Init
        x = new IloIntVar[numTeachers][numClasses];
        solver = new IloCplex();
        bound = solver.intVar(0, (int) totalLoadOfFeasibleClasses, "bound");

        for (short teacher = 0; teacher < numTeachers; teacher++) {
            for (Short cls : classesTeacherCanTeach[teacher]) {
                if (!infeasibleClasses.contains(cls)) {
                    x[teacher][cls] = solver.intVar(0, 1, "x[" + teacher + "][" + cls + "]");
                }
            }
        }

        // Constrains.
        // Constrain 1: Each class taught by only one teacher.
        IloLinearNumExpr[] flow_in = new IloLinearNumExpr[numClasses];

        for (Short cls = 0; cls < numClasses; cls++) {
            if (!infeasibleClasses.contains(cls)) {
                flow_in[cls] = solver.linearNumExpr();

                for (short i = 0; i < numTeachers; i++) {
                    if (classesTeacherCanTeach[i].contains(cls)) {
                        flow_in[cls].addTerm(1, x[i][cls]);
                    }
                }

                solver.addEq(flow_in[cls], 1, "flow_in[" + cls + "]");
            }
        }

        // Constrain 2: Do not assign pair of conflict classes to the same teacher.
        for (short i = 0; i < numTeachers; i++) {
            for (short[] pair : pairOfConflictClasses) {
                if (classesTeacherCanTeach[i].containsAll(Arrays.asList(pair[0], pair[1]))) {
                    solver.addLe(
                        solver.sum(
                            solver.prod(1, x[i][pair[0]]),
                            solver.prod(1, x[i][pair[1]])),
                        1, "conflict_x[" + i + "][" + pair[0] + "]_x[" + i + "][" + pair[1] + "]");
                }
            }
        }
    }

    public void phase1() {
        try {
            initModelAndSetUpFirst2Constrains();

            // Constrain 3: Calculate total load of a teacher: totalLoad[i] + preAssignedLoad <= bound
            totalLoadOfTeacher = new IloLinearNumExpr[numTeachers];

            for (short i = 0; i < numTeachers; i++) {
                totalLoadOfTeacher[i] = solver.linearNumExpr();

                for (Short cls : classesTeacherCanTeach[i]) {
                    if (!infeasibleClasses.contains(cls)) {
                        totalLoadOfTeacher[i].addTerm(loadOfClass[cls] * 1.0, x[i][cls]);
                    }
                }

                totalLoadOfTeacher[i].addTerm(bound, -1);

                solver.addLe(
                    totalLoadOfTeacher[i],
                    -(int) teachers[i].getPrespecifiedHourLoad() * 60,
                    "totalLoadOfTeacher[" + i + "]");
            }

            // Objective function.
            solver.addMinimize(bound);

            // Solves.
            long time = System.currentTimeMillis();
            solver.solve();
            time = System.currentTimeMillis() - time;

            // Analyse solution.
            minOfMaxLoad = (int) (solver.getValue(bound) + 0.25);
            this.time += 1.0 * time / 1000;

            System.out.println("MAX LOAD PER TEACHER: " + (int) (solver.getValue(bound) + 0.25));

            // Releases resources.
            solver.end();
        } catch (IloException e) {
            e.printStackTrace();
        }
    }

    public void phase2() {
        try {
            initModelAndSetUpFirst2Constrains();

            // Constrain 3: Calculate total load of a teacher: bound <= totalLoad[i] + preAssignedLoad <= minOfMaxLoad
            totalLoadOfTeacher = new IloLinearNumExpr[numTeachers];
            int preAssignedLoad;

            for (short i = 0; i < numTeachers; i++) {
                totalLoadOfTeacher[i] = solver.linearNumExpr();
                preAssignedLoad = (int) teachers[i].getPrespecifiedHourLoad() * 60;

                for (Short cls : classesTeacherCanTeach[i]) {
                    if (!infeasibleClasses.contains(cls)) {
                        totalLoadOfTeacher[i].addTerm(loadOfClass[cls] * 1.0, x[i][cls]);
                    }
                }

                solver.addGe(
                    solver.sum(solver.prod(totalLoadOfTeacher[i], 1), solver.prod(bound, -1)),
                    -preAssignedLoad,
                    "totalLoadOfTeacher[" + i + "]_lhs");

                solver.addLe(
                    totalLoadOfTeacher[i],
                    minOfMaxLoad - preAssignedLoad,
                    "totalLoadOfTeacher[" + i + "]_rhs");
            }

            // Objective function.
            solver.addMaximize(bound);

            // Solves.
            long time = System.currentTimeMillis();
            solver.solve();
            time = System.currentTimeMillis() - time;

            // Analyse solution.
            maxOfMinLoad = (int) (solver.getValue(bound) + 0.25);
            this.time += 1.0 * time / 1000;

            System.out.println("MIN LOAD PER TEACHER: " + (int) (solver.getValue(bound) + 0.25));

            // Releases resources.
            solver.end();
        } catch (IloException e) {
            e.printStackTrace();
        }
    }

    public void phase3() {
        try {
            int convergencePoint = (int) averageLoad;

            boundOfThisRound = minOfMaxLoad;
            while (boundOfThisRound > convergencePoint) {
                optimalRound(RHS);
            }

            boundOfThisRound = maxOfMinLoad;
            while (boundOfThisRound <= convergencePoint) {
                optimalRound(LHS);
            }

            if (isValidSolution()) {
                System.out.println("\nEVERYTHING IS OK!");

                // Calculate SD.
                numTeachers = (short) teachers.length;
                double std = 0;

                for (short i = 0; i < numTeachers; i++) {
                    std += (optimizedTeachers[i] - averageLoad) * (optimizedTeachers[i] - averageLoad);
                }

                optimalSD.add(Math.sqrt(std / numTeachers));
            }

            for (short i = 0, bound = (short) optimalSD.size(); i < bound; i++) {
                Double sd = optimalSD.get(i);
                System.out.println("SD OF ROUND " + i + " = " + sd);
            }

            System.out.println("TOTAL TIME = " + time);

            for (String s : failInOptimalRound) {
                System.out.println(s);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void optimalRound(String mode) throws Exception {
        teachersOfThisRound = new short[numTeachers]; // Teachers which are not optimized.

        short idx = 0;
        for (short i = 0; i < optimizedTeachers.length; i++) {
            if (-1 == optimizedTeachers[i]) {
                teachersOfThisRound[idx++] = i;
            }
        }

        try {
            // Init.
            x = new IloIntVar[numTeachers][numClasses];
            solver = new IloCplex();

            for (short i = 0; i < numTeachers; i++) {
                for (Short cls : classesTeacherCanTeach[teachersOfThisRound[i]]) {
                    if (!infeasibleClasses.contains(cls)) {
                        if (!optimizedClasses[cls]) {
                            x[i][cls] = solver.intVar(0, 1, "x[" + i + "][" + cls + "]");
                        }
                    }
                }
            }

            // Constrains.
            // Constrain 1: Each class taught by only one teacher.
            IloLinearNumExpr[] flow_in = new IloLinearNumExpr[numClasses];

            for (Short cls = 0; cls < numClasses; cls++) {
                if (!infeasibleClasses.contains(cls)) {
                    if (!optimizedClasses[cls]) {
                        flow_in[cls] = solver.linearNumExpr();

                        for (short i = 0; i < numTeachers; i++) {
                            if (classesTeacherCanTeach[teachersOfThisRound[i]].contains(cls)) {
                                flow_in[cls].addTerm(1, x[i][cls]);
                            }
                        }

                        solver.addEq(flow_in[cls], 1, "flow_in[" + cls + "]");
                    }
                }
            }

            // Constrain 2: A teacher not assigned to pair of conflict classes.
            for (short i = 0; i < numTeachers; i++) {
                for (short[] pair : pairOfConflictClasses) {
                    if (!optimizedClasses[pair[0]] &&
                        !optimizedClasses[pair[1]] &&
                        classesTeacherCanTeach[teachersOfThisRound[i]].containsAll(Arrays.asList(pair[0], pair[1]))) {

                        solver.addLe(
                            solver.sum(
                                solver.prod(1, x[i][pair[0]]),
                                solver.prod(1, x[i][pair[1]])),
                            1,
                            "conflict_x[" + i + "][" + pair[0] + "]_x[" + i + "][" + pair[1] + "]");
                    }
                }
            }

            // Constrain 3: Calculate total load of a teacher.
            totalLoadOfTeacher = new IloLinearNumExpr[numTeachers];
            loadEqualBound = new IloIntVar[numTeachers];
            int preAssignedLoad;

            for (short i = 0; i < numTeachers; i++) {
                totalLoadOfTeacher[i] = solver.linearNumExpr();
                loadEqualBound[i] = solver.intVar(0, 1, "loadEqualBound[" + i + "]");


                for (Short cls : classesTeacherCanTeach[teachersOfThisRound[i]]) {
                    if (!infeasibleClasses.contains(cls)) {
                        if (!optimizedClasses[cls]) {
                            totalLoadOfTeacher[i].addTerm(loadOfClass[cls] * 1.0, x[i][cls]);
                        }
                    }
                }
            }

            if (mode.equals(RHS)) {
                for (short i = 0; i < numTeachers; i++) {
                    preAssignedLoad = (int) (teachers[teachersOfThisRound[i]].getPrespecifiedHourLoad() * 60);

                    // maxOfMinLoad <= totalLoadOfTeacher[i] + preAssignedLoad <= boundOfThisRound
                    solver.addLe(
                        totalLoadOfTeacher[i],
                        boundOfThisRound - preAssignedLoad,
                        "totalLoadOfTeacher[" + i + "]_rhs");

                    solver.addGe(
                        totalLoadOfTeacher[i],
                        maxOfMinLoad - preAssignedLoad,
                        "totalLoadOfTeacher[" + i + "]_lhs");

                    // totalCreditOfTeacher[i] + preAssignedLoad = target --> loadEqualTarget[i] = 1.
                    // l[i] + M*(t[i] + pre - b) <= 1, (t[i] + pre <= b)
                    solver.addLe(
                        solver.sum(
                            solver.prod(1, loadEqualBound[i]),
                            solver.prod(BIG_M, totalLoadOfTeacher[i])),
                        1 + BIG_M * boundOfThisRound - BIG_M * preAssignedLoad);

                    // l[i] + M*(b - t[i] - pre) >= 1, (t[i] + pre <= b)
                    solver.addGe(
                        solver.sum(
                            solver.prod(1, loadEqualBound[i]),
                            solver.prod(-BIG_M, totalLoadOfTeacher[i])),
                        1 - BIG_M * boundOfThisRound + BIG_M * preAssignedLoad);
                }
            } else {
                for (short i = 0; i < numTeachers; i++) {
                    preAssignedLoad = (int) (teachers[teachersOfThisRound[i]].getPrespecifiedHourLoad() * 60);

                    // boundOfThisRound <= totalLoadOfTeacher[i] + preAssignedLoad <= averageLoad
                    solver.addLe(
                        totalLoadOfTeacher[i],
                        averageLoad - preAssignedLoad,
                        "totalLoadOfTeacher[" + i + "]_rhs");

                    solver.addGe(
                        totalLoadOfTeacher[i],
                        boundOfThisRound - preAssignedLoad,
                        "totalLoadOfTeacher[" + i + "]_lhs");

                    // totalCreditOfTeacher[i] + preAssignedLoad = target --> loadEqualTarget[i] = 1.
                    // l[i] + M*(t[i] + pre - b) >= 1, (t[i] + pre >= b)
                    solver.addGe(
                        solver.sum(
                            solver.prod(1, loadEqualBound[i]),
                            solver.prod(BIG_M, totalLoadOfTeacher[i])),
                        1 + BIG_M * boundOfThisRound - BIG_M * preAssignedLoad);

                    // l[i] + M*(b - t[i] - pre) <= 1, (t[i] + pre >= b)
                    solver.addLe(
                        solver.sum(
                            solver.prod(1, loadEqualBound[i]),
                            solver.prod(-BIG_M, totalLoadOfTeacher[i])),
                        1 - BIG_M * boundOfThisRound + BIG_M * preAssignedLoad);
                }
            }

            // Objective function.
            solver.addMinimize(solver.sum(loadEqualBound));

            // Solves.
            System.out.println("START NEXT ROUND");
            System.out.println("---------------------------------------------------------------------------------");

            long time = System.currentTimeMillis();
            solver.solve();
            time = System.currentTimeMillis() - time;

            this.time += 1.0 * time / 1000;

            // Analyse solution.
            short optimalValue = (short) (solver.getObjValue() + 0.25);
            analyseSolution(mode);

            if (optimalValue != teachersOfThisRound.length - numTeachers) {
                failInOptimalRound.add("SOLVER IS FAILURE, OPTIMAL = " +
                                       optimalValue +
                                       ", BUT NUMBER OF OPTIMIZED TEACHER = " +
                                       (teachersOfThisRound.length - numTeachers) + "IN ROUND " + optimalSD.size());
                throw new Exception("FAIL");
            }

            // Releases resources.
            solver.end();
        } catch (IloException e) {
            e.printStackTrace();
        }
    }

    public void analyseSolution(String mode) throws IloException {
        System.out.println("Target = " +
                           boundOfThisRound +
                           ", the smallest number of teacher whose total load equal target = " +
                           solver.getObjValue());
        System.out.println("Optimal solution:");
        System.out.println("          Teacher          Classes, (total load)");

        int boundOfNextRound;

        if (mode.equals(RHS)) {
            boundOfNextRound = -1;
        } else {
            boundOfNextRound = (int) averageLoad + 2; // To prevent infinity loop.
        }

        int[] totalLoadOfTeacherThisSolution = new int[optimizedTeachers.length];
        short numOptimizedTeachersThisRound = 0;

        for (short i = 0; i < optimizedTeachers.length; i++) {
            if (-1 != optimizedTeachers[i]) {
                totalLoadOfTeacherThisSolution[i] = optimizedTeachers[i];
            }
        }

        for (short i = 0; i < numTeachers; i++) {
            System.out.print("\n             " + teachersOfThisRound[i] + "             ");

            int totalLoad = (int) (solver.getValue(totalLoadOfTeacher[i]) + 0.25) +
                            (int) teachers[teachersOfThisRound[i]].getPrespecifiedHourLoad() * 60;

            totalLoadOfTeacherThisSolution[teachersOfThisRound[i]] = totalLoad;

            if (totalLoad == boundOfThisRound) {
                numOptimizedTeachersThisRound++;
                optimizedTeachers[teachersOfThisRound[i]] = boundOfThisRound;

                for (Short cls : classesTeacherCanTeach[teachersOfThisRound[i]]) {
                    if (!infeasibleClasses.contains(cls)) {
                        if (!optimizedClasses[cls] && solver.getValue(x[i][cls]) > 0.75) {

                            optimizedClasses[cls] = true;
                            optimalClassesOfTeacher[teachersOfThisRound[i]].add(cls);

                            System.out.print(cls + ", ");
                        }
                    }
                }
            } else {
                if (mode.equals(RHS)) {
                    boundOfNextRound = Math.max(boundOfNextRound, totalLoad);
                } else {
                    boundOfNextRound = Math.min(boundOfNextRound, totalLoad);
                }

                // Print classes assigned for the teacher.
                for (Short cls : classesTeacherCanTeach[teachersOfThisRound[i]]) {
                    if (!infeasibleClasses.contains(cls)) {
                        if (!optimizedClasses[cls] && solver.getValue(x[i][cls]) > 0.75) {
                            System.out.print(cls + ", ");
                        }
                    }
                }
            }

            boolean isEqual = solver.getValue(loadEqualBound[i]) > 0.75;
            System.out.println("(lEB = " +
                               solver.getValue(loadEqualBound[i]) +
                               ", totalLoad = " +
                               totalLoad +
                               ", totalLoad == bTR: " +
                               isEqual +
                               ")");
        }

        // Calculate SD.
        short len = (short) totalLoadOfTeacherThisSolution.length;
        double std = 0;

        for (short i = 0; i < len; i++) {
            std += (totalLoadOfTeacherThisSolution[i] - averageLoad) *
                   (totalLoadOfTeacherThisSolution[i] - averageLoad);
        }

        optimalSD.add(Math.sqrt(std / len));

        boundOfThisRound = boundOfNextRound;
        numTeachers -= numOptimizedTeachersThisRound;

        System.out.println("---------------------------------------------------------------------------------");
        System.out.println("BOUND OF NEXT ROUND = " +
                           boundOfNextRound +
                           ", NUMBER OF TEACHERS = " +
                           numTeachers +
                           " WITH MODE = " +
                           mode);
        System.out.println("---------------------------------------------------------------------------------");
    }
}

*/
