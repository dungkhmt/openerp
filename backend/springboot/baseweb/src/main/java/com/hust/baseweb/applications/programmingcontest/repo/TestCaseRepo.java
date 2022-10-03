package com.hust.baseweb.applications.programmingcontest.repo;

import com.hust.baseweb.applications.programmingcontest.entity.ProblemEntity;
import com.hust.baseweb.applications.programmingcontest.entity.TestCaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TestCaseRepo extends JpaRepository<TestCaseEntity, UUID> {
    TestCaseEntity findTestCaseByTestCaseId(UUID uuid);
    List<TestCaseEntity> findAllByProblemId(String problemId);
    List<TestCaseEntity> findAllByProblemIdAndStatusId(String problemId, String statusId);

    List<TestCaseEntity> findAllByProblemIdAndIsPublic(String problemId, String isPublic);

    List<TestCaseEntity> findAllByProblemIdAndIsPublicAndStatusId(String problemId, String isPublic, String statusId);


//    @Query("delete from TestCaseEntity t where t.problemId = :problemId")
//    void deleteAllTestCasesByProblemId(@PathVariable("problemId") String problemId);

    void deleteAllByProblemId(String problemId);

    void deleteTestCaseEntityByTestCaseId(UUID testCaseId);
}
