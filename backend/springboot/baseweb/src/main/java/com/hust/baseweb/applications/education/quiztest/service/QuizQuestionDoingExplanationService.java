package com.hust.baseweb.applications.education.quiztest.service;

import com.hust.baseweb.applications.education.quiztest.entity.QuizQuestionDoingExplanation;
import com.hust.baseweb.applications.education.quiztest.model.quizdoingexplanation.QuizDoingExplanationInputModel;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface QuizQuestionDoingExplanationService {

    QuizQuestionDoingExplanation createExplanation(QuizDoingExplanationInputModel solutionExplanation,
                                                   MultipartFile attachment);

    QuizQuestionDoingExplanation updateExplanation(UUID explanationId, String newExplanation, MultipartFile attachment);

    QuizQuestionDoingExplanation setAttachment(QuizQuestionDoingExplanation savedSolution, MultipartFile attachment);

}
