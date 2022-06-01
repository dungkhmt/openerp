package com.hust.baseweb.applications.education.teacherclassassignment.service.algorithm.solver.ortools;

import com.google.ortools.Loader;
import com.google.ortools.linearsolver.MPConstraint;
import com.google.ortools.linearsolver.MPObjective;
import com.google.ortools.linearsolver.MPSolver;
import com.google.ortools.linearsolver.MPVariable;
import com.hust.baseweb.applications.education.teacherclassassignment.service.MapDataInput;
import lombok.extern.log4j.Log4j2;

import java.util.Arrays;

/**
 *
 */
@Log4j2
public class LoadBalancingDurationConsiderationSolver extends MaxAssignedClassConstraintORToolMIPSolver {

    // Additional data parameters
    private int numAssignedClasses;

    // MIP modelling
    private MPVariable objectiveLoadBalancing;
    private MPVariable[] t; // use for linearing constraint
//    private MPVariable[] u; // use for linearing constraint
//    private MPVariable min;

    public LoadBalancingDurationConsiderationSolver(MapDataInput input) {
        super(input);
    }

    /**
     * OK
     *
     * @param numAssignedClasses
     */
    public void setNumAssignedClasses(int numAssignedClasses) {
        this.numAssignedClasses = numAssignedClasses;
    }

    /**
     * OK. Overriding
     *
     * @return
     */
    public double getObjectiveValue() {
        return objectiveLoadBalancing.solutionValue();
    }

    private void createSolverAndVariables() {
        Loader.loadNativeLibraries();
        // Create the linear solver with the SCIP backend.
        solver = MPSolver.createSolver("SCIP");
        if (null == solver) {
            log.error("Could not create solver SCIP");
            return;
        }

        log.info("createSolverAndVariables, n = " + n + " m = " + m);

        x = new MPVariable[m][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (!D[i].contains(j)) {// teacher j cannot be assigned to class i
                    x[j][i] = solver.makeIntVar(0, 0, "x[" + j + "," + i + "]");
                } else {
                    x[j][i] = solver.makeIntVar(0, 1, "x[" + j + "," + i + "]");
                }
            }
        }

        // Todo: xem xet viec toi uu khoi tao z: lop i trong preAssignments --> z[i] = 1
        // Cac lop ngoai preAssignments, D[i].size() == 1 --> z[i] = {0, 1]
        z = new MPVariable[n];
        for (int i = 0; i < n; i++) {
            z[i] = solver.makeIntVar(0, 1, "z[" + i + "]");
        }

        //
        t = new MPVariable[m];
        for (int i = 0; i < m; i++) {
            t[i] = solver.makeIntVar(0, 1, "t[" + i + "]");
        }

//        u = new MPVariable[m];
//        for (int i = 0; i < m; i++) {
//            u[i] = solver.makeIntVar(0, 1, "u[" + i + "]");
//        }

        // Consider
        objectiveLoadBalancing = solver.makeNumVar(0.0, 1.0, "objectiveLoadBalancing");
//        min = solver.makeNumVar(0.0, 1.0, "min");
    }

    /**
     * OK
     */
    private void createConstraintNumAssignedClassesAtLeast() {
        MPConstraint c = solver.makeConstraint(numAssignedClasses, numAssignedClasses);
        for (int i = 0; i < n; i++) {
            c.setCoefficient(z[i], 1);
        }
    }

    /**
     * OK
     */
    private void createConstraintObjective() {
        // constraint on the objective function
        // Y(j) > 0 --> F >= 1 - Y(j)/q(j) = 1 - sum_{i=1..n}[x(j, i) * hourClass(i) / maxHourTeacher(j)]
        double infinity = java.lang.Double.POSITIVE_INFINITY;
        double M = -1;
        for (int i = 0; i < m; i++) {
            if (maxHourTeacher[i] > M) {
                M = maxHourTeacher[i];
            }
        }
        M = (int) M + 1;

        // Linearing constraint
        //// Y(j) <= M*t(j) <--> M*t(j) - Y(j) >= 0, j = {1..m}
        for (int j = 0; j < m; j++) {
            MPConstraint c = solver.makeConstraint(0, infinity);
            c.setCoefficient(t[j], M);

            for (int i = 0; i < n; i++) {
                c.setCoefficient(x[j][i], -hourClass[i]);
            }
        }

        //// F + [1 - t(j)]*M >= 1 - Y(j)/q(j) <--> F - M*t(j) + Y(j)/q(j) >= 1 - M, j = {1..m}
        for (int j = 0; j < m; j++) {
            MPConstraint c = solver.makeConstraint(1 - M, infinity);
            c.setCoefficient(objectiveLoadBalancing, 1);
            c.setCoefficient(t[j], -M);

            for (int i = 0; i < n; i++) {
                c.setCoefficient(x[j][i], hourClass[i] / maxHourTeacher[j]);
            }
        }

        // Test obj func: min(min-max)
//        for (int j = 0; j < m; j++) {
//            MPConstraint c = solver.makeConstraint(0, infinity);
//            c.setCoefficient(u[j], M);
//
//            for (int i = 0; i < n; i++) {
//                c.setCoefficient(x[j][i], -hourClass[i]);
//            }
//        }
//
//        //// F + [1 - t(j)]*M >= 1 - Y(j)/q(j) <--> F - M*t(j) + Y(j)/q(j) >= 1 - M, j = {1..m}
//        for (int j = 0; j < m; j++) {
//            MPConstraint c = solver.makeConstraint(0, 1 + M);
//            c.setCoefficient(min, 1);
//            c.setCoefficient(u[j], M);
//
//            for (int i = 0; i < n; i++) {
//                c.setCoefficient(x[j][i], hourClass[i] / maxHourTeacher[j]);
//            }
//        }
    }

    /**
     * OK
     */
    private void createdConstraints() {
        super.createConstraintsPreAssignment();
        super.createConstraintMaxHourLoadTeacher();
        super.createConstraintConflictClasses();
        super.createConstraintChannelXZ();

        createConstraintNumAssignedClassesAtLeast();
        createConstraintObjective();
    }

    /**
     * OK
     */
    private void createObjective() {
        MPObjective objective = solver.objective();
        objective.setCoefficient(objectiveLoadBalancing, 1);
//        objective.setCoefficient(min, -1);
        objective.setMinimization();
    }

    /**
     * OK. Overriding is required
     *
     * @return
     */
    public boolean solve() {
        createSolverAndVariables();
        createdConstraints();
        createObjective();

        // Solves.
        final MPSolver.ResultStatus resultStatus = solver.solve();

        // Analyse solution.
        if (resultStatus == MPSolver.ResultStatus.OPTIMAL) {
            assignment = new int[n];
            Arrays.fill(assignment, -1);

            log.info("solved, n = " + n + " m = " + m + ", objective = " + objectiveLoadBalancing.solutionValue()
//                     +", min = " + min.solutionValue()+ ", obj = "+ solver.objective().value()
            );

//            super.printSolutionVariables();
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < m; j++) {
                    if (x[j][i].solutionValue() > 0) {
                        //System.out.println("solver, x[" + i + "," + j + "] = " + x[j][i].solutionValue());
                        if (x[j][i].solutionValue() > 0) {
                            assignment[i] = j;
                        }
                    }
                }
            }
            for (int i = 0; i < n; i++) {
                //System.out.println("solver z[" + i + "] = " + z[i].solutionValue());
                if (z[i].solutionValue() <= 0) {
                    notAssignedClasses.add(i);
                }
            }

            return true;
        }

        return false;
    }
}
