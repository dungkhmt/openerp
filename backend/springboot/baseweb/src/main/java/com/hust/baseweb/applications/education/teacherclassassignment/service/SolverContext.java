package com.hust.baseweb.applications.education.teacherclassassignment.service;

import com.hust.baseweb.applications.education.teacherclassassignment.model.TeacherClassAssignmentOM;
import lombok.Getter;

public class SolverContext {

    private ISolver solver;

    @Getter
    private TeacherClassAssignmentOM om;

    public SolverContext(ISolver solver) {
        this.solver = solver;
    }

    public void solve() {
        solver.solve();
        om = solver.getSolution();
    }
}
