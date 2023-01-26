package com.hust.baseweb.applications.programmingcontest.service;

import com.hust.baseweb.applications.programmingcontest.entity.TestCaseEntity;
import com.hust.baseweb.applications.programmingcontest.repo.TestCaseRepo;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class TestCaseService {

    private TestCaseRepo testCaseRepo;

    private static final String HASH = "TEST_CASE";

    @Cacheable(value = HASH, key = "#problemId + '_' + #isPublicTestCase")
    public List<TestCaseEntity> findListTestCaseWithCache(String problemId, boolean isPublicTestCase) {
        List<TestCaseEntity> testCaseEntityList;
        if (isPublicTestCase) {
            testCaseEntityList = testCaseRepo.findAllByProblemId(problemId);
        } else {
            testCaseEntityList = testCaseRepo.findAllByProblemIdAndIsPublic(problemId, "N");
        }
        return testCaseEntityList;
    }

    @CachePut(value = HASH, key = "#testCase.testCaseId")
    public TestCaseEntity updateTestCaseWithCache(TestCaseEntity testCase) {
        return testCaseRepo.save(testCase);
    }

    public TestCaseEntity saveTestCase(TestCaseEntity testCase) {
        return testCaseRepo.save(testCase);
    }
}
