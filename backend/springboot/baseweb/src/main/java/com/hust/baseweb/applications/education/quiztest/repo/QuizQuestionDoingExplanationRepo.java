package com.hust.baseweb.applications.education.quiztest.repo;

import com.hust.baseweb.applications.education.quiztest.entity.QuizQuestionDoingExplanation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface QuizQuestionDoingExplanationRepo extends JpaRepository<QuizQuestionDoingExplanation, UUID> {

}
