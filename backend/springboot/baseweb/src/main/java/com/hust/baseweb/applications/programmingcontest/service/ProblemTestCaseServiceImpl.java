package com.hust.baseweb.applications.programmingcontest.service;

import com.hust.baseweb.applications.notifications.service.NotificationsService;
import com.hust.baseweb.applications.programmingcontest.constants.Constants;
import com.hust.baseweb.applications.programmingcontest.docker.DockerClientBase;
import com.hust.baseweb.applications.programmingcontest.entity.*;
import com.hust.baseweb.applications.programmingcontest.exception.MiniLeetCodeException;
import com.hust.baseweb.applications.programmingcontest.model.*;
import com.hust.baseweb.applications.programmingcontest.repo.*;
import com.hust.baseweb.applications.programmingcontest.utils.ComputerLanguage;
import com.hust.baseweb.applications.programmingcontest.utils.DateTimeUtils;
import com.hust.baseweb.applications.programmingcontest.utils.TempDir;
import com.hust.baseweb.applications.programmingcontest.utils.codesimilaritycheckingalgorithms.CodeSimilarityCheck;
import com.hust.baseweb.applications.programmingcontest.utils.stringhandler.ProblemSubmission;
import com.hust.baseweb.applications.programmingcontest.utils.stringhandler.StringHandler;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.model.PersonModel;
import com.hust.baseweb.repo.UserLoginRepo;
import com.hust.baseweb.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class ProblemTestCaseServiceImpl implements ProblemTestCaseService {
    private ProblemRepo problemRepo;
    private TestCaseRepo testCaseRepo;
    private ProblemSourceCodeRepo problemSourceCodeRepo;
    private DockerClientBase dockerClientBase;
    private TempDir tempDir;
    private ProblemPagingAndSortingRepo problemPagingAndSortingRepo;
    private ProblemSubmissionRepo problemSubmissionRepo;
    private UserLoginRepo userLoginRepo;
    private ContestRepo contestRepo;
    private Constants  constants;
    private ContestPagingAndSortingRepo contestPagingAndSortingRepo;
    private ContestSubmissionRepo contestSubmissionRepo;
    private UserRegistrationContestRepo userRegistrationContestRepo;
    private NotificationsService notificationsService;
    private UserSubmissionContestResultNativeRepo userSubmissionContestResultNativeRepo;
    private UserRegistrationContestPagingAndSortingRepo userRegistrationContestPagingAndSortingRepo;
    private UserSubmissionContestResultNativePagingRepo userSubmissionContestResultNativePagingRepo;
    private ContestSubmissionPagingAndSortingRepo contestSubmissionPagingAndSortingRepo;
    private ContestSubmissionTestCaseEntityRepo contestSubmissionTestCaseEntityRepo;
    private UserService userService;
    private ContestRoleRepo contestRoleRepo;
    private CodePlagiarismRepo codePlagiarismRepo;
    private ContestSubmissionHistoryRepo contestSubmissionHistoryRepo;
    private ContestProblemRepo contestProblemRepo;


    @Override
    public void createContestProblem(ModelCreateContestProblem modelCreateContestProblem, String userId) throws MiniLeetCodeException {
        if(problemRepo.findByProblemId(modelCreateContestProblem.getProblemId()) != null){
            throw new MiniLeetCodeException("problem id already exist");
        }
        ProblemEntity problemEntity = ProblemEntity.builder()
                .problemId(modelCreateContestProblem.getProblemId())
                .problemName(modelCreateContestProblem.getProblemName())
                .problemDescription(modelCreateContestProblem.getProblemDescription())
                .categoryId(modelCreateContestProblem.getCategoryId())
                .memoryLimit(modelCreateContestProblem.getMemoryLimit())
                .timeLimit(modelCreateContestProblem.getTimeLimit())
                .levelId(modelCreateContestProblem.getLevelId())
                .correctSolutionLanguage(modelCreateContestProblem.getCorrectSolutionLanguage())
                .correctSolutionSourceCode(modelCreateContestProblem.getCorrectSolutionSourceCode())
                .solution(modelCreateContestProblem.getSolution())
                .solutionCheckerSourceCode(modelCreateContestProblem.getSolutionChecker())
                .solutionCheckerSourceLanguage(modelCreateContestProblem.getSolutionCheckerLanguage())
                .createdAt(new Date())
                .isPublicProblem(modelCreateContestProblem.getIsPublic())
                .levelOrder(constants.getMapLevelOrder().get(modelCreateContestProblem.getLevelId()))
                .userId(userId)
                .build();
        problemRepo.save(problemEntity);


    }

    @Override
    public ProblemEntity updateContestProblem(ModelCreateContestProblem modelCreateContestProblem, String problemId, String userId) throws Exception {

        if(!problemRepo.existsById(problemId)){
            throw new MiniLeetCodeException("problem id not found");
        }

        ProblemEntity problemEntity = problemRepo.findByProblemId(problemId);
        if(!userId.equals(problemEntity.getUserId())){
            throw new MiniLeetCodeException("permission denied");
        }
        problemEntity.setProblemName(modelCreateContestProblem.getProblemName());
        problemEntity.setProblemDescription(modelCreateContestProblem.getProblemDescription());
        problemEntity.setLevelId(modelCreateContestProblem.getLevelId());
        problemEntity.setCategoryId(modelCreateContestProblem.getCategoryId());
        problemEntity.setSolution(modelCreateContestProblem.getSolution());
        problemEntity.setTimeLimit(modelCreateContestProblem.getTimeLimit());
        problemEntity.setCorrectSolutionLanguage(modelCreateContestProblem.getCorrectSolutionLanguage());
        problemEntity.setCorrectSolutionSourceCode(modelCreateContestProblem.getCorrectSolutionSourceCode());
        problemEntity.setSolutionCheckerSourceCode(modelCreateContestProblem.getSolutionChecker());
        problemEntity.setPublicProblem(modelCreateContestProblem.getIsPublic());
        return problemRepo.save(problemEntity);

    }



    @Override
    public void updateProblemSourceCode(ModelAddProblemLanguageSourceCode modelAddProblemLanguageSourceCode, String problemId) {
//        ProblemSourceCode problemSourceCode = new ProblemSourceCode();
//        problemSourceCode.setProblemSourceCodeId(modelAddProblemLanguageSourceCode.getProblemSourceCodeId());
//        problemSourceCode.setMainSource(modelAddProblemLanguageSourceCode.getMainSource());
//        problemSourceCode.setBaseSource(modelAddProblemLanguageSourceCode.getBaseSource());
//        problemSourceCode.setLanguage(modelAddProblemLanguageSourceCode.getLanguage());
//        problemSourceCode.setProblemFunctionDefaultSource(modelAddProblemLanguageSourceCode.getProblemFunctionDefaultSource());
//        problemSourceCode.setProblemFunctionSolution(modelAddProblemLanguageSourceCode.getProblemFunctionSolution());
//        ContestProblem contestProblem = contestProblemRepo.findByProblemId(problemId);
//        if(contestProblem.getProblemSourceCode() == null){
//            ArrayList<ProblemSourceCode> problemSourceCodes = new ArrayList<ProblemSourceCode>();
//            problemSourceCodes.add(problemSourceCode);
//            contestProblem.setProblemSourceCode(problemSourceCodes);
//        }else{
//            contestProblem.getProblemSourceCode().add(problemSourceCode);
//        }
//        problemSourceCodeRepo.save(problemSourceCode);
//        contestProblemRepo.save(contestProblem);
    }

    @Override
    public Page<ProblemEntity> getContestProblemPaging(Pageable pageable){
        return problemPagingAndSortingRepo.findAll(pageable);
    }

    @Override
    public ProblemEntity findContestProblemByProblemId(String problemId) throws Exception {
        try {
            return problemRepo.findByProblemId(problemId);
        }catch (Exception e){
            throw new Exception(e.toString());
        }
    }

    @Override
    public void saveTestCase(TestCaseEntity testCase) throws Exception {
        try {
            testCaseRepo.save(testCase);
        }catch (Exception e){
            throw new Exception(e.toString());
        }
    }

    @Override
    public String executableIDECode(ModelRunCodeFromIDE modelRunCodeFromIDE, String userName, String computerLanguage) throws Exception {
        String tempName = tempDir.createRandomScriptFileName(userName + "-" + computerLanguage);
        String response = runCode(modelRunCodeFromIDE.getSource(), computerLanguage, tempName, modelRunCodeFromIDE.getInput(), 10, "Language Not Found");
        tempDir.pushToConcurrentLinkedQueue(tempName);
        return response;
    }

    @Override
    public ProblemEntity getContestProblem(String problemId) throws Exception {
        ProblemEntity problemEntity;
        try {
            problemEntity = problemRepo.findByProblemId(problemId);
            if(problemEntity == null){
                throw new MiniLeetCodeException("Problem not found");
            }
            return problemEntity;
        }catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }



    @Override
    public ModelProblemDetailRunCodeResponse problemDetailRunCode(String problemId, ModelProblemDetailRunCode modelProblemDetailRunCode, String userName) throws Exception {
        ProblemEntity problemEntity = problemRepo.findByProblemId(problemId);
        String tempName = tempDir.createRandomScriptFileName(problemEntity.getProblemName() + "-" + problemEntity.getCorrectSolutionLanguage());
        String output = runCode(modelProblemDetailRunCode.getSourceCode(),
                modelProblemDetailRunCode.getComputerLanguage(),
                tempName+"-"+userName+"-code",
                modelProblemDetailRunCode.getInput(),
                problemEntity.getTimeLimit(),
                "User Source Code Langua Not Found");

        output = output.substring(0, output.length()-1);

        int lastLineIndexOutput = output.lastIndexOf("\n");
        if(output.equals("Time Limit Exceeded")){
            return ModelProblemDetailRunCodeResponse.builder()
                    .status("Time Limit Exceeded")
                    .build();
        }
        String status = output.substring(lastLineIndexOutput);
        log.info("status {}", status);
        if(status.contains("Compile Error")){
            return ModelProblemDetailRunCodeResponse.builder()
                    .output(output.substring(0, lastLineIndexOutput))
                    .status("Compile Error")
                    .build();
        }
        log.info("status {}", status);
        output = output.substring(0, lastLineIndexOutput);
        String expected = runCode(problemEntity.getCorrectSolutionSourceCode(),
                problemEntity.getCorrectSolutionLanguage(),
                tempName+"-solution",
                modelProblemDetailRunCode.getInput(),
                problemEntity.getTimeLimit(),
                "Correct Solution Language Not Found");
        expected = expected.substring(0, expected.length()-1);
        int lastLinetIndexExpected = expected.lastIndexOf("\n");
        expected = expected.substring(0, lastLinetIndexExpected);
        expected = expected.replaceAll("\n", "");
        output = output.replaceAll("\n", "");
        if(output.equals(expected)){
            status = "Accept";
        }else{
            status = "Wrong Answer";
        }
        log.info("output {}", output);
        log.info("expected {}", expected);
        return ModelProblemDetailRunCodeResponse.builder()
                .expected(expected)
                .output(output)
                .status(status)
                .build();
    }

    @Override
    public ModelGetTestCaseResultResponse getTestCaseResult(String problemId, String userName, ModelGetTestCaseResult modelGetTestCaseResult) throws Exception {
        ProblemEntity problemEntity = problemRepo.findByProblemId(problemId);
        String tempName = tempDir.createRandomScriptFileName(userName + "-" + problemEntity.getProblemName() + "-" + problemEntity.getCorrectSolutionLanguage());
        String output = runCode(problemEntity.getCorrectSolutionSourceCode(), problemEntity.getCorrectSolutionLanguage(), tempName, modelGetTestCaseResult.getTestcase(), problemEntity.getTimeLimit(), "Correct Solution Language Not Found");
        if(output.contains("Time Limit Exceeded")){
            return ModelGetTestCaseResultResponse.builder()
                    .result("")
                    .status("Time Limit Exceeded")
                    .build();
        }
        output = output.substring(0, output.length()-1);
        int lastLinetIndexExpected = output.lastIndexOf("\n");
        output = output.substring(0, lastLinetIndexExpected);
//        output = output.replaceAll("\n", "");
        log.info("output {}", output);
        return ModelGetTestCaseResultResponse.builder()
                .result(output)
                .status("ok")
                .build();
    }

    @Override
    public ModelCheckCompileResponse checkCompile(ModelCheckCompile modelCheckCompile, String userName) throws Exception {
        String tempName = tempDir.createRandomScriptFileName(userName);
        String resp;
        switch (modelCheckCompile.getComputerLanguage()){
            case "CPP":
                tempDir.createScriptCompileFile(modelCheckCompile.getSource(), ComputerLanguage.Languages.CPP, tempName);
                resp = dockerClientBase.runExecutable(ComputerLanguage.Languages.CPP, tempName);
                break;
            case "JAVA":
                tempDir.createScriptCompileFile(modelCheckCompile.getSource(), ComputerLanguage.Languages.JAVA, tempName);
                resp = dockerClientBase.runExecutable(ComputerLanguage.Languages.JAVA, tempName);
                break;
            case "PYTHON3":
                tempDir.createScriptCompileFile(modelCheckCompile.getSource(), ComputerLanguage.Languages.PYTHON3, tempName);
                resp = dockerClientBase.runExecutable(ComputerLanguage.Languages.PYTHON3, tempName);
                break;
            case "GOLANG":
                tempDir.createScriptCompileFile(modelCheckCompile.getSource(), ComputerLanguage.Languages.GOLANG, tempName);
                resp = dockerClientBase.runExecutable(ComputerLanguage.Languages.GOLANG, tempName);
                break;
            default:
                throw new Exception("Language not found");
        }
        if(resp.contains("Successful")){
            return ModelCheckCompileResponse.builder()
                    .status("Successful")
                    .message("")
                    .build();

        }else{
            return ModelCheckCompileResponse.builder()
                    .status("Compile Error")
                    .message(resp)
                    .build();
        }
    }

    @Override
    public TestCaseEntity saveTestCase(String problemId, ModelSaveTestcase modelSaveTestcase) {

//        ProblemEntity problemEntity = problemRepo.findByProblemId(problemId);
        TestCaseEntity testCaseEntity = TestCaseEntity.builder()
                .correctAnswer(modelSaveTestcase.getResult())
                .testCase(modelSaveTestcase.getInput())
                .testCasePoint(modelSaveTestcase.getPoint())
//                .problem(problemEntity)
                .problemId(problemId)
            .isPublic(modelSaveTestcase.getIsPublic())
                .build();
        return testCaseRepo.save(testCaseEntity);
    }


    @Override
    public ListProblemSubmissionResponse getListProblemSubmissionResponse(String problemId, String userId) throws Exception {
        UserLogin userLogin = userLoginRepo.findByUserLoginId(userId);
        ProblemEntity problemEntity = problemRepo.findByProblemId(problemId);
        if(userLogin == null || problemEntity == null){
            throw new Exception("not found");
        }
        List<Object[]> list = problemSubmissionRepo.getListProblemSubmissionByUserAndProblemId(userLogin, problemEntity);
        List<ProblemSubmissionResponse> problemSubmissionResponseList = new ArrayList<>();
        try {
            list.forEach(objects -> {
                log.info("objects {}", objects);
                ProblemSubmissionResponse problemSubmissionResponse = ProblemSubmissionResponse.builder()
                        .problemSubmissionId((UUID) objects[0])
                        .timeSubmitted((String) objects[1])
                        .status((String) objects[2])
                        .score((int) objects[3])
                        .runtime((String) objects[4])
                        .memoryUsage((float) objects[5])
                        .language((String) objects[6])
                        .build();
                problemSubmissionResponseList.add(problemSubmissionResponse);
            });
        } catch (Exception e){
            log.info("error");
            throw e;
        }

        return ListProblemSubmissionResponse.builder()
                .contents(problemSubmissionResponseList)
                .isSubmitted(list.size() != 0)
                .build();
    }

    @Transactional
    @Override
    public ContestEntity createContest(ModelCreateContest modelCreateContest, String userName) throws Exception {
        try {
            ContestEntity contestEntityExist = contestRepo.findContestByContestId(modelCreateContest.getContestId());
            if(contestEntityExist != null){
                throw new MiniLeetCodeException("Contest is already exist");
            }
            ContestEntity contestEntity = null;
            List<ProblemEntity> problemEntities = getContestProblemsFromListContestId(modelCreateContest.getProblemIds());
            if(modelCreateContest.getStartedAt() != null){
                contestEntity = ContestEntity.builder()
                                                           .contestId(modelCreateContest.getContestId())
                                                           .contestName(modelCreateContest.getContestName())
                                                           .contestSolvingTime(modelCreateContest.getContestTime())
                                                           .problems(problemEntities)
                                                           .isPublic(modelCreateContest.isPublic())
                                                           .countDown(modelCreateContest.getCountDownTime())
                                                           .startedAt(modelCreateContest.getStartedAt())
                                                           .startedCountDownTime(DateTimeUtils.minusMinutesDate(modelCreateContest.getStartedAt(), modelCreateContest.getCountDownTime()))
                                                           .endTime(DateTimeUtils.addMinutesDate(modelCreateContest.getStartedAt(), modelCreateContest.getContestTime()))
                                                           .userId(userName)
                                                           .statusId(ContestEntity.CONTEST_STATUS_CREATED)
                                                           .maxNumberSubmissions(modelCreateContest.getMaxNumberSubmissions())
                                                            .maxSourceCodeLength(modelCreateContest.getMaxSourceCodeLength())
                                             .useCacheContestProblem(ContestEntity.USE_CACHE_CONTEST_PROBLEM_YES)
                                             .submissionActionType(ContestEntity.CONTEST_SUBMISSION_ACTION_TYPE_STORE_AND_EXECUTE)
                                             .problemDescriptionViewType(ContestEntity.CONTEST_PROBLEM_DESCRIPTION_VIEW_TYPE_VISIBLE)
                                             .participantViewResultMode(ContestEntity.CONTEST_PARTICIPANT_VIEW_MODE_SEE_CORRECT_ANSWER)
                                             .evaluateBothPublicPrivateTestcase(ContestEntity.EVALUATE_USE_BOTH_PUBLIC_PRIVATE_TESTCASE_NO)
                                             .createdAt(new Date())
                                                           .build();
                contestEntity = contestRepo.save(contestEntity);
            }else{
                contestEntity = ContestEntity.builder()
                                                           .contestId(modelCreateContest.getContestId())
                                                           .contestName(modelCreateContest.getContestName())
                                                           .contestSolvingTime(modelCreateContest.getContestTime())
                                                           .problems(problemEntities)
                                                           .isPublic(modelCreateContest.isPublic())
                                                           .countDown(modelCreateContest.getCountDownTime())
                                                           .userId(userName)
                                                           .statusId(ContestEntity.CONTEST_STATUS_CREATED)
                                                           .maxNumberSubmissions(modelCreateContest.getMaxNumberSubmissions())
                                                            .maxSourceCodeLength(modelCreateContest.getMaxSourceCodeLength())
                                                           .createdAt(new Date())
                                                           .build();
                contestEntity = contestRepo.save(contestEntity);
            }

            // create corresponding entities in ContestRole
            ContestRole contestRole = new ContestRole();
            contestRole.setContestId(modelCreateContest.getContestId());
            contestRole.setUserLoginId(userName);
            Date fromDate = new Date();
            contestRole.setRoleId(ContestRole.CONTEST_ROLE_OWNER);
            contestRole.setFromDate(fromDate);
            contestRole = contestRoleRepo.save(contestRole);

            contestRole = new ContestRole();
            contestRole.setContestId(modelCreateContest.getContestId());
            contestRole.setUserLoginId(userName);
            contestRole.setRoleId(ContestRole.CONTEST_ROLE_MANAGER);
            contestRole.setFromDate(fromDate);
            contestRole = contestRoleRepo.save(contestRole);

            contestRole = new ContestRole();
            contestRole.setContestId(modelCreateContest.getContestId());
            contestRole.setUserLoginId(userName);
            contestRole.setRoleId(ContestRole.CONTEST_ROLE_PARTICIPANT);
            contestRole.setFromDate(fromDate);
            contestRole = contestRoleRepo.save(contestRole);

            // create correspoding entities in UserRegistrationContestEntity
            UserRegistrationContestEntity urc = new UserRegistrationContestEntity();
            urc.setContestId(modelCreateContest.getContestId());
            urc.setRoleId(UserRegistrationContestEntity.ROLE_OWNER);
            urc.setUserId(userName);
            urc.setStatus(UserRegistrationContestEntity.STATUS_SUCCESSFUL);
            urc = userRegistrationContestRepo.save(urc);

            urc = new UserRegistrationContestEntity();
            urc.setContestId(modelCreateContest.getContestId());
            urc.setRoleId(UserRegistrationContestEntity.ROLE_MANAGER);
            urc.setUserId(userName);
            urc.setStatus(UserRegistrationContestEntity.STATUS_SUCCESSFUL);
            urc = userRegistrationContestRepo.save(urc);

            urc = new UserRegistrationContestEntity();
            urc.setContestId(modelCreateContest.getContestId());
            urc.setRoleId(UserRegistrationContestEntity.ROLE_PARTICIPANT);
            urc.setUserId(userName);
            urc.setStatus(UserRegistrationContestEntity.STATUS_SUCCESSFUL);
            urc = userRegistrationContestRepo.save(urc);

            // add account admin to the contest
            String admin = "admin";
            UserLogin u = userLoginRepo.findByUserLoginId(admin);
            if(u != null) {
                urc = new UserRegistrationContestEntity();
                urc.setContestId(modelCreateContest.getContestId());
                urc.setRoleId(UserRegistrationContestEntity.ROLE_OWNER);
                urc.setUserId(admin);
                urc.setStatus(UserRegistrationContestEntity.STATUS_SUCCESSFUL);
                urc = userRegistrationContestRepo.save(urc);

                urc = new UserRegistrationContestEntity();
                urc.setContestId(modelCreateContest.getContestId());
                urc.setRoleId(UserRegistrationContestEntity.ROLE_MANAGER);
                urc.setUserId(admin);
                urc.setStatus(UserRegistrationContestEntity.STATUS_SUCCESSFUL);
                urc = userRegistrationContestRepo.save(urc);

                urc = new UserRegistrationContestEntity();
                urc.setContestId(modelCreateContest.getContestId());
                urc.setRoleId(UserRegistrationContestEntity.ROLE_PARTICIPANT);
                urc.setUserId(admin);
                urc.setStatus(UserRegistrationContestEntity.STATUS_SUCCESSFUL);
                urc = userRegistrationContestRepo.save(urc);
            }
            return contestEntity;
        }catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public ContestEntity updateContest(ModelUpdateContest modelUpdateContest, String userName, String contestId) throws Exception {
        ContestEntity contestEntityExist = contestRepo.findContestByContestId(contestId);
        if(contestEntityExist == null){
            throw new MiniLeetCodeException("Contest does not exist");
        }
        log.info("updateContest, isPublic = " + modelUpdateContest.getIsPublic());
        boolean isPublic = true;
        if(modelUpdateContest.getIsPublic().equals("false"))
            isPublic = false;
        log.info("updateContest, modelUpdateContest.isPublic = " + modelUpdateContest.getIsPublic() + " -> isPublic  = " + isPublic);
        UserLogin userLogin = userLoginRepo.findByUserLoginId(userName);
        //check user have privileged
//            if(!userLogin.getUserLoginId().equals(contestEntityExist.getUserCreatedContest().getUserLoginId())){
//                throw new MiniLeetCodeException("You don't have privileged");
//            }

        List<UserRegistrationContestEntity> L = userRegistrationContestRepo
            .findUserRegistrationContestEntityByContestIdAndUserIdAndStatus(contestId,userName,UserRegistrationContestEntity.STATUS_SUCCESSFUL);
        boolean canUpdate = false;
        for(UserRegistrationContestEntity u: L){
            if(u.getRoleId().equals(UserRegistrationContestEntity.ROLE_MANAGER) ||
               u.getRoleId().equals(UserRegistrationContestEntity.ROLE_OWNER)){
                canUpdate = true; break;
            }
        }
        if(!canUpdate){
            throw new MiniLeetCodeException("You don't have privileged");
        }
        //if(!userName.equals(contestEntityExist.getUserId())){
        //    throw new MiniLeetCodeException("You don't have privileged");
        //}


        List<ProblemEntity> problemEntities = getContestProblemsFromListContestId(modelUpdateContest.getProblemIds());
        if(modelUpdateContest.getStartedAt() != null){
            ContestEntity contestEntity = ContestEntity.builder()
                                                       .contestId(contestId)
                                                       .contestName(modelUpdateContest.getContestName())
                                                       .contestSolvingTime(modelUpdateContest.getContestSolvingTime())
                                                       .problems(problemEntities)
                                                       .userId(userName)
                                                       .countDown(modelUpdateContest.getCountDownTime())
                                                       .startedAt(modelUpdateContest.getStartedAt())
                                                       .startedCountDownTime(DateTimeUtils.minusMinutesDate(modelUpdateContest.getStartedAt(), modelUpdateContest.getCountDownTime()))
                                                       .endTime(DateTimeUtils.addMinutesDate(modelUpdateContest.getStartedAt(), modelUpdateContest.getContestSolvingTime()))
                                                       .isPublic(isPublic)
                                                       .statusId(modelUpdateContest.getStatusId())
                                                       .submissionActionType(modelUpdateContest.getSubmissionActionType())
                                                       .maxNumberSubmissions(modelUpdateContest.getMaxNumberSubmission())
                                                       .participantViewResultMode(modelUpdateContest.getParticipantViewResultMode())
                                                       .problemDescriptionViewType(modelUpdateContest.getProblemDescriptionViewType())
                                                       .useCacheContestProblem(modelUpdateContest.getUseCacheContestProblem())
                                                       .maxSourceCodeLength(modelUpdateContest.getMaxSourceCodeLength())
                                                       .evaluateBothPublicPrivateTestcase(modelUpdateContest.getEvaluateBothPublicPrivateTestcase())
                                                       .build();
            return contestRepo.save(contestEntity);

        }else{
            ContestEntity contestEntity = ContestEntity.builder()
                                                       .contestId(contestId)
                                                       .contestName(modelUpdateContest.getContestName())
                                                       .contestSolvingTime(modelUpdateContest.getContestSolvingTime())
                                                       .problems(problemEntities)
                                                       .userId(userName)
                                                       .countDown(modelUpdateContest.getCountDownTime())
                                                       .statusId(modelUpdateContest.getStatusId())
                                                       .build();
            return contestRepo.save(contestEntity);
        }


    }

    @Override
    public ModelProblemSubmissionDetailResponse findProblemSubmissionById(UUID id, String userName) throws MiniLeetCodeException {
        ProblemSubmissionEntity problemSubmissionEntity = problemSubmissionRepo.findByProblemSubmissionId(id);
        if (!problemSubmissionEntity.getUserLogin().getUserLoginId().equals(userName)){
            throw new MiniLeetCodeException("unauthor");
        }
        return ModelProblemSubmissionDetailResponse.builder()
                .problemSubmissionId(problemSubmissionEntity.getProblemSubmissionId())
                .problemId(problemSubmissionEntity.getProblem().getProblemId())
                .problemName(problemSubmissionEntity.getProblem().getProblemName())
                .submittedAt(problemSubmissionEntity.getTimeSubmitted())
                .submissionSource(problemSubmissionEntity.getSourceCode())
                .submissionLanguage(problemSubmissionEntity.getSourceCodeLanguages())
                .score(problemSubmissionEntity.getScore())
                .testCasePass(problemSubmissionEntity.getTestCasePass())
                .runTime(problemSubmissionEntity.getRuntime())
                .memoryUsage(problemSubmissionEntity.getMemoryUsage())
                .status(problemSubmissionEntity.getStatus())
                .build();
    }

    @Override
    public ModelGetContestPageResponse getContestPaging(Pageable pageable) {
        Page<ContestEntity> contestPage =  contestPagingAndSortingRepo.findAll(pageable);
        return getModelGetContestPageResponse(contestPage);
    }

    @Override
    public ModelGetContestDetailResponse getContestDetailByContestIdAndTeacher(String contestId, String userName){
//        UserLogin userLogin = userLoginRepo.findByUserLoginId(userName);


        //ContestEntity contestEntity = contestRepo.findContestEntityByContestIdAndUserId(contestId, userName);
        boolean ok = false;
        // check role of teacher
        //UserRegistrationContestEntity c = userRegistrationContestRepo
        //    .findUserRegistrationContestEntityByContestIdAndUserIdAndStatus(contestId, userName, Constants.RegistrationType.SUCCESSFUL.getValue());
        List<UserRegistrationContestEntity> lc = userRegistrationContestRepo
            .findUserRegistrationContestEntityByContestIdAndUserIdAndStatus(contestId, userName, Constants.RegistrationType.SUCCESSFUL.getValue());

        ok = (lc != null && lc.size() > 0) || (userName.equals("admin"));
        log.info("getContestDetailByContestIdAndTeacher, userName = " + userName + " ok = " + ok);

        /*
        List<ModelContestByRoleResponse> L = getContestsByRoleOfUser(userName);
        for(UserRegistrationContestEntity c: L){
            log.info("getContestDetailByContestIdAndTeacher, user " + userName + " contest "
                     + c.getContestId() + " role = " + c.getRoleId());
            if(c.getContestId().equals(contestId) && (c.getRoleId().equals(UserRegistrationContestEntity.ROLE_MANAGER)
                                                      || c.getRoleId().equals(UserRegistrationContestEntity.ROLE_OWNER))){
                ok = true; break;
            }
        }
        */
        ContestEntity contestEntity = contestRepo.findContestByContestId(contestId);
        log.info("contestEntity {}", contestEntity);
        if(!ok || contestEntity == null){
            log.info("user does not create contest");
            return ModelGetContestDetailResponse.builder()
                    .unauthorized(true)
                    .build();
        }
        return getModelGetContestDetailResponse(contestId, contestEntity);
    }

    @Override
    public ModelGetContestDetailResponse getContestDetailByContestId(String contestId) {
        ContestEntity contestEntity = contestRepo.findContestByContestId(contestId);
        log.info("contestEntity {}", contestEntity);
        if(contestEntity == null){
            log.info("user does not create contest");
            return ModelGetContestDetailResponse.builder()
                                                .unauthorized(true)
                                                .build();
        }
        return getModelGetContestDetailResponse(contestId, contestEntity);
    }

    private ModelGetContestDetailResponse getModelGetContestDetailResponse(String contestId, ContestEntity contestEntity) {
        List<ModelGetProblemDetailResponse> problems = new ArrayList<>();
        contestEntity.getProblems().forEach(contestProblem -> {
            ModelGetProblemDetailResponse p = ModelGetProblemDetailResponse.builder()
                    .levelId(contestProblem.getLevelId())
                    .problemId(contestProblem.getProblemId())
                    .problemName(contestProblem.getProblemName())
                    .levelOrder(contestProblem.getLevelOrder())
                    .problemDescription(contestProblem.getProblemDescription())

                    .build();
            problems.add(p);
        });
        return ModelGetContestDetailResponse.builder()
                .contestId(contestId)
                .contestName(contestEntity.getContestName())
                .contestTime(contestEntity.getContestSolvingTime())
                .startAt(contestEntity.getStartedAt())
                .list(problems)
                .unauthorized(false)
                .isPublic(contestEntity.getIsPublic())
                                            .statusId(contestEntity.getStatusId())
                                            .listStatusIds(ContestEntity.getStatusIds())
                                            .listSubmissionActionTypes(ContestEntity.getSubmissionActionTypes())
                                            .listParticipantViewModes(ContestEntity.getParticipantViewResultModes())
                                            .listMaxNumberSubmissions(ContestEntity.getListMaxNumberSubmissions())
                                            .listProblemDescriptionViewTypes(ContestEntity.getProblemDescriptionViewTypes())
                                            .listUseCacheContestProblems(ContestEntity.getListUseCacheContestProblems())
                                            .listEvaluateBothPublicPrivateTestcases(ContestEntity.getListEvaluateBothPublicPrivateTestcases())
                                            .submissionActionType(contestEntity.getSubmissionActionType())
                                            .maxNumberSubmission(contestEntity.getMaxNumberSubmissions())
                                            .participantViewResultMode(contestEntity.getParticipantViewResultMode())
                                            .problemDescriptionViewType(contestEntity.getProblemDescriptionViewType())
                                            .useCacheContestProblem(contestEntity.getUseCacheContestProblem())
                                            .evaluateBothPublicPrivateTestcase(contestEntity.getEvaluateBothPublicPrivateTestcase())
                                            .maxSourceCodeLength(contestEntity.getMaxSourceCodeLength())
                                            .build();
    }

    @Override
    public ModelGetContestDetailResponse getContestSolvingDetailByContestId(String contestId, String userName) throws MiniLeetCodeException {
//        UserLogin userLogin = userLoginRepo.findByUserLoginId(userName);
        ContestEntity contestEntity = contestRepo.findContestByContestId(contestId);
        Date now = new Date();
        log.info("getContestSolvingDetailByContestId, contestId = " + contestId + " now = " + now + " contest start at " +
                 contestEntity.getStartedAt());

        //if(now.before(contestEntity.getStartedAt()) ){
        //    throw new MiniLeetCodeException("Wait contest start");
        //}

        if(!contestEntity.getStatusId().equals(ContestEntity.CONTEST_STATUS_RUNNING)){
            return ModelGetContestDetailResponse.builder()
                                                .contestId(contestId)
                                                .contestName(contestEntity.getContestName())
                                                .contestTime(contestEntity.getContestSolvingTime())
                                                .startAt(contestEntity.getStartedAt())
                                                .list(new ArrayList())
                                                .unauthorized(false)
                                                .isPublic(contestEntity.getIsPublic())
                                                .statusId(contestEntity.getStatusId())
                                                .listStatusIds(ContestEntity.getStatusIds())
                                                .build();
        }

        //UserRegistrationContestEntity userRegistrationContest = userRegistrationContestRepo.findUserRegistrationContestEntityByContestIdAndUserIdAndStatus(contestId, userName, Constants.RegistrationType.SUCCESSFUL.getValue());
        UserRegistrationContestEntity userRegistrationContest = null;
        List<UserRegistrationContestEntity> userRegistrationContests = userRegistrationContestRepo.findUserRegistrationContestEntityByContestIdAndUserIdAndStatus(contestId, userName, Constants.RegistrationType.SUCCESSFUL.getValue());
        if(userRegistrationContests != null && userRegistrationContests.size() > 0)
            userRegistrationContest = userRegistrationContests.get(0);

        log.info("contestEntity {}", contestEntity.getIsPublic());

        if(userRegistrationContest == null){
            log.info("unauthorized");
            return ModelGetContestDetailResponse.builder()
                    .unauthorized(true)
                    .build();
        }
        return getModelGetContestDetailResponse(contestId, contestEntity);
    }

    @Override
    public Page<ModelProblemSubmissionDetailByTestCaseResponse> getContestProblemSubmissionDetailByTestCase(Pageable  page) {
        Page<ContestSubmissionTestCaseEntity> L = contestSubmissionTestCaseEntityRepo.findAll(page);
        Page<ModelProblemSubmissionDetailByTestCaseResponse> retLst = L.map(e ->{
            TestCaseEntity tc = testCaseRepo.findTestCaseByTestCaseId(e.getTestCaseId());
            String testCase = "";
            String correctAnswer = "";
            if(tc != null){
                testCase = tc.getTestCase(); correctAnswer = tc.getCorrectAnswer();
            }
            return new ModelProblemSubmissionDetailByTestCaseResponse(e.getContestSubmissionTestcaseId(),
                                                                      e.getContestId(),
                                                                      e.getProblemId(),
                                                                      e.getSubmittedByUserLoginId(),
                                                                      e.getTestCaseId(),
                                                                      testCase,
                                                                      correctAnswer,
                                                                      e.getStatus(),
                                                                      e.getPoint(),
                                                                      e.getTestCaseOutput(),
                                                                      e.getParticipantSolutionOtput(),
                                                                      e.getCreatedStamp()
                                                                      );
        });
        return retLst;
    }

    @Override
    public List<ModelProblemSubmissionDetailByTestCaseResponse> getContestProblemSubmissionDetailByTestCaseOfASubmission(
        UUID submissionId
    ) {
        List<ContestSubmissionTestCaseEntity> L = contestSubmissionTestCaseEntityRepo.findAllByContestSubmissionId((submissionId));
        log.info("getContestProblemSubmissionDetailByTestCaseOfASubmission, submissionId  = " + submissionId + " retList = " + L.size());
        List<ModelProblemSubmissionDetailByTestCaseResponse> retLst = new ArrayList();
        for(ContestSubmissionTestCaseEntity e: L){
            TestCaseEntity tc = testCaseRepo.findTestCaseByTestCaseId(e.getTestCaseId());
            String testCase = "";
            String correctAnswer = "";
            if(tc != null){
                testCase = tc.getTestCase(); correctAnswer = tc.getCorrectAnswer();
            }

            retLst.add(new ModelProblemSubmissionDetailByTestCaseResponse(e.getContestSubmissionTestcaseId(),
                                                                          e.getContestId(),
                                                                          e.getProblemId(),
                                                                          e.getSubmittedByUserLoginId(),
                                                                          e.getTestCaseId(),
                                                                          testCase,
                                                                          correctAnswer,
                                                                          e.getStatus(),
                                                                          e.getPoint(),
                                                                          e.getTestCaseOutput(),
                                                                          e.getParticipantSolutionOtput(),
                                                                          e.getCreatedStamp()
            ));
        }
        return retLst;
    }
    @Override
    public List<ModelProblemSubmissionDetailByTestCaseResponse> getContestProblemSubmissionDetailByTestCaseOfASubmissionViewedByParticipant(
        UUID submissionId
    ){
        ContestSubmissionEntity sub = contestSubmissionRepo.findContestSubmissionEntityByContestSubmissionId(submissionId);
        ContestEntity contest = null;
        if(sub != null)
            contest = contestRepo.findContestByContestId(sub.getContestId());

        List<ContestSubmissionTestCaseEntity> L = contestSubmissionTestCaseEntityRepo.findAllByContestSubmissionId((submissionId));
        log.info("getContestProblemSubmissionDetailByTestCaseOfASubmission, submissionId  = " + submissionId + " retList = " + L.size());
        List<ModelProblemSubmissionDetailByTestCaseResponse> retLst = new ArrayList();
        for(ContestSubmissionTestCaseEntity e: L){

            String testCase = "";
            String correctAnswer = "";
            if(contest != null && contest.getParticipantViewResultMode().equals(ContestEntity
                                                                 .CONTEST_PARTICIPANT_VIEW_MODE_SEE_CORRECT_ANSWER_AND_PRIVATE_TESTCASE)) {
                TestCaseEntity tc = testCaseRepo.findTestCaseByTestCaseId(e.getTestCaseId());
                if (tc != null) {
                    testCase = tc.getTestCase();
                    correctAnswer = tc.getCorrectAnswer();
                }
            }
            retLst.add(new ModelProblemSubmissionDetailByTestCaseResponse(e.getContestSubmissionTestcaseId(),
                                                                          e.getContestId(),
                                                                          e.getProblemId(),
                                                                          e.getSubmittedByUserLoginId(),
                                                                          e.getTestCaseId(),
                                                                          testCase,
                                                                          correctAnswer,
                                                                          e.getStatus(),
                                                                          e.getPoint(),
                                                                          e.getTestCaseOutput(),
                                                                          e.getParticipantSolutionOtput(),
                                                                          e.getCreatedStamp()
            ));
        }
        return retLst;
    }

    @Override
    public ModelContestSubmissionResponse problemDetailSubmission(ModelProblemDetailSubmission modelProblemDetailSubmission, String problemId, String userName) throws Exception {
        log.info("source {} ", modelProblemDetailSubmission.getSource());
        UserLogin userLogin = userLoginRepo.findByUserLoginId(userName);
        if(userLogin  == null){
            throw new Exception(("user not found"));
        }
        ProblemEntity problemEntity = problemRepo.findByProblemId(problemId);
        if(problemEntity == null){
            throw new Exception("Contest problem does not exist");
        }
        List<TestCaseEntity> testCaseEntityList = testCaseRepo.findAllByProblemId(problemId);
        if (testCaseEntityList == null){
            throw new Exception("Problem Does not have testcase");
        }
        String tempName = tempDir.createRandomScriptFileName(userName+"-"+problemId);
        String response = submission(modelProblemDetailSubmission.getSource(), modelProblemDetailSubmission.getLanguage(), tempName, testCaseEntityList,"Language Not Found", problemEntity.getTimeLimit());

        List<String> correctAns = testCaseEntityList.stream().map(TestCaseEntity::getCorrectAnswer).collect(Collectors.toList());
        List<Integer> points = testCaseEntityList.stream().map(TestCaseEntity::getTestCasePoint).collect(Collectors.toList());
        ProblemSubmission problemSubmission = StringHandler.handleContestResponse(response, correctAns, points);
        log.info("problemSubmission {}", problemSubmission);
        ProblemSubmissionEntity p = ProblemSubmissionEntity.builder()
                .problem(problemEntity)
                .score(problemSubmission.getScore())
                .userLogin(userLogin)
                .testCasePass(problemSubmission.getTestCasePass())
                .status(problemSubmission.getStatus())
                .runtime(""+problemSubmission.getRuntime())
                .sourceCode(modelProblemDetailSubmission.getSource())
                .sourceCodeLanguages(modelProblemDetailSubmission.getLanguage())
                .build();
        problemSubmissionRepo.save(p);
        return ModelContestSubmissionResponse.builder()
                .status(problemSubmission.getStatus())
                .testCasePass(p.getTestCasePass())
                .runtime(problemSubmission.getRuntime())
                .memoryUsage(p.getMemoryUsage())
                .problemName(problemEntity.getProblemName())
                .score(problemSubmission.getScore())
                .build();
    }

    @Override
    public ModelContestSubmissionResponse submitContestProblem(ModelContestSubmission modelContestSubmission, String userName) throws Exception {
        log.info("submitContestProblem");
        log.info("modelContestSubmission {}", modelContestSubmission);
        ProblemEntity problemEntity = problemRepo.findByProblemId(modelContestSubmission.getProblemId());

        //UserRegistrationContestEntity userRegistrationContest = userRegistrationContestRepo.findUserRegistrationContestEntityByContestIdAndUserIdAndStatus(modelContestSubmission.getContestId(), userName, Constants.RegistrationType.SUCCESSFUL.getValue());
        List<UserRegistrationContestEntity> userRegistrationContests = userRegistrationContestRepo.findUserRegistrationContestEntityByContestIdAndUserIdAndStatus(modelContestSubmission.getContestId(), userName, Constants.RegistrationType.SUCCESSFUL.getValue());
        UserRegistrationContestEntity userRegistrationContest = null;
        if(userRegistrationContests != null && userRegistrationContests.size() > 0)
            userRegistrationContest = userRegistrationContests.get(0);

        log.info("userRegistrationContest {}", userRegistrationContest);
        if(userRegistrationContest == null){
            throw new MiniLeetCodeException("User not register contest");
        }
        List<TestCaseEntity> testCaseEntityList = testCaseRepo.findAllByProblemId(modelContestSubmission.getProblemId());
        String tempName = tempDir.createRandomScriptFileName(userName+"-"+modelContestSubmission.getContestId()+"-"+modelContestSubmission.getProblemId());

        String response = submission(modelContestSubmission.getSource(), modelContestSubmission.getLanguage(), tempName, testCaseEntityList, "language not found", problemEntity.getTimeLimit());

        List<String> testCaseAns = testCaseEntityList.stream().map(TestCaseEntity::getCorrectAnswer).collect(Collectors.toList());
        List<Integer> points = testCaseEntityList.stream().map(TestCaseEntity::getTestCasePoint).collect(Collectors.toList());
        ProblemSubmission problemSubmission = StringHandler.handleContestResponse(response, testCaseAns, points);
        ContestSubmissionEntity c = ContestSubmissionEntity.builder()
                .contestId(modelContestSubmission.getContestId())
                .status(problemSubmission.getStatus())
                .point(problemSubmission.getScore())
                .problemId(modelContestSubmission.getProblemId())
                .userId(userName)
                .testCasePass(problemSubmission.getTestCasePass())
                .sourceCode(modelContestSubmission.getSource())
                .sourceCodeLanguage(modelContestSubmission.getLanguage())
                .runtime(problemSubmission.getRuntime())
                .createdAt(new Date())
                .build();
        c = contestSubmissionRepo.save(c);
        log.info("c {}", c.getRuntime());
        return ModelContestSubmissionResponse.builder()
                .status(problemSubmission.getStatus())
                .testCasePass(c.getTestCasePass())
                .runtime(problemSubmission.getRuntime())
                .memoryUsage(c.getMemoryUsage())
                .problemName(problemEntity.getProblemName())
                .contestSubmissionID(c.getContestSubmissionId())
                .submittedAt(c.getCreatedAt())
                .score(problemSubmission.getScore())
                .build();
    }
    @Transactional
    @Override
    public ModelContestSubmissionResponse submitContestProblemTestCaseByTestCase(ModelContestSubmission modelContestSubmission, String userName) throws Exception {
        //log.info("submitContestProblem");
        //log.info("modelContestSubmission {}", modelContestSubmission);
        ProblemEntity problemEntity = problemRepo.findByProblemId(modelContestSubmission.getProblemId());
        ContestEntity contest = contestRepo.findContestByContestId(modelContestSubmission.getContestId());

        //UserRegistrationContestEntity userRegistrationContest = userRegistrationContestRepo.findUserRegistrationContestEntityByContestIdAndUserIdAndStatus(modelContestSubmission.getContestId(), userName, Constants.RegistrationType.SUCCESSFUL.getValue());
        UserRegistrationContestEntity userRegistrationContest = null;
        List<UserRegistrationContestEntity> userRegistrationContests = userRegistrationContestRepo.findUserRegistrationContestEntityByContestIdAndUserIdAndStatus(modelContestSubmission.getContestId(), userName, Constants.RegistrationType.SUCCESSFUL.getValue());
        if(userRegistrationContests != null && userRegistrationContests.size() > 0)
            userRegistrationContest = userRegistrationContests.get(0);

        //log.info("userRegistrationContest {}", userRegistrationContest);
        if(userRegistrationContest == null){
            throw new MiniLeetCodeException("User not register contest");
        }
        //List<TestCaseEntity> testCaseEntityList = testCaseRepo.findAllByProblemId(modelContestSubmission.getProblemId());
        List<TestCaseEntity> testCaseEntityList = null;
        boolean evalPrivatePublic = false;
        if(contest != null && contest.getEvaluateBothPublicPrivateTestcase() != null
           && contest.getEvaluateBothPublicPrivateTestcase().equals(ContestEntity.EVALUATE_USE_BOTH_PUBLIC_PRIVATE_TESTCASE_YES))
            evalPrivatePublic = true;

        if(evalPrivatePublic)
            testCaseEntityList = testCaseRepo.findAllByProblemId(modelContestSubmission.getProblemId());
        else testCaseEntityList =  testCaseRepo
            .findAllByProblemIdAndIsPublic(modelContestSubmission.getProblemId(),"N");

        String tempName = tempDir.createRandomScriptFileName(userName+"-"+modelContestSubmission.getContestId()+"-"+modelContestSubmission.getProblemId());

        int runtime  = 0;
        int score = 0;
        int nbTestCasePass = 0;
        String totalStatus = "";
        List<String> statusList = new ArrayList<String>();
        List<ContestSubmissionTestCaseEntity> LCSTE = new ArrayList();
        String message = "";
        boolean compileError = false;
        for(int i = 0; i < testCaseEntityList.size(); i++) {
            List<TestCaseEntity> L = new ArrayList();
            L.add(testCaseEntityList.get(i));

            String response = submission(modelContestSubmission.getSource(), modelContestSubmission.getLanguage(), tempName, L, "language not found", problemEntity.getTimeLimit());

            List<String> testCaseAns = L.stream().map(TestCaseEntity::getCorrectAnswer).collect(Collectors.toList());
            List<Integer> points = L.stream().map(TestCaseEntity::getTestCasePoint).collect(Collectors.toList());
            ProblemSubmission problemSubmission = StringHandler.handleContestResponse(response, testCaseAns, points);

            //log.info("submitContestProblemTestCaseByTestCase, run tesecase " + (i+1) + " message = " + problemSubmission.getMessage());
            // check if there is error compile
            if(problemSubmission.getMessage() != null && !problemSubmission.getMessage().contains("successful")){
                message = problemSubmission.getMessage(); compileError = true; break;
            }

            runtime = runtime + problemSubmission.getRuntime().intValue();
            score = score + problemSubmission.getScore();
            nbTestCasePass += problemSubmission.getNbTestCasePass();
            //status = status + "#" + (i+1) + ": " + problemSubmission.getStatus() + "; ";
            statusList.add(problemSubmission.getStatus());
            List<String> output  = problemSubmission.getParticipantAns();
            String participantAns = "";
            if(output != null && output.size() > 0)
                participantAns = output.get(0);

            ContestSubmissionTestCaseEntity cste = ContestSubmissionTestCaseEntity.builder()
                .contestId(modelContestSubmission.getContestId())
                                                                                  .problemId(modelContestSubmission.getProblemId())
                                                                                  .testCaseId(testCaseEntityList.get(i).getTestCaseId())
                                                                                  .submittedByUserLoginId(userName)
                                                                                  .point(problemSubmission.getScore())
                                                                                  .status(problemSubmission.getStatus())
                                                                                  .testCaseOutput(testCaseEntityList.get(i).getCorrectAnswer())
                                                                                  .participantSolutionOtput(participantAns)
                                                                                  .runtime(problemSubmission.getRuntime())
                                                                                  .createdStamp(new Date())
                                                                                  .build();
            cste = contestSubmissionTestCaseEntityRepo.save(cste);
            LCSTE.add(cste);
        }
        boolean accepted = true;
        for(String s: statusList){
            if(s.equals(ContestSubmissionEntity.SUBMISSION_STATUS_COMPILE_ERROR)){
                totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_COMPILE_ERROR; accepted = false; break;
            }else if(s.equals(ContestSubmissionEntity.SUBMISSION_STATUS_TIME_LIMIT_EXCEEDED)){
                totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_TIME_LIMIT_EXCEEDED; accepted = false; break;
            }else if(s.equals(ContestSubmissionEntity.SUBMISSION_STATUS_WRONG)){
                totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_WRONG; accepted = false; //break;
            }
        }
        if(accepted) totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_ACCEPTED;

        if(compileError) {
            // keep compile error message above
            totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_COMPILE_ERROR;
        }else if(nbTestCasePass == 0){
            totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_WRONG;
        }else if(nbTestCasePass > 0 && nbTestCasePass < testCaseEntityList.size()) {
            totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_PARTIAL;
        }else{
            message = "Successful";
        }
        log.info("evaluateSubmission, totalStatus = " + totalStatus + " nbTestCasePass = " + nbTestCasePass);

        //String response = submission(modelContestSubmission.getSource(), modelContestSubmission.getLanguage(), tempName, testCaseEntityList, "language not found", problemEntity.getTimeLimit());

        //List<String> testCaseAns = testCaseEntityList.stream().map(TestCaseEntity::getCorrectAnswer).collect(Collectors.toList());
        //List<Integer> points = testCaseEntityList.stream().map(TestCaseEntity::getTestCasePoint).collect(Collectors.toList());
        //ProblemSubmission problemSubmission = StringHandler.handleContestResponse(response, testCaseAns, points);
        ContestSubmissionEntity c = ContestSubmissionEntity.builder()
                                                           .contestId(modelContestSubmission.getContestId())
                                                           .status(totalStatus)
                                                           .point(score)
                                                           .problemId(modelContestSubmission.getProblemId())
                                                           .userId(userName)
                                                           .testCasePass(nbTestCasePass + "/" + testCaseEntityList.size())
                                                           .sourceCode(modelContestSubmission.getSource())
                                                           .sourceCodeLanguage(modelContestSubmission.getLanguage())
                                                           .runtime(new Long(runtime))
                                                           .createdAt(new Date())
                                                           .build();
        c = contestSubmissionRepo.save(c);

        for(ContestSubmissionTestCaseEntity e: LCSTE){
            e.setContestSubmissionId(c.getContestSubmissionId());
            e = contestSubmissionTestCaseEntityRepo.save(e);
        }

        log.info("c {}", c.getRuntime());

        return ModelContestSubmissionResponse.builder()
                                             .status(totalStatus)
                                             .message(message)
                                             .testCasePass(c.getTestCasePass())
                                             .runtime(new Long(runtime))
                                             .memoryUsage(c.getMemoryUsage())
                                             .problemName(problemEntity.getProblemName())
                                             .contestSubmissionID(c.getContestSubmissionId())
                                             .submittedAt(c.getCreatedAt())
                                             .score(score)
                                             .numberTestCasePassed(nbTestCasePass)
                                             .totalNumberTestCase(testCaseEntityList.size())
                                             .build();
    }

    @Override
    public ModelContestSubmissionResponse submitContestProblemStoreOnlyNotExecute(
        ModelContestSubmission modelContestSubmission,
        String userName
    ) throws Exception {

        ContestSubmissionEntity c = ContestSubmissionEntity.builder()
                                                           .contestId(modelContestSubmission.getContestId())
                                                           .status(ContestSubmissionEntity.SUBMISSION_STATUS_NOT_AVAILABLE)
                                                           .point(0)
                                                           .problemId(modelContestSubmission.getProblemId())
                                                           .userId(userName)
                                                           .testCasePass("")
                                                           .sourceCode(modelContestSubmission.getSource())
                                                           .sourceCodeLanguage(modelContestSubmission.getLanguage())
                                                           .runtime(new Long(0))
                                                           .createdAt(new Date())
                                                           .build();
        c = contestSubmissionRepo.save(c);



        log.info("c {}", c.getRuntime());
        return ModelContestSubmissionResponse.builder()
                                             .status("STORED")
                                             .testCasePass(c.getTestCasePass())
                                             .runtime(new Long(0))
                                             .memoryUsage(c.getMemoryUsage())
                                             .problemName("")
                                             .contestSubmissionID(c.getContestSubmissionId())
                                             .submittedAt(c.getCreatedAt())
                                             .score(0)
                                             .numberTestCasePassed(0)
                                             .totalNumberTestCase(0)
                                             .build();
    }

    @Transactional
    @Override
    public ModelContestSubmissionResponse submitSolutionOutput(
        String solutionOutput,
        String contestId,
        String problemId,
        UUID testCaseId,
        String userName
    ) throws Exception {
        ProblemEntity problemEntity = problemRepo.findByProblemId(problemId);
        //UserRegistrationContestEntity userRegistrationContest = userRegistrationContestRepo.findUserRegistrationContestEntityByContestIdAndUserIdAndStatus(
        //    contestId, userName, Constants.RegistrationType.SUCCESSFUL.getValue());

        UserRegistrationContestEntity userRegistrationContest = null;
        List<UserRegistrationContestEntity> userRegistrationContests = userRegistrationContestRepo.findUserRegistrationContestEntityByContestIdAndUserIdAndStatus(
            contestId, userName, Constants.RegistrationType.SUCCESSFUL.getValue());
        if(userRegistrationContests != null && userRegistrationContests.size() > 0)
            userRegistrationContest   = userRegistrationContests.get(0);

        log.info("submitSolutionOutput, userRegistrationContest {}", userRegistrationContest);
        if(userRegistrationContest == null){
            throw new MiniLeetCodeException("User not register contest");
        }
        TestCaseEntity testCase = testCaseRepo.findTestCaseByTestCaseId(testCaseId);
        String tempName = tempDir.createRandomScriptFileName(userName+"-" + contestId + "-" + problemId);
        String response = submissionSolutionOutput(problemEntity.getSolutionCheckerSourceCode(),
                                                   problemEntity.getSolutionCheckerSourceLanguage(), solutionOutput, tempName, testCase,"language not found",1000000);


        log.info("submitSolutionOutput, response = " + response);

        ProblemSubmission problemSubmission = StringHandler.handleContestResponseSubmitSolutionOutputOneTestCase(response,testCase.getTestCasePoint());

        String participantAns = "";
        if(problemSubmission.getParticipantAns() != null && problemSubmission.getParticipantAns().size() > 0){
            participantAns = problemSubmission.getParticipantAns().get(0);
        }
        ContestSubmissionTestCaseEntity cste = ContestSubmissionTestCaseEntity.builder()
                                                                              .contestId(contestId)
                                                                              .problemId(problemId)
                                                                              .testCaseId(testCase.getTestCaseId())
                                                                              .submittedByUserLoginId(userName)
                                                                              .point(problemSubmission.getScore())
                                                                              .status(problemSubmission.getStatus())
                                                                              .testCaseOutput(testCase.getCorrectAnswer())
                                                                              .participantSolutionOtput(participantAns)
                                                                              .runtime(problemSubmission.getRuntime())
                                                                              .createdStamp(new Date())
                                                                              .build();
        cste = contestSubmissionTestCaseEntityRepo.save(cste);

        return ModelContestSubmissionResponse.builder()
                                             .status(problemSubmission.getStatus())
                                             .testCasePass("1/1")
                                             .runtime(problemSubmission.getRuntime())
                                             .memoryUsage((float)0.0)
                                             .problemName(problemEntity.getProblemName())
                                             .contestSubmissionID(null)
                                             .submittedAt(new Date())
                                             .score(problemSubmission.getScore())
                                             .build();

    }

    @Override
    public ModelStudentRegisterContestResponse studentRegisterContest(String contestId, String userId) throws MiniLeetCodeException {
        ContestEntity contestEntity = contestRepo.findContestByContestId(contestId);
//
//        UserLogin userLogin = userLoginRepo.findByUserLoginId(userId);
        UserRegistrationContestEntity existed = userRegistrationContestRepo.findUserRegistrationContestEntityByContestIdAndUserId(contestId, userId);
        log.info("existed {}", existed);
//        if(existed != null && Constants.RegisterCourseStatus.SUCCESSES.getValue().equals(existed.getStatus())){
//            throw new MiniLeetCodeException("You are already register course successful");
//        }
        if(existed == null){
            UserRegistrationContestEntity userRegistrationContestEntity = UserRegistrationContestEntity.builder()
                    .contestId(contestId)
                    .userId(userId)
                    .status(Constants.RegistrationType.PENDING.getValue())
                    .build();
            userRegistrationContestRepo.save(userRegistrationContestEntity);

        }else{
            if(Constants.RegistrationType.SUCCESSFUL.getValue().equals(existed.getStatus())){
                throw new MiniLeetCodeException("You are already register course successful");
            }else{
                existed.setStatus(Constants.RegistrationType.PENDING.getValue());
                userRegistrationContestRepo.save(existed);
            }
        }
        notificationsService.create(userId, contestEntity.getUserId(), userId + " register contest "+contestId,"/programming-contest/contest-manager/"+contestId+"#pending");

        return ModelStudentRegisterContestResponse.builder()
                .status(Constants.RegistrationType.PENDING.getValue())
                .message("You have send request to register contest "+ contestId +", please wait to accept")
                .build();
    }

    @Override
    public int teacherManageStudentRegisterContest(String teacherId, ModelTeacherManageStudentRegisterContest modelTeacherManageStudentRegisterContest) throws MiniLeetCodeException {
        ContestEntity contestEntity = contestRepo.findContestByContestId(modelTeacherManageStudentRegisterContest.getContestId());
//        UserLogin student = userLoginRepo.findByUserLoginId(modelTeacherManageStudentRegisterContest.getUserId());
        log.info("teacherid {}", teacherId);
        log.info("created contest {}", contestEntity.getUserId());
        int cnt = 0;
        if( contestEntity.getUserId() == null || !contestEntity.getUserId().equals(teacherId)){
            throw new MiniLeetCodeException(teacherId +" does not have privilege to manage contest " + modelTeacherManageStudentRegisterContest.getContestId());
        }
        UserRegistrationContestEntity userRegistrationContestEntity = userRegistrationContestRepo.findUserRegistrationContestEntityByContestIdAndUserId(modelTeacherManageStudentRegisterContest.getContestId(), modelTeacherManageStudentRegisterContest.getUserId());

        if(Constants.RegisterCourseStatus.SUCCESSES.getValue().equals(modelTeacherManageStudentRegisterContest.getStatus())){
            log.info("approve");
            if(!userRegistrationContestEntity.getStatus().equals(Constants.RegistrationType.SUCCESSFUL.getValue())) {
                userRegistrationContestEntity.setStatus(Constants.RegistrationType.SUCCESSFUL.getValue());
                userRegistrationContestRepo.save(userRegistrationContestEntity);
                notificationsService.create(
                    teacherId,
                    modelTeacherManageStudentRegisterContest.getUserId(),
                    "Your register contest " +
                    modelTeacherManageStudentRegisterContest.getContestId() +
                    " is approved ",
                    null);
                cnt += 1;
            }
        }else if(Constants.RegisterCourseStatus.FAILED.getValue().equals(modelTeacherManageStudentRegisterContest.getStatus())){

            log.info("reject");
            if(!userRegistrationContestEntity.getStatus().equals(Constants.RegistrationType.FAILED.getValue())) {
                userRegistrationContestEntity.setStatus(Constants.RegistrationType.FAILED.getValue());
                userRegistrationContestRepo.save(userRegistrationContestEntity);
                notificationsService.create(
                    teacherId,
                    modelTeacherManageStudentRegisterContest.getUserId(),
                    "Your register contest " +
                    modelTeacherManageStudentRegisterContest.getContestId() +
                    " is rejected ",
                    null);
                cnt += 1;
            }
        }else{
            throw new MiniLeetCodeException("Status not found");
        }
        return cnt;
    }

    @Override
    public void calculateContestResult(String contestId) {
        List<Object[]> list = contestSubmissionRepo.calculatorContest(contestId);
        log.info("size {}", list.size());
        log.info("list {}", list);
        List<UserSubmissionContestResultNativeEntity> list1 = list.stream()
                .map(objects -> convertObjectsToUserSubmissionContestResultNativeEntity(objects, contestId))
                .collect(Collectors.toList());
//        log.info("list1 {}", list1);



        userSubmissionContestResultNativeRepo.saveAll(list1);
    }

    @Override
    public ModelGetContestPageResponse getContestPagingByUserCreatedContest(String userName, Pageable pageable) {
//        UserLogin userCreateContest = userLoginRepo.findByUserLoginId(userName);
        Page<ContestEntity> contestPage =  contestPagingAndSortingRepo.findAllByUserId(pageable, userName);
        return getModelGetContestPageResponse(contestPage);
    }

    @Override
    public ModelGetContestPageResponse getContestPagingByUserManagerContest(String userName, Pageable pageable) {
        List<UserRegistrationContestEntity> L = userRegistrationContestRepo.findAllByUserIdAndRoleId(userName, UserRegistrationContestEntity.ROLE_MANAGER);
        //Page<ContestEntity> contestPage =  contestPagingAndSortingRepo.findAllByUserIdAndRoleId(pageable, userName, UserRegistrationContestEntity.ROLE_MANAGER);
        HashSet<String> contestIds = new HashSet();
        for(UserRegistrationContestEntity e: L){
            contestIds.add(e.getContestId());
        }
        List<ContestEntity> contestEntities = contestPagingAndSortingRepo.findAllByContestIdIn(contestIds);
        return getModelGetContestPageResponse(contestEntities);
    }

    @Override
    public ModelGetContestPageResponse getAllContestsPagingByAdmin(String userName, Pageable pageable) {
        //List<ContestEntity> contestEntities = contestPagingAndSortingRepo.findAll();
        Page<ContestEntity> contestEntities = contestPagingAndSortingRepo.findAll(pageable);
        return getModelGetContestPageResponse(contestEntities);
    }

    @Override
    public ListModelUserRegisteredContestInfo getListUserRegisterContestSuccessfulPaging(Pageable pageable, String contestId) {
//        ContestEntity contest = contestRepo.findContestByContestId(contestId);
        Page<ModelUserRegisteredClassInfo> list = userRegistrationContestPagingAndSortingRepo.getAllUserRegisteredByContestIdAndStatusInfo(pageable, contestId, Constants.RegistrationType.SUCCESSFUL.getValue());
        return ListModelUserRegisteredContestInfo.builder()
                .contents(list)
                .build();
    }

    @Override
    public ListModelUserRegisteredContestInfo getListUserRegisterContestPendingPaging(Pageable pageable, String contestId) {
//        ContestEntity contest = contestRepo.findContestByContestId(contestId);
        Page<ModelUserRegisteredClassInfo> list = userRegistrationContestPagingAndSortingRepo.getAllUserRegisteredByContestIdAndStatusInfo(pageable, contestId, Constants.RegistrationType.PENDING.getValue());
        return ListModelUserRegisteredContestInfo.builder()
                .contents(list)
                .build();
    }

    @Override
    public ListModelUserRegisteredContestInfo searchUser(Pageable pageable, String contestId, String keyword) {
//        ContestEntity contest = contestRepo.findContestByContestId(contestId);
        Page<ModelUserRegisteredClassInfo> list = userRegistrationContestPagingAndSortingRepo.searchUser(pageable,contestId, keyword);
        return ListModelUserRegisteredContestInfo.builder()
                .contents(list)
                .build();
    }

    @Override
    public ModelGetContestPageResponse getRegisteredContestByUser(Pageable pageable, String userName) {
//        Page<ContestEntity> list = userRegistrationContestPagingAndSortingRepo.getContestByUserAndStatusSuccessful(pageable, userName);
        Date currentDate = new Date();
        log.info("getRegisteredContestByUser, currentDateTime = " + currentDate);
        //Page<ContestEntity> list = userRegistrationContestPagingAndSortingRepo.getContestByUserAndStatusSuccessfulInSolvingTime(pageable, userName, currentDate);
        Page<ContestEntity> list = userRegistrationContestPagingAndSortingRepo.getContestByUser(pageable, userName);
        return getModelGetContestPageResponse(list);
    }

    @Override
    public ModelGetContestPageResponse getNotRegisteredContestByUser(Pageable pageable, String userName) {
//        UserLogin u = userLoginRepo.findByUserLoginId(userName);
        Page<ContestEntity> list = userRegistrationContestPagingAndSortingRepo.getNotRegisteredContestByUserLogin(pageable, userName);
        return getModelGetContestPageResponse(list);
    }

    @Override
    public Page<UserSubmissionContestResultNativeEntity> getRankingByContestId(Pageable pageable, String contestId) {
        return userSubmissionContestResultNativePagingRepo.findAllByContestId(pageable, contestId);
    }

    @Override
    public List<ContestSubmissionsByUser> getRankingByContestIdNew(Pageable pageable, String contestId, Constants.GetPointForRankingType getPointForRankingType) {
        ListModelUserRegisteredContestInfo users = this.getListUserRegisterContestSuccessfulPaging(pageable, contestId);
        ContestEntity contestEntity = contestRepo.findContestByContestId(contestId);

        List<ContestSubmissionsByUser> listContestSubmissionsByUser = new ArrayList<>();
        for (ModelUserRegisteredClassInfo user: users.getContents()) {

            List<ContestSubmission> submissionsByUser = contestSubmissionPagingAndSortingRepo.findAllByUserIdAndContestId(user.getUserName(), contestId).stream()
                .map(contestSubmissionEntity -> ContestSubmission.builder()                                                                                                          .contestSubmissionId(contestSubmissionEntity.getContestSubmissionId())
                                                                  .contestId(contestSubmissionEntity.getContestId())
                                                                  .createAt(contestSubmissionEntity.getCreatedAt() != null ? DateTimeUtils.dateToString(contestSubmissionEntity.getCreatedAt(), DateTimeUtils.DateTimeFormat.DATE_TIME_ISO_FORMAT) : null)
                                                                  .sourceCodeLanguage(contestSubmissionEntity.getSourceCodeLanguage())
                                                                  .point(contestSubmissionEntity.getPoint())
                                                                  .problemId(contestSubmissionEntity.getProblemId())
                                                                  .testCasePass(contestSubmissionEntity.getTestCasePass())
                                                                  .status(contestSubmissionEntity.getStatus())
                                                                  .userId(contestSubmissionEntity.getUserId())
                                                                  .build()
            ).collect(Collectors.toList());

            ContestSubmissionsByUser contestSubmission = new ContestSubmissionsByUser();
            contestSubmission.setUserId(user.getUserName());

            HashMap<String, Integer> mapProblemToPoint = new HashMap<>();

            for (ProblemEntity problem : contestEntity.getProblems()) {
                mapProblemToPoint.put(problem.getProblemId(), 0);
            }

            switch (getPointForRankingType) {
                // get highest submission score on each problem
                case HIGHEST:
                    for (ContestSubmission submission : submissionsByUser) {
                        String problemId = submission.getProblemId();
                        if (mapProblemToPoint.containsKey(problemId)){
                            if (submission.getPoint() > mapProblemToPoint.get(problemId)) {
                                mapProblemToPoint.put(problemId, submission.getPoint());
                            }
                        }
                    }
                    break;

                // get latest submission score on each problem
                case LATEST:
                    HashMap<String, ContestSubmission> mapProblemToLatestSubmission = new HashMap<>();

                    for (ContestSubmission submission : submissionsByUser) {
                        String problemId = submission.getProblemId();
                        if (mapProblemToLatestSubmission.containsKey(problemId)){
                            Date tmpSubmissionTime = DateTimeUtils.convertDateTimeStr2Date(submission.getCreateAt());
                            Date currentSubmissionTime = DateTimeUtils.convertDateTimeStr2Date(mapProblemToLatestSubmission.get(problemId).getCreateAt());
                            if (tmpSubmissionTime.compareTo(currentSubmissionTime) >= 0) {
                                mapProblemToLatestSubmission.put(problemId, submission);
                            }
                        }
                        else mapProblemToLatestSubmission.put(problemId, submission);
                    }

//                    mapProblemToLatestSubmission.entrySet().stream().map(entry -> mapProblemToPoint.put(entry.getKey(), entry.getValue().getPoint()));

                    for (Map.Entry<String, ContestSubmission> entry : mapProblemToLatestSubmission.entrySet()) {
                        mapProblemToPoint.put(entry.getKey(), entry.getValue().getPoint());
                    }
                    break;
            }

            int totalPoint = 0;

            List<ContestSubmissionsByUserCustom> mapProblemsToPoints = new ArrayList<>();
            for(Map.Entry entry : mapProblemToPoint.entrySet()) {
                ContestSubmissionsByUserCustom tmp = new ContestSubmissionsByUserCustom();
                tmp.setProblemId(entry.getKey().toString());
                tmp.setPoint(Integer.valueOf(entry.getValue().toString()));
                mapProblemsToPoints.add(tmp);
                totalPoint += tmp.getPoint();
            }
            //PersonModel person = userService.findPersonByUserLoginId(user.getUserLoginId());
            String fullname = user.getLastName() + " " + user.getMiddleName() + " " + user.getFirstName();
            contestSubmission.setFullname(fullname);
            contestSubmission.setMapProblemsToPoints(mapProblemsToPoints);
            contestSubmission.setTotalPoint(totalPoint);
            listContestSubmissionsByUser.add(contestSubmission);
        }

        return listContestSubmissionsByUser;
    }

    @Override
    public Page<ProblemEntity> getPublicProblemPaging(Pageable pageable) {
        return problemPagingAndSortingRepo.findAllByPublicIs(pageable);
    }

    @Override
    public List<ModelGetTestCase> getTestCaseByProblem(String problemId) {
//        ProblemEntity problem = problemRepo.findByProblemId(problemId);
        List<TestCaseEntity> testCases = testCaseRepo.findAllByProblemId(problemId);
        return testCases.stream().map(this::convertToModelGetTestCase).collect(Collectors.toList());
    }

    @Override
    public ModelGetTestCaseDetail getTestCaseDetail(UUID testCaseId) throws MiniLeetCodeException {
        TestCaseEntity testCase = testCaseRepo.findTestCaseByTestCaseId(testCaseId);
        ProblemEntity problem = problemRepo.findByProblemId(testCase.getProblemId());
        if(testCase == null){
            throw new MiniLeetCodeException("testcase not found");
        }
        return ModelGetTestCaseDetail.builder()
                .testCaseId(testCaseId)
                .correctAns(testCase.getCorrectAnswer())
                .testCase(testCase.getTestCase())
                .point(testCase.getTestCasePoint()).isPublic(testCase.getIsPublic())
                .problemSolution(problem.getSolution())
                .problemDescription(problem.getProblemDescription())
                                     .description(testCase.getDescription())
                .build();
    }

    @Override
    public void editTestCase(UUID testCaseId, ModelSaveTestcase modelSaveTestcase) throws MiniLeetCodeException {
        TestCaseEntity testCase = testCaseRepo.findTestCaseByTestCaseId(testCaseId);
        if(testCase == null){
            throw new MiniLeetCodeException("test case not found");
        }

        testCase.setTestCase(modelSaveTestcase.getInput());
        testCase.setCorrectAnswer(modelSaveTestcase.getResult());
        testCase.setTestCasePoint(modelSaveTestcase.getPoint());
        testCase.setIsPublic(modelSaveTestcase.getIsPublic());
        testCaseRepo.save(testCase);
    }

    @Override
    public int addUserToContest(ModelAddUserToContest modelAddUserToContest) {
        UserRegistrationContestEntity userRegistrationContest = userRegistrationContestRepo.findUserRegistrationContestEntityByContestIdAndUserId(modelAddUserToContest.getContestId(), modelAddUserToContest.getUserId());
        if(userRegistrationContest == null) {
            userRegistrationContestRepo.save(UserRegistrationContestEntity.builder()
                    .contestId(modelAddUserToContest.getContestId())
                    .userId(modelAddUserToContest.getUserId())
                    .status(Constants.RegistrationType.SUCCESSFUL.getValue())
                                                                          .roleId(modelAddUserToContest.getRole())
                    .build());
            return 1;
        }else{
            userRegistrationContest.setStatus(Constants.RegistrationType.SUCCESSFUL.getValue());
            userRegistrationContestRepo.save(userRegistrationContest);
            return 0;
        }

    }

    @Override
    public int addAllUsersToContest(ModelAddUserToContest model) {
        List<UserLogin> users = userService.getAllUserLogins();
        int cnt = 0;
        for(UserLogin u: users){
            model.setUserId(u.getUserLoginId());
            cnt += addUserToContest(model);
        }
        return cnt;
    }

    @Override
    public void deleteUserContest(ModelAddUserToContest modelAddUserToContest) throws MiniLeetCodeException {
        UserRegistrationContestEntity userRegistrationContest = userRegistrationContestRepo.findUserRegistrationContestEntityByContestIdAndUserId(modelAddUserToContest.getContestId(), modelAddUserToContest.getUserId());
        if(userRegistrationContest == null){
            throw new MiniLeetCodeException("user not register contest");
        }

        userRegistrationContest.setStatus(Constants.RegistrationType.FAILED.getValue());
        userRegistrationContestRepo.delete(userRegistrationContest);
    }
    @Override
    public Page<ContestSubmission> findContestSubmissionByUserLoginIdPaging(Pageable pageable,String userLoginId){
        return contestSubmissionPagingAndSortingRepo.findAllByUserId(pageable,userLoginId)
                                                    .map(contestSubmissionEntity -> ContestSubmission.builder()                                                                                                          .contestSubmissionId(contestSubmissionEntity.getContestSubmissionId())
                                                    .contestId(contestSubmissionEntity.getContestId())
                                                    .createAt(contestSubmissionEntity.getCreatedAt() != null ? DateTimeUtils.dateToString(contestSubmissionEntity.getCreatedAt(), DateTimeUtils.DateTimeFormat.DATE_TIME_ISO_FORMAT) : null)
                                                    .sourceCodeLanguage(contestSubmissionEntity.getSourceCodeLanguage())
                                                    .point(contestSubmissionEntity.getPoint())
                                                    .problemId(contestSubmissionEntity.getProblemId())
                                                    .testCasePass(contestSubmissionEntity.getTestCasePass())
                                                    .status(contestSubmissionEntity.getStatus())
                                                    .message(contestSubmissionEntity.getMessage())
                                                    .userId(contestSubmissionEntity.getUserId())
                                                    .build()
                                                    );
    }

    @Override
    public Page<ContestSubmission> findContestSubmissionByUserLoginIdAndContestIdPaging(
        Pageable pageable,
        String userLoginId,
        String contestId
    ) {
        log.info("findContestSubmissionByUserLoginIdAndContestIdPaging, user = " + userLoginId + " contestId = " + contestId);
        return contestSubmissionPagingAndSortingRepo.findAllByUserIdAndContestId(pageable,userLoginId, contestId)
                                                    .map(contestSubmissionEntity -> ContestSubmission.builder()                                                                                                          .contestSubmissionId(contestSubmissionEntity.getContestSubmissionId())
                                                                                                     .contestId(contestSubmissionEntity.getContestId())
                                                                                                     .createAt(contestSubmissionEntity.getCreatedAt() != null ? DateTimeUtils.dateToString(contestSubmissionEntity.getCreatedAt(), DateTimeUtils.DateTimeFormat.DATE_TIME_ISO_FORMAT) : null)
                                                                                                     .sourceCodeLanguage(contestSubmissionEntity.getSourceCodeLanguage())
                                                                                                     .point(contestSubmissionEntity.getPoint())
                                                                                                     .problemId(contestSubmissionEntity.getProblemId())
                                                                                                     .testCasePass(contestSubmissionEntity.getTestCasePass())
                                                                                                     .status(contestSubmissionEntity.getStatus())
                                                                                                     .message(contestSubmissionEntity.getMessage())
                                                                                                     .userId(contestSubmissionEntity.getUserId())
                                                                                                     .build()
                                                    );
    }

    @Override
    public List<ContestSubmission> getNewestSubmissionResults(String userLoginId) {
        List<ContestSubmissionEntity> lst = contestSubmissionPagingAndSortingRepo
            .findAllByUserId(userLoginId);
        List<ContestSubmission> retList = new ArrayList();
        Set<String> keys = new HashSet();
        for(ContestSubmissionEntity s: lst){
            String k = s.getContestId() + "@" + s.getProblemId() + "@" + s.getUserId();
            keys.add(k);
            log.info("getNewestSubmissionResults, read record " + s.getContestSubmissionId() + " created stamp " + s.getCreatedAt());
        }
        Set<String> ignores = new HashSet();
        for(ContestSubmissionEntity s: lst){
            String k = s.getContestId() + "@" + s.getProblemId() + "@" + s.getUserId();
            if(ignores.contains(k)){
                continue;
            }
            if(keys.contains(k)){
                ContestSubmission cs = new ContestSubmission();
                cs.setContestSubmissionId(s.getContestSubmissionId());
                cs.setStatus(s.getStatus());
                cs.setContestId(s.getContestId());
                cs.setProblemId(s.getProblemId());
                cs.setUserId(s.getUserId());
                cs.setPoint(s.getPoint());
                cs.setCreateAt(s.getCreatedAt() != null ? DateTimeUtils.dateToString(s.getCreatedAt(), DateTimeUtils.DateTimeFormat.DATE_TIME_ISO_FORMAT) : null);
                cs.setTestCasePass(s.getTestCasePass());
                cs.setSourceCodeLanguage(s.getSourceCodeLanguage());
                retList.add(cs);
                ignores.add(k);// process only the first meet
                //break;// break when reach a first entry
            }
        }
        return retList;
    }

    @Override
    public Page<ContestSubmission> findContestSubmissionByContestIdPaging(Pageable pageable, String contestId) {
        return contestSubmissionPagingAndSortingRepo.findAllByContestId(pageable, contestId).map(contestSubmissionEntity -> ContestSubmission.builder()
                .contestSubmissionId(contestSubmissionEntity.getContestSubmissionId())
                .contestId(contestSubmissionEntity.getContestId())
                .createAt(contestSubmissionEntity.getCreatedAt() != null ? DateTimeUtils.dateToString(contestSubmissionEntity.getCreatedAt(), DateTimeUtils.DateTimeFormat.DATE_TIME_ISO_FORMAT) : null)
                .sourceCodeLanguage(contestSubmissionEntity.getSourceCodeLanguage())
                .point(contestSubmissionEntity.getPoint())
                .problemId(contestSubmissionEntity.getProblemId())
                .testCasePass(contestSubmissionEntity.getTestCasePass())
                .status(contestSubmissionEntity.getStatus()).message(contestSubmissionEntity.getMessage())
                .userId(contestSubmissionEntity.getUserId())
                .fullname(userService.findPersonByUserLoginId(contestSubmissionEntity.getUserId()).getFullName())
                .build());
    }

    @Override
    public ContestSubmissionEntity getContestSubmissionDetail(UUID submissionId) {
        return contestSubmissionRepo.findContestSubmissionEntityByContestSubmissionId(submissionId);
    }

    @Override
    @Transactional
    public void deleteProblem(String problemId, String userId) throws MiniLeetCodeException {
        ProblemEntity problem = problemRepo.findByProblemId(problemId);
        if(problem.getUserId().equals(userId)){
            try {
                testCaseRepo.deleteAllByProblemId(problemId);
                problemRepo.deleteProblemEntityByProblemId(problemId);
            }catch (Exception e){
                throw new MiniLeetCodeException("Problem exist in some contest");
            }

        }
        else
            throw new MiniLeetCodeException("Permission denied");
    }

    @Override
    @Transactional
    public void deleteContest(String contestId, String userId) throws MiniLeetCodeException {
        ContestEntity contest = contestRepo.findContestByContestId(contestId);
        if(!contest.getUserId().equals(userId)){
            throw new MiniLeetCodeException("Permission denied");
        }
        userSubmissionContestResultNativeRepo.deleteAllByContestId(contestId);
        userRegistrationContestRepo.deleteAllByContestId(contestId);
        contestSubmissionRepo.deleteAllByContestId(contestId);
        contestRepo.deleteByContestIdAndUserId(contestId, userId);


    }

    @Override
    @Transactional
    public void deleteTestcase(UUID testcaseId, String userId) throws MiniLeetCodeException {
        TestCaseEntity testCase = testCaseRepo.findTestCaseByTestCaseId(testcaseId);
        ProblemEntity problem = problemRepo.findByProblemId(testCase.getProblemId());
        if(!problem.getUserId().equals(userId)){
            throw new MiniLeetCodeException("permission denied");
        }
        testCaseRepo.deleteTestCaseEntityByTestCaseId(testcaseId);
    }

    class CodeSimilatiryComparator implements Comparator<CodeSimilarityElement>{
        @Override
        public int compare(CodeSimilarityElement e1, CodeSimilarityElement e2){
            if (e1.getScore() > e2.getScore()) return -1;
                else if(e1.getScore() < e2.getScore()) return 1;
                else return 0;
        }
    }
    @Override
    public ModelCodeSimilarityOutput checkSimilarity(String contestId, ModelCheckSimilarityInput I) {
        List<CodeSimilarityElement> list = new ArrayList();

        List<UserRegistrationContestEntity> participants = userRegistrationContestRepo
            .findAllByContestIdAndStatus(contestId, UserRegistrationContestEntity.STATUS_SUCCESSFUL);

        ContestEntity contestEntity = contestRepo.findContestByContestId(contestId);
        List<ProblemEntity> problems = contestEntity.getProblems();

        for(ProblemEntity p: problems) {
            String problemId = p.getProblemId();
            log.info("checkSimilarity, consider problem " + problemId + " threshold  = " + I.getThreshold());
            List<ContestSubmissionEntity> listSubmissions = new ArrayList();
            for (UserRegistrationContestEntity participant : participants) {
                String userLoginId = participant.getUserId();
                //log.info("checkSimilarity, consider problem " + problemId + " participant " + userLoginId);
                List<ContestSubmissionEntity> submissions = contestSubmissionRepo.findAllByContestIdAndUserIdAndProblemId(
                    contestId,
                    userLoginId,
                    problemId);
                //log.info("checkSimilarity, consider problem " + problemId + " participant " + userLoginId
                //         + " submissions.sz = " +
                //         submissions.size() +
                //         "");

                if (submissions != null && submissions.size() > 0) {// take the last submission in the sorted list
                    ContestSubmissionEntity sub = submissions.get(0);
                    listSubmissions.add(sub);
                }
            }

            log.info("checkSimilarity, consider problem " + problemId + " listSubmissions = " + listSubmissions.size());

            // check similarity of submissions to the current problemId
            for(int i = 0; i < listSubmissions.size(); i++){
                ContestSubmissionEntity s1 = listSubmissions.get(i);
                for(int j = i+1; j < listSubmissions.size(); j++){
                    ContestSubmissionEntity s2 = listSubmissions.get(j);
                    if(s1.getUserId().equals(s2.getUserId())) continue;

                    double score = CodeSimilarityCheck.check(s1.getSourceCode(), s2.getSourceCode());
                    log.info("checkSimilarity, consider problem " + problemId + " listSubmissions = " + listSubmissions.size()
                    + " score between codes " + i + " and " + j + " = " + score + " threshold = " + I.getThreshold());

                    //if(score <= 0.0001) continue;
                    if(score <= I.getThreshold()*0.01) continue;

                    CodeSimilarityElement e = new CodeSimilarityElement();
                    e.setScore(score);
                    e.setSource1(s1.getSourceCode());
                    e.setUserLoginId1(s1.getUserId());
                    e.setSubmitDate1(s1.getCreatedAt());
                    e.setProblemId1(s1.getProblemId());

                    e.setSource2(s2.getSourceCode());
                    e.setUserLoginId2(s2.getUserId());
                    e.setSubmitDate2(s2.getCreatedAt());
                    e.setProblemId2(s2.getProblemId());

                    list.add(e);


                    CodePlagiarism codePlagiarism = new CodePlagiarism();
                    codePlagiarism.setContestId(contestId);
                    codePlagiarism.setProblemId(problemId);
                    codePlagiarism.setUserId1(s1.getUserId());
                    codePlagiarism.setUserId2(s2.getUserId());
                    codePlagiarism.setSourceCode1(s1.getSourceCode());
                    codePlagiarism.setSourceCode2(s2.getSourceCode());
                    codePlagiarism.setSubmitDate1(s1.getCreatedAt());
                    codePlagiarism.setSubmitDate2(s2.getCreatedAt());
                    codePlagiarism.setScore(score);
                    codePlagiarism.setCreatedStamp(new Date());

                    codePlagiarism = codePlagiarismRepo.save(codePlagiarism);
                    log.info("checkSimilarity, save score = " + score);
                }
            }
        }


        /*
        List<ContestSubmissionEntity> submissions = contestSubmissionPagingAndSortingRepo.findAllByContestId(contestId);
        for(int i = 0; i < submissions.size(); i++){
            ContestSubmissionEntity s1 = submissions.get(i);
            for(int j = i+1; j < submissions.size(); j++){
                ContestSubmissionEntity s2 = submissions.get(j);
                if(s1.getUserId().equals(s2.getUserId())) continue;

                double score = CodeSimilarityCheck.check(s1.getSourceCode(), s2.getSourceCode());
                CodeSimilarityElement e = new CodeSimilarityElement();
                e.setScore(score);
                e.setSource1(s1.getSourceCode());
                e.setUserLoginId1(s1.getUserId());
                e.setSubmitDate1(s1.getCreatedAt());
                e.setProblemId1(s1.getProblemId());

                e.setSource2(s2.getSourceCode());
                e.setUserLoginId2(s2.getUserId());
                e.setSubmitDate2(s2.getCreatedAt());
                e.setProblemId2(s2.getProblemId());

                list.add(e);
            }
        }
        */

        Collections.sort(list, new CodeSimilatiryComparator());

        ModelCodeSimilarityOutput model = new ModelCodeSimilarityOutput();
        model.setCodeSimilarityElementList(list);
        return model;
    }
    @Override
    public ModelContestSubmissionResponse evaluateSubmission(UUID submissionId){
        log.info("evaluateSubmission(" + submissionId);
        ContestSubmissionEntity sub = contestSubmissionRepo.findById(submissionId).orElse(null);
        ContestEntity contest = contestRepo.findContestByContestId(sub.getContestId());
        return evaluateSubmission(sub, contest);
    }
    @Override
    public ModelContestSubmissionResponse evaluateSubmission(ContestSubmissionEntity sub, ContestEntity contest){
        log.info("evaluateSubmission");
        if(sub != null){
            // set status of submission and store in DB
            sub.setStatus(ContestSubmissionEntity.SUBMISSION_STATUS_EVALUATION_IN_PROGRESS);
            sub = contestSubmissionRepo.save(sub);
            log.info("evaluateSubmission(" + sub.getContestSubmissionId() + " Saved in DB");

            ProblemEntity p = problemRepo.findById(sub.getProblemId()).orElse(null);
            if(p == null){
                log.info("evaluateSubmission, problem is NULL???");
                return null;
            }
            log.info("evaluateBatchSubmissionContest, consider participant " + sub.getUserId() + " problem " +
                     sub.getProblemId() + " submissions " + sub.getContestSubmissionId());

            List<TestCaseEntity> testCaseEntityList = null;

            if(contest.getEvaluateBothPublicPrivateTestcase() != null &&
               contest.getEvaluateBothPublicPrivateTestcase().equals(ContestEntity.EVALUATE_USE_BOTH_PUBLIC_PRIVATE_TESTCASE_YES))
               testCaseEntityList = testCaseRepo.findAllByProblemId(sub.getProblemId());
            else{
                testCaseEntityList = testCaseRepo.findAllByProblemIdAndIsPublic(sub.getProblemId(),"N");
            }
            if(testCaseEntityList == null) testCaseEntityList = new ArrayList<>();

            String tempName = tempDir.createRandomScriptFileName(sub.getUserId()+"-"+sub.getContestId()+"-"+sub.getProblemId());

            int runtime  = 0;
            int score = 0;
            int nbTestCasePass = 0;
            String totalStatus = "";
            List<String> statusList = new ArrayList<String>();
            List<ContestSubmissionTestCaseEntity> LCSTE = new ArrayList();
            String message = "";
            boolean compileError = false;
            for(int i = 0; i < testCaseEntityList.size(); i++) {
                List<TestCaseEntity> L = new ArrayList();
                TestCaseEntity testCase = testCaseEntityList.get(i);

                L.add(testCaseEntityList.get(i));

                try {
                    String response = submission(
                        sub.getSourceCode(),
                        sub.getSourceCodeLanguage(),
                        tempName,
                        L,
                        "language not found",
                        p.getTimeLimit());
                    List<String> testCaseAns = L.stream().map(TestCaseEntity::getCorrectAnswer).collect(Collectors.toList());
                    List<Integer> points = L.stream().map(TestCaseEntity::getTestCasePoint).collect(Collectors.toList());
                    ProblemSubmission problemSubmission = StringHandler.handleContestResponse(response, testCaseAns, points);

                    log.info("submitContestProblemTestCaseByTestCase, run tesecase " + (i+1) + " message = " + problemSubmission.getMessage());
                    // check if there is error compile
                    if(problemSubmission.getMessage() != null && !problemSubmission.getMessage().contains("successful")){
                        message = problemSubmission.getMessage(); compileError = true; break;
                    }

                    runtime = runtime + problemSubmission.getRuntime().intValue();
                    score = score + problemSubmission.getScore();
                    nbTestCasePass += problemSubmission.getNbTestCasePass();
                    //status = status + "#" + (i+1) + ": " + problemSubmission.getStatus() + "; ";
                    statusList.add(problemSubmission.getStatus());
                    List<String> output  = problemSubmission.getParticipantAns();
                    String participantAns = "";
                    if(output != null && output.size() > 0)
                        participantAns = output.get(0);

                    List<ContestSubmissionTestCaseEntity> LT = contestSubmissionTestCaseEntityRepo
                        .findAllByContestSubmissionIdAndContestIdAndProblemIdAndSubmittedByUserLoginIdAndTestCaseId(sub.getContestSubmissionId(),
                                                                                                                    sub.getContestId(),sub.getProblemId(),
                                                                                                                    sub.getUserId(),testCase.getTestCaseId());
                    ContestSubmissionTestCaseEntity cste = null;
                    if(LT != null && LT.size() > 0){
                        cste = LT.get(0);
                        cste.setStatus(problemSubmission.getStatus());
                        cste.setPoint(problemSubmission.getScore());
                        cste.setRuntime(problemSubmission.getRuntime());
                    }else {
                        cste = ContestSubmissionTestCaseEntity.builder()
                                                              .contestId(sub.getContestId())
                                                              .problemId(sub.getProblemId())
                                                              .testCaseId(testCaseEntityList.get(i).getTestCaseId())
                                                              .submittedByUserLoginId(sub.getUserId())
                                                              .point(problemSubmission.getScore())
                                                              .status(problemSubmission.getStatus())
                                                              .testCaseOutput(testCaseEntityList
                                                                                  .get(i)
                                                                                  .getCorrectAnswer())
                                                              .participantSolutionOtput(participantAns)
                                                              .runtime(problemSubmission.getRuntime())
                                                              .createdStamp(new Date())
                                                              .build();
                    }
                    cste = contestSubmissionTestCaseEntityRepo.save(cste);
                    LCSTE.add(cste);
                    log.info("evaluateBatchSubmissionContest, consider participant " + sub.getUserId()
                             + " problem " + sub.getProblemId() + " submissions "
                             + sub.getContestSubmissionId() + " DONE with testcase " + testCase.getTestCaseId() + " get point " + problemSubmission.getScore());

                }catch(Exception e){
                    e.printStackTrace();
                }
            }
            boolean accepted = true;
            for(String s: statusList){
                if(s.equals(ContestSubmissionEntity.SUBMISSION_STATUS_COMPILE_ERROR)){
                    totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_COMPILE_ERROR; accepted = false; break;
                }else if(s.equals(ContestSubmissionEntity.SUBMISSION_STATUS_TIME_LIMIT_EXCEEDED)){
                    totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_TIME_LIMIT_EXCEEDED; accepted = false; break;
                }else if(s.equals(ContestSubmissionEntity.SUBMISSION_STATUS_WRONG)){
                    totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_WRONG; accepted = false; //break;
                }
            }
            if(accepted) totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_ACCEPTED;

            if(compileError) {
                // keep compile error message above
                totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_COMPILE_ERROR;
            }else if(nbTestCasePass == 0){
                totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_WRONG;
            }else if(nbTestCasePass > 0 && nbTestCasePass < testCaseEntityList.size()) {
                totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_PARTIAL;
            }else{
                message = "Successful";
            }
            log.info("evaluateSubmission, totalStatus = " + totalStatus + " nbTestCasePass = " + nbTestCasePass);

            //String response = submission(modelContestSubmission.getSource(), modelContestSubmission.getLanguage(), tempName, testCaseEntityList, "language not found", problemEntity.getTimeLimit());

            //List<String> testCaseAns = testCaseEntityList.stream().map(TestCaseEntity::getCorrectAnswer).collect(Collectors.toList());
            //List<Integer> points = testCaseEntityList.stream().map(TestCaseEntity::getTestCasePoint).collect(Collectors.toList());
            //ProblemSubmission problemSubmission = StringHandler.handleContestResponse(response, testCaseAns, points);

            ContestSubmissionEntity c = ContestSubmissionEntity.builder()
                                                               .contestId(sub.getContestId())
                                                               .status(totalStatus)
                                                               .point(score)
                                                               .problemId(sub.getProblemId())
                                                               .userId(sub.getUserId())
                                                               .testCasePass(nbTestCasePass + "/" + testCaseEntityList.size())
                                                               .sourceCode(sub.getSourceCode())
                                                               .sourceCodeLanguage(sub.getSourceCodeLanguage())
                                                               .runtime(new Long(runtime))
                                                               .createdAt(new Date())
                                                               .message(message)
                                                               .build();
            sub.setPoint(score);
            sub.setTestCasePass(nbTestCasePass + "/" + testCaseEntityList.size());
            sub.setRuntime(new Long(runtime));
            sub.setStatus(totalStatus);
            sub.setMessage(message);
            c = contestSubmissionRepo.save(sub);

            for(ContestSubmissionTestCaseEntity e: LCSTE){
                e.setContestSubmissionId(c.getContestSubmissionId());
                e = contestSubmissionTestCaseEntityRepo.save(e);
            }

            //log.info("c {}", c.getRuntime());

        }
        return null;
    }
    @Override
    public ModelEvaluateBatchSubmissionResponse reJudgeAllSubmissionsOfContest(String contestId){
        List<UserRegistrationContestEntity> participants = userRegistrationContestRepo
            .findAllByContestIdAndStatus(contestId, UserRegistrationContestEntity.STATUS_SUCCESSFUL);

        ContestEntity contestEntity = contestRepo.findContestByContestId(contestId);
        List<ProblemEntity> problems = contestEntity.getProblems();
        for(UserRegistrationContestEntity participant: participants){
            String userLoginId = participant.getUserId();
            log.info("evaluateBatchSubmissionContest, consider participant " + userLoginId);
            for(ProblemEntity p: problems){
                String problemId = p.getProblemId();
                List<ContestSubmissionEntity> submissions = contestSubmissionRepo.findAllByContestIdAndUserIdAndProblemId(contestId,userLoginId,problemId);
                log.info("evaluateBatchSubmissionContest, consider participant " + userLoginId + " problem " + problemId + " submissions.sz = " + submissions.size() + "");

                for(int i = 0; i < submissions.size(); i++){// take the last submission in the sorted list
                    ContestSubmissionEntity sub = submissions.get(i);
                    log.info("evaluateBatchSubmissionContest, consider participant " + userLoginId + " problem " + problemId + " submissions " + sub.getContestSubmissionId());
                        ModelContestSubmissionResponse res = evaluateSubmission(sub, contestEntity);

                }
            }
        }
        return null;

    }
    private ModelEvaluateBatchSubmissionResponse judgeAllSubmissionsOfContestBasedOnUserAndProblems(String contestId){
        List<UserRegistrationContestEntity> participants = userRegistrationContestRepo
            .findAllByContestIdAndStatus(contestId, UserRegistrationContestEntity.STATUS_SUCCESSFUL);

        ContestEntity contestEntity = contestRepo.findContestByContestId(contestId);
        List<ProblemEntity> problems = contestEntity.getProblems();
        for(UserRegistrationContestEntity participant: participants){
            String userLoginId = participant.getUserId();
            log.info("evaluateBatchSubmissionContest, consider participant " + userLoginId);
            for(ProblemEntity p: problems){
                String problemId = p.getProblemId();
                List<ContestSubmissionEntity> submissions = contestSubmissionRepo.findAllByContestIdAndUserIdAndProblemId(contestId,userLoginId,problemId);
                log.info("evaluateBatchSubmissionContest, consider participant " + userLoginId + " problem " + problemId + " submissions.sz = " + submissions.size() + "");

                for(int i = 0; i < submissions.size(); i++){// take the last submission in the sorted list
                    ContestSubmissionEntity sub = submissions.get(i);

                    log.info("evaluateBatchSubmissionContest, consider participant " + userLoginId + " problem " + problemId + " submissions " + sub.getContestSubmissionId());
                    if(sub.getStatus() == null || sub.getStatus().equals("")) {
                        ModelContestSubmissionResponse res = evaluateSubmission(sub, contestEntity);
                    }else{
                        log.info("evaluateBatchSubmissionContest, consider participant " + userLoginId + " problem " + problemId +
                                 " submissions " + sub.getContestSubmissionId() + " has evaluated --> IGNORE");
                    }
                }
            }
        }
        return null;

    }
    private ModelEvaluateBatchSubmissionResponse judgeAllSubmissionsOfContestBasedSubmissionDate(String contestId){
        List<ContestSubmissionEntity> submissions = contestSubmissionRepo.findAllByContestIdAndStatus(contestId, ContestSubmissionEntity.SUBMISSION_STATUS_NOT_AVAILABLE);
        ContestEntity contest = contestRepo.findContestByContestId(contestId);
        for(int i = 0; i < submissions.size(); i++){// take the last submission in the sorted list
            ContestSubmissionEntity sub = submissions.get(i);

            log.info("evaluateBatchSubmissionContest, start " + i + "/" + submissions.size()
                     + " consider submission " + sub.getContestSubmissionId() + " participant " + sub.getUserId() + " problem "

                     + sub.getProblemId() + " submissions " + sub.getContestSubmissionId());

            ModelContestSubmissionResponse res = evaluateSubmission(sub, contest);
            /*
            if(sub.getStatus() == null || sub.getStatus().equals("")) {
                ModelContestSubmissionResponse res = evaluateSubmission(sub);
            }else{
                log.info("evaluateBatchSubmissionContest, consider participant " + sub.getUserId()
                         + " problem " + sub.getProblemId() +
                         " submissions " + sub.getContestSubmissionId() + " has evaluated --> IGNORE");
            }
            */
        }
        return null;


    }

    @Override
    public ModelEvaluateBatchSubmissionResponse judgeAllSubmissionsOfContest(String contestId){
        //return judgeAllSubmissionsOfContestBasedOnUserAndProblems(contestId);
        return judgeAllSubmissionsOfContestBasedSubmissionDate(contestId);
    }

    @Override
    public ModelEvaluateBatchSubmissionResponse evaluateBatchSubmissionContest(String contestId) {
        List<UserRegistrationContestEntity> participants = userRegistrationContestRepo
            .findAllByContestIdAndStatus(contestId, UserRegistrationContestEntity.STATUS_SUCCESSFUL);

        ContestEntity contestEntity = contestRepo.findContestByContestId(contestId);
        List<ProblemEntity> problems = contestEntity.getProblems();
        for(UserRegistrationContestEntity participant: participants){
            String userLoginId = participant.getUserId();
            log.info("evaluateBatchSubmissionContest, consider participant " + userLoginId);
            for(ProblemEntity p: problems){
                String problemId = p.getProblemId();
                List<ContestSubmissionEntity> submissions = contestSubmissionRepo.findAllByContestIdAndUserIdAndProblemId(contestId,userLoginId,problemId);
                log.info("evaluateBatchSubmissionContest, consider participant " + userLoginId + " problem " + problemId + " submissions.sz = " + submissions.size() + "");

                if(submissions != null && submissions.size() > 0){// take the last submission in the sorted list
                    ContestSubmissionEntity sub = submissions.get(0);
                    log.info("evaluateBatchSubmissionContest, consider participant " + userLoginId + " problem " + problemId + " submissions " + sub.getContestSubmissionId());
                    List<TestCaseEntity> testCaseEntityList = testCaseRepo.findAllByProblemId(problemId);
                    String tempName = tempDir.createRandomScriptFileName(userLoginId+"-"+contestId+"-"+problemId);

                    int runtime  = 0;
                    int score = 0;
                    int nbTestCasePass = 0;
                    String totalStatus = "";
                    List<String> statusList = new ArrayList<String>();
                    List<ContestSubmissionTestCaseEntity> LCSTE = new ArrayList();
                    String message = "";
                    boolean compileError = false;
                    for(int i = 0; i < testCaseEntityList.size(); i++) {
                        List<TestCaseEntity> L = new ArrayList();
                        TestCaseEntity testCase = testCaseEntityList.get(i);
                        L.add(testCaseEntityList.get(i));

                        try {
                            String response = submission(
                                sub.getSourceCode(),
                                sub.getSourceCodeLanguage(),
                                tempName,
                                L,
                                "language not found",
                                p.getTimeLimit());
                        List<String> testCaseAns = L.stream().map(TestCaseEntity::getCorrectAnswer).collect(Collectors.toList());
                        List<Integer> points = L.stream().map(TestCaseEntity::getTestCasePoint).collect(Collectors.toList());
                        ProblemSubmission problemSubmission = StringHandler.handleContestResponse(response, testCaseAns, points);

                        log.info("submitContestProblemTestCaseByTestCase, run tesecase " + (i+1) + " message = " + problemSubmission.getMessage());
                        // check if there is error compile
                        if(problemSubmission.getMessage() != null && !problemSubmission.getMessage().contains("successful")){
                            message = problemSubmission.getMessage(); compileError = true; break;
                        }

                        runtime = runtime + problemSubmission.getRuntime().intValue();
                        score = score + problemSubmission.getScore();
                        nbTestCasePass += problemSubmission.getNbTestCasePass();
                        //status = status + "#" + (i+1) + ": " + problemSubmission.getStatus() + "; ";
                        statusList.add(problemSubmission.getStatus());
                        List<String> output  = problemSubmission.getParticipantAns();
                        String participantAns = "";
                        if(output != null && output.size() > 0)
                            participantAns = output.get(0);

                        List<ContestSubmissionTestCaseEntity> LT = contestSubmissionTestCaseEntityRepo
                            .findAllByContestSubmissionIdAndContestIdAndProblemIdAndSubmittedByUserLoginIdAndTestCaseId(sub.getContestSubmissionId(),
                                                                                                                       sub.getContestId(),sub.getProblemId(),
                                                                                                                        sub.getUserId(),testCase.getTestCaseId());
                        ContestSubmissionTestCaseEntity cste = null;
                        if(LT != null && LT.size() > 0){
                            cste = LT.get(0);
                            cste.setStatus(problemSubmission.getStatus());
                            cste.setPoint(problemSubmission.getScore());
                            cste.setRuntime(problemSubmission.getRuntime());
                        }else {
                            cste = ContestSubmissionTestCaseEntity.builder()
                                                                  .contestId(contestId)
                                                                  .problemId(problemId)
                                                                  .testCaseId(testCaseEntityList.get(i).getTestCaseId())
                                                                  .submittedByUserLoginId(userLoginId)
                                                                  .point(problemSubmission.getScore())
                                                                  .status(problemSubmission.getStatus())
                                                                  .testCaseOutput(testCaseEntityList
                                                                                      .get(i)
                                                                                      .getCorrectAnswer())
                                                                  .participantSolutionOtput(participantAns)
                                                                  .runtime(problemSubmission.getRuntime())
                                                                  .createdStamp(new Date())
                                                                  .build();
                        }
                        cste = contestSubmissionTestCaseEntityRepo.save(cste);
                        LCSTE.add(cste);
                            log.info("evaluateBatchSubmissionContest, consider participant " + userLoginId + " problem " + problemId + " submissions "
                                     + sub.getContestSubmissionId() + " DONE with testcase " + testCase.getTestCaseId() + " get point " + problemSubmission.getScore());

                        }catch(Exception e){
                            e.printStackTrace();
                        }
                    }
                    boolean accepted = true;
                    for(String s: statusList){
                        if(s.equals(ContestSubmissionEntity.SUBMISSION_STATUS_COMPILE_ERROR)){
                            totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_COMPILE_ERROR; accepted = false; break;
                        }else if(s.equals(ContestSubmissionEntity.SUBMISSION_STATUS_TIME_LIMIT_EXCEEDED)){
                            totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_TIME_LIMIT_EXCEEDED; accepted = false; break;
                        }else if(s.equals(ContestSubmissionEntity.SUBMISSION_STATUS_WRONG)){
                            totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_WRONG; accepted = false; //break;
                        }
                    }
                    if(accepted) totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_ACCEPTED;
                    if(compileError){
                        // keep compile error message above
                        totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_COMPILE_ERROR;
                    }else{
                        message = "Successful";
                    }
                    //String response = submission(modelContestSubmission.getSource(), modelContestSubmission.getLanguage(), tempName, testCaseEntityList, "language not found", problemEntity.getTimeLimit());

                    //List<String> testCaseAns = testCaseEntityList.stream().map(TestCaseEntity::getCorrectAnswer).collect(Collectors.toList());
                    //List<Integer> points = testCaseEntityList.stream().map(TestCaseEntity::getTestCasePoint).collect(Collectors.toList());
                    //ProblemSubmission problemSubmission = StringHandler.handleContestResponse(response, testCaseAns, points);
                    ContestSubmissionEntity c = ContestSubmissionEntity.builder()
                                                                       .contestId(contestId)
                                                                       .status(totalStatus)
                                                                       .point(score)
                                                                       .problemId(problemId)
                                                                       .userId(userLoginId)
                                                                       .testCasePass(nbTestCasePass + "/" + testCaseEntityList.size())
                                                                       .sourceCode(sub.getSourceCode())
                                                                       .sourceCodeLanguage(sub.getSourceCodeLanguage())
                                                                       .runtime(new Long(runtime))
                                                                       .createdAt(new Date())
                                                                       .build();
                    sub.setPoint(score);
                    sub.setTestCasePass(nbTestCasePass + "/" + testCaseEntityList.size());
                    sub.setRuntime(new Long(runtime));
                    sub.setStatus(totalStatus);
                    c = contestSubmissionRepo.save(sub);

                    for(ContestSubmissionTestCaseEntity e: LCSTE){
                        e.setContestSubmissionId(c.getContestSubmissionId());
                        e = contestSubmissionTestCaseEntityRepo.save(e);
                    }

                    log.info("c {}", c.getRuntime());

                }
            }
        }
        return null;
    }

    @Override
    public List<ModelContestByRoleResponse> getContestsByRoleOfUser(String userLoginId) {
        List<ContestRole> contestRoles = contestRoleRepo.findAllByUserLoginIdAndThruDate(userLoginId, null);
        List<ModelContestByRoleResponse> modelContestByRoleResponses = new ArrayList();
        for(ContestRole cr: contestRoles){
            ModelContestByRoleResponse m = new ModelContestByRoleResponse();
            m.setContestId(cr.getContestId());
            m.setRoleId(cr.getRoleId());
            modelContestByRoleResponses.add(m);
        }
        return modelContestByRoleResponses;
    }

    private ModelGetTestCase convertToModelGetTestCase(TestCaseEntity testCaseEntity){
        boolean viewMore = false;
        String correctAns = testCaseEntity.getCorrectAnswer();
        String testCase = testCaseEntity.getTestCase();
        int point = testCaseEntity.getTestCasePoint();

        return ModelGetTestCase.builder()
                .correctAns(correctAns)
                .testCase(testCase)
                .point(point)
                .isPublic(testCaseEntity.getIsPublic())
                .viewMore(viewMore)
                .testCaseId(testCaseEntity.getTestCaseId())
                               .description(testCaseEntity.getDescription())
                .build();
    }

    private ModelGetContestPageResponse getModelGetContestPageResponse(List<ContestEntity> contestPage) {
        List<ModelGetContestResponse> lists = new ArrayList<>();
        if(contestPage != null){
            contestPage.forEach(contest -> {
                ModelGetContestResponse modelGetContestResponse = ModelGetContestResponse.builder()
                                                                                         .contestId(contest.getContestId())
                                                                                         .contestName(contest.getContestName())
                                                                                         .contestTime(contest.getContestSolvingTime())
                                                                                         .countDown(contest.getCountDown())
                                                                                         .startAt(contest.getStartedAt())
                                                                                         .isPublic(contest.getIsPublic())
                                                                                         .statusId(contest.getStatusId())
                                                                                         .userId(contest.getUserId())
                                                                                         .createdAt(contest.getCreatedAt())
                                                                                         .build();
                lists.add(modelGetContestResponse);
            });
        }

        return ModelGetContestPageResponse.builder()
                                          .contents(lists)
                                          .build();
    }
    private ModelGetContestPageResponse getModelGetContestPageResponse(Page<ContestEntity> contestPage) {
        List<ModelGetContestResponse> lists = new ArrayList<>();
        if(contestPage != null){
            contestPage.forEach(contest -> {
                ModelGetContestResponse modelGetContestResponse = ModelGetContestResponse.builder()
                                                                                         .contestId(contest.getContestId())
                                                                                         .contestName(contest.getContestName())
                                                                                         .contestTime(contest.getContestSolvingTime())
                                                                                         .countDown(contest.getCountDown())
                                                                                         .startAt(contest.getStartedAt())
                                                                                         .isPublic(contest.getIsPublic())
                                                                                         .statusId(contest.getStatusId())
                                                                                         .userId(contest.getUserId())
                                                                                         .createdAt(contest.getCreatedAt())
                                                                                         .build();
                lists.add(modelGetContestResponse);
            });
        }

        return ModelGetContestPageResponse.builder()
                .contents(lists)
                .build();
    }

    private UserSubmissionContestResultNativeEntity convertObjectsToUserSubmissionContestResultNativeEntity(Object[] objects, String contestId){
        if(objects.length < 6){
            return null;
        }
//        String fullName = objects[3] != null ? objects[3].toString() : "" + objects[4] != null ? objects[4].toString() : "" + objects[5] != null ? objects[5].toString() : "" ;
        StringBuilder fullName = new StringBuilder();
        for(int i = 3; i < 6; i++){
            if(objects[i] != null)
                fullName.append(objects[i]).append(" ");
        }
        log.info("full name {}", fullName);
        return UserSubmissionContestResultNativeEntity.builder()
                .contestId(contestId)
                .userId(objects[0] != null ? objects[0].toString(): null)
                .point(objects[1] != null ? Integer.parseInt(objects[1].toString()) : 0)
                .email(objects[2] != null ? objects[2].toString(): null)
                .fullName(fullName.toString())
                .build();
    }

    private List<ProblemEntity> getContestProblemsFromListContestId(List<String> problemIds) throws MiniLeetCodeException {
//        List<ProblemEntity> problemEntities = new ArrayList<>();
//        for(String problemId : problemIds){
//            ProblemEntity problemEntity = problemRepo.findByProblemId(problemId);
//            if(problemEntity == null){
//                throw new MiniLeetCodeException("Problem " + problemId +" does not exist");
//            }
//            problemEntities.add(problemEntity);
//        }
//        return problemEntities;
        return problemRepo.getAllProblemWithArray(problemIds);
    }


    private String submission(String source, String computerLanguage, String tempName, List<TestCaseEntity> testCaseList, String exception, int timeLimit) throws Exception {
        String ans;
        tempName = tempName.replaceAll(" ","");
        switch (computerLanguage){
            case "CPP":
                tempDir.createScriptSubmissionFile(ComputerLanguage.Languages.CPP, tempName, testCaseList, source, timeLimit);
                ans = dockerClientBase.runExecutable(ComputerLanguage.Languages.CPP,  tempName);
                break;
            case "JAVA":
                tempDir.createScriptSubmissionFile(ComputerLanguage.Languages.JAVA, tempName, testCaseList, source, timeLimit);
                ans = dockerClientBase.runExecutable(ComputerLanguage.Languages.JAVA, tempName);
                break;
            case "PYTHON3":
                tempDir.createScriptSubmissionFile(ComputerLanguage.Languages.PYTHON3, tempName, testCaseList, source, timeLimit);
                ans = dockerClientBase.runExecutable(ComputerLanguage.Languages.PYTHON3, tempName);
                break;
            case "GOLANG":
                tempDir.createScriptSubmissionFile(ComputerLanguage.Languages.GOLANG, tempName, testCaseList, source, timeLimit);
                ans = dockerClientBase.runExecutable(ComputerLanguage.Languages.GOLANG, tempName);
                break;
            default:
                throw new Exception(exception);
        }
//        tempDir.pushToConcurrentLinkedQueue(tempName);
        return ans;
    }
    private String submissionSolutionOutput(String sourceChecker, String computerLanguage, String solutionOutput, String tempName, TestCaseEntity testCase, String exception, int timeLimit) throws Exception {
        log.info("submissionSolutionOutput, sourceChecker = " + sourceChecker + " solutionOutput = " + solutionOutput + " testCase = " + testCase.getTestCase());

        String ans = "";
        tempName = tempName.replaceAll(" ","");
        switch (computerLanguage){
            case "CPP":
                tempDir.createScriptSubmissionSolutionOutputFile(ComputerLanguage.Languages.CPP, tempName, solutionOutput,
                                                                 testCase, sourceChecker, timeLimit);
                ans = dockerClientBase.runExecutable(ComputerLanguage.Languages.CPP,  tempName);
                log.info("submissionSolutionOutput, sourceChecker = " + sourceChecker + " solutionOutput = " + solutionOutput + " testCase = " + testCase.getTestCase()
                + " ans = " + ans);
                break;
            case "JAVA":
                break;
            case "PYTHON3":
                break;
            case "GOLANG":
                break;
            default:
                throw new Exception(exception);
        }
//        tempDir.pushToConcurrentLinkedQueue(tempName);
        return ans;
    }

    private String runCode(String sourceCode, String computerLanguage, String tempName, String input, int timeLimit, String exception) throws Exception {
        String ans;
        tempName = tempName.replaceAll(" ","");
        switch (computerLanguage){
            case "CPP":
                tempDir.createScriptFile(sourceCode, input, timeLimit, ComputerLanguage.Languages.CPP, tempName);
                ans = dockerClientBase.runExecutable(ComputerLanguage.Languages.CPP,  tempName);
                break;
            case "JAVA":
                tempDir.createScriptFile(sourceCode, input, timeLimit, ComputerLanguage.Languages.JAVA, tempName);
                ans = dockerClientBase.runExecutable(ComputerLanguage.Languages.JAVA, tempName);
                break;
            case "PYTHON3":
                tempDir.createScriptFile(sourceCode, input, timeLimit, ComputerLanguage.Languages.PYTHON3, tempName);
                ans = dockerClientBase.runExecutable(ComputerLanguage.Languages.PYTHON3, tempName);
                break;
            case "GOLANG":
                tempDir.createScriptFile(sourceCode, input, timeLimit, ComputerLanguage.Languages.GOLANG, tempName);
                ans = dockerClientBase.runExecutable(ComputerLanguage.Languages.GOLANG, tempName);
                break;
            default:
                throw new Exception(exception);
        }
//        tempDir.pushToConcurrentLinkedQueue(tempName);
        return ans;
    }

    @Override
    public List<CodePlagiarism> findAllByContestId(String contestId){
        List<CodePlagiarism> codePlagiarisms = codePlagiarismRepo.findAllByContestId(contestId);
        return codePlagiarisms;
    }

    @Transactional
    @Override
    public ContestSubmissionEntity updateContestSubmissionSourceCode(ModelUpdateContestSubmission input){
        ContestSubmissionEntity sub = contestSubmissionRepo.findById(input.getContestSubmissionId()).orElse(null);
        if(sub != null){
            sub.setSourceCode(input.getModifiedSourceCodeSubmitted());
            sub.setUpdateAt(new Date());
            sub = contestSubmissionRepo.save(sub);

            ContestSubmissionHistoryEntity e = new ContestSubmissionHistoryEntity();
            e.setContestSubmissionId(sub.getContestSubmissionId());
            e.setModifiedSourceCodeSubmitted(input.getModifiedSourceCodeSubmitted());
            e.setLanguage(sub.getSourceCodeLanguage());
            e.setCreatedStamp(new Date());
            e = contestSubmissionHistoryRepo.save(e);
            return sub;
        }
        return null;
    }

    @Override
    public List<ModelGetContestResponse> getContestsUsingAProblem(String problemId) {
        List<ModelGetContestResponse> res = new ArrayList();
        List<ContestProblem> contestProblems = contestProblemRepo.findAllByProblemId(problemId);
        for(ContestProblem cp: contestProblems){
            ContestEntity contest = contestRepo.findContestByContestId(cp.getContestId());
            ModelGetContestResponse m = ModelGetContestResponse.builder()
                .contestId(contest.getContestId())
                .statusId(contest.getStatusId())
                .build();
            res.add(m);
        }
        return res;
    }

    @Override
    public int addAdminToManagerAndParticipantAllContest() {
        int cnt = 0;
        String admin = "admin";
        List<ContestEntity> contests = contestRepo.findAll();
        for(ContestEntity c: contests){
            String contestId = c.getContestId();
            List<UserRegistrationContestEntity> L = userRegistrationContestRepo
                .findUserRegistrationContestEntityByContestIdAndUserIdAndStatusAndRoleId(contestId, admin, UserRegistrationContestEntity.STATUS_SUCCESSFUL, UserRegistrationContestEntity.ROLE_MANAGER);
            if(L == null || L.size() == 0){
                UserRegistrationContestEntity ur = new UserRegistrationContestEntity();
                ur.setContestId(contestId);
                ur.setUserId(admin);
                ur.setStatus(UserRegistrationContestEntity.STATUS_SUCCESSFUL);
                ur.setRoleId(UserRegistrationContestEntity.ROLE_MANAGER);
                ur = userRegistrationContestRepo.save(ur);
                cnt ++;
            }

            L = userRegistrationContestRepo
                .findUserRegistrationContestEntityByContestIdAndUserIdAndStatusAndRoleId(contestId, admin, UserRegistrationContestEntity.STATUS_SUCCESSFUL, UserRegistrationContestEntity.ROLE_PARTICIPANT);
            if(L == null || L.size() == 0){
                UserRegistrationContestEntity ur = new UserRegistrationContestEntity();
                ur.setContestId(contestId);
                ur.setUserId(admin);
                ur.setStatus(UserRegistrationContestEntity.STATUS_SUCCESSFUL);
                ur.setRoleId(UserRegistrationContestEntity.ROLE_PARTICIPANT);
                ur = userRegistrationContestRepo.save(ur);
                cnt ++;
            }

        }
        return cnt;
    }

    @Override
    public ModelUploadTestCaseOutput addTestCase(String testCase, ModelProgrammingContestUploadTestCase modelUploadTestCase, String userName) {
        // try to execute the solution code on this test-case, if pass then store in DB
        // otherwise, ignore
        String problemId = modelUploadTestCase.getProblemId();
        ProblemEntity problemEntity = problemRepo.findByProblemId(problemId);
        String tempName = tempDir.createRandomScriptFileName(userName + "-" + problemEntity.getProblemName() + "-" + problemEntity.getCorrectSolutionLanguage());
        String output = "";
        try {
            output = runCode(problemEntity.getCorrectSolutionSourceCode(), problemEntity.getCorrectSolutionLanguage(), tempName,
                    testCase, problemEntity.getTimeLimit(), "Correct Solution Language Not Found");
        }catch(Exception e){
            e.printStackTrace();
        }
        ModelUploadTestCaseOutput res = new ModelUploadTestCaseOutput();
        if(output.contains("Time Limit Exceeded")){
            res.setMessage("Time Limit Exceeded");
            res.setStatus("TLE");
            return res;
        }
        output = output.substring(0, output.length()-1);
        int lastLinetIndexExpected = output.lastIndexOf("\n");
        output = output.substring(0, lastLinetIndexExpected);
//        output = output.replaceAll("\n", "");
        log.info("addTestCase, output = {}", output);


        TestCaseEntity tc = new TestCaseEntity();
        tc.setTestCase(testCase);
        tc.setProblemId(modelUploadTestCase.getProblemId());
        tc.setIsPublic(modelUploadTestCase.getIsPublic());
        tc.setTestCasePoint(modelUploadTestCase.getPoint());
        tc.setCorrectAnswer(output);
        tc.setDescription(modelUploadTestCase.getDescription());
        tc = testCaseRepo.save(tc);
        res.setMessage("Upload Successfully!");
        res.setStatus("OK");
        return res;
    }
}
