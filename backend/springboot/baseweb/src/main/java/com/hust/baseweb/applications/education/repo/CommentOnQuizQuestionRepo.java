package com.hust.baseweb.applications.education.repo;

import com.hust.baseweb.applications.education.entity.CommentOnQuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface CommentOnQuizQuestionRepo extends JpaRepository<CommentOnQuizQuestion, UUID> {
    List<CommentOnQuizQuestion> findAllByQuestionId(UUID questionId);

    @Query(value="select count(*) from comment_on_quiz_question where question_id = ?1", nativeQuery = true)
    int getNumberCommentsOnQuiz(UUID questionId);
}
