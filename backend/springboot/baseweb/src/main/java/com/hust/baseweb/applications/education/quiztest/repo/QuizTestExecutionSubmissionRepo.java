package com.hust.baseweb.applications.education.quiztest.repo;

import com.hust.baseweb.applications.education.quiztest.entity.QuizTestExecutionSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface QuizTestExecutionSubmissionRepo extends JpaRepository<QuizTestExecutionSubmission, UUID> {

}
