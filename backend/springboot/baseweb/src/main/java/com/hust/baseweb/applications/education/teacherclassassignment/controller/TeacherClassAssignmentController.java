package com.hust.baseweb.applications.education.teacherclassassignment.controller;

import com.google.gson.Gson;
import com.hust.baseweb.applications.education.teacherclassassignment.entity.*;
import com.hust.baseweb.applications.education.teacherclassassignment.model.*;
import com.hust.baseweb.applications.education.teacherclassassignment.model.teachersuggestion.SuggestedTeacherAndActionForClass;
import com.hust.baseweb.applications.education.teacherclassassignment.service.ClassTeacherAssignmentPlanService;
import com.hust.baseweb.applications.education.teacherclassassignment.service.ClassTeacherAssignmentSolutionExcelExporter;
import com.hust.baseweb.applications.education.teacherclassassignment.service.TeacherClassAssignmentAlgoService;
import com.hust.baseweb.applications.education.teacherclassassignment.service.TeacherClassAssignmentService;
import com.hust.baseweb.applications.education.teacherclassassignment.utils.TimetableConflictChecker;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Log4j2
@Controller
@Validated
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class TeacherClassAssignmentController {

    private TeacherClassAssignmentAlgoService algoService;

    private TeacherClassAssignmentService assignmentService;

    private UserService userService;
    private ClassTeacherAssignmentPlanService classTeacherAssignmentPlanService;

    @PostMapping("/upload-excel-class-4-teacher-assignment")
    public ResponseEntity<?> uploadExcelClass4TeacherAssignment(
        Principal principal, @RequestParam("inputJson") String inputJson,
        @RequestParam("file") MultipartFile file
    ) {
        Gson gson = new Gson();
        UploadExcelClass4TeacherAssignmentInputModel input = gson.fromJson(
            inputJson,
            UploadExcelClass4TeacherAssignmentInputModel.class);
        UUID planId = input.getPlanId();
        log.info("uploadExcelClass4TeacherAssignment, json = " + inputJson + " planId = " + planId);
        classTeacherAssignmentPlanService.extractExcelAndStoreDB(planId, file);
        return ResponseEntity.ok().body("OK");

    }

    @GetMapping("/get-all-class-teacher-assignment-plan")
    public ResponseEntity<?> getAllClassTeacherAssignmentPlan(Principal principal) {
        UserLogin u = userService.findById(principal.getName());
        List<ClassTeacherAssignmentPlan> classTeacherAssignmentPlanList = classTeacherAssignmentPlanService.findAll();
        return ResponseEntity.ok().body(classTeacherAssignmentPlanList);
    }

    @PostMapping("/upload-excel-teacher-course")
    public ResponseEntity<?> uploadExcelTeacherCourse(
        Principal principal, @RequestParam("inputJson") String inputJson,
        @RequestParam("file") MultipartFile file
    ) {
        Gson gson = new Gson();
        UploadExcelTeacherCourseInputModel input = gson.fromJson(
            inputJson,
            UploadExcelTeacherCourseInputModel.class);
        UUID planId = input.getPlanId();
        String choice = input.getChoice();
        log.info("uploadExcelTeacherCourse, choice = " + choice);
        boolean ok = classTeacherAssignmentPlanService.extractExcelAndStoreDBTeacherCourse(planId, choice, file);
        return ResponseEntity.ok().body(ok);
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @PostMapping("/add-teacher")
    public ResponseEntity<?> addTeacher(Principal principal, @RequestBody EduTeacher teacher) {
        String result = classTeacherAssignmentPlanService.addTeacher(teacher);
        log.info("addTeacher, teacherId " + teacher.getTeacherId());
        if (result.equals("OK")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    @GetMapping("/get-all-teachers")
    public ResponseEntity<?> getAllTeachers(Principal principal) {
        List<EduTeacher> eduTeachers = classTeacherAssignmentPlanService.findAllTeachers();
        return ResponseEntity.ok().body(eduTeachers);
    }

    @GetMapping("/get-all-teachers-by-page")
    public ResponseEntity<?> getTeachersByPage(
        Principal principal,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int pageSize,
        @RequestParam(defaultValue = "teacherName") String sortBy,
        @RequestParam(defaultValue = "asc") String sortType,
        @RequestParam(defaultValue = "_") String keyword
    ) {
        Sort sort = Sort.by(sortBy);
        if (sortType.equals("desc")) {
            sort = sort.descending();
        }
        Pageable paging = PageRequest.of(page, pageSize, sort);
        Page<EduTeacher> eduTeacherPage = classTeacherAssignmentPlanService.findAllTeachersByPage(keyword, paging);
        return ResponseEntity.ok(eduTeacherPage);
    }

    @GetMapping("/get-teacher-for-assignment/{planId}")
    public ResponseEntity<?> getTeacherForAssignmentPlan(Principal principal, @PathVariable UUID planId) {
        List<TeacherForAssignmentPlan> teacherForAssignmentPlans =
            classTeacherAssignmentPlanService.findAllTeacherByPlanId(planId);
        return ResponseEntity.ok().body(teacherForAssignmentPlans);

    }

    @GetMapping("/get-teacher-course-4-assignment/{planId}")
    public ResponseEntity<?> getTeacherCourseForAssignment(Principal principal, @PathVariable UUID planId) {
        List<TeacherCourseForAssignmentPlan> teacherCourses =
            classTeacherAssignmentPlanService.findTeacherCourseOfPlan(planId);

        return ResponseEntity.ok().body(teacherCourses);
    }

    @GetMapping("/get-pair-of-conflict-timetable-class/{planId}")
    public ResponseEntity<?> getPairOfConflictTimetableClass(Principal principal, @PathVariable UUID planId) {
        List<PairOfConflictTimetableClassModel> lst = classTeacherAssignmentPlanService.getPairOfConflictTimetableClass(
            planId);
        log.info("getPairOfConflictTimetableClass, return list.sz = " + lst.size());
        return ResponseEntity.ok().body(lst);
    }

    @GetMapping("/get-all-teacher-course")
    public ResponseEntity<?> getAllTeacherCourse(Principal principal) {
        List<TeacherCourse> teacherCourses = classTeacherAssignmentPlanService.findAllTeacherCourse();

        return ResponseEntity.ok().body(teacherCourses);
    }

    @PostMapping("/add-teacher-to-assign-plan")
    public ResponseEntity<?> addTeacherToAssignmentPlan(
        Principal principal,
        @RequestParam(required = false, name = "planId") UUID planId,
        @RequestParam(required = false, name = "teacherList") String teacherList
    ) {
        log.info("addTeacherToAssignmentPlan, planId = " + planId + " teacherList = " + teacherList);

        boolean ok = classTeacherAssignmentPlanService.addTeacherToAssignmentPlan(planId, teacherList);

        return ResponseEntity.ok().body(ok);

    }

    @PostMapping("/remove-teacher-from-assign-plan")
    public ResponseEntity<?> removeTeacherFromAssignmentPlan(
        Principal principal,
        @RequestParam(required = false, name = "planId") UUID planId,
        @RequestParam(required = false, name = "teacherList") String teacherList
    ) {
        log.info("removeTeacherFromAssignmentPlan, planId = " + planId + " teacherList = " + teacherList);

        boolean ok = classTeacherAssignmentPlanService.removeTeacherFromAssignmentPlan(planId, teacherList);

        return ResponseEntity.ok().body(ok);

    }

    @PostMapping("/remove-class-from-assign-plan")
    public ResponseEntity<?> removeClassFromAssignmentPlan(
        Principal principal,
        @RequestParam(required = false, name = "planId") UUID planId,
        @RequestParam(required = false, name = "classList") String classList
    ) {
        log.info("removeClassFromAssignmentPlan, planId = " + planId + " classList = " + classList);

        boolean ok = classTeacherAssignmentPlanService.removeClassFromAssignmentPlan(planId, classList);

        return ResponseEntity.ok().body(ok);

    }

    @PostMapping("/remove-class-teacher-assign-solution-list")
    public ResponseEntity<?> removeClassTeacherAssignmentSolutionList(
        Principal principal,
        @RequestParam(required = false, name = "planId") UUID planId,
        @RequestParam(required = false, name = "solutionItemList") String solutionItemList
    ) {
        log.info("removeClassFromAssignmentPlan, planId = " + planId + " solutionItemList = " + solutionItemList);

        boolean ok = classTeacherAssignmentPlanService.removeClassTeacherAssignmentSolutionList(
            planId,
            solutionItemList);

        return ResponseEntity.ok().body(ok);

    }

    @PostMapping("/add-teacher-course-to-assign-plan")
    public ResponseEntity<?> addTeacherCourseToAssignmentPlan(
        Principal principal,
        @RequestParam(required = false, name = "planId") UUID planId,
        @RequestParam(required = false, name = "teacherCourseList") String teacherCourseList
    ) {
        log.info("addTeacherCourseToAssignmentPlan, planId = " + planId + " teacherCourseList = " + teacherCourseList);

        boolean ok = classTeacherAssignmentPlanService.addTeacherCourseToAssignmentPlan(planId, teacherCourseList);

        return ResponseEntity.ok().body("OK");
    }

    @PostMapping("/remove-teacher-course-from-assign-plan")
    public ResponseEntity<?> removeTeacherCourseFromAssignmentPlan(
        Principal principal,
        @RequestParam(required = false, name = "planId") UUID planId,
        @RequestParam(required = false, name = "teacherCourseList") String teacherCourseList
    ) {
        log.info("removeTeacherCourseFromAssignmentPlan, planId = " +
                 planId +
                 " teacherCourseList = " +
                 teacherCourseList);

        boolean ok = classTeacherAssignmentPlanService.removeTeacherCourseFromAssignmentPlan(planId, teacherCourseList);

        return ResponseEntity.ok().body("OK");
    }

    @PostMapping("/auto-assign-teacher-2-class")
    public ResponseEntity<?> autoAssignTeacher2Class(
        @RequestBody RunAutoAssignTeacher2ClassInputModel input
    ) {
        classTeacherAssignmentPlanService.autoAssignTeacher2Class(input);
        return ResponseEntity.ok().body("OK");
    }

    @GetMapping("/get-class-teacher-assignment-solution/{planId}")
    public ResponseEntity<?> getClassTeacherAssignmentSolutions(Principal principal, @PathVariable UUID planId) {
        log.info("getClassTeacherAssignmentSolutions, planId = " + planId);
        List<ClassTeacherAssignmentSolutionModel> classTeacherAssignmentSolutionModels =
            classTeacherAssignmentPlanService.getClassTeacherAssignmentSolution(planId);
        return ResponseEntity.ok().body(classTeacherAssignmentSolutionModels);
    }

    @GetMapping("/get-classes-assigned-to-a-teacher-solution/{planId}")
    public ResponseEntity<?> getClassesAssignedToATeacherSolution(Principal principal, @PathVariable UUID planId) {
        List<ClassesAssignedToATeacherModel> lst = classTeacherAssignmentPlanService.getClassesAssignedToATeacherSolution(
            planId);
        return ResponseEntity.ok().body(lst);
    }

    @GetMapping("/get-conflict-class-assigned-to-teacher-in-solution/{planId}")
    public ResponseEntity<?> getConflictClassesAssignedToTeacherInSolution(
        Principal principal,
        @PathVariable UUID planId
    ) {
        List<ClassTeacherAssignmentSolutionModel> classTeacherAssignmentSolutionModels =
            classTeacherAssignmentPlanService.getClassTeacherAssignmentSolution(planId);
        log.info("getConflictClassesAssignedToTeacherInSolution, planId = " +
                 planId +
                 ", sol.sz = " +
                 classTeacherAssignmentSolutionModels.size());

        List<ConflictClassAssignedToTeacherModel> conflictClassAssignedToTeacherModels = new ArrayList();
        for (int i = 0; i < classTeacherAssignmentSolutionModels.size(); i++) {
            ClassTeacherAssignmentSolutionModel si = classTeacherAssignmentSolutionModels.get(i);
            for (int j = i + 1; j < classTeacherAssignmentSolutionModels.size(); j++) {
                ClassTeacherAssignmentSolutionModel sj = classTeacherAssignmentSolutionModels.get(j);
                if (si.getTeacherId().equals(sj.getTeacherId())) {
                    boolean conflict = TimetableConflictChecker
                        .conflictMultiTimeTable(si.getTimetable(), sj.getTimetable());
                    //.conflict(si.getTimetable(),sj.getTimetable());
                    //log.info("getConflictClassesAssignedToTeacherInSolution, timetable1 = " + si.getTimetable() + " timetable2 = " + sj.getTimetable() +
                    //         " conflict = " + conflict);
                    if (conflict) {
                        ConflictClassAssignedToTeacherModel e = new ConflictClassAssignedToTeacherModel();
                        e.setTeacherId(si.getTeacherId());
                        e.setTeacherName(si.getTeacherName());
                        e.setClassCode1(si.getClassCode());
                        e.setCourseName1(si.getCourseName());
                        e.setTimeTable1(si.getTimetable());
                        e.setClassCode2(sj.getClassCode());
                        e.setCourseName2(sj.getCourseName());
                        e.setTimeTable2(sj.getTimetable());
                        conflictClassAssignedToTeacherModels.add(e);
                    }
                }
            }
        }
        log.info("getConflictClassesAssignedToTeacherInSolution, conflict list.sz = " +
                 conflictClassAssignedToTeacherModels.size());
        return ResponseEntity.ok().body(conflictClassAssignedToTeacherModels);
    }

    @GetMapping("/get-classes-assigned-to-a-teacher-solution-for-view-grid/{planId}")
    public ResponseEntity<?> getClassesAssignedToATeacherSolutionForViewGrid(
        Principal principal,
        @PathVariable UUID planId
    ) {
        log.info("getClassesAssignedToATeacherSolutionForViewGrid, planId = " + planId);
        List<ClassesAssignedToATeacherModel> lst = classTeacherAssignmentPlanService
            .getClassesAssignedToATeacherSolutionDuplicateWhenMultipleFragmentTimeTable(
                planId);
        return ResponseEntity.ok().body(lst);
    }

    @PostMapping("/update-class-for-assignment")
    public ResponseEntity<?> updateClassForAssignment(
        Principal principal,
        @RequestBody UpdateClassForAssignmentInputModel input
    ) {
        UserLogin u = userService.findById(principal.getName());
        ClassTeacherAssignmentClassInfo c = classTeacherAssignmentPlanService.updateClassForAssignment(u, input);
        return ResponseEntity.ok().body(c);
    }

    @PostMapping("/update-teacher-for-assignment")
    public ResponseEntity<?> updateTeacherForAssignment(
        Principal principal,
        @RequestBody UpdateTeacherForAssignmentInputModel input
    ) {
        UserLogin u = userService.findById(principal.getName());
        TeacherForAssignmentPlan t = classTeacherAssignmentPlanService.updateTeacherForAssignment(u, input);
        return ResponseEntity.ok().body(t);
    }

    @PostMapping("/update-teacher-course-for-assignment-plan")
    public ResponseEntity<?> updateTeacherCourseForAssignmentPlan(
        Principal principal,
        @RequestBody UpdateTeacherCoursePriorityForAssignmentPlanInputModel input
    ) {

        UserLogin u = userService.findById(principal.getName());
        log.info("updateTeacherCourseForAssignmentPlan, planId = " +
                 input.getPlanId() +
                 " teacherId = " +
                 input.getTeacherId()
                 +
                 " courseId = " +
                 input.getCourseId() +
                 " priority = " +
                 input.getPriority());
        TeacherCourseForAssignmentPlan teacherCourseForAssignmentPlan = classTeacherAssignmentPlanService
            .updateTeacherCourseForAssignmentPlan(u, input);

        return ResponseEntity.ok().body("OK)");
    }

    @GetMapping("/get-not-assigned-class-solution/{planId}")
    public ResponseEntity<?> getNotAssignedClassSolution(Principal principal, @PathVariable UUID planId) {
        List<ClassTeacherAssignmentSolutionModel> notAssignedClasses =
            classTeacherAssignmentPlanService.getNotAssignedClassSolution(planId);
        log.info("getNotAssignedClassSolution, return list.sz = " + notAssignedClasses.size());
        return ResponseEntity.ok().body(notAssignedClasses);
    }

    @GetMapping("/get-suggested-teacher-for-class/{classId}/{planId}")
    public ResponseEntity<?> getSuggestedTeacherForClass(
        Principal principal,
        @PathVariable String classId,
        @PathVariable UUID planId
    ) {
        log.info("getSuggestedTeacherForClass, classId = " + classId);
        List<SuggestedTeacherForClass> lst = classTeacherAssignmentPlanService.getSuggestedTeacherForClass(
            classId,
            planId);

        return ResponseEntity.ok().body(lst);
    }

    @GetMapping("/get-suggested-teacher-and-actions-for-class/{classId}/{planId}")
    public ResponseEntity<?> getSuggestedTeacherAndActionsForClass(
        Principal principal,
        @PathVariable String classId,
        @PathVariable UUID planId
    ) {
        log.info("getSuggestedTeacherAndActionForClass, classId = " + classId + " planId = " + planId);
        List<SuggestedTeacherAndActionForClass> lst = classTeacherAssignmentPlanService
            .getSuggestedTeacherAndActionForClass(classId, planId);

        return ResponseEntity.ok().body(lst);
    }

    @PostMapping("/manual-remove-class-teacher-assignment-solution")
    public ResponseEntity<?> manualRemoveClassTeacherAssignmentSolution(
        Principal principal,
        @RequestBody RemoveClassTeacherAssignmentSolutionInputModel input
    ) {
        UserLogin u = userService.findById(principal.getName());
        log.info("manualRemoveClassTeacherAssignmentSolution, solutionItemId = " + input.getSolutionItemId());
        boolean ok = classTeacherAssignmentPlanService.removeClassTeacherAssignmentSolution(u, input);
        return ResponseEntity.ok().body(ok);
    }

    @GetMapping(value = "/export-excel-class-teacher-assignment-solution/{planId}")
    //public void exportExcelClassTeacherAssignmentSolution(HttpServletResponse response, @PathVariable UUID planId){
    public ResponseEntity<?> exportExcelClassTeacherAssignmentSolution(@PathVariable UUID planId) {

        log.info("exportExcelClassTeacherAssignmentSolution, planId = " + planId);

        ClassTeacherAssignmentPlanDetailModel plan = classTeacherAssignmentPlanService.getClassTeacherAssignmentPlanDetail(
            planId);
        List<ClassTeacherAssignmentSolutionModel> solution = classTeacherAssignmentPlanService.getClassTeacherAssignmentSolution(
            planId);
        ClassTeacherAssignmentSolutionExcelExporter exporter
            = new ClassTeacherAssignmentSolutionExcelExporter(solution);

        ByteArrayInputStream in = exporter.toExcel();

        HttpHeaders headers = new HttpHeaders();

        headers.add("Content-Type", "application/octet-stream");
        headers.add("Content-Disposition", "attachment; filename=" + plan.getPlanName() + ".xlsx");
        headers.add("Access-Control-Expose-Headers", "Content-Disposition");

        return ResponseEntity
            .ok()
            .headers(headers)
            .body(new InputStreamResource(in));

        /*
        response.setContentType("application/octet-stream");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=phan_cong_" + currentDateTime + ".xlsx";
        response.setHeader(headerKey, headerValue);

        List<ClassTeacherAssignmentSolutionModel> solution =
            classTeacherAssignmentPlanService.getClassTeacherAssignmentSolution(planId);

        ClassTeacherAssignmentSolutionExcelExporter exporter
            = new ClassTeacherAssignmentSolutionExcelExporter(solution);

        try {
            exporter.export(response);
        }catch(Exception e){
            e.printStackTrace();
        }
        */

    }

    @PostMapping("/manual-assign-teacher-to-class")
    public ResponseEntity<?> manualAssignTeacherToClass(
        Principal principal,
        @RequestBody AssignTeacherToClassInputModel input
    ) {
        UserLogin u = userService.findById(principal.getName());
        log.info("manualAssignTeacherToClass, planId = " + input.getPlanId() + " teacherId = " + input.getTeacherId()
                 + " classId = " + input.getClassId());

        TeacherClassAssignmentSolution teacherClassAssignmentSolution = classTeacherAssignmentPlanService.assignTeacherToClass(
            u,
            input);
        return ResponseEntity.ok().body(teacherClassAssignmentSolution);
    }

    @PostMapping("/manual-reassign-teacher-to-class")
    public ResponseEntity<?> manualReAssignTeacherToClass(
        Principal principal,
        @RequestBody AssignTeacherToClassInputModel input
    ) {
        // class input.getClassId() was assigned to a teacher t
        // now remove class input.getClassId() from t, and re-assign to teacher input.getTeacherId()

        UserLogin u = userService.findById(principal.getName());
        log.info("manualReAssignTeacherToClass, planId = " + input.getPlanId() + " teacherId = " + input.getTeacherId()
                 + " classId = " + input.getClassId());

        TeacherClassAssignmentSolution teacherClassAssignmentSolution = classTeacherAssignmentPlanService.reAssignTeacherToClass(
            u,
            input);
        return ResponseEntity.ok().body(teacherClassAssignmentSolution);
    }

    @GetMapping("/get-class-teacher-assignment-plan/detail/{planId}")
    public ResponseEntity<?> getClassTeacherAssignmentPlanDetail(Principal principal, @PathVariable UUID planId) {
        log.info("getClassTeacherAssignmentPlanDetail, planId = " + planId);
        ClassTeacherAssignmentPlanDetailModel classTeacherAssignmentPlanDetailModel = classTeacherAssignmentPlanService
            .getClassTeacherAssignmentPlanDetail(planId);
        return ResponseEntity.ok().body(classTeacherAssignmentPlanDetailModel);
    }

    @PostMapping("/create-class-teacher-assignment-plan")
    public ResponseEntity<?> createClassTeacherAssignmentPlan(
        Principal principal, @RequestBody
        ClassTeacherAssignmentPlanCreateModel input
    ) {
        UserLogin u = userService.findById(principal.getName());
        log.info("createClassTeacherAssignmentPlan, planName   = " + input.getPlanName());
        ClassTeacherAssignmentPlan classTeacherAssignmentPlan = classTeacherAssignmentPlanService.create(u, input);
        return ResponseEntity.ok().body(classTeacherAssignmentPlan);

    }

    @GetMapping("/get-class-list-for-assignment-2-teacher/{planId}")
    public ResponseEntity<?> getClassListForAssignment2Teacher(Principal principal, @PathVariable UUID planId) {
        log.info("getClassListForAssignment2Teacher, planId = " + planId);
        List<ClassInfoForAssignment2TeacherModel> classTeacherAssignmentClassInfos =
            classTeacherAssignmentPlanService.findAllClassTeacherAssignmentClassByPlanId(planId);
        return ResponseEntity.ok().body(classTeacherAssignmentClassInfos);
    }


    @PostMapping("/teacherclassassignment/algo")
    public ResponseEntity<?> computeTeacherClassAssignment(
        Principal principal, @RequestBody
        AlgoTeacherAssignmentIM input
    ) {
        System.out.println("computeTeacherClassAssignment start");
        TeacherClassAssignmentOM teacherClassAssignmentOM = algoService.computeTeacherClassAssignment(
            input);

        return ResponseEntity.ok().body(teacherClassAssignmentOM);
    }

    @PostMapping("/teacher-class-assignment/mip")
    public ResponseEntity<?> assign(@RequestBody AlgoTeacherAssignmentIM input) {
        return ResponseEntity.ok().body(assignmentService.assign(input));
    }
}
