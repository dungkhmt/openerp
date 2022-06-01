package com.hust.baseweb.applications.education.teacherclassassignment.service;

import com.google.ortools.Loader;
import com.google.ortools.linearsolver.MPConstraint;
import com.google.ortools.linearsolver.MPObjective;
import com.google.ortools.linearsolver.MPSolver;
import com.google.ortools.linearsolver.MPVariable;
import com.hust.baseweb.applications.education.teacherclassassignment.model.*;
import com.hust.baseweb.applications.education.teacherclassassignment.utils.CheckConflict;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

public class BaseMIPSolver implements ISolver {

    short numClasses, numTeachers; // Number of classes, teachers.

    double averageLoad = 0;

    long totalLoadOfFeasibleClasses;

    int[] loadOfClass;

    int[] optimizedTeachers; // optimizedTeachers[i] = total load assigned, -1 if teacher i th haven't been optimized yet.

    boolean[] optimizedClasses; // Classes optimized after each optimal round.

    short[][] pairOfConflictClasses;  // (conflict[k][0], conflict[k][1]) is a pair of conflicting classes (cannot assign to the same teacher).

    ArrayList<Short>[] classesTeacherCanTeach;  // Classes teacher can teach.

    List<Short>[] teachersCanTeachClass; // Teachers can teach specific class.

    ArrayList<Short>[] optimalClassesOfTeacher; // Classes assigned to teacher in optimal solution.

    Set<Short> infeasibleClasses; // Index of classes cannot be assigned to any teacher.

    AlgoTeacherIM[] teachers; // From input.

    List<AlgoClassIM> classes; // From input.

    AlgoTeacherAssignmentIM im; // Input.

    TeacherClassAssignmentOM om; // Output.

    // Modeling.
    final String RHS = "Right-hand side";

    final String LHS = "Left-hand side";

    final short BIG_M = 2;

    public BaseMIPSolver(AlgoTeacherAssignmentIM im) {
        this.im = im;
        om = new TeacherClassAssignmentOM();
        infeasibleClasses = new HashSet<>();
    }

    void preProcessing() {
        teachers = im.getTeachers();
        classes = new ArrayList<>(Arrays.asList(im.getClasses()));

        // Init.
        numTeachers = (short) teachers.length;
        optimizedTeachers = new int[numTeachers];
        classesTeacherCanTeach = new ArrayList[numTeachers];
        optimalClassesOfTeacher = new ArrayList[numTeachers];

        numClasses = (short) classes.size();
        loadOfClass = new int[numClasses];
        optimizedClasses = new boolean[numClasses];
        teachersCanTeachClass = new ArrayList[numClasses];
        totalLoadOfFeasibleClasses = 0;

        Arrays.fill(optimizedClasses, false);
        Arrays.fill(optimizedTeachers, -1);

        // Normalize.
        for (short i = 0; i < numClasses; i++) {
            normalizeClass(classes.get(i));
            teachersCanTeachClass[i] = new ArrayList<>();
        }

        for (short i = 0; i < numTeachers; i++) {
            teachers[i].getCourses().forEach(course -> {
                normalizeCourse(course);
            });

            optimalClassesOfTeacher[i] = new ArrayList<>();
            classesTeacherCanTeach[i] = new ArrayList<>();
        }

        // Populate list of classes which teacher can teach.
        for (short i = 0; i < numClasses; i++) {
            boolean isInfeasible = true;
            AlgoClassIM classIM = classes.get(i);

            for (short j = 0; j < numTeachers; j++) {
                for (Course4Teacher course : teachers[j].getCourses()) {
                    if (course.getCourseId().equals(classIM.getCourseId()) &&
                        course.getType().equals(classIM.getClassType())
                    ) {
                        isInfeasible = false;
                        classesTeacherCanTeach[j].add(i);
                        teachersCanTeachClass[i].add(j);
                        break;
                    }
                }
            }

            if (isInfeasible) {
                infeasibleClasses.add(i);
            }
        }

        // Remove classes assign to only one teacher that is invalid.
        List<Short>[] onlyOneTeacher = new List[numTeachers];

        for (short i = 0; i < numTeachers; i++) {
            onlyOneTeacher[i] = new ArrayList<>();
        }

        for (short i = 0; i < teachersCanTeachClass.length; i++) {
            if (teachersCanTeachClass[i].size() == 1) {
                onlyOneTeacher[teachersCanTeachClass[i].get(0)].add(i);
            }
        }

        checkClassesAssign2OnlyOneTeacher(onlyOneTeacher);

        //
        for (Short i = 0; i < numClasses; i++) {
            if (!infeasibleClasses.contains(i)) {
                totalLoadOfFeasibleClasses += (int) (classes.get(i).getHourLoad() * 60);
                loadOfClass[i] = (int) (classes.get(i).getHourLoad() * 60);
            }
        }

        averageLoad = totalLoadOfFeasibleClasses * 1.0 / numTeachers;

        // Check conflict classes.
        pairOfConflictClasses = extractConflictClasses(classes);
    }

    private void checkClassesAssign2OnlyOneTeacher(List<Short>[] onlyOneTeacher) {
        for (List<Short> classes : onlyOneTeacher) {
            if (classes.size() > 1) {
                CheckConflict checker = new CheckConflict();
                short len = (short) classes.size();

                if (len == 2) {
                    if (checker.isConflict(this.classes.get(classes.get(0)), this.classes.get(classes.get(1)))) {
                        infeasibleClasses.add(classes.get(0));
                    }
                } else {
                    Loader.loadNativeLibraries();
                    MPSolver mpSolver = MPSolver.createSolver(String.valueOf(MPSolver.OptimizationProblemType.SCIP_MIXED_INTEGER_PROGRAMMING));
                    MPVariable[] vertices = new MPVariable[len];
                    List<Short>[] graph = new ArrayList[len];

                    // Init.
                    for (short i = 0; i < len; i++) {
                        vertices[i] = mpSolver.makeIntVar(0, 1, "vertices[" + i + "]");
                        graph[i] = new ArrayList<>();
                    }

                    for (short i = 0, bound = (short) (len - 1); i < bound; i++) {
                        for (short j = (short) (i + 1); j < len; j++) {
                            if (checker.isConflict(
                                this.classes.get(classes.get(i)),
                                this.classes.get(classes.get(j)))) {

                                graph[i].add(j);
                            }
                        }
                    }

                    // Constrain: 0 <= x[i] + x[j] <= 1 (classes.get(i) conflict with classes.get(j)).
                    for (short i = 0; i < graph.length; i++) {
                        for (Short vertex : graph[i]) {
                            MPConstraint conflict = mpSolver.makeConstraint(
                                0,
                                1,
                                "conflict[" + i + "][" + vertex + "]");

                            conflict.setCoefficient(vertices[i], 1);
                            conflict.setCoefficient(vertices[vertex], 1);
                        }
                    }

                    // Model sum of vertices[i].
                    MPVariable sum = mpSolver.makeIntVar(0, len, "sum");
                    MPConstraint computeSum = mpSolver.makeConstraint(0, 0, "computeSum");

                    computeSum.setCoefficient(sum, -1);

                    for (short i = 0; i < vertices.length; i++) {
                        computeSum.setCoefficient(vertices[i], 1);
                    }

                    // Objective.
                    MPObjective objective = mpSolver.objective();
                    objective.setCoefficient(sum, 1);
                    objective.setMaximization();

                    // Solves.
                    final MPSolver.ResultStatus resultStatus = mpSolver.solve();

                    if (resultStatus == MPSolver.ResultStatus.OPTIMAL) {
                        for (int i = 0; i < vertices.length; i++) {
                            if ((int) (vertices[i].solutionValue() + 0.25) == 0) {
                                infeasibleClasses.add(classes.get(i));
                            }
                        }
                    } else {
                        System.err.println("This problem not have optimal solution");
                    }

                    // Release resources.
                    mpSolver.clear();
                }
            }
        }
    }

    boolean isValidSolution() {
        for (short i = 0; i < teachers.length; i++) {
            for (Short cls : optimalClassesOfTeacher[i]) {
                if (!classesTeacherCanTeach[i].contains(cls)) {
                    return false;
                }
            }

            if (optimalClassesOfTeacher[i].size() > 1) {
                for (short[] pair : pairOfConflictClasses) {
                    if (optimalClassesOfTeacher[i].containsAll(Arrays.asList(pair[0], pair[1]))) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    private void normalizeClass(AlgoClassIM classIM) {
        classIM.setCourseId(StringUtils.deleteWhitespace(classIM.getCourseId()).toUpperCase());
        classIM.setClassType(StringUtils.deleteWhitespace(classIM.getClassType()).toUpperCase());
    }

    private void normalizeCourse(Course4Teacher course) {
        course.setCourseId(StringUtils.deleteWhitespace(course.getCourseId()).toUpperCase());
        course.setType(StringUtils.deleteWhitespace(course.getType()).toUpperCase());
    }

    private short[][] extractConflictClasses(List<AlgoClassIM> classes) {
        List<BaseMIPSolver.PairOfConflictClasses> conflictClasses = new ArrayList<>();
        CheckConflict checker = new CheckConflict();

        for (Short cls1 = 0, bound1 = (short) (classes.size() - 1); cls1 < bound1; cls1++) {
            if (!infeasibleClasses.contains(cls1)) {
                for (Short cls2 = (short) (cls1 + 1), bound2 = (short) classes.size(); cls2 < bound2; cls2++) {
                    if (!infeasibleClasses.contains(cls2)) {
                        if (checker.isConflict(classes.get(cls1), classes.get(cls2))) {
                            conflictClasses.add(new BaseMIPSolver.PairOfConflictClasses(cls1, cls2));
                        }
                    }
                }
            }
        }

        // Convert to output format.
        short[][] result = new short[conflictClasses.size()][2];

        for (short i = 0, bound = (short) conflictClasses.size(); i < bound; i++) {
            result[i][0] = conflictClasses.get(i).getFirstClass();
            result[i][1] = conflictClasses.get(i).getSecondClass();
        }

        return result;
    }

    @Override
    public void solve() {
    }

    @Override
    public TeacherClassAssignmentOM getSolution() {
        ClassesAssigned2TeacherModel[] models = new ClassesAssigned2TeacherModel[numTeachers];

        for (int i = 0; i < optimalClassesOfTeacher.length; i++) {
            ClassesAssigned2TeacherModel assignmentModel = new ClassesAssigned2TeacherModel();

            assignmentModel.setTeacher(teachers[i]);
            assignmentModel.setClasses(optimalClassesOfTeacher[i].stream().map(cls -> classes.get(cls)).collect(
                Collectors.toList()));

            models[i] = assignmentModel;
        }

        om.setClassesAssigned2TeacherModels(models);

        // Classes not assigned.
        om.setNotAssignedClasses(infeasibleClasses.stream().map(cls -> classes.get(cls)).collect(Collectors.toList()));
        return om;
    }

    @Getter
    private class PairOfConflictClasses {

        private short firstClass;

        private short secondClass;

        public PairOfConflictClasses(short firstClass, short secondClass) {
            this.firstClass = firstClass;
            this.secondClass = secondClass;
        }
    }
}
