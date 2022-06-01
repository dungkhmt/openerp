package com.hust.baseweb.applications.programmingcontest.repo;

import com.hust.baseweb.applications.programmingcontest.entity.ProblemEntity;
import com.hust.baseweb.applications.programmingcontest.entity.TestCaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TestCaseRepo extends JpaRepository<TestCaseEntity, UUID> {
    TestCaseEntity findTestCaseByTestCaseId(UUID uuid);
    List<TestCaseEntity> findAllByProblemId(String problemId);

//    @Query("delete from TestCaseEntity t where t.problemId = :problemId")
//    void deleteAllTestCasesByProblemId(@PathVariable("problemId") String problemId);

    void deleteAllByProblemId(String problemId);

    void deleteTestCaseEntityByTestCaseId(UUID testCaseId);
}
