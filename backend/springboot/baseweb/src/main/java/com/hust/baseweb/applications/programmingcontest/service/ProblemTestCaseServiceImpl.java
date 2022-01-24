package com.hust.baseweb.applications.programmingcontest.service;

import com.hust.baseweb.applications.notifications.service.NotificationsService;
import com.hust.baseweb.applications.programmingcontest.constants.Constants;
import com.hust.baseweb.applications.programmingcontest.docker.DockerClientBase;
import com.hust.baseweb.applications.programmingcontest.exception.MiniLeetCodeException;
import com.hust.baseweb.applications.programmingcontest.utils.ComputerLanguage;
import com.hust.baseweb.applications.programmingcontest.utils.TempDir;
import com.hust.baseweb.applications.programmingcontest.utils.stringhandler.ProblemSubmission;
import com.hust.baseweb.applications.programmingcontest.utils.stringhandler.StringHandler;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.repo.UserLoginRepo;
import com.hust.baseweb.applications.programmingcontest.entity.*;
import com.hust.baseweb.applications.programmingcontest.model.*;
import com.hust.baseweb.applications.programmingcontest.repo.*;
import com.hust.baseweb.utils.DateTimeUtils;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
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

    @Override
    public void createContestProblem(ModelCreateContestProblem modelCreateContestProblem) throws MiniLeetCodeException {
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
                                                   .createdAt(new Date())
                                                   .isPublicProblem(modelCreateContestProblem.getIsPublic())
                                                   .levelOrder(constants.getMapLevelOrder().get(modelCreateContestProblem.getLevelId()))
                                                   .build();
        problemRepo.save(problemEntity);


    }

    @Override
    public ProblemEntity updateContestProblem(ModelCreateContestProblem modelCreateContestProblem, String problemId) throws Exception {

        if(!problemRepo.existsById(problemId)){
            throw new MiniLeetCodeException("problem id not found");
        }
        ProblemEntity problemEntity = problemRepo.findByProblemId(problemId);
        problemEntity.setProblemName(modelCreateContestProblem.getProblemName());
        problemEntity.setProblemDescription(modelCreateContestProblem.getProblemDescription());
        problemEntity.setLevelId(modelCreateContestProblem.getLevelId());
        problemEntity.setCategoryId(modelCreateContestProblem.getCategoryId());
        problemEntity.setSolution(modelCreateContestProblem.getSolution());
        problemEntity.setTimeLimit(modelCreateContestProblem.getTimeLimit());
        problemEntity.setCorrectSolutionLanguage(modelCreateContestProblem.getCorrectSolutionLanguage());
        problemEntity.setCorrectSolutionSourceCode(modelCreateContestProblem.getCorrectSolutionSourceCode());
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
        log.info("problem entity {}", problemEntity);
        log.info("source {}", problemEntity.getCorrectSolutionSourceCode());
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

        ProblemEntity problemEntity = problemRepo.findByProblemId(problemId);
        TestCaseEntity testCaseEntity = TestCaseEntity.builder()
                                                      .correctAnswer(modelSaveTestcase.getResult())
                                                      .testCase(modelSaveTestcase.getInput())
                                                      .testCasePoint(modelSaveTestcase.getPoint())
                                                      .problem(problemEntity)
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

    @Override
    public ContestEntity createContest(ModelCreateContest modelCreateContest, String userName) throws Exception {
        try {
            ContestEntity contestEntityExist = contestRepo.findContestByContestId(modelCreateContest.getContestId());
            if(contestEntityExist != null){
                throw new MiniLeetCodeException("Contest is already exist");
            }
            UserLogin userLogin = userLoginRepo.findByUserLoginId(userName);
            List<ProblemEntity> problemEntities = getContestProblemsFromListContestId(modelCreateContest.getProblemIds());
            ContestEntity contestEntity = ContestEntity.builder()
                                                       .contestId(modelCreateContest.getContestId())
                                                       .contestName(modelCreateContest.getContestName())
                                                       .contestSolvingTime(modelCreateContest.getContestTime())
                                                       .problems(problemEntities)
                                                       .userCreatedContest(userLogin)
                                                       .build();
            return contestRepo.save(contestEntity);
        }catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public ContestEntity updateContest(ModelUpdateContest modelUpdateContest, String userName, String contestId) throws Exception {
        try {
            ContestEntity contestEntityExist = contestRepo.findContestByContestId(contestId);
            if(contestEntityExist == null){
                throw new MiniLeetCodeException("Contest does not exist");
            }
            UserLogin userLogin = userLoginRepo.findByUserLoginId(userName);
            //check user have privileged
            if(!userLogin.getUserLoginId().equals(contestEntityExist.getUserCreatedContest().getUserLoginId())){
                throw new MiniLeetCodeException("You don't have privileged");
            }
            List<ProblemEntity> problemEntities = getContestProblemsFromListContestId(modelUpdateContest.getProblemIds());
            ContestEntity contestEntity = ContestEntity.builder()
                                                       .contestId(contestId)
                                                       .contestName(modelUpdateContest.getContestName())
                                                       .contestSolvingTime(modelUpdateContest.getContestSolvingTime())
                                                       .problems(problemEntities)
                                                       .userCreatedContest(userLogin)
                                                       .build();
            return contestRepo.save(contestEntity);
        }catch (Exception e){
            throw new Exception(e.getMessage());
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
        UserLogin userLogin = userLoginRepo.findByUserLoginId(userName);
        ContestEntity contestEntity = contestRepo.findContestEntityByContestIdAndUserCreatedContest(contestId, userLogin);
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
                                            .list(problems)
                                            .unauthorized(false)
                                            .build();
    }

    @Override
    public ModelGetContestDetailResponse getContestSolvingDetailByContestId(String contestId, String userName) {
//        UserLogin userLogin = userLoginRepo.findByUserLoginId(userName);
        ContestEntity contestEntity = contestRepo.findContestByContestId(contestId);
        UserRegistrationContestEntity userRegistrationContest = userRegistrationContestRepo.findUserRegistrationContestEntityByContestIdAndUserIdAndStatus(contestId, userName, Constants.RegistrationType.SUCCESSFUL.getValue());
        log.info("userRegistrationContest {}", userRegistrationContest);

        if(userRegistrationContest == null){
            log.info("unauthorized");
            return ModelGetContestDetailResponse.builder()
                                                .unauthorized(true)
                                                .build();
        }
        return getModelGetContestDetailResponse(contestId, contestEntity);
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
        List<TestCaseEntity> testCaseEntityList = testCaseRepo.findAllByProblem(problemEntity);
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
        UserRegistrationContestEntity userRegistrationContest = userRegistrationContestRepo.findUserRegistrationContestEntityByContestIdAndUserIdAndStatus(modelContestSubmission.getContestId(), userName, Constants.RegistrationType.SUCCESSFUL.getValue());
        log.info("userRegistrationContest {}", userRegistrationContest);
        if(userRegistrationContest == null){
            throw new MiniLeetCodeException("User not register contest");
        }
        List<TestCaseEntity> testCaseEntityList = testCaseRepo.findAllByProblem(problemEntity);
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
        notificationsService.create(userId, contestEntity.getUserCreatedContest().getUserLoginId(), userId + " register contest "+contestId,"/programming-contest/contest-manager/"+contestId+"#pending");

        return ModelStudentRegisterContestResponse.builder()
                                                  .status(Constants.RegistrationType.PENDING.getValue())
                                                  .message("You have send request to register contest "+ contestId +", please wait to accept")
                                                  .build();
    }

    @Override
    public void teacherManageStudentRegisterContest(String teacherId, ModelTeacherManageStudentRegisterContest modelTeacherManageStudentRegisterContest) throws MiniLeetCodeException {
        ContestEntity contestEntity = contestRepo.findContestByContestId(modelTeacherManageStudentRegisterContest.getContestId());
//        UserLogin student = userLoginRepo.findByUserLoginId(modelTeacherManageStudentRegisterContest.getUserId());
        log.info("teacherid {}", teacherId);
        log.info("created contest {}", contestEntity.getUserCreatedContest().getUserLoginId());
        if(contestEntity.getUserCreatedContest() == null || contestEntity.getUserCreatedContest().getUserLoginId() == null || !contestEntity.getUserCreatedContest().getUserLoginId().equals(teacherId)){
            throw new MiniLeetCodeException(teacherId +" does not have privilege to manage contest " + modelTeacherManageStudentRegisterContest.getContestId());
        }
        UserRegistrationContestEntity userRegistrationContestEntity = userRegistrationContestRepo.findUserRegistrationContestEntityByContestIdAndUserId(modelTeacherManageStudentRegisterContest.getContestId(), modelTeacherManageStudentRegisterContest.getUserId());

        if(Constants.RegisterCourseStatus.SUCCESSES.getValue().equals(modelTeacherManageStudentRegisterContest.getStatus())){
            log.info("approve");
            userRegistrationContestEntity.setStatus(Constants.RegistrationType.SUCCESSFUL.getValue());
            userRegistrationContestRepo.save(userRegistrationContestEntity);
            notificationsService.create(teacherId, modelTeacherManageStudentRegisterContest.getUserId(), "Your register contest " + modelTeacherManageStudentRegisterContest.getContestId() +" is approved ", null);
        }else if(Constants.RegisterCourseStatus.FAILED.getValue().equals(modelTeacherManageStudentRegisterContest.getStatus())){
            log.info("reject");
            userRegistrationContestEntity.setStatus(Constants.RegistrationType.FAILED.getValue());
            userRegistrationContestRepo.save(userRegistrationContestEntity);
            notificationsService.create(teacherId, modelTeacherManageStudentRegisterContest.getUserId(), "Your register contest " + modelTeacherManageStudentRegisterContest.getContestId() +" is rejected ", null);
        }else{
            throw new MiniLeetCodeException("Status not found");
        }
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
        UserLogin userCreateContest = userLoginRepo.findByUserLoginId(userName);
        Page<ContestEntity> contestPage =  contestPagingAndSortingRepo.findAllByUserCreatedContest(pageable, userCreateContest);
        return getModelGetContestPageResponse(contestPage);
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
//        UserLogin u = userLoginRepo.findByUserLoginId(userName);
        Page<ContestEntity> list = userRegistrationContestPagingAndSortingRepo.getContestByUserAndStatusSuccessful(pageable, userName);
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
    public Page<ProblemEntity> getPublicProblemPaging(Pageable pageable) {
        return problemPagingAndSortingRepo.findAllByPublicIs(pageable);
    }

    @Override
    public List<ModelGetTestCase> getTestCaseByProblem(String problemId) {
        ProblemEntity problem = problemRepo.findByProblemId(problemId);
        List<TestCaseEntity> testCases = testCaseRepo.findAllByProblem(problem);
        return testCases.stream().map(this::convertToModelGetTestCase).collect(Collectors.toList());
    }

    @Override
    public ModelGetTestCaseDetail getTestCaseDetail(UUID testCaseId) throws MiniLeetCodeException {
        TestCaseEntity testCase = testCaseRepo.findTestCaseByTestCaseId(testCaseId);
        if(testCase == null){
            throw new MiniLeetCodeException("testcase not found");
        }
        return ModelGetTestCaseDetail.builder()
                                     .testCaseId(testCaseId)
                                     .correctAns(testCase.getCorrectAnswer())
                                     .testCase(testCase.getTestCase())
                                     .point(testCase.getTestCasePoint())
                                     .problemSolution(testCase.getProblem().getSolution())
                                     .problemDescription(testCase.getProblem().getProblemDescription())
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
        testCaseRepo.save(testCase);
    }

    @Override
    public void addUserToContest(ModelAddUserToContest modelAddUserToContest) {
        UserRegistrationContestEntity userRegistrationContest = userRegistrationContestRepo.findUserRegistrationContestEntityByContestIdAndUserId(modelAddUserToContest.getContestId(), modelAddUserToContest.getUserId());
        if(userRegistrationContest == null) {
            userRegistrationContestRepo.save(UserRegistrationContestEntity.builder()
                                                                          .contestId(modelAddUserToContest.getContestId())
                                                                          .userId(modelAddUserToContest.getUserId())
                                                                          .status(Constants.RegistrationType.SUCCESSFUL.getValue())
                                                                          .build());
        }else{
            userRegistrationContest.setStatus(Constants.RegistrationType.SUCCESSFUL.getValue());
            userRegistrationContestRepo.save(userRegistrationContest);
        }

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
    public Page<ContestSubmission> findContestSubmissionByContestIdPaging(Pageable pageable, String contestId) {
        return contestSubmissionPagingAndSortingRepo.findAllByContestId(pageable, contestId).map(
            contestSubmissionEntity -> ContestSubmission.builder()
                                                        .contestSubmissionId(contestSubmissionEntity.getContestSubmissionId())
                                                        .contestId(contestSubmissionEntity.getContestId())
                                                        .createAt(contestSubmissionEntity.getCreatedAt() != null ? DateTimeUtils.dateToString(contestSubmissionEntity.getCreatedAt(), DateTimeUtils.DateTimeFormat.DATE_TIME_ISO_FORMAT) : null)
                                                        .sourceCodeLanguage(contestSubmissionEntity.getSourceCodeLanguage())
                                                        .point(contestSubmissionEntity.getPoint())
                                                        .problemId(contestSubmissionEntity.getProblemId())
                                                        .testCasePass(contestSubmissionEntity.getTestCasePass())
                                                        .status(contestSubmissionEntity.getStatus())
                                                        .userId(contestSubmissionEntity.getUserId())
                                                        .build());
    }

    @Override
    public ContestSubmissionEntity getContestSubmissionDetail(UUID submissionId) {
        return contestSubmissionRepo.findContestSubmissionEntityByContestSubmissionId(submissionId);
    }

    private ModelGetTestCase convertToModelGetTestCase(TestCaseEntity testCaseEntity){
        boolean viewMore = false;
        String correctAns = testCaseEntity.getCorrectAnswer();
        String testCase = testCaseEntity.getTestCase();
        int point = testCaseEntity.getTestCasePoint();

        if(correctAns.length() > 20){
            viewMore = true;
            correctAns = correctAns.substring(0,17);
            correctAns += "...";
        }
        if(testCase.length() > 20){
            viewMore = true;
            testCase = testCase.substring(0,17);
            testCase += "...";
        }
        return ModelGetTestCase.builder()
                               .correctAns(correctAns)
                               .testCase(testCase)
                               .point(point)
                               .viewMore(viewMore)
                               .testCaseId(testCaseEntity.getTestCaseId())
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
        List<ProblemEntity> problemEntities = new ArrayList<>();
        for(String problemId : problemIds){
            ProblemEntity problemEntity = problemRepo.findByProblemId(problemId);
            if(problemEntity == null){
                throw new MiniLeetCodeException("Problem " + problemId +" does not exist");
            }
            problemEntities.add(problemEntity);
        }
        return problemEntities;
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
}
