package com.hust.baseweb.applications.programmingcontest.repo;


import com.hust.baseweb.applications.programmingcontest.entity.ContestSubmissionTestCaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ContestSubmissionTestCaseEntityRepo extends JpaRepository<ContestSubmissionTestCaseEntity, UUID> {

}
