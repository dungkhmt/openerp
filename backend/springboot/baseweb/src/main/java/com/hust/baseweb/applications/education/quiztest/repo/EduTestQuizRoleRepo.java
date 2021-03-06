package com.hust.baseweb.applications.education.quiztest.repo;

import com.hust.baseweb.applications.education.quiztest.entity.EduTestQuizRole;
import com.hust.baseweb.applications.education.quiztest.entity.compositeid.CompositeTestQuizRoleId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EduTestQuizRoleRepo extends JpaRepository<EduTestQuizRole, CompositeTestQuizRoleId> {
    List<EduTestQuizRole> findAllByTestId(String testId);
    List<EduTestQuizRole> findByTestId(String testId);
    List<EduTestQuizRole> findByParticipantUserLoginId(String participantUserLoginId);
}
