package com.hust.baseweb.applications.education.classmanagement.controller;

import com.google.gson.Gson;
import com.hust.baseweb.applications.education.classmanagement.service.ClassServiceImpl;
import com.hust.baseweb.applications.education.content.Video;
import com.hust.baseweb.applications.education.content.VideoService;
import com.hust.baseweb.applications.education.entity.*;
import com.hust.baseweb.applications.education.exception.SimpleResponse;
import com.hust.baseweb.applications.education.model.*;
import com.hust.baseweb.applications.education.model.educlassuserloginrole.AddEduClassUserLoginRoleIM;
import com.hust.baseweb.applications.education.model.educlassuserloginrole.ClassOfUserOM;
import com.hust.baseweb.applications.education.model.educlassuserloginrole.EduClassUserLoginRoleType;
import com.hust.baseweb.applications.education.repo.ClassRepo;
import com.hust.baseweb.applications.education.report.model.courseparticipation.StudentCourseParticipationModel;
import com.hust.baseweb.applications.education.report.model.quizparticipation.StudentQuizParticipationModel;
import com.hust.baseweb.applications.education.service.*;
import com.hust.baseweb.applications.notifications.service.NotificationsService;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Log4j2
@Controller
@Validated
@RequestMapping("/edu/class")
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class ClassController {

    private ClassServiceImpl classService;
    private CourseService courseService;
    private SemesterService semesterService;
    private UserService userService;
    private EduDepartmentService eduDepartmentService;
    private EduCourseChapterService eduCourseChapterService;
    private EduCourseChapterMaterialService eduCourseChapterMaterialService;
    private LogUserLoginCourseChapterMaterialService logUserLoginCourseChapterMaterialService;
    private LogUserLoginQuizQuestionService logUserLoginQuizQuestionService;
    private VideoService videoService;
    private NotificationsService notificationsService;
    private ClassRepo classRepo;
    @PostMapping
    public ResponseEntity<?> getClassesOfCurrSemester(
        Principal principal,
        @RequestParam
        @Min(value = 0, message = "Số trang có giá trị không âm") Integer page,
        @RequestParam
        @Min(value = 0, message = "Kích thước trang có giá trị không âm") Integer size,
        @RequestBody GetClassesIM filterParams
    ) {
        log.info("getClassesOfCurrSemester");

        if (null == page) {
            page = 0;
        }

        if (null == size) {
            size = 20;
        }

        return ResponseEntity
            .ok()
            .body(classService.getClassesOfCurrentSemester(
                principal.getName(),
                filterParams,
                PageRequest.of(page, size)));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegistIM im, Principal principal) {
        SimpleResponse res = classService.register(im.getClassId(), principal.getName());
        return ResponseEntity.status(res.getStatus()).body(res.getMessage());
    }
    @GetMapping("/ping")
    public ResponseEntity<?> ping(Principal principal){
        log.info("ping");
        return ResponseEntity.ok().body("OK");
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @PostMapping("/add-class-user-login-role")
    public ResponseEntity addEduClassUserLoginRole(Principal principal,
                                                @RequestBody AddEduClassUserLoginRoleIM input){
        log.info("addEduClassUserLoginRole, classId = " + input.getClassId()
                 + " userlogin = " + input.getUserLoginId() + " roleId = " + input.getRoleId());

        EduClassUserLoginRole eduClassUserLoginRole = classService.addEduClassUserLoginRole(input);

        return ResponseEntity.ok().body("OK");
    }
    @GetMapping("/get-classes-of-user/{userLoginId}")
    public ResponseEntity getClassesOfUser(Principal principal, @PathVariable String userLoginId){
        String currentUserLoginId = principal.getName();
        log.info("getClassesOfUser, currentUserLoginId = " + currentUserLoginId + " userLoginId = " + userLoginId);

        if(userLoginId.equals("null")) userLoginId = currentUserLoginId;

        List<ClassOfUserOM> eduClasses = classService.getClassOfUser(userLoginId);
        return ResponseEntity.ok().body(eduClasses);
    }
    @GetMapping("/get-role-list-educlass-userlogin")
    public ResponseEntity<?> getRoleListEduClassUserLogin(){
        List<EduClassUserLoginRoleType> lst = new ArrayList();
        lst.add(new EduClassUserLoginRoleType(EduClassUserLoginRole.ROLE_PARTICIPANT,"Người tham gia"));
        lst.add(new EduClassUserLoginRoleType(EduClassUserLoginRole.ROLE_OWNER,"Người tạo và sở hữu"));
        lst.add(new EduClassUserLoginRoleType(EduClassUserLoginRole.ROLE_MANAGER,"Người quản lý"));
        return ResponseEntity.ok().body(lst);
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/update-class-status")
    public ResponseEntity updateClassStatus(Principal principal, @RequestParam UUID classId,
                                            @RequestParam String status){
        log.info("updateClassStatus, classId = " + classId + ", status = " + status);
        EduClass eduClass = classRepo.findById(classId).orElse(null);
        if(eduClass != null){
            eduClass.setStatusId(status);
            eduClass = classRepo.save(eduClass);
        }else{
            log.info("updateClassStatus, classId = " + classId + ", status = " + status + " class NOT FOUND??");
        }
        return ResponseEntity.ok().body("OK");
    }

    @GetMapping("/{id}/students")
    public ResponseEntity<List<GetStudentsOfClassOM>> getStudentsOfClass(@PathVariable UUID id) {
        return ResponseEntity.ok().body(classService.getStudentsOfClass(id));
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/{id}/registered-students")
    public ResponseEntity<List<GetStudentsOfClassOM>> getRegistStudentsOfClass(@PathVariable UUID id) {
        List<GetStudentsOfClassOM> lst = classService.getRegistStudentsOfClass(id);
        log.info("getRegistStudentsOfClass, lst.sz = " + lst.size());
        return ResponseEntity.ok().body(lst);
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @PutMapping("/registration-status")
    public ResponseEntity<?> updateRegistStatus(@Valid @RequestBody UpdateRegistStatusIM im) {
        return ResponseEntity
            .ok()
            .body(classService.updateRegistStatus(im.getClassId(), im.getStudentIds(), im.getStatus()));
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/list/teacher")
    public ResponseEntity<?> getClassesOfTeacher(Principal principal) {
        return ResponseEntity.ok().body(classService.getClassesOfTeacher(principal.getName()));
    }

    @GetMapping("/list/student")
    public ResponseEntity<?> getClassesOfStudent(Principal principal) {
        return ResponseEntity.ok().body(classService.getClassesOfStudent(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getClassDetail(@PathVariable UUID id) {
        return ResponseEntity.ok().body(classService.getClassDetail(id));
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/{id}/assignments/teacher")
    public ResponseEntity<?> getAssignOfClass4Teacher(@PathVariable UUID id) {
        return ResponseEntity.ok().body(classService.getAssign4Teacher(id));
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/{id}/all-student-assignments/teacher")
    public ResponseEntity<?> getAllStuAssignOfClass4Teacher(@PathVariable UUID id) {
        return ResponseEntity.ok().body(classService.getAllStuAssign4Teacher(id));
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/{id}/assignmentsSubmission/teacher")
    public ResponseEntity<?> getAssignSubmitOfClass4Teacher(@PathVariable UUID id) {
        return ResponseEntity.ok().body(classService.getAssignSubmit4Teacher(id));
    }

    @GetMapping("/{id}/assignments/student")
    public ResponseEntity<?> getAssignOfClass4Student(@PathVariable UUID id) {
        return ResponseEntity.ok().body(classService.getAssign4Student(id));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addEduClass(Principal principal, @RequestBody AddClassModel addClassModel) {
        log.info("addEduClass, start....");
        UserLogin userLogin = userService.findById(principal.getName());
        EduClass aClass = classService.save(userLogin, addClassModel);
        return ResponseEntity.ok().body(aClass);
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/get-all-courses")
    public ResponseEntity<?> getAllCourses(Principal principal) {
        log.info("getAllCourses start...");
        List<EduCourse> courses = courseService.findAll();
        log.info("getAllCourses, GOT " + courses.size());
        return ResponseEntity.ok().body(courses);
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/get-chapters-of-course/{courseId}")
    public ResponseEntity<?> getChaptersOfCourse(Principal principal, @PathVariable String courseId) {
        log.info("getChaptersOfCourse start... courseId = " + courseId);
        //List<EduCourseChapter> eduCourseChapters = eduCourseChapterService.findAll();
        List<EduCourseChapter> eduCourseChapters = eduCourseChapterService.findAllByCourseId(courseId);
        log.info("getChaptersOfCourse, GOT " + eduCourseChapters.size());
        return ResponseEntity.ok().body(eduCourseChapters);
    }

    @GetMapping("/get-chapters-of-class/{classId}")
    public ResponseEntity<?> getChaptersOfClass(Principal principal, @PathVariable UUID classId) {
        GetClassDetailOM eduClass = classService.getClassDetail(classId);
        String courseId = eduClass.getCourseId();

        List<EduCourseChapter> eduCourseChapters = eduCourseChapterService.findAllByCourseId(courseId);
//        log.info("getChaptersOfClass, classId = " + classId + ", courseId = " + courseId
//                 + " RETURN list.sz = " + eduCourseChapters.size());

        return ResponseEntity.ok().body(eduCourseChapters);
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @PostMapping("/create-chapter-of-course")
    public ResponseEntity<?> createChapterOfCourse(
        Principal principal,
        @RequestBody EduCourseChapterModelCreate eduCourseChapterModelCreate
    ) {
        log.info("createChapterOfCourse, courseId = " + eduCourseChapterModelCreate.getCourseId() + " chapterName = " +
                 eduCourseChapterModelCreate.getChapterName());
        EduCourseChapter eduCourseChapter = eduCourseChapterService.save(eduCourseChapterModelCreate);
        return ResponseEntity.ok().body(eduCourseChapter);
    }

    @GetMapping("/change-chapter-status/{chapterId}")
    public ResponseEntity<?> changeChapterStatus(Principal principal, @PathVariable UUID chapterId) {
        log.info("changeChapterStatus, chapterId = " + chapterId);
        String statusId = eduCourseChapterService.changeOpenCloseChapterStatus(chapterId);
        return ResponseEntity.ok().body(statusId);
    }

    @GetMapping("/get-course-chapter-material-type-list")
    public ResponseEntity<?> getCourseChapterMaterialTypeList(Principal principal) {
        log.info("getCourseChapterMaterialTypeList");
        List<String> types = new ArrayList<>();
        types.add(EduCourseChapterMaterial.EDU_COURSE_MATERIAL_TYPE_SLIDE);
        types.add(EduCourseChapterMaterial.EDU_COURSE_MATERIAL_TYPE_VIDEO);
        return ResponseEntity.ok().body(types);
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @PostMapping("/create-chapter-material-of-course")
    //public ResponseEntity<?> createChapterMaterialOfCourse(Principal principal, @RequestBody
    //  EduCourseChapterMaterialModelCreate eduCourseChapterMaterialModelCreate){
    public ResponseEntity<?> createChapterMaterialOfCourse(
        Principal principal, @RequestParam("inputJson") String inputJson,
        @RequestParam("files") MultipartFile[] files
    ) {
        UserLogin u = userService.findById(principal.getName());

        Gson gson = new Gson();
        EduCourseChapterMaterialModelCreate eduCourseChapterMaterialModelCreate = gson.fromJson(
            inputJson,
            EduCourseChapterMaterialModelCreate.class);

        log.info("createChapterMaterialOfCourse, chapterId = " + eduCourseChapterMaterialModelCreate.getChapterId()
                 + " materialName = " + eduCourseChapterMaterialModelCreate.getMaterialName() + " materialType = " +
                 eduCourseChapterMaterialModelCreate.getMaterialType());
        EduCourseChapterMaterial eduCourseChapterMaterial = null;
        try {
            Video video = videoService.create(files[0]);
            log.info("createChapterMaterialOfCourse, videoId = " + video.getId());
            eduCourseChapterMaterial = eduCourseChapterMaterialService.save(eduCourseChapterMaterialModelCreate, video);

        } catch (Exception e) {
            e.printStackTrace();
        }

        // push notification
        List<String> userLoginIds = userService
            .findAllUserLoginIdOfGroup("ROLE_EDUCATION_LEARNING_MANAGEMENT_STUDENT");
        for (String userLoginId : userLoginIds) {
            log.info("createChapterMaterialOfCourse, push notif to " + userLoginId);
            notificationsService.create(u.getUserLoginId(), userLoginId,
                                        u.getUserLoginId() + " vừa upload bài giảng "
                                        + eduCourseChapterMaterialModelCreate.getMaterialName()
                + ", chương " + eduCourseChapterMaterial.getEduCourseChapter().getChapterName()
                                        + ", môn học" + eduCourseChapterMaterial.getEduCourseChapter().getEduCourse().getName(),
                                        "");
        }
        return ResponseEntity.ok().body(eduCourseChapterMaterial);
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/get-course-chapter-material-detail/{id}")
    public ResponseEntity<?> getCourseChapterMaterialDetail(Principal principal, @PathVariable UUID id) {
        log.info("getCourseChapterMaterialDetail, id = " + id);
        UserLogin userLogin = userService.findById(principal.getName());
        logUserLoginCourseChapterMaterialService.logUserLoginMaterial(userLogin, id);
        log.info("getCourseChapterMaterialDetail, id = " + id);
        EduCourseChapterMaterial eduCourseChapterMaterial = eduCourseChapterMaterialService.findById(id);
        return ResponseEntity.ok().body(eduCourseChapterMaterial);
    }

    @GetMapping("/get-course-chapter-material-detail/{courseId}/{classId}")
    public ResponseEntity<?> getCourseChapterMaterialDetailV2(
            Principal principal, @PathVariable UUID courseId, @PathVariable UUID classId) {
        log.info("getCourseChapterMaterialDetail, id = " + courseId);
        String userId = principal.getName();
        logUserLoginCourseChapterMaterialService.logUserLoginMaterialV2(userId, classId, courseId);
        log.info("getCourseChapterMaterialDetail, id = " + courseId);
        EduCourseChapterMaterial eduCourseChapterMaterial = eduCourseChapterMaterialService.findById(courseId);
        return ResponseEntity.ok().body(eduCourseChapterMaterial);
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/get-chapter-materials-of-course/{chapterId}")
    public ResponseEntity<?> getChapterMaterialsOfCourse(Principal principal, @PathVariable UUID chapterId) {
        //List<EduCourseChapterMaterial> eduCourseChapterMaterials = eduCourseChapterMaterialService.findAll();
        List<EduCourseChapterMaterial> eduCourseChapterMaterials = eduCourseChapterMaterialService.findAllByChapterId(
            chapterId);
        return ResponseEntity.ok().body(eduCourseChapterMaterials);
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/get-all-semesters")
    public ResponseEntity<?> getAllSemesters(Principal principal) {
        log.info("getAllSemester start...");
        List<Semester> semesters = semesterService.findAll();
        log.info("getAllSemester GOT " + semesters.size());
        return ResponseEntity.ok().body(semesters);
    }

    @GetMapping("/get-all-departments")
    public ResponseEntity<?> getAllEduDepartments(Principal principal) {

        List<EduDepartment> eduDepartments = eduDepartmentService.findAll();
        log.info("getAllEduDepartments, GOT sz = " + eduDepartments.size());
        return ResponseEntity.ok().body(eduDepartments);
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/get-log-user-course-chapter-material/{classId}")
    public ResponseEntity<?> getLogUserCourseChapterMaterial(Principal principal, @PathVariable UUID classId) {
        log.info("getLogUserCourseChapterMaterial, classId = " + classId);
        UserLogin userLogin = userService.findById(principal.getName());

        List<StudentCourseParticipationModel> studentCourseParticipationModels =
            logUserLoginCourseChapterMaterialService.findAllByClassId(classId);
        return ResponseEntity.ok().body(studentCourseParticipationModels);
    }

    @GetMapping("/get-log-user-course-chapter-material-by-page")
    public ResponseEntity<?> getLogUserCourseChapterMaterialByPage(
        @RequestParam(name="classId") UUID classId,
        @RequestParam(name="page", defaultValue = "0") int page,
        @RequestParam(name="pageSize", defaultValue = "5") int pageSize,
        @RequestParam(name="sortType", defaultValue = "desc") String sortType,
        @RequestParam(name="keyword", defaultValue = "_") String keyword
    ) {
        log.info("getLogUserCourseChapterMaterial, classId = " + classId);

        Sort sort = Sort.by("createStamp");
        if(sortType.equals("desc")) sort = sort.descending();
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        
        Page<StudentCourseParticipationModel> studentCourseParticipationModels =
            logUserLoginCourseChapterMaterialService.findDataByClassIdAndPage(classId, keyword, pageable);
        return ResponseEntity.ok().body(studentCourseParticipationModels);
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/{classId}/user-quiz/log")
    public ResponseEntity<?> getLogUserQuiz(
        @PathVariable UUID classId,
        @RequestParam(defaultValue = "0") @PositiveOrZero Integer page,
        @RequestParam(defaultValue = "10") @Positive Integer size
    ) {
        log.info("getLogUserQuiz, classId = " + classId);
        Page<StudentQuizParticipationModel> studentQuizParticipationModels = logUserLoginQuizQuestionService.findByClassId(
            classId,
            page,
            size);

        return ResponseEntity.ok().body(studentQuizParticipationModels);
    }
}
