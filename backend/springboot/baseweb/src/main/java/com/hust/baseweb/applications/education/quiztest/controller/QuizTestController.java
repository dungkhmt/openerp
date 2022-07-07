package com.hust.baseweb.applications.education.quiztest.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hust.baseweb.applications.education.classmanagement.service.ClassService;
import com.hust.baseweb.applications.education.entity.EduClass;
import com.hust.baseweb.applications.education.entity.QuizQuestion;
import com.hust.baseweb.applications.education.model.quiz.QuizQuestionDetailModel;
import com.hust.baseweb.applications.education.quiztest.UserQuestionQuizExecutionOM;
import com.hust.baseweb.applications.education.quiztest.entity.EduQuizTest;
import com.hust.baseweb.applications.education.quiztest.entity.EduTestQuizParticipant;
import com.hust.baseweb.applications.education.quiztest.entity.EduTestQuizRole;
import com.hust.baseweb.applications.education.quiztest.model.*;
import com.hust.baseweb.applications.education.quiztest.model.edutestquizparticipation.GetQuizTestParticipationExecutionResultInputModel;
import com.hust.baseweb.applications.education.quiztest.model.edutestquizparticipation.QuizTestParticipationExecutionResultOutputModel;
import com.hust.baseweb.applications.education.quiztest.model.quitestgroupquestion.AutoAssignQuestion2QuizTestGroupInputModel;
import com.hust.baseweb.applications.education.quiztest.model.quiztestgroup.AutoAssignParticipants2QuizTestGroupInputModel;
import com.hust.baseweb.applications.education.quiztest.model.quiztestquestion.CopyQuestionFromQuizTest2QuizTestInputModel;
import com.hust.baseweb.applications.education.quiztest.repo.EduTestQuizParticipantRepo;
import com.hust.baseweb.applications.education.quiztest.repo.EduTestQuizRoleRepo;
import com.hust.baseweb.applications.education.quiztest.service.EduQuizTestGroupService;
import com.hust.baseweb.applications.education.quiztest.service.EduQuizTestParticipantRoleService;
import com.hust.baseweb.applications.education.quiztest.service.EduQuizTestQuizQuestionService;
import com.hust.baseweb.applications.education.quiztest.service.QuizTestService;
import com.hust.baseweb.applications.education.service.QuizQuestionService;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;

@Log4j2
@Controller
@Validated
@AllArgsConstructor(onConstructor = @__(@Autowired))
@CrossOrigin
public class QuizTestController {

    private QuizTestService quizTestService;
    private UserService userService;
    private EduTestQuizParticipantRepo eduTestQuizParticipationRepo;
    private QuizQuestionService quizQuestionService;
    private ClassService classService;
    private EduQuizTestQuizQuestionService eduQuizTestQuizQuestionService;
    private EduQuizTestGroupService eduQuizTestGroupService;
    private EduTestQuizRoleRepo eduTestQuizRoleRepo;
    private EduQuizTestParticipantRoleService eduQuizTestParticipantRoleService;

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @PostMapping("/create-quiz-test")
    public ResponseEntity<?> createQuizCourseTopic(
        Principal principal,
        @RequestParam(required = false, name = "QuizTestCreateInputModel") String json
    ) {
        Gson g = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ssZ").create();
        QuizTestCreateInputModel input = g.fromJson(json, QuizTestCreateInputModel.class);

        UserLogin user = userService.findById(principal.getName());


        //System.out.println(input);
        return ResponseEntity.ok().body(quizTestService.save(input, user));
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @PostMapping("/update-quiz-test")
    public ResponseEntity<?> updateQuizTest(Principal principal, @RequestBody EditQuizTestInputModel input) {
        EduQuizTest eduQuizTest = quizTestService.update(input);
        return ResponseEntity.ok().body(eduQuizTest);
    }
    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/open-quiz-test/{testId}")
    public ResponseEntity<?> openQuizTest(Principal principal, @PathVariable String testId) {
        EduQuizTest eduQuizTest = quizTestService.openQuizTest(testId);
        return ResponseEntity.ok().body(eduQuizTest);
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/hide-quiz-test/{testId}")
    public ResponseEntity<?> hideQuizTest(Principal principal, @PathVariable String testId) {
        EduQuizTest eduQuizTest = quizTestService.hideQuizTest(testId);
        return ResponseEntity.ok().body(eduQuizTest);
    }
    @GetMapping("/get-users-role-of-quiz-test/{testId}")
    public ResponseEntity<?> getUserRolesOfQuizTest(@PathVariable String testId){
        List<QuizTestParticipantRoleModel> res = eduQuizTestParticipantRoleService.getParticipantRolesOfQuizTest(testId);
        return ResponseEntity.ok().body(res);
    }
    @GetMapping("/get-all-quiz-test")
    public ResponseEntity<?> getAllQuizTests(Principal principal){
        List<QuizTestParticipantRoleModel> res = eduQuizTestParticipantRoleService.getAllQuizTests();
        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/get-quiz-tests-of-user-login")
    public ResponseEntity<?> getQuizTestsOfUserLogin(Principal principal){
        List<QuizTestParticipantRoleModel> res = eduQuizTestParticipantRoleService.getQuizTestsOfUser(principal.getName());
        return ResponseEntity.ok().body(res);
    }

    @PostMapping("/add-quiz-test-participant-role")
    public ResponseEntity<?> addQuizTestParticipantRole(Principal principal, @RequestBody ModelCreateEduQuizTestParticipantRole input){
        EduTestQuizRole eduTestQuizRole = eduQuizTestParticipantRoleService.save(input);
        return ResponseEntity.ok().body(eduTestQuizRole);
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/get-all-quiz-test-by-user")
    public ResponseEntity<?> getAllQuizTestByUserLogin(
        Principal principal
    ) {
        return ResponseEntity.ok().body(quizTestService.getAllTestByCreateUser(principal.getName()));
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/get-quiz-test")
    public ResponseEntity<?> getQuizTestByTestId(
        Principal principal,
        @RequestParam(required = false, name = "testId") String testId
    ) {
        return ResponseEntity.ok().body(quizTestService.getQuizTestById(testId));
    }
    @GetMapping("/get-list-question-statement-view-type-id")
    public ResponseEntity<?> getListQuestionStatementViewTypeId(){
        List<String> L = EduQuizTest.getListQuestionStatementViewType();
        return ResponseEntity.ok().body(L);
    }

    @GetMapping("/get-all-quiz-test-user")
    public ResponseEntity<?> getAllQuizTestByUser(
        Principal principal
    ) {
        UserLogin user = userService.findById(principal.getName());
        List<EduQuizTestModel> listQuizTest = quizTestService.getListQuizByUserId(user.getUserLoginId());
        return ResponseEntity.ok().body(listQuizTest);
    }
    @GetMapping("/get-active-quiz-of-session-for-participant/{sessionId}")
    public ResponseEntity<?> getActiveQuizTestOfSession(
        Principal principal, @PathVariable UUID sessionId
    ) {
        UserLogin user = userService.findById(principal.getName());

        List<EduQuizTestModel> listQuizTest = quizTestService.getListOpenQuizTestOfSession(sessionId,user.getUserLoginId());
        if(listQuizTest == null ||  listQuizTest.size() == 0) {
            log.info("getActiveQuizTestOfSession, listQuizTest null or size = 0 -> RETURN");
            return ResponseEntity.ok().body(new QuizGroupTestDetailModel());
        }

        QuizGroupTestDetailModel testDetail = null;
        //for(EduQuizTestModel qt: listQuizTest){
        // TO BE IMPROVED
        EduQuizTestModel qt = listQuizTest.get(0);
            String testID = qt.getTestId();
            /*
            EduQuizTest eduQuizTest = quizTestService.getQuizTestById(testID);
            Date startDateTime = eduQuizTest.getScheduleDatetime();
            Date currentDate = new Date();
            int timeTest = ((int) (currentDate.getTime() - startDateTime.getTime())) / (60 * 1000); //minutes
            log.info("getTestGroupQuestionByUser, current = " + currentDate.toString() +
                     " scheduleDate = " + startDateTime.toString() + " timeTest = " + timeTest);

            if (timeTest > eduQuizTest.getDuration() || timeTest < 0) {// out-of-allowed date-time
                return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(null);
            }
            */
            log.info("getActiveQuizTestOfSession, get TestId = " + testID);
            EduTestQuizParticipant testParticipant = eduTestQuizParticipationRepo
                .findEduTestQuizParticipantByParticipantUserLoginIdAndAndTestId(
                principal.getName(),
                testID);

            if (testParticipant == null ||
                (!testParticipant.getStatusId().equals(EduTestQuizParticipant.STATUS_APPROVED))) {
                log.info("getActiveQuizTestOfSession, participant to testID " + testID + " is NULL -> return");
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
            }


            testDetail = eduQuizTestGroupService.getTestGroupQuestionDetail(principal, testID);

            // check if user has already done the quiz question, then return null
            // in this context, each user can only take quiz once
            Set<String> disableQuestionIds = new HashSet();
            for(String questionId: testDetail.getParticipationExecutionChoice().keySet()){
                List<UUID> choiceAnswers = testDetail.getParticipationExecutionChoice().get(questionId);
                if(choiceAnswers.size() > 0){
                    // disable this question, do not return
                    disableQuestionIds.add(questionId);
                }
            }
            for(String qid: disableQuestionIds){
                testDetail.getParticipationExecutionChoice().remove(qid);
                //testDetail.getListQuestion().remove(qid);
                for(QuizQuestionDetailModel q: testDetail.getListQuestion()){
                    if(q.getQuestionId().toString().equals(qid)){
                        testDetail.getListQuestion().remove(q);
                        break;
                    }
                }
                log.info("getActiveQuizTestOfSession, question  " + qid + " has already been answered, remove this");
            }
        return ResponseEntity.ok().body(testDetail);
    }


    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/get-all-student-in-test")
    public ResponseEntity<?> getAllStudentInTest(
        Principal principal, @RequestParam(required = false, name = "testId") String testId
    ) {
        testId = testId.replaceAll("\'", "");
        /* System.out.println("============================================================================================================");
        System.out.println(testId); */
        List<StudentInTestQueryReturnModel> list = quizTestService.getAllStudentInTest(testId);
        /* for (StudentInTestQueryReturnModel studentInTestQueryReturn : list) {
            System.out.println(studentInTestQueryReturn);
        } */
        if (list.isEmpty()) {
            return ResponseEntity.ok().body("Error");
        }
        return ResponseEntity.ok().body(list);

    }

    @PostMapping("/auto-assign-participants-2-quiz-test-group")
    public ResponseEntity<?> autoAssignParticipants2QuizTestGroup(
        Principal principal, @RequestBody
        AutoAssignParticipants2QuizTestGroupInputModel input
    ) {
        boolean ok = quizTestService.autoAssignParticipants2QuizTestGroup(input);

        return ResponseEntity.ok().body(ok);
    }

    @PostMapping("auto-assign-question-2-quiz-group")
    public ResponseEntity<?> autoAssignQuestion2QuizTestGroup(
        Principal principal, @RequestBody
        AutoAssignQuestion2QuizTestGroupInputModel input
    ) {

        boolean ok = quizTestService.autoAssignQuestion2QuizTestGroup(input);

        return ResponseEntity.ok().body(ok);
    }

    @GetMapping("/get-list-quiz-for-assignment-of-test/{testId}")
    public ResponseEntity<?> getListQuizForAssignmentOfTest(Principal principal, @PathVariable String testId) {
        EduQuizTest eduQuizTest = quizTestService.getQuizTestById(testId);
        if (eduQuizTest == null) {
            return ResponseEntity.ok().body(new ArrayList());
        }
        UUID classId = eduQuizTest.getClassId();
        EduClass eduClass = classService.findById(classId);

        String courseId = null;
        if (eduClass != null) {
            courseId = eduClass.getEduCourse().getId();
        }

        log.info("getListQuizForAssignmentOfTest, testId = " + testId + " courseId = " + courseId);
        List<QuizQuestion> quizQuestions = quizQuestionService.findQuizOfCourse(courseId);
        List<QuizQuestionDetailModel> quizQuestionDetailModels = new ArrayList<>();
        for (QuizQuestion q : quizQuestions) {
            if (q.getStatusId().equals(QuizQuestion.STATUS_PUBLIC)) {
                continue;
            }
            QuizQuestionDetailModel quizQuestionDetailModel = quizQuestionService.findQuizDetail(q.getQuestionId());
            quizQuestionDetailModels.add(quizQuestionDetailModel);
        }
        Collections.sort(quizQuestionDetailModels, new Comparator<QuizQuestionDetailModel>() {
            @Override
            public int compare(QuizQuestionDetailModel o1, QuizQuestionDetailModel o2) {
                String topic1 = o1.getQuizCourseTopic().getQuizCourseTopicId();
                String topic2 = o2.getQuizCourseTopic().getQuizCourseTopicId();
                String level1 = o1.getLevelId();
                String level2 = o2.getLevelId();
                int c1 = topic1.compareTo(topic2);
                if (c1 == 0) {
                    return level1.compareTo(level2);
                } else {
                    return c1;
                }
            }
        });
        log.info("getListQuizForAssignmentOfTest, testId = " + testId + " courseId = " + courseId
                 + " RETURN list.sz = " + quizQuestionDetailModels.size());

        return ResponseEntity.ok().body(quizQuestionDetailModels);

    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @PostMapping("/reject-students-in-test")
    public ResponseEntity<?> rejectStudentInTest(
        Principal principal,
        @RequestParam(required = false, name = "testId") String testId,
        @RequestParam(required = false, name = "studentList") String studentList
    ) {
        String[] students = studentList.split(";");
        return ResponseEntity.ok().body(quizTestService.rejectStudentsInTest(testId, students));
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @PostMapping("/accept-students-in-test")
    public ResponseEntity<?> acceptStudentInTest(
        Principal principal,
        @RequestParam(required = false, name = "testId") String testId,
        @RequestParam(required = false, name = "studentList") String studentList
    ) {
        String[] students = studentList.split(";");
        return ResponseEntity.ok().body(quizTestService.acceptStudentsInTest(testId, students));
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/get-test-groups-info")
    public ResponseEntity<?> getTestGroups(
        @RequestParam(required = false, name = "testId") String testId
    ) {
        return ResponseEntity.ok().body(quizTestService.getQuizTestGroupsInfoByTestId(testId));
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @PostMapping("/delete-quiz-test-groups")
    public ResponseEntity<?> deleteQuizTestGroups(
        Principal principal,
        @RequestParam(required = false, name = "testId") String testId,
        @RequestParam(required = false, name = "quizTestGroupList") String quizTestGroupList
    ) {
        String[] list = quizTestGroupList.split(";");
        return ResponseEntity.ok().body(quizTestService.deleteQuizTestGroups(testId, list));
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @PostMapping("/get-quiz-test-participation-execution-result")
    public ResponseEntity<?> getQuizTestParticipationExecutionResult(
        Principal principal, @RequestBody
        GetQuizTestParticipationExecutionResultInputModel input
    ) {
        List<QuizTestParticipationExecutionResultOutputModel> quizTestParticipationExecutionResultOutputModels =
            quizTestService.getQuizTestParticipationExecutionResult(input.getTestId());
            //quizTestService.getQuizTestParticipationExecutionResultNewByPQD(input.getTestId());

        return ResponseEntity.ok().body(quizTestParticipationExecutionResultOutputModels);
    }
    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @GetMapping("/get-quiz-test-participation-execution-result-of-user-login/{userLoginId}")
    public ResponseEntity<?> getQuizTestParticipationExecutionResultOfAStudent(
        Principal principal, @PathVariable String userLoginId
    ) {
        log.info("getQuizTestParticipationExecutionResultOfAStudent, studentId = " + userLoginId);
        List<UserQuestionQuizExecutionOM> userQuestionExecutions =
            quizTestService.getQuizTestParticipationExecutionResultOfAUserLogin(userLoginId);

        return ResponseEntity.ok().body(userQuestionExecutions);
    }

    @Secured({"ROLE_EDUCATION_TEACHING_MANAGEMENT_TEACHER"})
    @PostMapping("/copy-question-from-quiztest-to-quiztest")
    public ResponseEntity<?> copyQuestionFromQuizTestId2QuizTestId(Principal principal,
                                                                   @RequestBody  CopyQuestionFromQuizTest2QuizTestInputModel input){
        UserLogin u = userService.findById(principal.getName());

        log.info("copyQuestionFromQuizTestId2QuizTestId from test " + input.getFromTestId() + " to test " + input.getToTestId());
        int cnt = quizTestService.copyQuestionsFromQuizTest2QuizTest(u,input.getFromTestId(), input.getToTestId());
        return ResponseEntity.ok().body(cnt);
    }

}
