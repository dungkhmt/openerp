package com.hust.baseweb.applications.education.teacherclassassignment.service;

import com.google.ortools.Loader;
import com.google.ortools.linearsolver.MPConstraint;
import com.google.ortools.linearsolver.MPObjective;
import com.google.ortools.linearsolver.MPSolver;
import com.google.ortools.linearsolver.MPVariable;
import com.hust.baseweb.applications.education.teacherclassassignment.model.AlgoTeacherAssignmentIM;

import java.util.ArrayList;
import java.util.Arrays;

public class ORToolsMIPSolver extends BaseMIPSolver {

    private int minOfMaxLoad, maxOfMinLoad; // Max, min load per teacher (from result of phase 1 and 2).

    private int boundOfThisRound; // Bound of total load of teacher in optimal rounds.

    private short[] teachersOfThisRound; // Teachers in an optimal round who not optimized.

    private ArrayList<Double> optimalSD = new ArrayList<>(); // To tracking SD in each optimal round.

    // Modeling.
    private double time = 0;

    private MPSolver solver;

    private MPVariable bound; // Objective in phase 1 and 2, max(bound) = totalLoadOfFeasibleClasses.

    private MPVariable[] totalLoadOfTeacher; // Calculate total load of the teacher in optimal rounds.

    private MPVariable[] loadEqualBound; // Determine teachers have load equals bound in optimal rounds.

    private MPVariable[][] x;

    public ORToolsMIPSolver(AlgoTeacherAssignmentIM im) {
        super(im);
    }

    @Override
    public void solve() {
        super.preProcessing();
        phase1();
        phase2();
        phase3();
    }

    private void initModelAndSetUpFirst2Constrains() {
        // Init
        x = new MPVariable[numTeachers][numClasses];

        Loader.loadNativeLibraries();
        solver = MPSolver.createSolver(String.valueOf(MPSolver.OptimizationProblemType.SCIP_MIXED_INTEGER_PROGRAMMING));

        if (solver == null) {
            System.err.println("Could not create solver SCIP");
            return;
        }

        bound = solver.makeIntVar(0, totalLoadOfFeasibleClasses, "minOfMaxLoad");

        for (short teacher = 0; teacher < numTeachers; teacher++) {
            for (Short cls : classesTeacherCanTeach[teacher]) {
                if (!infeasibleClasses.contains(cls)) {
                    x[teacher][cls] = solver.makeIntVar(0, 1, "x[" + teacher + "][" + cls + "]");
                }
            }
        }

        // Constrains.
        // Constrain 1: Each class taught by only one teacher.
        for (Short cls = 0; cls < numClasses; cls++) {
            if (!infeasibleClasses.contains(cls)) {
                MPConstraint flow_in = solver.makeConstraint(1, 1, "flow_in[" + cls + "]");

                for (short i = 0; i < numTeachers; i++) {
                    if (classesTeacherCanTeach[i].contains(cls)) {
                        flow_in.setCoefficient(x[i][cls], 1);
                    }
                }
            }
        }

        // Constrain 2: Do not assign pair of conflict classes to the same teacher.
        for (short i = 0; i < numTeachers; i++) {
            for (short[] pair : pairOfConflictClasses) {
                if (classesTeacherCanTeach[i].containsAll(Arrays.asList(pair[0], pair[1]))) {
                    MPConstraint conflict = solver.makeConstraint(
                        0,
                        1,
                        "conflict_x[" + i + "][" + pair[0] + "]_x[" + i + "][" + pair[1] + "]");

                    conflict.setCoefficient(x[i][pair[0]], 1);
                    conflict.setCoefficient(x[i][pair[1]], 1);
                }
            }
        }
    }

    private void phase1() {
        initModelAndSetUpFirst2Constrains();

        // Constrain 3: Calculate total load of a teacher: - (bound = totalLoadOfFeasibleClasses) - pre <= totalLoad[i] - bound <= -pre
        MPConstraint[] totalLoadOfTeacher = new MPConstraint[numTeachers];
        int preAssignedLoad;

        for (short i = 0; i < numTeachers; i++) {
            preAssignedLoad = (int) (teachers[i].getPrespecifiedHourLoad() * 60);

            totalLoadOfTeacher[i] = solver.makeConstraint(
                -totalLoadOfFeasibleClasses - preAssignedLoad,
                -preAssignedLoad,
                "totalLoadOfTeacher[" + i + "]");

            totalLoadOfTeacher[i].setCoefficient(bound, -1);

            for (Short cls : classesTeacherCanTeach[i]) {
                // or if x[i][j] != null
                if (!infeasibleClasses.contains(cls)) {
                    totalLoadOfTeacher[i].setCoefficient(x[i][cls], loadOfClass[cls]);
                }
            }
        }

        // Objective function.
        MPObjective objective = solver.objective();
        objective.setCoefficient(bound, 1);
        objective.setMinimization();

        // Solves.
        final MPSolver.ResultStatus resultStatus = solver.solve();

        // Analyse solution.
        if (resultStatus == MPSolver.ResultStatus.OPTIMAL) {
            minOfMaxLoad = (int) (objective.value() + 0.25);
            time += 1.0 * solver.wallTime() / 1000;

            System.out.println("Problem solved in " + solver.iterations() + " iterations");
            System.out.println("Problem solved in " + solver.nodes() + " branch-and-bound nodes");
            System.out.println("MAX LOAD PER TEACHER: " + minOfMaxLoad);
        } else {
            System.err.println("The problem does not have an optimal solution!");
        }

        // Releases resources.
        solver.clear();
    }

    private void phase2() {
        initModelAndSetUpFirst2Constrains();

        // Constrain 3: Calculate total load of a teacher: - pre <= totalLoad[i] - bound <= minOfMaxLoad - pre - (bound = 0)
        int preAssignedLoad;

        for (short i = 0; i < numTeachers; i++) {
            preAssignedLoad = (int) (teachers[i].getPrespecifiedHourLoad() * 60);

            MPConstraint totalLoadOfTeacher = solver.makeConstraint(
                -preAssignedLoad,
                minOfMaxLoad - preAssignedLoad,
                "totalLoadOfTeacher[" + i + "]");

            totalLoadOfTeacher.setCoefficient(bound, -1);

            for (Short cls : classesTeacherCanTeach[i]) {
                if (!infeasibleClasses.contains(cls)) {
                    totalLoadOfTeacher.setCoefficient(x[i][cls], loadOfClass[cls]);
                }
            }
        }

        // Objective function.
        MPObjective objective = solver.objective();
        objective.setCoefficient(bound, 1);
        objective.setMaximization();

        // Solves.
        final MPSolver.ResultStatus resultStatus = solver.solve();

        // Analyse solution.
        if (resultStatus == MPSolver.ResultStatus.OPTIMAL) {
            maxOfMinLoad = (int) (objective.value() + 0.25);
            time += 1.0 * solver.wallTime() / 1000;

            System.out.println("Problem solved in " + solver.iterations() + " iterations");
            System.out.println("Problem solved in " + solver.nodes() + " branch-and-bound nodes");
            System.out.println("MIN LOAD PER TEACHER: " + maxOfMinLoad);
        } else {
            System.err.println("The problem does not have an optimal solution!");
        }

        // Releases resources.
        solver.clear();
    }

    private void phase3() {
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
    }

    private void optimalRound(String mode) {
        teachersOfThisRound = new short[numTeachers]; // Teachers which are not optimized.

        short idx = 0;
        for (short i = 0; i < optimizedTeachers.length; i++) {
            if (-1 == optimizedTeachers[i]) {
                teachersOfThisRound[idx++] = i;
            }
        }

        // Init.
        Loader.loadNativeLibraries();
        solver = MPSolver.createSolver(String.valueOf(MPSolver.OptimizationProblemType.SCIP_MIXED_INTEGER_PROGRAMMING));

        if (solver == null) {
            System.out.println("Could not create solver SCIP");
            return;
        }

        x = new MPVariable[numTeachers][numClasses];

        for (short i = 0; i < numTeachers; i++) {
            for (Short cls : classesTeacherCanTeach[teachersOfThisRound[i]]) {
                if (!infeasibleClasses.contains(cls)) {
                    if (!optimizedClasses[cls]) {
                        x[i][cls] = solver.makeIntVar(0, 1, "x[" + i + "][" + cls + "]");
                    }
                }
            }
        }

        // Constrains.
        // Constrain 1: Each class taught by only one teacher.
        for (Short cls = 0; cls < numClasses; cls++) {
            if (!infeasibleClasses.contains(cls)) {
                if (!optimizedClasses[cls]) {
                    MPConstraint flow_in = solver.makeConstraint(1, 1, "flow_in[" + cls + "]");

                    for (short i = 0; i < numTeachers; i++) {
                        if (classesTeacherCanTeach[teachersOfThisRound[i]].contains(cls)) {
                            flow_in.setCoefficient(x[i][cls], 1);
                        }
                    }
                }
            }
        }

        // Constrain 2: A teacher not assigned to pair of conflict classes.
        for (short i = 0; i < numTeachers; i++) {
            for (short[] pair : pairOfConflictClasses) {
                if (!optimizedClasses[pair[0]] &&
                    !optimizedClasses[pair[1]] &&
                    classesTeacherCanTeach[teachersOfThisRound[i]].containsAll(Arrays.asList(pair[0], pair[1]))) {

                    MPConstraint conflict = solver.makeConstraint(
                        0,
                        1,
                        "conflict_x[" + i + "][" + pair[0] + "]_x[" + i + "][" + pair[1] + "]");

                    conflict.setCoefficient(x[i][pair[0]], 1);
                    conflict.setCoefficient(x[i][pair[1]], 1);
                }
            }
        }

        // Constrain 3: Calculate total load of a teacher.
        totalLoadOfTeacher = new MPVariable[numTeachers];
        loadEqualBound = new MPVariable[numTeachers];
        int preAssignedLoad;

        if (mode.equals(RHS)) {
            for (short i = 0; i < numTeachers; i++) {
                preAssignedLoad = (int) (teachers[teachersOfThisRound[i]].getPrespecifiedHourLoad() * 60);

                MPConstraint calcTotalLoadOfTeacher = solver.makeConstraint(
                    -preAssignedLoad,
                    -preAssignedLoad,
                    "calcTotalLoadOfTeacher[" + i + "]");

                loadEqualBound[i] = solver.makeIntVar(0, 1, "loadEqualTarget[" + i + "]");
                totalLoadOfTeacher[i] = solver.makeIntVar(
                    maxOfMinLoad,
                    boundOfThisRound,
                    "totalLoadOfTeacher[" + i + "]");

                calcTotalLoadOfTeacher.setCoefficient(totalLoadOfTeacher[i], -1);

                for (Short cls : classesTeacherCanTeach[teachersOfThisRound[i]]) {
                    if (!infeasibleClasses.contains(cls)) {
                        if (!optimizedClasses[cls]) {
                            calcTotalLoadOfTeacher.setCoefficient(x[i][cls], loadOfClass[cls]);
                        }
                    }
                }

                // totalLoadOfTeacher[i] = target --> loadEqualTarget[i] = 1, = 0 otherwise.
                MPConstraint constraintRHS = solver.makeConstraint(
                    Double.NEGATIVE_INFINITY,
                    1 + boundOfThisRound * BIG_M,
                    "constraintRHS[" + i + "]");

                MPConstraint constraintLHS = solver.makeConstraint(
                    1 - boundOfThisRound * BIG_M,
                    Double.POSITIVE_INFINITY,
                    "constraintLHS[" + i + "]");

                // l[i] + M*(t[i] - b) <= 1, (t[i] <= b)
                constraintRHS.setCoefficient(loadEqualBound[i], 1);
                constraintRHS.setCoefficient(totalLoadOfTeacher[i], BIG_M);

                // l[i] + M*(b - t[i]) >= 1, (t[i] <= b)
                constraintLHS.setCoefficient(loadEqualBound[i], 1);
                constraintLHS.setCoefficient(totalLoadOfTeacher[i], -BIG_M);
            }
        } else {
            for (short i = 0; i < numTeachers; i++) {
                preAssignedLoad = (int) (teachers[teachersOfThisRound[i]].getPrespecifiedHourLoad() * 60);

                MPConstraint calcTotalLoadOfTeacher = solver.makeConstraint(
                    -preAssignedLoad,
                    -preAssignedLoad,
                    "calcTotalLoadOfTeacher[" + i + "]");

                loadEqualBound[i] = solver.makeIntVar(0, 1, "loadEqualTarget[" + i + "]");
                totalLoadOfTeacher[i] = solver.makeIntVar(
                    boundOfThisRound,
                    averageLoad,
                    "totalLoadOfTeacher[" + i + "]");

                calcTotalLoadOfTeacher.setCoefficient(totalLoadOfTeacher[i], -1);

                for (Short cls : classesTeacherCanTeach[teachersOfThisRound[i]]) {
                    if (!infeasibleClasses.contains(cls)) {
                        if (!optimizedClasses[cls]) {
                            calcTotalLoadOfTeacher.setCoefficient(x[i][cls], loadOfClass[cls]);
                        }
                    }
                }

                // totalLoadOfTeacher[i] = target --> loadEqualTarget[i] = 1, = 0 otherwise.
                MPConstraint constraintLHS = solver.makeConstraint(
                    1 + boundOfThisRound * BIG_M,
                    Double.POSITIVE_INFINITY,
                    "constraintLHS[" + i + "]");

                MPConstraint constraintRHS = solver.makeConstraint(
                    Double.NEGATIVE_INFINITY,
                    1 - boundOfThisRound * BIG_M,
                    "constraintRHS[" + i + "]");

                // l[i] + M*(t[i] - b) >= 1, (t[i] >= b)
                constraintLHS.setCoefficient(loadEqualBound[i], 1);
                constraintLHS.setCoefficient(totalLoadOfTeacher[i], BIG_M);

                // l[i] + M*(b - t[i]) <= 1, (t[i] >= b)
                constraintRHS.setCoefficient(loadEqualBound[i], 1);
                constraintRHS.setCoefficient(totalLoadOfTeacher[i], -BIG_M);
            }
        }

        // Objective function.
        MPObjective objective = solver.objective();

        for (short i = 0; i < loadEqualBound.length; i++) {
            objective.setCoefficient(loadEqualBound[i], 1);
        }

        objective.setMinimization();

        // Solves.
        System.out.println("START NEXT ROUND");
        System.out.println("---------------------------------------------------------------------------------");
        final MPSolver.ResultStatus resultStatus = solver.solve();

        if (resultStatus == MPSolver.ResultStatus.OPTIMAL) {
            short optimalValue = (short) (objective.value() + 0.25);

            System.out.println("Problem solved in " + solver.iterations() + " iterations");
            System.out.println("Problem solved in " + solver.nodes() + " branch-and-bound nodes");
            System.out.println("Target = " + boundOfThisRound +
                               ", the smallest number of teacher whose total load equal target = " + optimalValue);
            System.out.println("Optimal solution:");
            System.out.println("          Teacher          Classes, (total load)");

            time += 1.0 * solver.wallTime() / 1000;
            analyseSolution(mode);

            if (optimalValue != teachersOfThisRound.length - numTeachers) {
                System.err.println("SOLVER IS FAILURE!");
            }
        } else {
            System.err.println("The problem does not have an optimal solution!");
        }

        // Releases resources.
        solver.clear();
    }

    private void analyseSolution(String mode) {
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

            int totalLoad = (int) (totalLoadOfTeacher[i].solutionValue() + 0.25) +
                            (int) teachers[teachersOfThisRound[i]].getPrespecifiedHourLoad() * 60;

            totalLoadOfTeacherThisSolution[teachersOfThisRound[i]] = totalLoad;

            if (totalLoad == boundOfThisRound) {
                numOptimizedTeachersThisRound++;
                optimizedTeachers[teachersOfThisRound[i]] = boundOfThisRound;

                for (Short cls : classesTeacherCanTeach[teachersOfThisRound[i]]) {
                    if (!infeasibleClasses.contains(cls)) {
                        if (!optimizedClasses[cls] && x[i][cls].solutionValue() > 0.75) {

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
                        if (!optimizedClasses[cls] && x[i][cls].solutionValue() > 0.75) {
                            System.out.print(cls + ", ");
                        }
                    }
                }
            }

            boolean isEqual = loadEqualBound[i].solutionValue() > 0.75;
            System.out.println("(lEB = " +
                               loadEqualBound[i].solutionValue() +
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
