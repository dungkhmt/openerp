package com.hust.baseweb.applications.education.teacherclassassignment.service.algorithm.solver.ortools.cp;

import com.hust.baseweb.applications.education.teacherclassassignment.model.SolverConfig;
import com.hust.baseweb.applications.education.teacherclassassignment.service.algorithm.solver.BaseSolver;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class OrtoolsCPSolver extends BaseSolver {

    @Override
    public boolean solve(SolverConfig config) {
        MaxAssignedClassOrtoolsCPSolver maxAssignedClassSolver = new MaxAssignedClassOrtoolsCPSolver(input);
        maxAssignedClassSolver.setTimeLimit(600);


        log.info("solve, solver " + config.getSolver() +
                 " with model " + config.getModel() +
                 " target " + config.getObjective());

        boolean isOptimal = maxAssignedClassSolver.solve();
        assignment = maxAssignedClassSolver.getAssignment();
        notAssignedClasses = maxAssignedClassSolver.getNotAssignedClasses();
        int numAssignedClasses = input.n - notAssignedClasses.size();

        log.info("solve, PHASE 1: MaxAssignedClassOrtoolsCPSolver" +
                 ", numAssignedClass = " + maxAssignedClassSolver.getObjectiveValue()
        );

        if (config.getObjective().equals(SolverConfig.Objective.LOAD_BALANCING_DURATION_CONSIDERATION)) {
            LoadBalancingDurationConsiderationOrtoolsCPSolver loadBalancingSolver = new LoadBalancingDurationConsiderationOrtoolsCPSolver(
                input);
            loadBalancingSolver.setNumAssignedClasses(numAssignedClasses);

            loadBalancingSolver.solve();
            assignment = loadBalancingSolver.getAssignment();
            notAssignedClasses = loadBalancingSolver.getNotAssignedClasses();

            log.info("solve, PHASE 2: LoadBalancingDurationConsiderationOrtoolsCPSolver"
                     + ", F_min = " + loadBalancingSolver.getObjectiveValue());

            MaxAssignedTeacherOrtoolsCPSolver maxAssignedTeacherSolver = new MaxAssignedTeacherOrtoolsCPSolver(input);
            maxAssignedTeacherSolver.setNumAssignedClasses(numAssignedClasses);
            maxAssignedTeacherSolver.setLoadBalancingObjValue((long) loadBalancingSolver.getObjectiveValue());

            isOptimal = maxAssignedTeacherSolver.solve();
            assignment = maxAssignedTeacherSolver.getAssignment();
            notAssignedClasses = maxAssignedTeacherSolver.getNotAssignedClasses();

            log.info("solve, PHASE 3: MaxAssignedTeacherOrtoolsCPSolver"
                     + ", numAssignedTeacher = " + maxAssignedTeacherSolver.getObjectiveValue());
        } else {
            // ...
        }

        return isOptimal;
    }
}
