package com.hust.baseweb.applications.education.teacherclassassignment.service;

import com.hust.baseweb.applications.education.teacherclassassignment.model.*;
import com.hust.baseweb.applications.education.teacherclassassignment.utils.TimetableConflictChecker;
import lombok.extern.log4j.Log4j2;
import lombok.var;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service cung cap cac thuat toan giai quyet bai toan Phan cong giang day.
 */
@Log4j2
@Service
public class TeacherClassAssignmentAlgoServiceImpl implements TeacherClassAssignmentAlgoService {

    // Kha nang rat cao la bo
//    private CheckConflict checker;
//
//    public TeacherClassAssignmentAlgoServiceImpl() {
//        checker = new CheckConflict();
//    }

    public String name() {
        return "TeacherClassAssignmentAlgoServiceImpl";
    }

    @Override
    public TeacherClassAssignmentOM computeTeacherClassAssignment(AlgoTeacherAssignmentIM input) {
        // Only for logging
        String thisMethodName = "computeTeacherClassAssignment, ";

        // Include all of (have INVALID timetable and NOT in preAssignments)
        // or (algo cannot assign that classes because of violating constraints)
        List<AlgoClassIM> notAssignedClasses = new ArrayList<>();

        // Collect classes (have INVALID timetable and NOT in preAssignments)
        List<AlgoClassIM> validClasses = new ArrayList<>();
        List<HashSet<Integer>> daysOfValidClass = new ArrayList<>();
        Set<String> preAssignedClassIds = Arrays
            .stream(input.getPreAssignments())
            .map(assignment -> assignment.getAlgoClassIM().getClassId())
            .collect(Collectors.toSet());

        for (AlgoClassIM algoClass : input.getClasses()) {
            HashSet<Integer> days = TimetableConflictChecker.extractDayOfTimeTable(algoClass.getTimetable());

            if (null != days || preAssignedClassIds.contains(algoClass.getClassId())) { // valid
                validClasses.add(algoClass);
                daysOfValidClass.add(days);
            } else { // invalid
                notAssignedClasses.add(algoClass);
//                log.info("TeacherClassAssignmentAlgoServiceImpl::computeTeacherClassAssignment, "
//                         + "detect invalid timetable class with classId = " + algoClass.getClassId());
            }
        }

        log.info(thisMethodName + "after removing classes (have INVALID timetable and NOT in preAssignments)"
                 + ", solve the problem with " + validClasses.size() + " classes");

        // Init
        AlgoClassIM[] algoClasses = validClasses.toArray(new AlgoClassIM[0]);
        AlgoTeacherIM[] algoTeachers = input.getTeachers();
        TeacherClassAssignmentModel[] preAssignments = input.getPreAssignments();

        int n = algoClasses.length; // number of classes;
        int m = algoTeachers.length; // number of teachers;
        double[] hourClass; // hourClass[i] is the number of hours of class i
        double[] maxHourTeacher; // maxHourTeacher[i] is the upper bound of the total hourLoad of classes assigned to teacher i

        // Encode data
        //// Encode teacher.
        HashMap<String, Integer> mTeacher2Index = new HashMap<>();
        HashSet<Integer> teacherWantToMinimizeWorkingDays = new HashSet<>();
        for (int i = 0; i < m; i++) {
            AlgoTeacherIM teacher = algoTeachers[i];
            mTeacher2Index.put(teacher.getId(), i);

            if (teacher.isMinimizeNumberWorkingDays()) {
                teacherWantToMinimizeWorkingDays.add(i);
            }

//            log.info("map: teacher[" + i + "] = " + teacher.getId());
        }

        //// Encode class
        HashMap<String, Integer> mClassId2Index = new HashMap<>();
        for (int i = 0; i < n; i++) {
            mClassId2Index.put(algoClasses[i].getClassId(), i);

//            log.info("map: class[" + i + "] = " + algoClasses[i].getClassId());
        }

        //// Map course's id with list of index of classes opened for that course in assignment plan
        HashMap<String, List<Integer>> mCourseId2ClassIndex = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String courseId = algoClasses[i].getCourseId();

            mCourseId2ClassIndex.computeIfAbsent(courseId, k -> new ArrayList<>());
            mCourseId2ClassIndex.get(courseId).add(i);
        }

        //// Init
        int[][] priorityMatrix = new int[n][m]; // to be upgrade
        Arrays.stream(priorityMatrix).forEach(row -> Arrays.fill(row, Integer.MAX_VALUE));

        hourClass = new double[n];
        var mClass2Teachers = new HashSet[n]; // mClass2Teachers[i]: danh sach cac gv co the day lop i.
        for (int i = 0; i < n; i++) {
            mClass2Teachers[i] = new HashSet<Integer>();
            hourClass[i] = algoClasses[i].getHourLoad();
        }

        maxHourTeacher = new double[m];
        for (int i = 0; i < m; i++) {
            AlgoTeacherIM teacher = algoTeachers[i];
            maxHourTeacher[i] = teacher.getPrespecifiedHourLoad(); // xem ki cho nay

            if (null != teacher.getCourses()) {
                for (int j = 0; j < teacher.getCourses().size(); j++) {
                    Course4Teacher course4Teacher = teacher.getCourses().get(j);
                    int priority = course4Teacher.getPriority();

                    if (null != mCourseId2ClassIndex.get(course4Teacher.getCourseId())) {
                        for (int clazz : mCourseId2ClassIndex.get(course4Teacher.getCourseId())) {
                            //mClass2Teachers[clazz].add(new AlgoTeacherClassPriorityModel(i,clazz,priority));
                            mClass2Teachers[clazz].add(i);
                            priorityMatrix[clazz][i] = priority;
                        }
                    }
                    // Testing and debugging only
//                    else {
//                        // This is normal case because TeacherCourseForAssignmentPlan may contain courses that not have in assignment plan
//                        // No problem
//                        log.info(name() + "::no class for course " + course4Teacher.getCourseId());
//                    }
                }
            }
        }

        int[][] pa = null;
        if (null != preAssignments && preAssignments.length != 0) {
            log.info(thisMethodName + "prepare preAssignments with size = " + preAssignments.length);

            pa = new int[preAssignments.length][2];
            for (int i = 0; i < preAssignments.length; i++) {
                AlgoClassIM algoClass = preAssignments[i].getAlgoClassIM();
                AlgoTeacherIM algoTeacher = preAssignments[i].getAlgoTeacherIM();
                int clazz = mClassId2Index.get(algoClass.getClassId());
                int teacher = mTeacher2Index.get(algoTeacher.getId());

                mClass2Teachers[clazz].clear();
                mClass2Teachers[clazz].add(teacher);

                log.info(thisMethodName + "preAssign class[" + clazz + "] = " + algoClass.getClassId()
                         + " - teacher[" + teacher + "] = " + algoTeacher.getId());

                //mClass2Teachers[clazz].add(new AlgoTeacherClassPriorityModel(teacher,clazz,1));

                pa[i][0] = clazz;
                pa[i][1] = teacher;
            }
        }

        //// Testing and debugging only
//        for (int i = 0; i < n; i++) {
//            System.out.println("Class " +
//                               algoClasses[i].getId() +
//                               " " +
//                               algoClasses[i].getCourseId() +
//                               "-" +
//                               algoClasses[i].getCourseName() +
//                               ": ");
//
//
//            for (int j : mClass2Teachers[i]) {
//                if (algoTeachers[j].getId().equals("bang.banha@hust.edu.vn")) {
//                    System.out.println("teacher " + j + ": " + algoTeachers[j].getId());
//                    System.out.println("Class " +
//                                       algoClasses[i].getId() +
//                                       " " +
//                                       algoClasses[i].getCourseId() +
//                                       "-" +
//                                       algoClasses[i].getCourseName() +
//                                       ": ");
//
//                }
//            }
//        }

        // Todo: consider j = i+1 not j = 0
        boolean[][] conflict = new boolean[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                conflict[i][j] = TimetableConflictChecker
                    .conflictMultiTimeTable(algoClasses[i].getTimetable(), algoClasses[j].getTimetable());

                // Testing and debugging only
//                if (conflict[i][j]) {
//                    log.info("Conflict " + algoClasses[i].getTimetable() + " VS. " + algoClasses[j].getTimetable());
//                } else {
//                    log.info("NOT Conflict " + algoClasses[i].getTimetable() + " VS. " + algoClasses[j].getTimetable());
//                }
            }
        }

        //// Chưa quan tâm đến tuần học
        boolean[][] classDays = new boolean[n][7]; // Luu cac ngay trong tuan ma lop hoc dien ra.
        Arrays.stream(classDays).forEach(row -> Arrays.fill(row, false));

        for (int i = 0; i < n; i++) {
            for (int d : daysOfValidClass.get(i)) {
                classDays[i][d - 2] = true;
            }
        }

        MapDataInput mapDataInput = new MapDataInput(n, m, mClass2Teachers, conflict, priorityMatrix, hourClass,
                                                     maxHourTeacher, pa, classDays, teacherWantToMinimizeWorkingDays);

        //mapDataInput.savePlainTextFile("mClass2Teachers:/tmp/data-bca/1.txt");
        //MaxLoadConstraintORToolMIPSolver mipSolver =
        //    new MaxLoadConstraintORToolMIPSolver(n, m, mClass2Teachers, priorityMatrix, conflict, hourClass, maxHourTeacher);

        // Solve
        ORToolMIPSolver mipSolver = new ORToolMIPSolver(mapDataInput);
        boolean solved = mipSolver.solve(input.getSolver());
        int[] assignments;

        if (solved) {
            assignments = mipSolver.getAssignment();
            log.info(thisMethodName + "MIP found optimal solution!!");
            log.info(thisMethodName + "numNotAssignClasses = " + mipSolver.getNotAssignedClasses().size());
        } else {
            return null;
        }
        /*
        else {
            log.info("computeTeacherClassAssignment, MIP cannot find optimal solution, Apply CBLS");
            CBLSSolver solver = new CBLSSolver(n, m, mClass2Teachers, priorityMatrix, conflict, hourClass, maxHourTeacher);
            solver.solve();
            assignments = solver.getSolution();
        }
        */

        // Decoding
        ////
        HashMap<AlgoTeacherIM, List<AlgoClassIM>> mTeacher2AssignedClasses = new HashMap<>();
        TeacherClassAssignmentModel[] assignmentModels = new TeacherClassAssignmentModel[algoClasses.length];
        for (int i = 0; i < algoClasses.length; i++) {
            AlgoClassIM clazz = algoClasses[i];

            if (assignments[i] > -1) {
                AlgoTeacherIM teacher = algoTeachers[assignments[i]];
                assignmentModels[i] = new TeacherClassAssignmentModel(clazz, teacher);

                mTeacher2AssignedClasses.computeIfAbsent(teacher, k -> new ArrayList<>());
                mTeacher2AssignedClasses.get(teacher).add(clazz);
            } else {
                notAssignedClasses.add(clazz);
            }
        }

        ////
        ClassesAssigned2TeacherModel[] classesAssigned2TeacherModels = new ClassesAssigned2TeacherModel[algoTeachers.length];
        for (int i = 0; i < algoTeachers.length; i++) {
            classesAssigned2TeacherModels[i] = new ClassesAssigned2TeacherModel(
                algoTeachers[i],
                mTeacher2AssignedClasses.get(algoTeachers[i]));
        }

        //// Currently do nothing with this
        int numEmpty = 0;
        for (int i = 0; i < n; i++) {
            if (mClass2Teachers[i].size() == 0) {
                log.info(thisMethodName + "empty domain course "
//                         + algoClasses[i].getCourseId()
//                         + " - "
                         + algoClasses[i].getCourseName());
                numEmpty++;
            }
        }

        log.info(thisMethodName + "num empty domain = " + numEmpty);

        ////
        TeacherClassAssignmentOM teacherClassAssignmentOM = new TeacherClassAssignmentOM(
            assignmentModels,
            classesAssigned2TeacherModels,
            notAssignedClasses);

        ////
        int[] numClassesOfTeacher = new int[m];
        Arrays.fill(numClassesOfTeacher, 0);

        for (int i = 0; i < n; i++) {
            if (assignments[i] > -1) {
                numClassesOfTeacher[assignments[i]]++;
            }
        }

        // Verify solution
        for (int t = 0; t < m; t++) {
            log.info(thisMethodName +
                     "teacher[" +
                     t +
                     "] - " +
                     algoTeachers[t].getId() +
                     " has " +
                     numClassesOfTeacher[t]);

            for (int i = 0; i < n; i++) {
                for (int j = i + 1; j < n; j++) {
                    if (assignments[i] == t && assignments[j] == t && conflict[i][j]) {
                        log.error(thisMethodName + "BUG with class " + i + " and " + j + " of teacher " + t + ": " +
                                  algoClasses[i].getTimetable() +
                                  " <-> " +
                                  algoClasses[j].getTimetable());
                    }
                }
            }
        }

        return teacherClassAssignmentOM;
    }
}
