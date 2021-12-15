package com.hust.baseweb.applications.education.quiztest.controller;

import com.hust.baseweb.applications.education.quiztest.entity.EduQuizTest;
import com.hust.baseweb.applications.education.quiztest.entity.EduTestQuizGroup;
import com.hust.baseweb.applications.education.quiztest.entity.EduTestQuizParticipant;
import com.hust.baseweb.applications.education.quiztest.model.quiztestgroup.GenerateQuizTestGroupInputModel;
import com.hust.baseweb.applications.education.quiztest.model.quiztestgroup.QuizTestGroupParticipantAssignmentOutputModel;
import com.hust.baseweb.applications.education.quiztest.repo.EduTestQuizParticipantRepo;
import com.hust.baseweb.applications.education.quiztest.service.EduQuizTestGroupService;
import com.hust.baseweb.applications.education.quiztest.service.EduTestQuizGroupParticipationAssignmentService;
import com.hust.baseweb.applications.education.quiztest.service.QuizTestService;
import com.hust.baseweb.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Date;
import java.util.List;

@Log4j2
@Controller
@Validated
@AllArgsConstructor(onConstructor = @__(@Autowired))
@CrossOrigin
public class EduQuizTestGroupController {

    private EduQuizTestGroupService eduQuizTestGroupService;
    private UserService userService;
    private EduTestQuizParticipantRepo eduTestQuizParticipationRepo;
    private EduTestQuizGroupParticipationAssignmentService eduTestQuizGroupParticipationAssignmentService;
    private QuizTestService quizTestService;

    @PostMapping("/generate-quiz-test-group")
    public ResponseEntity<?> generateQuizTestGroup(
        Principal principal, @RequestBody
        GenerateQuizTestGroupInputModel input
    ) {

        List<EduTestQuizGroup> eduTestQuizGroups = eduQuizTestGroupService.generateQuizTestGroups(input);

        return ResponseEntity.ok().body(eduTestQuizGroups);
    }

    @GetMapping("/get-quiz-test-participation-group-question/{testID}")
    public ResponseEntity<?> getTestGroupQuestionByUser(Principal principal, @PathVariable String testID) {
        EduQuizTest eduQuizTest = quizTestService.getQuizTestById(testID);
        Date startDateTime = eduQuizTest.getScheduleDatetime();
        Date currentDate = new Date();
        int timeTest = ((int) (currentDate.getTime() - startDateTime.getTime())) / (60 * 1000); //minutes
        log.info("getTestGroupQuestionByUser, current = " + currentDate.toString() +
                 " scheduleDate = " + startDateTime.toString() + " timeTest = " + timeTest);

        if (timeTest > eduQuizTest.getDuration() || timeTest < 0) {// out-of-allowed date-time
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(null);
        }

        EduTestQuizParticipant testParticipant = eduTestQuizParticipationRepo.findEduTestQuizParticipantByParticipantUserLoginIdAndAndTestId(
            principal.getName(),
            testID);

        if (testParticipant == null ||
            (!testParticipant.getStatusId().equals(EduTestQuizParticipant.STATUS_APPROVED))) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }

        return ResponseEntity.ok().body(eduQuizTestGroupService.getTestGroupQuestionDetail(principal, testID));
    }

    @GetMapping("/get-all-quiz-test-group-participants/{testId}")
    public ResponseEntity<?> getQuizTestGroupParticipants(Principal principal, @PathVariable String testId) {
        log.info("getQuizTestGroupParticipants, testId = " + testId);
        List<QuizTestGroupParticipantAssignmentOutputModel> quizTestGroupParticipantAssignmentOutputModels
            = eduTestQuizGroupParticipationAssignmentService.getQuizTestGroupParticipant(testId);
        return ResponseEntity.ok().body(quizTestGroupParticipantAssignmentOutputModels);
    }

}
