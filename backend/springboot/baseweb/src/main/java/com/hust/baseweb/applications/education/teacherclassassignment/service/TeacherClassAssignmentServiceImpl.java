package com.hust.baseweb.applications.education.teacherclassassignment.service;

import com.hust.baseweb.applications.education.teacherclassassignment.model.AlgoTeacherAssignmentIM;
import com.hust.baseweb.applications.education.teacherclassassignment.model.TeacherClassAssignmentOM;
import org.springframework.stereotype.Service;

@Service
public class TeacherClassAssignmentServiceImpl implements TeacherClassAssignmentService {

    @Override
    public TeacherClassAssignmentOM assign(AlgoTeacherAssignmentIM im) {
        SolverContext solver = new SolverContext(new ORToolsMIPSolver(im));
        /*SolverContext solver = new SolverContext(new CPLEXMIPSolver(im));*/
        solver.solve();

        return solver.getOm();
    }
}
