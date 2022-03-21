package com.hust.baseweb.applications.education.repo;

import com.hust.baseweb.applications.education.entity.LogUserLoginQuizQuestion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LogUserLoginQuizQuestionRepo extends JpaRepository<LogUserLoginQuizQuestion, UUID> {

    LogUserLoginQuizQuestion save(LogUserLoginQuizQuestion logUserLoginQuizQuestion);

    Page<LogUserLoginQuizQuestion> findByUserLoginId(String userLoginId, Pageable page);
}
