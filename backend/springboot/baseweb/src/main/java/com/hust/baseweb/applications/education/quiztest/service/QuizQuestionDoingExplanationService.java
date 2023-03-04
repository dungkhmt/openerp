package com.hust.baseweb.applications.education.quiztest.service;

import com.hust.baseweb.applications.education.quiztest.entity.QuizQuestionDoingExplanation;
import com.hust.baseweb.applications.education.quiztest.model.quizdoingexplanation.QuizDoingExplanationInputModel;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collection;
import java.util.UUID;

public interface QuizQuestionDoingExplanationService {

    Collection<QuizQuestionDoingExplanation> findExplanationByParticipantIdAndQuestionId(String studentLoginId,
                                                                                         UUID questionId);

    QuizQuestionDoingExplanation createExplanation(QuizDoingExplanationInputModel explanation,
                                                   MultipartFile attachment);

    QuizQuestionDoingExplanation updateExplanation(UUID explanationId, String explanationContent, MultipartFile attachment);

    void deleteExplanation(UUID explanationId);

    QuizQuestionDoingExplanation setAttachment(QuizQuestionDoingExplanation explanation, MultipartFile attachment);

}
