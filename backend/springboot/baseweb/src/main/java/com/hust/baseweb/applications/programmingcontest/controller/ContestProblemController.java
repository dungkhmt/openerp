package com.hust.baseweb.applications.programmingcontest.controller;

import com.google.gson.Gson;
import com.hust.baseweb.applications.programmingcontest.model.*;
import com.hust.baseweb.applications.programmingcontest.entity.*;
import com.hust.baseweb.applications.programmingcontest.exception.MiniLeetCodeException;
import com.hust.baseweb.applications.programmingcontest.model.ModelCreateContestProblem;
import com.hust.baseweb.applications.programmingcontest.repo.ContestRepo;
import com.hust.baseweb.applications.programmingcontest.service.ProblemTestCaseService;
import io.lettuce.core.dynamic.annotation.Param;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.security.Principal;
import java.util.List;
import java.util.Scanner;
import java.util.UUID;
import java.util.Date;
@RestController
@CrossOrigin
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class ContestProblemController {
    ProblemTestCaseService problemTestCaseService;
    ContestRepo contestRepo;
    @PostMapping("/create-problem")
    public ResponseEntity<?> createContestProblem(@RequestBody ModelCreateContestProblem modelCreateContestProblem, Principal principal) throws MiniLeetCodeException {
        log.info("create problem {}", modelCreateContestProblem);
        problemTestCaseService.createContestProblem(modelCreateContestProblem, principal.getName());
        return ResponseEntity.status(200).body(null);
    }


    @PostMapping("/add-problem-language-source-code/{problemId}")
    public ResponseEntity<?> addProblemLanguageSourceCode(
        @PathVariable("problemId") String problemId,
        @RequestBody ModelAddProblemLanguageSourceCode modelAddProblemLanguageSourceCode) throws Exception{
        problemTestCaseService.updateProblemSourceCode(modelAddProblemLanguageSourceCode, problemId);
        return ResponseEntity.status(200).body(null);
    }


    @PostMapping("/get-test-case-result/{problemId}")
    public ResponseEntity<?> getTestCaseResult(@PathVariable("problemId") String problemId, @RequestBody ModelGetTestCaseResult testCaseResult, Principal principal) throws Exception {
        log.info("get test case result {}", problemId);
        ModelGetTestCaseResultResponse resp = problemTestCaseService.getTestCaseResult(problemId, principal.getName(), testCaseResult);
        return ResponseEntity.status(200).body(resp);
    }



    @GetMapping("/get-contest-problem-paging")
    public ResponseEntity<?> getContestProblemPaging(Pageable pageable, @Param("sortBy") String sortBy, @Param("desc") String desc){
        log.info("getContestProblemPaging pageable {}", pageable);
        log.info("sortBy {}", sortBy);
        if(sortBy != null){
            if(desc != null)
                pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(sortBy).descending());
            else
                pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(sortBy).ascending());
        }
        Page<ProblemEntity> contestProblemPage = problemTestCaseService.getContestProblemPaging(pageable);
        return ResponseEntity.status(200).body(contestProblemPage);
    }

    @PostMapping("/ide/{computerLanguage}")
    public ResponseEntity<?> runCode(@PathVariable("computerLanguage") String computerLanguage, @RequestBody ModelRunCodeFromIDE modelRunCodeFromIDE, Principal principal) throws Exception{
        String response = null;
        response = problemTestCaseService.executableIDECode(modelRunCodeFromIDE,principal.getName(), computerLanguage);
        ModelRunCodeFromIDEOutput modelRunCodeFromIDEOutput = new ModelRunCodeFromIDEOutput();
        modelRunCodeFromIDEOutput.setOutput(response);
        return ResponseEntity.status(200).body(modelRunCodeFromIDEOutput);
    }

    @GetMapping("/problem-details/{problemId}")
    public ResponseEntity<?> getProblemDetails(@PathVariable("problemId") String problemId) throws Exception {
        log.info("getProblemDetails problemId ", problemId);
        ProblemEntity problemEntity = problemTestCaseService.getContestProblem(problemId);
        return ResponseEntity.status(200).body(problemEntity);
    }

    @GetMapping("/get-problem-detail-view-by-student/{problemId}")
    public ResponseEntity<?> getProblemDetailViewByStudent(Principal principal,@PathVariable("problemId") String problemId){
        try {
            ProblemEntity problemEntity = problemTestCaseService.getContestProblem(problemId);
            ModelStudentViewProblemDetail model = new ModelStudentViewProblemDetail();
            model.setProblemStatement(problemEntity.getProblemDescription());
            model.setProblemName(problemEntity.getProblemName());
            return ResponseEntity.ok().body(model);
        }catch(Exception e){
            e.printStackTrace();
        }
        return ResponseEntity.ok().body("NOTFOUND");
    }
    @PostMapping("/update-problem-detail/{problemId}")
    public ResponseEntity<?> updateProblemDetails(@RequestBody ModelCreateContestProblem modelCreateContestProblem, @PathVariable("problemId") String problemId, Principal principal) throws Exception {
        log.info("updateProblemDetails problemId {}", problemId);
        ProblemEntity problemEntity = problemTestCaseService.updateContestProblem(modelCreateContestProblem, problemId, principal.getName());
        return ResponseEntity.status(HttpStatus.OK).body(problemEntity);
    }

    @PostMapping("/problem-detail-run-code/{problemId}")
    public ResponseEntity<?> problemDetailsRunCode(@PathVariable("problemId") String problemId, @RequestBody ModelProblemDetailRunCode modelProblemDetailRunCode, Principal principal) throws Exception {
        ModelProblemDetailRunCodeResponse resp = problemTestCaseService.problemDetailRunCode(problemId, modelProblemDetailRunCode, principal.getName());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/check-compile")
    public ResponseEntity<?> checkCompile(@RequestBody ModelCheckCompile modelCheckCompile, Principal principal) throws Exception {
        ModelCheckCompileResponse resp = problemTestCaseService.checkCompile(modelCheckCompile, principal.getName());
        return ResponseEntity.status(200).body(resp);
    }

    @PostMapping("/save-test-case/{problemId}")
    public ResponseEntity<?> saveTestCase(@PathVariable("problemId") String problemId, @RequestBody ModelSaveTestcase modelSaveTestcase){
        TestCaseEntity testCaseEntity = problemTestCaseService.saveTestCase(problemId, modelSaveTestcase);
        return ResponseEntity.status(200).body(testCaseEntity);
    }

    @PostMapping("/problem-details-submission/{problemId}")
    public ResponseEntity<?> problemDetailsSubmission(@PathVariable("problemId") String problemId, @RequestBody ModelProblemDetailSubmission modelProblemDetailSubmission, Principal principal) throws Exception {
        log.info("problemDetailsSubmission {}", problemId);
        ModelContestSubmissionResponse response = problemTestCaseService.problemDetailSubmission(modelProblemDetailSubmission, problemId, principal.getName());
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/get-all-problem-submission-by-user/{problemId}")
    public ResponseEntity<?> getAllProblemSubmissionByUser(@PathVariable("problemId") String problemId, Principal principal) throws Exception {
        ListProblemSubmissionResponse listProblemSubmissionResponse = problemTestCaseService.getListProblemSubmissionResponse(problemId, principal.getName());
        return ResponseEntity.status(200).body(listProblemSubmissionResponse);
    }

    @GetMapping("/get-problem-submission/{id}")
    public ResponseEntity<?> getProblemSubmissionById(@PathVariable("id") UUID id, Principal principal) throws MiniLeetCodeException {
        log.info("getProblemSubmissionById id {}", id);
        ModelProblemSubmissionDetailResponse modelProblemSubmissionDetailResponse = problemTestCaseService.findProblemSubmissionById(id, principal.getName());
        return ResponseEntity.status(200).body(modelProblemSubmissionDetailResponse);
    }

    @PostMapping("/create-contest")
    public ResponseEntity<?> createContest(@RequestBody ModelCreateContest modelCreateContest, Principal principal) throws Exception {
        log.info("createContest {}", modelCreateContest);
        problemTestCaseService.createContest(modelCreateContest, principal.getName());
        return ResponseEntity.status(200).body(null);
    }

    @PostMapping("/edit-contest/{contestId}")
    public ResponseEntity<?> editContest(@RequestBody ModelUpdateContest modelUpdateContest, Principal principal, @PathVariable("contestId") String contestId) throws Exception {
        log.info("edit contest modelUpdateContest {}",modelUpdateContest );
        problemTestCaseService.updateContest(modelUpdateContest, principal.getName(), contestId);
        return ResponseEntity.status(200).body(null);
    }
    @GetMapping("/get-contest-paging")
    public ResponseEntity<?> getContestPaging(Pageable pageable, @Param("sortBy") String sortBy){
        log.info("getContestPaging sortBy {} pageable {}", sortBy, pageable);
        if(sortBy != null){
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(sortBy));
        }else{
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("createdAt").ascending());
        }
        ModelGetContestPageResponse modelGetContestPageResponse = problemTestCaseService.getContestPaging(pageable);
        return ResponseEntity.status(200).body(modelGetContestPageResponse);
    }

    @GetMapping("/get-contest-detail/{contestId}")
    public ResponseEntity<?> getContestDetail(@PathVariable("contestId") String contestId, Principal principal){
        log.info("getContestDetail constestid {}", contestId);
        ModelGetContestDetailResponse response = problemTestCaseService.getContestDetailByContestIdAndTeacher(contestId, principal.getName());
        return ResponseEntity.status(200).body(response);
    }
    @GetMapping("/check-code-similarity/{contestId}")
    public ResponseEntity<?> checkCodeSimilarity(Principal principal, @PathVariable String contestId){
        log.info("checkCodeSimilarity, contestId = " + contestId);
        ModelCodeSimilarityOutput res= problemTestCaseService.checkSimilarity(contestId);
        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/get-contest-detail-solving/{contestId}")
    public ResponseEntity<?> getContestDetailSolving(@PathVariable("contestId") String contestId, Principal principal) throws MiniLeetCodeException {
        log.info("getContestDetail constestid {}", contestId);
        ModelGetContestDetailResponse response = problemTestCaseService.getContestSolvingDetailByContestId(contestId, principal.getName());
        return ResponseEntity.status(200).body(response);
    }

    @Secured("ROLE_STUDENT")
    @PostMapping("/student-register-contest/{contestId}")
    public ResponseEntity<?> studentRegisterContest(@PathVariable("contestId") String contestId, Principal principal) throws MiniLeetCodeException {
        log.info("studentRegisterContest {}", contestId);
        ModelStudentRegisterContestResponse resp = problemTestCaseService.studentRegisterContest(contestId, principal.getName());
        return ResponseEntity.status(200).body(resp);
    }
    @Secured("ROLE_TEACHER")
    @GetMapping("/get-contest-paging-by-user-manager")
    public ResponseEntity<?> getContestPagingByUserManager(Principal principal, Pageable pageable, @Param("sortBy") String sortBy){
        log.info("getContestPagingByUserCreate");
        if(sortBy != null){
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(sortBy));
        }else{
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("createdAt").ascending());
        }
        ModelGetContestPageResponse resp = problemTestCaseService.getContestPagingByUserManagerContest(principal.getName(), pageable);
        return ResponseEntity.status(200).body(resp);
    }

    @Secured("ROLE_TEACHER")
    @GetMapping("/get-contest-paging-by-user-create")
    public ResponseEntity<?> getContestPagingByUserCreate(Principal principal, Pageable pageable, @Param("sortBy") String sortBy){
        log.info("getContestPagingByUserCreate");
        if(sortBy != null){
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(sortBy));
        }else{
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("createdAt").ascending());
        }
        ModelGetContestPageResponse resp = problemTestCaseService.getContestPagingByUserCreatedContest(principal.getName(), pageable);
        return ResponseEntity.status(200).body(resp);
    }

    @Secured("ROLE_TEACHER")
    @GetMapping("/get-user-register-successful-contest/{contestId}")
    public ResponseEntity<?> getUserRegisterSuccessfulContest(@PathVariable("contestId") String contestId, Pageable pageable){
        log.info("get User Register Successful Contest ");
        ListModelUserRegisteredContestInfo resp = problemTestCaseService.getListUserRegisterContestSuccessfulPaging(pageable, contestId);
        return ResponseEntity.status(200).body(resp);
    }


    @Secured("ROLE_TEACHER")
    @GetMapping("/get-user-register-pending-contest/{contestId}")
    public ResponseEntity<?> getUserRegisterPendingContest(@PathVariable("contestId") String contestId, Pageable pageable, @Param("size") String size, @Param("page") String page){
        log.info("get User Register Pending Contest pageable {} size {} page {} contest id {}", pageable, size, page, contestId);
        ListModelUserRegisteredContestInfo resp = problemTestCaseService.getListUserRegisterContestPendingPaging(pageable, contestId);
        return ResponseEntity.status(200).body(resp);
    }

    @Secured("ROLE_TEACHER")
    @GetMapping("/search-user/{contestId}")
    public ResponseEntity<?> searchUser(@PathVariable("contestId") String contestId, Pageable pageable, @Param("keyword") String keyword){
        if(keyword == null){
            keyword = "";
        }
        ListModelUserRegisteredContestInfo resp = problemTestCaseService.searchUser(pageable, contestId, keyword);
        return ResponseEntity.status(200).body(resp);

    }



    @Secured("ROLE_TEACHER")
    @PostMapping("/techer-manager-student-register-contest")
    public ResponseEntity<?> teacherManagerStudentRegisterContest(Principal principal, @RequestBody ModelTeacherManageStudentRegisterContest request) throws MiniLeetCodeException {
        log.info("teacherManagerStudentRegisterContest");
        problemTestCaseService.teacherManageStudentRegisterContest(principal.getName(), request);
        return ResponseEntity.status(200).body(null);
    }


    @GetMapping("/get-contest-paging-registered")
    public ResponseEntity<?> getContestRegisteredByStudentPaging(Pageable pageable, @Param("sortBy") String sortBy, Principal principal){
        log.info("getContestRegisteredByStudentPaging sortBy {} pageable {}", sortBy, pageable);
        if(sortBy != null){
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(sortBy));
        }else{
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("createdAt").ascending());
        }
        ModelGetContestPageResponse modelGetContestPageResponse = problemTestCaseService.getRegisteredContestByUser(pageable, principal.getName());
        return ResponseEntity.status(200).body(modelGetContestPageResponse);
    }

    @GetMapping("/get-contest-paging-not-registered")
    public ResponseEntity<?> getContestNotRegisteredByStudentPaging(Pageable pageable, @Param("sortBy") String sortBy, Principal principal){
        log.info("getContestRegisteredByStudentPaging sortBy {} pageable {}", sortBy, pageable);
        if(sortBy != null){
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(sortBy));
        }else{
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("createdAt").ascending());
        }
        ModelGetContestPageResponse modelGetContestPageResponse = problemTestCaseService.getNotRegisteredContestByUser(pageable, principal.getName());
        return ResponseEntity.status(200).body(modelGetContestPageResponse);
    }

    @PostMapping("/contest-submit-problem")
    public ResponseEntity<?> contestSubmitProblem(@RequestBody ModelContestSubmission request, Principal principal) throws Exception {
        log.info("/contest-submit-problem");
        //ModelContestSubmissionResponse resp = problemTestCaseService.submitContestProblem(request, principal.getName());
        // modified by PQD, process testcase by testcase
        ModelContestSubmissionResponse resp = problemTestCaseService.submitContestProblemTestCaseByTestCase(request, principal.getName());

        log.info("resp {}", resp);
        return ResponseEntity.status(200).body(resp);
    }
    @GetMapping("/get-contest-problem-submission-detail-by-testcase-of-a-submission/{submissionId}")
    public ResponseEntity<?> getContestProblemSubmissionDetailByTestCaseOfASubmission(Principal principal, @PathVariable UUID submissionId){
        List<ModelProblemSubmissionDetailByTestCaseResponse> retLst = problemTestCaseService
            .getContestProblemSubmissionDetailByTestCaseOfASubmission(submissionId);
        return ResponseEntity.ok().body(retLst);
    }
    @GetMapping("/get-contest-problem-submission-detail-by-testcase")
    public ResponseEntity<?> getContestProblemSubmissionDetailByTestCase(Principal principal,
                                                                         @RequestParam int page, int size, Pageable pageable){
        log.info("getContestProblemSubmissionDetailByTestCase, page = " + page + " size = " + size);
        Pageable sortedByCreatedStampDsc =
            PageRequest.of(page, size, Sort.by("createdStamp").descending());

        Page<ModelProblemSubmissionDetailByTestCaseResponse> lst = problemTestCaseService
            .getContestProblemSubmissionDetailByTestCase(sortedByCreatedStampDsc);

        return ResponseEntity.ok().body(lst);
    }
    @PostMapping("/contest-submit-problem-via-upload-file")
    public ResponseEntity<?> contestSubmitProblemViaUploadFile(Principal principal,
                                                               @RequestParam("inputJson") String inputJson,
                                                               @RequestParam("file") MultipartFile file
                                                               ){
        log.info("contestSubmitProblemViaUploadFile, inputJson = " + inputJson);

        Gson gson = new Gson();
        ModelContestSubmitProgramViaUploadFile model = gson.fromJson(inputJson, ModelContestSubmitProgramViaUploadFile.class);
        ContestEntity contestEntity = contestRepo.findContestByContestId(model.getContestId());
        Date currentDate = new Date();
        int timeTest = ((int) (currentDate.getTime() - contestEntity.getStartedAt().getTime())) / (60 * 1000); //minutes
        //System.out.println(currentDate);
        //System.out.println(testStartDate);
        //System.out.println(timeTest);
        //System.out.println(test.getDuration());
        log.info("contestSubmitProblemViaUploadFile, currentDate = " + currentDate + ", contest started at" + contestEntity.getStartedAt()
                 + " timeTest = " + timeTest + " contestSolvingTime = " + contestEntity.getContestSolvingTime());

        //if (timeTest > contestEntity.getContestSolvingTime()) {
        if(!contestEntity.getStatusId().equals(ContestEntity.CONTEST_STATUS_RUNNING)){
            log.info("contestSubmitProblemViaUploadFile, TIME OUT!!!!! currentDate = " + currentDate + ", contest started at" + contestEntity.getStartedAt()
                     + " timeTest = " + timeTest + " contestSolvingTime = " +
                     contestEntity.getContestSolvingTime());

            //return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(null);

            ModelContestSubmissionResponse resp = ModelContestSubmissionResponse.builder()
                                          .status("TIME_OUT")
                                          .testCasePass("0")
                                          .runtime(new Long(0))
                                          .memoryUsage(new Float(0))
                                          .problemName("")
                                          .contestSubmissionID(null)
                                          .submittedAt(null)
                                          .score(0)
                                          .numberTestCasePassed(0)
                                          .totalNumberTestCase(0)
                                          .build();
            return ResponseEntity.ok().body(resp);
        }

        try {
            String source = "";
            InputStream inputStream = file.getInputStream();
            Scanner in = new Scanner(inputStream);
            while(in.hasNext()) {
                String line = in.nextLine();
                source += line + "\n";
                System.out.println("contestSubmitProblemViaUploadFile: read line: " + line);
            }
            in.close();

            ModelContestSubmission request = new ModelContestSubmission(model.getContestId(), model.getProblemId(), source,model.getLanguage());
            ModelContestSubmissionResponse resp = null;
            if(contestEntity.getSubmissionActionType().equals(ContestEntity.CONTEST_SUBMISSION_ACTION_TYPE_STORE_AND_EXECUTE)) {
                resp = problemTestCaseService.submitContestProblemTestCaseByTestCase(
                    request,
                    principal.getName());
            }else{
                resp = problemTestCaseService.submitContestProblemStoreOnlyNotExecute(request,principal.getName());
            }
            log.info("resp {}", resp);
            return ResponseEntity.status(200).body(resp);
        }catch(Exception e){
            e.printStackTrace();
        }
        return ResponseEntity.ok().body("OK");
    }
    @PostMapping("/submit-solution-output")
    public ResponseEntity<?>  submitSolutionOutput(Principal principale,
                                                   @RequestParam("inputJson") String inputJson,
                                                   @RequestParam("file") MultipartFile file){
        log.info("submitSolutionOutput, inputJson = " + inputJson);
        Gson gson = new Gson();
        ModelSubmitSolutionOutput model = gson.fromJson(inputJson, ModelSubmitSolutionOutput.class);
        try {
            String solutionOutput = "";
            InputStream inputStream = file.getInputStream();
            Scanner in = new Scanner(inputStream);
            while(in.hasNext()) {
                String line = in.nextLine();
                solutionOutput += line + "\n";
                System.out.println("submitSolutionOutput: read line: " + line);
            }
            in.close();
            ModelContestSubmissionResponse resp = problemTestCaseService.submitSolutionOutput(solutionOutput,
                                                                                              model.getContestId(),
                                                                                              model.getProblemId(), model.getTestCaseId(),
                                                                                              principale.getName());
            log.info("resp {}", resp);
            return ResponseEntity.status(200).body(resp);
        }catch(Exception e){
            e.printStackTrace();
        }
        return ResponseEntity.ok().body("OK");
    }
    @PostMapping("/contest-submit-all")
    public ResponseEntity<?> contestSubmitAll (@RequestBody ModelContestSubmissionAll request, Principal principal){
        log.info("contestSubmitAll request {}", request);
        request.getContents().parallelStream().forEach(modelContestSubmission -> {
            try {
                problemTestCaseService.submitContestProblem(modelContestSubmission, principal.getName());
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        return ResponseEntity.status(200).body(null);
    }

    @GetMapping("/get-ranking-contest/{contestId}")
    public ResponseEntity<?> getRankingContest(@PathVariable("contestId") String contestId, Pageable pageable){
        log.info("getRankingContest page {}", pageable);
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("point").descending());
        Page<UserSubmissionContestResultNativeEntity> page = problemTestCaseService.getRankingByContestId(pageable, contestId);
        log.info("ranking page {}", page);
        return ResponseEntity.status(200).body(page);
    }

    @PostMapping("/recalculate-ranking/{contestId}")
    public ResponseEntity<?> recalculateRanking(@PathVariable("contestId") String contestId){
        log.info("/recalculate-ranking/ contestid {}", contestId);
        problemTestCaseService.calculateContestResult(contestId);
        return ResponseEntity.status(200).body(null);
    }

    @GetMapping("/get-problem-public-paging")
    public ResponseEntity<?> getProblemPublicPaging(Pageable pageable){
        Page<ProblemEntity> page = problemTestCaseService.getPublicProblemPaging(pageable);
        return ResponseEntity.status(200).body(page);
    }

    @GetMapping("/get-test-case-list-by-problem/{problemId}")
    public ResponseEntity<?> getTestCaseListByProblem(@PathVariable("problemId") String problemId){
        List<ModelGetTestCase> list = problemTestCaseService.getTestCaseByProblem(problemId);
        return ResponseEntity.status(200).body(list);
    }

    @GetMapping("/get-test-case-detail/{testCaseId}")
    public ResponseEntity<?> getTestCaseDetail(@PathVariable("testCaseId") UUID testCaseId) throws MiniLeetCodeException {
        ModelGetTestCaseDetail resp = problemTestCaseService.getTestCaseDetail(testCaseId);
        return ResponseEntity.status(200).body(resp);
    }

    @PostMapping("/update-test-case/{testCaseId}")
    public ResponseEntity<?> updateDateTestCase(@PathVariable("testCaseId") UUID testCaseId, @RequestBody ModelSaveTestcase modelSaveTestcase) throws MiniLeetCodeException {
        problemTestCaseService.editTestCase(testCaseId, modelSaveTestcase);
        return ResponseEntity.status(200).body(null);
    }

    @PostMapping("/add-user-to-contest")
    public ResponseEntity<?> addUserContest(@RequestBody ModelAddUserToContest modelAddUserToContest){
        problemTestCaseService.addUserToContest(modelAddUserToContest);
        return ResponseEntity.status(200).body(null);
    }

    @PostMapping("/delete-user-contest")
    public ResponseEntity<?> deleteUserFromContest(@RequestBody ModelAddUserToContest modelAddUserToContest) throws MiniLeetCodeException {
        problemTestCaseService.deleteUserContest(modelAddUserToContest);
        return ResponseEntity.status(200).body(null);
    }
    @GetMapping("/get-contest-result-on-problem-of-a-user/{userLoginId}")
    public ResponseEntity<?> getContestResultOnProblemOfAUser( @PathVariable("userLoginId") String userLoginId, Pageable pageable) {
        log.info("getContestResultOnProblemOfAUser, user = " + userLoginId);
        List<ContestSubmission> lst = problemTestCaseService.getNewestSubmissionResults(userLoginId);

        return ResponseEntity.status(200).body(lst);
    }

    @GetMapping("/get-contest-submission-paging-of-a-user/{userLoginId}")
    public ResponseEntity<?> getContestSubmissionPagingOfAUser( @PathVariable("userLoginId") String userLoginId, Pageable pageable){
        log.info("getContestSubmissionPagingOfAUser, user = " + userLoginId);
        pageable = PageRequest.of(pageable.getPageNumber(),pageable.getPageSize(), Sort.by("createdAt").descending());
        Page<ContestSubmission> page = problemTestCaseService.findContestSubmissionByUserLoginIdPaging(pageable, userLoginId);
        log.info("page {}", page);
        return ResponseEntity.status(200).body(page);
    }

    @GetMapping("/get-contest-submission-paging-of-a-user-and-contest/{contestId}")
    public ResponseEntity<?> getContestSubmissionPagingOfCurrentUser( Principal principal, @PathVariable String contestId, Pageable pageable){
        log.info("getContestSubmissionPagingOfCurrentUser, user = " + principal.getName() + " contestId = " + contestId);
        pageable = PageRequest.of(pageable.getPageNumber(),pageable.getPageSize(), Sort.by("createdAt").descending());
        Page<ContestSubmission> page = problemTestCaseService.findContestSubmissionByUserLoginIdAndContestIdPaging(pageable, principal.getName(), contestId);
        log.info("page {}", page);
        return ResponseEntity.status(200).body(page);
    }

    @GetMapping("/get-contest-submission-paging/{contestId}")
    public ResponseEntity<?> getContestSubmissionPaging(@PathVariable("contestId") String contestId, Pageable pageable){
        log.info("getContestSubmissionPaging, contestId = " + contestId);
        pageable = PageRequest.of(pageable.getPageNumber(),pageable.getPageSize(), Sort.by("createdAt").descending());
        Page<ContestSubmission> page = problemTestCaseService.findContestSubmissionByContestIdPaging(pageable, contestId);
        log.info("page {}", page);
        return ResponseEntity.status(200).body(page);
    }

    @GetMapping("/get-contest-problem-submission-detail/{submissionId}")
    public ResponseEntity<?> getContestSubmissionDetail(@PathVariable("submissionId") UUID submissionId){
        log.info("get contest submission detail");
        ContestSubmissionEntity contestSubmission = problemTestCaseService.getContestSubmissionDetail(submissionId);
        return ResponseEntity.status(200).body(contestSubmission);
    }


//    @DeleteMapping("/delete-contest/{contestId}")
//    public ResponseEntity<?> deleteContest(@PathVariable("contestId") String contestId, Principal principal) throws MiniLeetCodeException {
//        log.info("delete-contest {}", contestId);
//        problemTestCaseService.deleteContest(contestId, principal.getName());
//        return ResponseEntity.status(HttpStatus.OK).body(null);
//    }
//
//    @DeleteMapping("/delete-problem/{problemId}")
//    public ResponseEntity<?> deleteProblem(@PathVariable("problemId") String problemId, Principal principal) throws MiniLeetCodeException {
//        log.info("delete-problem {}", problemId);
//        problemTestCaseService.deleteProblem(problemId, principal.getName());
//        return ResponseEntity.status(HttpStatus.OK).body(null);
//
//    }

    @DeleteMapping("/delete-test-case/{testCaseId}")
    public ResponseEntity<?> deleteTestCase(@PathVariable("testCaseId") UUID testCaseId, Principal principal) throws MiniLeetCodeException {
        problemTestCaseService.deleteTestcase(testCaseId, principal.getName());
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

}
