package com.hust.baseweb.applications.education.quiztest.controller;

import com.hust.baseweb.applications.education.quiztest.entity.QuizQuestionDoingExplanation;
import com.hust.baseweb.applications.education.quiztest.model.quizdoingexplanation.QuizDoingExplanationInputModel;
import com.hust.baseweb.applications.education.quiztest.service.QuizQuestionDoingExplanationService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/quiz-doing-explanations")
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class QuizQuestionDoingExplanationController {

    private final QuizQuestionDoingExplanationService quizDoingExplanationService;

    @GetMapping("/{questionId}")
    public ResponseEntity<?> getParticipantExplanationForQuestion(Principal principal,
                                                                  @PathVariable UUID questionId) {
        return ResponseEntity.ok(
            quizDoingExplanationService.findExplanationByParticipantIdAndQuestionId(principal.getName(), questionId)
        );
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createQuizDoingExplanation(
        Principal principal,
        @RequestPart QuizDoingExplanationInputModel quizDoingExplanation,
        @RequestParam MultipartFile attachment
    ) {
        log.info("Create quiz doing explanation {}", quizDoingExplanation);
        try {
            quizDoingExplanation.setParticipantUserId(principal.getName());
            return ResponseEntity.ok(quizDoingExplanationService.createExplanation(quizDoingExplanation, attachment));
        } catch (RuntimeException e) {
            log.error("An error occur when create quiz doing explanation", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
