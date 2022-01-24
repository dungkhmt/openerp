package com.hust.baseweb.applications.education.teacherclassassignment.service;

import com.hust.baseweb.applications.education.teacherclassassignment.model.*;
import com.hust.baseweb.applications.education.teacherclassassignment.utils.CheckConflict;
import com.hust.baseweb.applications.education.teacherclassassignment.utils.TimetableConflictChecker;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.*;

@Log4j2
@Service
public class TeacherClassAssignmentAlgoServiceImpl implements TeacherClassAssignmentAlgoService {

    private CheckConflict checker;

    public TeacherClassAssignmentAlgoServiceImpl() {
        checker = new CheckConflict();
    }

    public String name() {
        return "TeacherClassAssignmentAlgoServiceImpl";
    }

    @Override
    public TeacherClassAssignmentOM computeTeacherClassAssignment(AlgoTeacherAssignmentIM input) {
        AlgoTeacherIM[] algoTeacherIMs = input.getTeachers();
        AlgoClassIM[] algoClassIMS = input.getClasses();
        TeacherClassAssignmentModel[] preAssignment = input.getPreAssignments();

        int n = algoClassIMS.length;// number of classes;
        int m = algoTeacherIMs.length;// number of teachers;
        double[] hourClass;// hourClass[i] is the number of hours of class i
        double[] maxHourTeacher; // maxHourTeacher[j] is the upper bound of the total hourLoad of classes assigned to teacher j
        HashSet<Integer> teacherWantToMinimizeWorkingDays = new HashSet<Integer>();
        boolean[][] classDays = new boolean[n][7];

        HashMap<String, Integer> mTeacher2Index = new HashMap();
        for (int i = 0; i < m; i++) {
            mTeacher2Index.put(algoTeacherIMs[i].getId(), i);
            if(algoTeacherIMs[i].isMinimizeNumberWorkingDays()){
                teacherWantToMinimizeWorkingDays.add(i);
            }
            log.info("map: teacher[" + i + "] = " + algoTeacherIMs[i].getId());
        }
        HashMap<String, Integer> mClassId2Index = new HashMap();
        for (int i = 0; i < n; i++) {
            mClassId2Index.put(algoClassIMS[i].getClassCode(), i);
            log.info("map: class[" + i + "] = " + algoClassIMS[i].getClassCode());

        }

        HashMap<String, List<Integer>> mCourseID2ClassIndex = new HashMap();
        for (int i = 0; i < n; i++) {
            if (mCourseID2ClassIndex.get(algoClassIMS[i].getCourseId()) == null) {
                mCourseID2ClassIndex.put(algoClassIMS[i].getCourseId(), new ArrayList<Integer>());
            }
            mCourseID2ClassIndex.get(algoClassIMS[i].getCourseId()).add(i);
        }
        HashSet[] D = new HashSet[n];
        int[][] priorityMatrix = new int[n][m]; // to be upgrade
        for(int i = 0; i < n; i++){
            for(int j = 0;j < m; j++){
                priorityMatrix[i][j] = Integer.MAX_VALUE;
            }
        }
        //ArrayList<Integer>[] D = new ArrayList[n];
        hourClass = new double[n];
        maxHourTeacher = new double[m];
        for (int i = 0; i < n; i++) {
            D[i] = new HashSet();
            hourClass[i] = algoClassIMS[i].getHourLoad();
        }
        for (int i = 0; i < m; i++) {
            AlgoTeacherIM t = algoTeacherIMs[i];
            maxHourTeacher[i] = t.getPrespecifiedHourLoad();

            if (t.getCourses() == null) {
                continue;
            }
            for (int j = 0; j < t.getCourses().size(); j++) {
                Course4Teacher course4Teacher = t.getCourses().get(j);
                int priority = course4Teacher.getPriority();

                if (mCourseID2ClassIndex.get(course4Teacher.getCourseId()) == null) {
                    //System.out.println(name() + "::no class for course " + course4Teacher.getCourseId());
                } else {
                    for (int c : mCourseID2ClassIndex.get(course4Teacher.getCourseId())) {
                        D[c].add(i);
                        //D[c].add(new AlgoTeacherClassPriorityModel(i,c,priority));
                        priorityMatrix[c][i] = priority;
                    }
                }
            }
        }
        int[][] pa = null;

        if (preAssignment != null) {
            log.info("prepare preAssignment.sz = " + preAssignment.length);
            pa = new int[preAssignment.length][];
            for (int i = 0; i < preAssignment.length; i++) {
                AlgoClassIM ci = preAssignment[i].getAlgoClassIM();
                AlgoTeacherIM ti = preAssignment[i].getAlgoTeacherIM();
                int ic = mClassId2Index.get(ci.getClassCode());
                int it = mTeacher2Index.get(ti.getId());
                D[ic].clear();
                D[ic].add(it);
                log.info("computeTeacherClassAssignment, preAssign class[" + ic + "] = " + ci.getClassCode()
                         + " - teacher[" + it + "] = " + ti.getId());
                //D[ic].add(new AlgoTeacherClassPriorityModel(it,ic,1));
                pa[i] = new int[2];
                pa[i][0] = ic; pa[i][1] = it;
            }
        }
        for (int i = 0; i < n; i++) {
            /*
            System.out.println("Class " +
                               algoClassIMS[i].getId() +
                               " " +
                               algoClassIMS[i].getCourseId() +
                               "-" +
                               algoClassIMS[i].getCourseName() +
                               ": ");
            */
            /*
            for (int j : D[i]) {
                if (algoTeacherIMs[j].getId().equals("bang.banha@hust.edu.vn")) {
                    System.out.println("teacher " + j + ": " + algoTeacherIMs[j].getId());
                    System.out.println("Class " +
                                       algoClassIMS[i].getId() +
                                       " " +
                                       algoClassIMS[i].getCourseId() +
                                       "-" +
                                       algoClassIMS[i].getCourseName() +
                                       ": ");

                }
            }
            */

        }
        boolean[][] conflict = new boolean[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                //conflict[i][j] = checker.isConflict(algoClassIMS[i], algoClassIMS[j]);
                conflict[i][j] = TimetableConflictChecker
                    //.conflict(algoClassIMS[i].getTimetable(), algoClassIMS[j].getTimetable());
                    .conflictMultiTimeTable(algoClassIMS[i].getTimetable(), algoClassIMS[j].getTimetable());
                if (conflict[i][j]) {
                    //System.out.println("Conflict " + algoClassIMS[i].getTimetable() + " VS. " + algoClassIMS[j].getTimetable());
                } else {
                    //System.out.println("NOT Conflict " + algoClassIMS[i].getTimetable() + " VS. " + algoClassIMS[j].getTimetable());
                }
            }
        }

        for(int i = 0; i < n; i++){
            for(int d = 0; d < 7; d++){
                classDays[i][d] = false;
            }
        }
        for(int i = 0;i < n; i++){
            HashSet<Integer> days = TimetableConflictChecker.extractDayOfTimeTable(algoClassIMS[i].getTimetable());
            if(days != null) {
                for (int d : days) {
                    classDays[i][d - 2] = true;
                }
            }else{
                log.info("computeTeacherClassAssignment, exception invalid timetable at class[" + i + "], " +
                         "code = " + algoClassIMS[i].getClassCode() + " timetable = " + algoClassIMS[i].getTimetable());
                return null;
            }
        }

        int[] sol = null;
        MapDataInput mapDataInput = new MapDataInput(n, m, D, conflict, priorityMatrix, hourClass,
                                                     maxHourTeacher,pa, classDays, teacherWantToMinimizeWorkingDays);

        //mapDataInput.savePlainTextFile("D:/tmp/data-bca/1.txt");
        //MaxLoadConstraintORToolMIPSolver mipSolver =
        //    new MaxLoadConstraintORToolMIPSolver(n, m, D, priorityMatrix, conflict, hourClass, maxHourTeacher);
        ORToolMIPSolver mipSolver  = new ORToolMIPSolver(mapDataInput);
        boolean solved = mipSolver.solve(input.getSolver());
        if (solved) {
            sol = mipSolver.getSolutionAssignment();
            log.info("computeTeacherClassAssignment, MIP found optimal solution!!");
            log.info("computeTeacherClassAssignment, notAssign = " + mipSolver.getNotAssignedClass().size());
        }else{
            return null;
        }
        /*
        else {
            log.info("computeTeacherClassAssignment, MIP cannot find optimal solution, Apply CBLS");
            CBLSSolver solver = new CBLSSolver(n, m, D, priorityMatrix, conflict, hourClass, maxHourTeacher);
            solver.solve();
            sol = solver.getSolution();
        }
        */

        HashMap<AlgoTeacherIM, List<AlgoClassIM>> mTeacher2AssignedClass = new HashMap();

        Random R = new Random();
        TeacherClassAssignmentModel[] assignmentModels = new TeacherClassAssignmentModel[algoClassIMS.length];
        List<AlgoClassIM> notAssigned = new ArrayList<AlgoClassIM>();
        for (int i = 0; i < algoClassIMS.length; i++) {
            //int j = R.nextInt(algoTeacherIMs.length);
            if (sol[i] >= 0) {
                AlgoTeacherIM t = algoTeacherIMs[sol[i]];
                assignmentModels[i] = new TeacherClassAssignmentModel(algoClassIMS[i], t);
                if (mTeacher2AssignedClass.get(t) == null) {
                    mTeacher2AssignedClass.put(t, new ArrayList<AlgoClassIM>());
                }
                mTeacher2AssignedClass.get(t).add(algoClassIMS[i]);
            } else {
                notAssigned.add(algoClassIMS[i]);
            }
        }
        ClassesAssigned2TeacherModel[] classesAssigned2TeacherModels = new ClassesAssigned2TeacherModel[algoTeacherIMs.length];
        for (int t = 0; t < algoTeacherIMs.length; t++) {
            classesAssigned2TeacherModels[t] = new ClassesAssigned2TeacherModel(
                algoTeacherIMs[t],
                mTeacher2AssignedClass.get(
                    algoTeacherIMs[t]));
        }
        int nbEmpty = 0;
        for (int i = 0; i < n; i++) {
            if (D[i].size() == 0) {
                //System.out.println("empty domain course " + algoClassIMS[i].getCourseId() + " - " + algoClassIMS[i].getCourseName());
                nbEmpty++;
            }
        }
        System.out.println("nb empty domain = " + nbEmpty);
        TeacherClassAssignmentOM teacherClassAssignmentOM = new TeacherClassAssignmentOM(
            assignmentModels,
            classesAssigned2TeacherModels,
            notAssigned);

        int[] nbCourseOfTeacher = new int[m];
        for (int i = 0; i < m; i++) {
            nbCourseOfTeacher[i] = 0;
        }
        for (int i = 0; i < n; i++) {
            if (sol[i] >= 0) {
                nbCourseOfTeacher[sol[i]]++;
            }
        }
        for (int t = 0; t < m; t++) {
            System.out.println("Teacher[" + t + "] = " + algoTeacherIMs[t].getId() + " has " + nbCourseOfTeacher[t]);
            for (int i = 0; i < n; i++) {
                for (int j = i + 1; j < n; j++) {
                    if (sol[i] == t && sol[j] == t && conflict[i][j]) {
                        System.out.println("BUG with class " + i + " and " + j + " of teacher " + t + ": " +
                                           algoClassIMS[i].getTimetable() +
                                           " <-> " +
                                           algoClassIMS[j].getTimetable());
                    }
                }
            }
        }
        return teacherClassAssignmentOM;
    }
}
