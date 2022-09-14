package com.hust.baseweb.applications.programmingcontest.service;

import com.hust.baseweb.applications.programmingcontest.constants.Constants;
import com.hust.baseweb.applications.programmingcontest.entity.*;
import com.hust.baseweb.applications.programmingcontest.exception.MiniLeetCodeException;
import com.hust.baseweb.applications.programmingcontest.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ProblemTestCaseService {

    void createContestProblem(ModelCreateContestProblem modelCreateContestProblem, String userID) throws MiniLeetCodeException;

    ProblemEntity updateContestProblem(ModelCreateContestProblem modelCreateContestProblem, String problemId, String userId) throws Exception;

    void updateProblemSourceCode(ModelAddProblemLanguageSourceCode modelAddProblemLanguageSourceCode, String problemId);

    Page<ProblemEntity> getContestProblemPaging(Pageable pageable);
    List<ProblemEntity> getAllProblems();

    ProblemEntity findContestProblemByProblemId(String problemId) throws Exception;

    void saveTestCase(TestCaseEntity testCase) throws Exception;

    String executableIDECode(ModelRunCodeFromIDE modelRunCodeFromIDE, String userName, String computerLanguage) throws Exception;

    ProblemEntity getContestProblem(String problemId) throws Exception;

    ModelProblemDetailRunCodeResponse problemDetailRunCode(String problemId, ModelProblemDetailRunCode modelProblemDetailRunCode, String userName) throws Exception;

    ModelGetTestCaseResultResponse getTestCaseResult(String problemId, String userName, ModelGetTestCaseResult modelGetTestCaseResult) throws Exception;

    ModelCheckCompileResponse checkCompile(ModelCheckCompile modelCheckCompile, String userName) throws Exception;

    TestCaseEntity saveTestCase(String problemId, ModelSaveTestcase modelSaveTestcase);

    ModelContestSubmissionResponse problemDetailSubmission(ModelProblemDetailSubmission modelProblemDetailSubmission, String problemId, String userName) throws Exception;

    ListProblemSubmissionResponse getListProblemSubmissionResponse(String problemId, String userId) throws Exception;

    ContestEntity createContest(ModelCreateContest modelCreateContest, String userName) throws Exception;

    ContestEntity updateContest(ModelUpdateContest modelUpdateContest, String userName, String contestId) throws Exception;

    ModelProblemSubmissionDetailResponse findProblemSubmissionById(UUID id, String userName) throws MiniLeetCodeException;

    ModelGetContestPageResponse getContestPaging(Pageable pageable);

    ModelGetContestDetailResponse getContestDetailByContestIdAndTeacher(String contestId, String userName);
    ModelGetContestDetailResponse getContestDetailByContestId(String contestId);

    ModelGetContestDetailResponse getContestSolvingDetailByContestId(String contestId, String userName) throws MiniLeetCodeException;

    Page<ModelProblemSubmissionDetailByTestCaseResponse> getContestProblemSubmissionDetailByTestCase(Pageable  page);

    List<ModelProblemSubmissionDetailByTestCaseResponse> getContestProblemSubmissionDetailByTestCaseOfASubmission(UUID submissionId);
    List<ModelProblemSubmissionDetailByTestCaseResponse> getContestProblemSubmissionDetailByTestCaseOfASubmissionViewedByParticipant(UUID submissionId);

    ModelContestSubmissionResponse submitContestProblem(ModelContestSubmission modelContestSubmission, String userName) throws Exception;
    ModelContestSubmissionResponse submitContestProblemTestCaseByTestCase(ModelContestSubmission modelContestSubmission, String userName) throws Exception;
    ModelContestSubmissionResponse submitContestProblemStoreOnlyNotExecute(ModelContestSubmission modelContestSubmission, String userName) throws Exception;


    ModelContestSubmissionResponse submitSolutionOutput(String solutionOutput, String contestId, String problemId, UUID testCaseId, String userName) throws Exception;

    ModelStudentRegisterContestResponse studentRegisterContest(String contestId, String userId) throws MiniLeetCodeException;

    int teacherManageStudentRegisterContest(String teacherId, ModelTeacherManageStudentRegisterContest modelTeacherManageStudentRegisterContest) throws MiniLeetCodeException;

    void calculateContestResult(String contestId);

    ModelGetContestPageResponse getContestPagingByUserCreatedContest(String userName, Pageable pageable);

    ModelGetContestPageResponse getContestPagingByUserManagerContest(String userName, Pageable pageable);
    ModelGetContestPageResponse getAllContestsPagingByAdmin(String userName, Pageable pageable);
    List<ModelGetContestResponse> getContestByUserRole(String userName);

    ListModelUserRegisteredContestInfo getListUserRegisterContestSuccessfulPaging(Pageable pageable, String contestId);

    ListModelUserRegisteredContestInfo getListUserRegisterContestPendingPaging(Pageable pageable, String contestId);

    ListModelUserRegisteredContestInfo searchUser(Pageable pageable, String contestId, String keyword);

    ModelGetContestPageResponse getRegisteredContestByUser(Pageable pageable, String userName);
    ModelGetContestPageResponse getRegisteredContestsByUser(String userName);

    ModelGetContestPageResponse getNotRegisteredContestByUser(Pageable pageable, String userName);

    List<ContestSubmissionsByUser> getRankingByContestIdNew(Pageable pageable, String contestId, Constants.GetPointForRankingType getPointForRankingType);

    Page<UserSubmissionContestResultNativeEntity> getRankingByContestId(Pageable pageable, String contestId);

    Page<ProblemEntity> getPublicProblemPaging(Pageable pageable);

    List<ModelGetTestCase> getTestCaseByProblem(String problemId);

    ModelGetTestCaseDetail getTestCaseDetail(UUID testCaseId) throws MiniLeetCodeException;

    void editTestCase(UUID testCaseId, ModelSaveTestcase modelSaveTestcase) throws MiniLeetCodeException;

    int addUserToContest(ModelAddUserToContest modelAddUserToContest);
    int addAllUsersToContest(ModelAddUserToContest modelAddUserToContest);

    void deleteUserContest(ModelAddUserToContest modelAddUserToContest) throws MiniLeetCodeException;

    Page<ContestSubmission> findContestSubmissionByContestIdPaging(Pageable pageable, String contestId);
    Page<ContestSubmission> findContestNotEvaluatedSubmissionByContestIdPaging(Pageable pageable, String contestId);
    Page<ContestSubmission> findContestSubmissionByUserLoginIdPaging(Pageable pageable, String userLoginId);
    Page<ContestSubmission> findContestSubmissionByUserLoginIdAndContestIdPaging(Pageable pageable, String userLoginId, String contestId);
    List<ContestSubmission> getNewestSubmissionResults(String userLoginId);


    ContestSubmissionEntity getContestSubmissionDetail(UUID submissionId);

    ModelGetContestInfosOfSubmissionOutput getContestInfosOfASubmission(UUID submissionId);

    void deleteProblem(String problemId, String userId) throws MiniLeetCodeException;

    void deleteContest(String contestId, String userId) throws MiniLeetCodeException;

    void deleteTestcase(UUID testcaseId, String userId) throws MiniLeetCodeException;

    ModelCodeSimilarityOutput checkSimilarity(String contestId, ModelCheckSimilarityInput I);

    ModelEvaluateBatchSubmissionResponse evaluateBatchSubmissionContest(String contestId);
    ModelEvaluateBatchSubmissionResponse reJudgeAllSubmissionsOfContest(String contestId);
    ModelEvaluateBatchSubmissionResponse judgeAllSubmissionsOfContest(String contestId);

    ModelContestSubmissionResponse evaluateSubmission(UUID submisionId);
    ModelContestSubmissionResponse evaluateSubmission(ContestSubmissionEntity sub, ContestEntity contest);

    List<ModelContestByRoleResponse> getContestsByRoleOfUser(String userLoginId);

    List<CodePlagiarism> findAllByContestId(String contestId);
    List<CodePlagiarism> findAllBy(ModelGetCodeSimilarityParams input);
    List<ModelSimilarityClusterOutput> computeSimilarityClusters(ModelGetCodeSimilarityParams input);

    ContestSubmissionEntity updateContestSubmissionSourceCode(ModelUpdateContestSubmission input);

    List<ModelGetContestResponse> getContestsUsingAProblem(String problemId);

    int addAdminToManagerAndParticipantAllContest();

    ModelUploadTestCaseOutput addTestCase(String testCase, ModelProgrammingContestUploadTestCase modelUploadTestCase, String userName);

    ModelUploadTestCaseOutput uploadUpdateTestCase(UUID testCaseId, String testCase, ModelProgrammingContestUploadTestCase modelUploadTestCase, String userName);

    public List<ModelUserJudgedProblemSubmissionResponse> getUserJudgedProblemSubmissions(String contestId);

}
