package com.hust.baseweb.applications.education.quiztest.repo;

import com.hust.baseweb.applications.education.quiztest.entity.QuizGroupQuestionAssignment;
import com.hust.baseweb.applications.education.quiztest.entity.compositeid.CompositeQuizGroupQuestionAssignmentId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuizGroupQuestionAssignmentRepo
    extends JpaRepository<QuizGroupQuestionAssignment, CompositeQuizGroupQuestionAssignmentId> {

    List<QuizGroupQuestionAssignment> findQuizGroupQuestionAssignmentsByQuizGroupId(UUID groupId);

    List<QuizGroupQuestionAssignment> findAllByQuizGroupIdIn(List<UUID> quizGroupIds);

    QuizGroupQuestionAssignment findByQuestionIdAndQuizGroupId(UUID questionId, UUID quizGroupId);

    QuizGroupQuestionAssignment save(QuizGroupQuestionAssignment quizGroupQuestionAssignment);

}
