package com.hust.baseweb.applications.programmingcontest.controller;

import com.google.gson.Gson;
import com.hust.baseweb.applications.programmingcontest.constants.Constants;
import com.hust.baseweb.applications.programmingcontest.entity.*;
import com.hust.baseweb.applications.programmingcontest.exception.MiniLeetCodeException;
import com.hust.baseweb.applications.programmingcontest.model.*;
import com.hust.baseweb.applications.programmingcontest.repo.ContestProblemRepo;
import com.hust.baseweb.applications.programmingcontest.repo.ContestRepo;
import com.hust.baseweb.applications.programmingcontest.repo.ContestSubmissionRepo;
import com.hust.baseweb.applications.programmingcontest.repo.UserRegistrationContestRepo;
import com.hust.baseweb.applications.programmingcontest.service.ProblemTestCaseService;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.model.PersonModel;
import com.hust.baseweb.service.UserService;
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
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@RestController
@CrossOrigin
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class ContestProblemController {
    ProblemTestCaseService problemTestCaseService;
    ContestRepo contestRepo;
    ContestSubmissionRepo contestSubmissionRepo;
    ContestProblemRepo contestProblemRepo;
    UserService userService;
    UserRegistrationContestRepo userRegistrationContestRepo;

    // public static List<ModelGetContestDetailResponse> runningContests = new
    // ArrayList();
    public static ConcurrentMap<String, ModelGetContestDetailResponse> runningContests = new ConcurrentHashMap();

    @PostMapping("/create-problem")
    public ResponseEntity<?> createContestProblem(Principal principal,
            @RequestParam("ModelCreateContestProblem") String json,
            @RequestParam("files") MultipartFile[] files) throws MiniLeetCodeException {
        // problemTestCaseService.createContestProblem(modelCreateContestProblem,
        // principal.getName());
        problemTestCaseService.createContestProblem(principal.getName(), json, files);
        return ResponseEntity.status(200).body(null);
    }

    @PostMapping("/add-problem-language-source-code/{problemId}")
    public ResponseEntity<?> addProblemLanguageSourceCode(
            @PathVariable("problemId") String problemId,
            @RequestBody ModelAddProblemLanguageSourceCode modelAddProblemLanguageSourceCode) throws Exception {
        problemTestCaseService.updateProblemSourceCode(modelAddProblemLanguageSourceCode, problemId);
        return ResponseEntity.status(200).body(null);
    }

    @PostMapping("/get-test-case-result/{problemId}")
    public ResponseEntity<?> getTestCaseResult(@PathVariable("problemId") String problemId,
            @RequestBody ModelGetTestCaseResult testCaseResult, Principal principal) throws Exception {
        log.info("get test case result {}", problemId);
        ModelGetTestCaseResultResponse resp = problemTestCaseService.getTestCaseResult(problemId, principal.getName(),
                testCaseResult);
        return ResponseEntity.status(200).body(resp);
    }

    @GetMapping("/get-all-contest-problems")
    public ResponseEntity<?> getAllContestProblems(Principal principal) {
        List<ProblemEntity> problems = problemTestCaseService.getAllProblems();
        return ResponseEntity.ok().body(problems);
    }

    @GetMapping("/get-contest-problem-paging")
    public ResponseEntity<?> getContestProblemPaging(Pageable pageable, @Param("sortBy") String sortBy,
            @Param("desc") String desc) {
        log.info("getContestProblemPaging pageable {}", pageable);
        log.info("sortBy {}", sortBy);
        if (sortBy != null) {
            if (desc != null)
                pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                        Sort.by(sortBy).descending());
            else
                pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                        Sort.by(sortBy).ascending());
        }
        Page<ProblemEntity> contestProblemPage = problemTestCaseService.getContestProblemPaging(pageable);
        return ResponseEntity.status(200).body(contestProblemPage);
    }

    @PostMapping("/ide/{computerLanguage}")
    public ResponseEntity<?> runCode(@PathVariable("computerLanguage") String computerLanguage,
            @RequestBody ModelRunCodeFromIDE modelRunCodeFromIDE, Principal principal) throws Exception {
        String response = null;
        response = problemTestCaseService.executableIDECode(modelRunCodeFromIDE, principal.getName(), computerLanguage);
        ModelRunCodeFromIDEOutput modelRunCodeFromIDEOutput = new ModelRunCodeFromIDEOutput();
        modelRunCodeFromIDEOutput.setOutput(response);
        return ResponseEntity.status(200).body(modelRunCodeFromIDEOutput);
    }

    @GetMapping("/problem-details/{problemId}")
    public ResponseEntity<?> getProblemDetails(@PathVariable("problemId") String problemId) throws Exception {
        log.info("getProblemDetails problemId ", problemId);
        ModelCreateContestProblemResponse problemResponse = problemTestCaseService.getContestProblem(problemId);
        return ResponseEntity.status(200).body(problemResponse);
    }

    @GetMapping("/get-problem-detail-view-by-student/{problemId}")
    public ResponseEntity<?> getProblemDetailViewByStudent(Principal principal,
            @PathVariable("problemId") String problemId) {
        try {
            ModelCreateContestProblemResponse problemEntity = problemTestCaseService.getContestProblem(problemId);
            ModelStudentViewProblemDetail model = new ModelStudentViewProblemDetail();
            model.setProblemStatement(problemEntity.getProblemDescription());
            model.setProblemName(problemEntity.getProblemName());
            return ResponseEntity.ok().body(model);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok().body("NOTFOUND");
    }

    @GetMapping("/get-problem-detail-view-by-manager/{problemId}")
    public ResponseEntity<?> getProblemDetailViewByManager(Principal principal, @PathVariable String problemId) {
        try {
            ModelCreateContestProblemResponse problemEntity = problemTestCaseService.getContestProblem(problemId);
            ModelStudentViewProblemDetail model = new ModelStudentViewProblemDetail();
            model.setProblemStatement(problemEntity.getProblemDescription());
            model.setProblemName(problemEntity.getProblemName());
            model.setCreatedStamp(problemEntity.getCreatedAt());
            model.setAttachment(problemEntity.getAttachment());
            model.setAttachmentNames(problemEntity.getAttachmentNames());
            PersonModel person = userService.findPersonByUserLoginId(problemEntity.getUserId());
            model.setCreatedByUserFullName(person.getFullName());
            return ResponseEntity.ok().body(model);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok().body("NOTFOUND");

    }

    @GetMapping("/get-problem-detail-view-by-student-in-contest/{problemId}/{contestId}")
    public ResponseEntity<?> getProblemDetailViewByStudent(Principal principal,
            @PathVariable("problemId") String problemId, @PathVariable("contestId") String contestId) {
        try {
            ContestEntity contestEntity = contestRepo.findContestByContestId(contestId);
            ContestProblem cp = contestProblemRepo.findByContestIdAndProblemId(contestId, problemId);
            if(cp == null){
                return ResponseEntity.ok().body("NOTFOUND");
            }
            ModelCreateContestProblemResponse problemEntity = problemTestCaseService.getContestProblem(problemId);
            ModelStudentViewProblemDetail model = new ModelStudentViewProblemDetail();
            if (contestEntity.getProblemDescriptionViewType() != null &&
                    contestEntity.getProblemDescriptionViewType()
                            .equals(ContestEntity.CONTEST_PROBLEM_DESCRIPTION_VIEW_TYPE_HIDDEN))
                model.setProblemStatement(" ");
            else
                model.setProblemStatement(problemEntity.getProblemDescription());

            model.setSubmissionMode(cp.getSubmissionMode());
            model.setProblemName(problemEntity.getProblemName());
            model.setAttachment(problemEntity.getAttachment());
            model.setAttachmentNames(problemEntity.getAttachmentNames());
            return ResponseEntity.ok().body(model);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok().body("NOTFOUND");
    }

    @PostMapping("/update-problem-detail/{problemId}")
    public ResponseEntity<?> updateProblemDetails(
            @PathVariable("problemId") String problemId, Principal principal,
            @RequestParam("ModelUpdateContestProblem") String json, @RequestParam("files") MultipartFile[] files)
        throws Exception {
        log.info("updateProblemDetails problemId {}", problemId);
        ProblemEntity problemResponse = problemTestCaseService.updateContestProblem(problemId, principal.getName(), json, files);
        return ResponseEntity.status(HttpStatus.OK).body(problemResponse);
    }

    @PostMapping("/problem-detail-run-code/{problemId}")
    public ResponseEntity<?> problemDetailsRunCode(@PathVariable("problemId") String problemId,
            @RequestBody ModelProblemDetailRunCode modelProblemDetailRunCode, Principal principal) throws Exception {
        ModelProblemDetailRunCodeResponse resp = problemTestCaseService.problemDetailRunCode(problemId,
                modelProblemDetailRunCode, principal.getName());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/check-compile")
    public ResponseEntity<?> checkCompile(@RequestBody ModelCheckCompile modelCheckCompile, Principal principal)
            throws Exception {
        ModelCheckCompileResponse resp = problemTestCaseService.checkCompile(modelCheckCompile, principal.getName());
        return ResponseEntity.status(200).body(resp);
    }

    @PostMapping("/save-test-case/{problemId}")
    public ResponseEntity<?> saveTestCase(@PathVariable("problemId") String problemId,
            @RequestBody ModelSaveTestcase modelSaveTestcase) {
        TestCaseEntity testCaseEntity = problemTestCaseService.saveTestCase(problemId, modelSaveTestcase);
        return ResponseEntity.status(200).body(testCaseEntity);
    }

    @PostMapping("/problem-details-submission/{problemId}")
    public ResponseEntity<?> problemDetailsSubmission(@PathVariable("problemId") String problemId,
            @RequestBody ModelProblemDetailSubmission modelProblemDetailSubmission, Principal principal)
            throws Exception {
        log.info("problemDetailsSubmission {}", problemId);
        ModelContestSubmissionResponse response = problemTestCaseService
                .problemDetailSubmission(modelProblemDetailSubmission, problemId, principal.getName());
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/get-all-problem-submission-by-user/{problemId}")
    public ResponseEntity<?> getAllProblemSubmissionByUser(@PathVariable("problemId") String problemId,
            Principal principal) throws Exception {
        ListProblemSubmissionResponse listProblemSubmissionResponse = problemTestCaseService
                .getListProblemSubmissionResponse(problemId, principal.getName());
        return ResponseEntity.status(200).body(listProblemSubmissionResponse);
    }

    @GetMapping("/get-problem-submission/{id}")
    public ResponseEntity<?> getProblemSubmissionById(@PathVariable("id") UUID id, Principal principal)
            throws MiniLeetCodeException {
        log.info("getProblemSubmissionById id {}", id);
        ModelProblemSubmissionDetailResponse modelProblemSubmissionDetailResponse = problemTestCaseService
                .findProblemSubmissionById(id, principal.getName());
        return ResponseEntity.status(200).body(modelProblemSubmissionDetailResponse);
    }

    @GetMapping("/add-admin-to-manager-all-contest")
    public ResponseEntity<?> addAdminToManagerAndParticipantAllContest(Principal principal) {
        int cnt = problemTestCaseService.addAdminToManagerAndParticipantAllContest();
        log.info("addAdminToManagerAndParticipantAllContest, cnt = " + cnt);
        return ResponseEntity.ok().body(cnt);
    }

    @PostMapping("/create-contest")
    public ResponseEntity<?> createContest(@RequestBody ModelCreateContest modelCreateContest, Principal principal)
            throws Exception {
        log.info("createContest {}", modelCreateContest);
        problemTestCaseService.createContest(modelCreateContest, principal.getName());
        return ResponseEntity.status(200).body(null);
    }

    @PostMapping("/edit-contest/{contestId}")
    public ResponseEntity<?> editContest(@RequestBody ModelUpdateContest modelUpdateContest, Principal principal,
            @PathVariable("contestId") String contestId) throws Exception {
        log.info("edit contest modelUpdateContest {}", modelUpdateContest);

        problemTestCaseService.updateContest(modelUpdateContest, principal.getName(), contestId);
        ModelGetContestDetailResponse runningContest = runningContests.get(contestId);
        if (runningContest != null) {
            removeContestFromCache(contestId);
            if (modelUpdateContest.getStatusId().equals(ContestEntity.CONTEST_STATUS_RUNNING)) {
                log.info("updateContest, found contest " + contestId + " is running in cache --> remove it");
                // remove active contest from runningContests
                // removeContestFromCache(contestId);

                // RELOAD Contest and Put into the cache
                log.info("editContest, status = RUNNING -> RELOAD from DB and put into cache");
                runningContest = problemTestCaseService.getContestDetailByContestId(contestId);
                if (runningContest != null)
                    checkAndAddRunningContest(runningContest);
            }
        }
        return ResponseEntity.status(200).body(null);
    }

    synchronized static void removeContestFromCache(String contestId) {
        log.info("removeContestFromCache synchronized remove from cache contestId " + contestId);
        runningContests.remove(contestId);
    }

    @GetMapping("/get-list-roles-contest")
    public ResponseEntity<?> getListRolesContest() {
        List<String> L = UserRegistrationContestEntity.getListRoles();
        return ResponseEntity.ok().body(L);
    }

    @GetMapping("/get-my-contest-by-role")
    public ResponseEntity<?> getMyContestByRole(Principal principal) {
        String userLoginId = principal.getName();
        log.info("getMyContestByRole, userLoginId = " + userLoginId);
        List<ModelContestByRoleResponse> modelContestByRoleResponses = problemTestCaseService
                .getContestsByRoleOfUser(userLoginId);
        return ResponseEntity.ok().body(modelContestByRoleResponses);
    }

    @GetMapping("/get-contest-paging")
    public ResponseEntity<?> getContestPaging(Pageable pageable, @Param("sortBy") String sortBy) {
        log.info("getContestPaging sortBy {} pageable {}", sortBy, pageable);
        if (sortBy != null) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(sortBy));
        } else {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                    Sort.by("createdAt").ascending());
        }
        ModelGetContestPageResponse modelGetContestPageResponse = problemTestCaseService.getContestPaging(pageable);
        return ResponseEntity.status(200).body(modelGetContestPageResponse);
    }

    @GetMapping("/get-contest-detail/{contestId}")
    public ResponseEntity<?> getContestDetail(@PathVariable("contestId") String contestId, Principal principal) {
        log.info("getContestDetail constestid {}", contestId);
        ModelGetContestDetailResponse response = problemTestCaseService.getContestDetailByContestIdAndTeacher(contestId,
                principal.getName());
        return ResponseEntity.status(200).body(response);
    }

    @PostMapping("/update-contest-submission-source-code")
    public ResponseEntity<?> updateContestSubmisionSourceCode(Principal principal,
            @RequestBody ModelUpdateContestSubmission input) {
        log.info("updateContestSubmisionSourceCode, new source code = " + input.getModifiedSourceCodeSubmitted());
        ContestSubmissionEntity sub = problemTestCaseService.updateContestSubmissionSourceCode(input);
        return ResponseEntity.ok().body(sub);
    }

    @PostMapping("/get-code-similarity")
    public ResponseEntity<?> getCodeSimilarity(Principal principal, @RequestBody ModelGetCodeSimilarityParams input) {
        // String contestId = input.getContestId();
        // String userId = input.getUserId();
        // String problemId = input.getProblemId();
        // List<CodePlagiarism> codePlagiarism =
        // problemTestCaseService.findAllByContestId(contestId);
        List<CodePlagiarism> codePlagiarism = problemTestCaseService.findAllBy(input);
        return ResponseEntity.ok().body(codePlagiarism);
    }

    @PostMapping("/get-code-similarity-cluster")
    public ResponseEntity<?> getCodeSimilarityCluster(Principal principal,
            @RequestBody ModelGetCodeSimilarityParams input) {
        List<ModelSimilarityClusterOutput> res = problemTestCaseService.computeSimilarityClusters(input);
        return ResponseEntity.ok().body(res);
    }

    @PostMapping("/check-code-similarity/{contestId}")
    public ResponseEntity<?> checkCodeSimilarity(Principal principal, @RequestBody ModelCheckSimilarityInput I,
            @PathVariable String contestId) {
        log.info("checkCodeSimilarity, contestId = " + contestId);
        ModelCodeSimilarityOutput res = problemTestCaseService.checkSimilarity(contestId, I);
        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/get-contest-detail-solving/{contestId}")
    public ResponseEntity<?> getContestDetailSolving(@PathVariable("contestId") String contestId, Principal principal)
            throws MiniLeetCodeException {
        log.info("getContestDetail constestid {}", contestId);
        ModelGetContestDetailResponse response = null;
        // ModelGetContestDetailResponse response =
        // problemTestCaseService.getContestSolvingDetailByContestId(contestId,
        // principal.getName());

        ContestEntity contestEntity = contestRepo.findContestByContestId(contestId);
        if (!contestEntity.getStatusId().equals(ContestEntity.CONTEST_STATUS_RUNNING)) {
            response = ModelGetContestDetailResponse.builder()
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
            return ResponseEntity.status(200).body(response);
        }
        // USE cache
        /*
         * for(ModelGetContestDetailResponse res: runningContests){
         * if(res.getContestId().equals(contestId)){
         * log.
         * info("getContestDetail constestid {} use cache, found a running contest!!!",
         * contestId);
         * response = res; break;
         * }
         * }
         */
        if (contestEntity.getUseCacheContestProblem() != null &&
                contestEntity.getUseCacheContestProblem().equals(ContestEntity.USE_CACHE_CONTEST_PROBLEM_YES)) {
            response = runningContests.get(contestId);
            if (response == null) {
                // load from DB and store in cache
                log.info("getContestDetail constestid " + contestId
                        + " USED_CACHE not found in the cache --> load from DB");
                response = problemTestCaseService.getContestSolvingDetailByContestId(contestId, principal.getName());
                if (response != null)
                    checkAndAddRunningContest(response);

            } else {
                log.info("getContestDetail constestid {} use cache, found a running contest in cache!!!", contestId);
            }
        } else {
            log.info("getContestDetail constestid {} NOT use cache -> load from DB", contestId);
            response = problemTestCaseService.getContestSolvingDetailByContestId(contestId, principal.getName());
        }
        return ResponseEntity.status(200).body(response);
    }

    synchronized static void checkAndAddRunningContest(ModelGetContestDetailResponse response) {
        if (runningContests.get(response.getContestId()) == null) {
            runningContests.put(response.getContestId(), response);
            log.info("getContestDetail constestid " + response.getContestId()
                    + " not found in the cache --> load from DB AND push successfully in cache");
        }
    }

    @Secured("ROLE_STUDENT")
    @PostMapping("/student-register-contest/{contestId}")
    public ResponseEntity<?> studentRegisterContest(@PathVariable("contestId") String contestId, Principal principal)
            throws MiniLeetCodeException {
        log.info("studentRegisterContest {}", contestId);
        ModelStudentRegisterContestResponse resp = problemTestCaseService.studentRegisterContest(contestId,
                principal.getName());
        return ResponseEntity.status(200).body(resp);
    }

    @Secured("ROLE_TEACHER")
    @GetMapping("/get-all-contests-paging-by-admin")
    public ResponseEntity<?> getAllContestPagingByAdmin(Principal principal, Pageable pageable,
            @Param("sortBy") String sortBy) {
        log.info("getContestPagingByUserCreate");
        if (sortBy != null) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(sortBy));
        } else {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                    Sort.by("createdAt").ascending());
        }
        ModelGetContestPageResponse resp = problemTestCaseService.getAllContestsPagingByAdmin(principal.getName(),
                pageable);
        return ResponseEntity.status(200).body(resp);
    }

    @Secured("ROLE_TEACHER")
    @GetMapping("/get-contest-paging-by-user-manager")
    public ResponseEntity<?> getContestPagingByUserManager(Principal principal, Pageable pageable,
            @Param("sortBy") String sortBy) {
        log.info("getContestPagingByUserCreate");
        if (sortBy != null) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(sortBy));
        } else {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                    Sort.by("createdAt").ascending());
        }
        ModelGetContestPageResponse resp = problemTestCaseService
                .getContestPagingByUserManagerContest(principal.getName(), pageable);
        return ResponseEntity.status(200).body(resp);
    }

    @Secured("ROLE_TEACHER")
    @GetMapping("/get-contest-by-user-role")
    public ResponseEntity<?> getContestPagingByUserRole(Principal principal) {
        String userId = principal.getName();
        List<ModelGetContestResponse> resp = problemTestCaseService
                .getContestByUserRole(principal.getName());
        return ResponseEntity.status(200).body(resp);
    }

    @Secured("ROLE_TEACHER")
    @GetMapping("/get-contest-paging-by-user-create")
    public ResponseEntity<?> getContestPagingByUserCreate(Principal principal, Pageable pageable,
            @Param("sortBy") String sortBy) {
        log.info("getContestPagingByUserCreate");
        if (sortBy != null) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(sortBy));
        } else {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                    Sort.by("createdAt").ascending());
        }
        ModelGetContestPageResponse resp = problemTestCaseService
                .getContestPagingByUserCreatedContest(principal.getName(), pageable);
        return ResponseEntity.status(200).body(resp);
    }

    @Secured("ROLE_TEACHER")
    @GetMapping("/get-user-register-successful-contest/{contestId}")
    public ResponseEntity<?> getUserRegisterSuccessfulContest(@PathVariable("contestId") String contestId,
            Pageable pageable) {
        log.info("get User Register Successful Contest ");
        ListModelUserRegisteredContestInfo resp = problemTestCaseService
                .getListUserRegisterContestSuccessfulPaging(pageable, contestId);
        return ResponseEntity.status(200).body(resp);
    }

    @Secured("ROLE_TEACHER")
    @GetMapping("/get-members-of-contest/{contestId}")
    public ResponseEntity<?> getMembersOfContest(Principal principal, @PathVariable String contestId) {
        List<ModelMemberOfContestResponse> res = problemTestCaseService.getListMemberOfContest(contestId);
        return ResponseEntity.ok().body(res);
    }

    @Secured("ROLE_TEACHER")
    @PostMapping("/remove-member-from-contest")
    public ResponseEntity<?> removeMemberFromContest(Principal principal,
            @RequestBody ModelRemoveMemberFromContestInput input) {
        boolean res = problemTestCaseService.removeMemberFromContest(input.getId());
        return ResponseEntity.ok().body(res);
    }

    @Secured("ROLE_TEACHER")
    @PostMapping("/forbid-member-from-submit-to-contest")
    public ResponseEntity<?> forbidMemberFromSubmitToContest(Principal principal,
            @RequestBody ModelRemoveMemberFromContestInput input) {
        boolean res = problemTestCaseService.forbidMemberFromSubmitToContest(input.getId());
        return ResponseEntity.ok().body(res);
    }

    @Secured("ROLE_TEACHER")
    @PostMapping("/update-permission-of-member-to-contest")
    public ResponseEntity<?> updatePermissionOfMemberToContest(Principal principal,
            @RequestBody ModelUpdatePermissionMemberToContestInput input) {
        boolean res = problemTestCaseService.updatePermissionMemberToContest(principal.getName(), input);
        return ResponseEntity.ok().body(res);
    }

    @Secured("ROLE_TEACHER")
    @GetMapping("/get-user-register-pending-contest/{contestId}")
    public ResponseEntity<?> getUserRegisterPendingContest(@PathVariable("contestId") String contestId,
            Pageable pageable, @Param("size") String size, @Param("page") String page) {
        log.info("get User Register Pending Contest pageable {} size {} page {} contest id {}", pageable, size, page,
                contestId);
        ListModelUserRegisteredContestInfo resp = problemTestCaseService
                .getListUserRegisterContestPendingPaging(pageable, contestId);
        return ResponseEntity.status(200).body(resp);
    }

    @Secured("ROLE_TEACHER")
    @GetMapping("/get-pending-registered-users-of-contest/{contestId}")
    public ResponseEntity<?> getPendingRegisteredUserOfContest(Principal principal, @PathVariable String contestId) {
        List<ModelMemberOfContestResponse> res = problemTestCaseService.getPendingRegisteredUsersOfContest(contestId);
        return ResponseEntity.ok().body(res);
    }

    @Secured("ROLE_TEACHER")
    @GetMapping("/search-user/{contestId}")
    public ResponseEntity<?> searchUser(@PathVariable("contestId") String contestId, Pageable pageable,
            @Param("keyword") String keyword) {
        if (keyword == null) {
            keyword = "";
        }
        ListModelUserRegisteredContestInfo resp = problemTestCaseService.searchUser(pageable, contestId, keyword);
        return ResponseEntity.status(200).body(resp);

    }

    @Secured("ROLE_TEACHER")
    @PostMapping("/techer-manager-student-register-contest")
    public ResponseEntity<?> teacherManagerStudentRegisterContest(Principal principal,
            @RequestBody ModelTeacherManageStudentRegisterContest request) throws MiniLeetCodeException {
        log.info("teacherManagerStudentRegisterContest");
        problemTestCaseService.teacherManageStudentRegisterContest(principal.getName(), request);
        return ResponseEntity.status(200).body(null);
    }

    @Secured("ROLE_TEACHER")
    @PostMapping("/approve-registered-user-2-contest")
    public ResponseEntity<?> approveRegisteredUser2Contest(Principal principal,
            @RequestBody ModelApproveRegisterUser2ContestInput input) {
        try {
            boolean ok = problemTestCaseService.approveRegisteredUser2Contest(principal.getName(), input);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok().body("");
        }
        return ResponseEntity.ok().body(true);
    }

    @Secured("ROLE_TEACHER")
    @PostMapping("/teacher-manager-all-student-register-contest")
    public ResponseEntity<?> teacherManagerAllStudentRegisterContest(Principal principal,
            @RequestBody ModelTeacherManageStudentRegisterContest request) throws MiniLeetCodeException {
        log.info("teacherManagerAllStudentRegisterContest");
        List<UserLogin> users = userService.getAllUserLogins();
        int cnt = 0;
        int i = 0;
        for (UserLogin u : users) {
            i++;
            request.setUserId(u.getUserLoginId());
            cnt += problemTestCaseService.teacherManageStudentRegisterContest(principal.getName(), request);
            log.info(
                    "teacherManagerAllStudentRegisterContest finished " + i + "/" + users.size() + " processed " + cnt);
        }
        return ResponseEntity.status(200).body(cnt);
    }

    @GetMapping("/get-contest-registered-student")
    public ResponseEntity<?> getContestRegisteredStudent(Principal principal) {
        ModelGetContestPageResponse res = problemTestCaseService.getRegisteredContestsByUser(principal.getName());
        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/get-contest-paging-registered")
    public ResponseEntity<?> getContestRegisteredByStudentPaging(Pageable pageable, @Param("sortBy") String sortBy,
            Principal principal) {
        log.info("getContestRegisteredByStudentPaging sortBy {} pageable {}", sortBy, pageable);
        if (sortBy != null) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(sortBy));
        } else {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                    Sort.by("createdAt").ascending());
        }
        ModelGetContestPageResponse modelGetContestPageResponse = problemTestCaseService
                .getRegisteredContestByUser(pageable, principal.getName());
        return ResponseEntity.status(200).body(modelGetContestPageResponse);
    }

    @GetMapping("/get-contest-paging-not-registered")
    public ResponseEntity<?> getContestNotRegisteredByStudentPaging(Pageable pageable, @Param("sortBy") String sortBy,
            Principal principal) {
        log.info("getContestRegisteredByStudentPaging sortBy {} pageable {}", sortBy, pageable);
        if (sortBy != null) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(sortBy));
        } else {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                    Sort.by("createdAt").ascending());
        }
        ModelGetContestPageResponse modelGetContestPageResponse = problemTestCaseService
                .getNotRegisteredContestByUser(pageable, principal.getName());
        return ResponseEntity.status(200).body(modelGetContestPageResponse);
    }

    @PostMapping("/contest-submit-problem")
    public ResponseEntity<?> contestSubmitProblem(@RequestBody ModelContestSubmission request, Principal principal)
            throws Exception {
        log.info("/contest-submit-problem");
        // ModelContestSubmissionResponse resp =
        // problemTestCaseService.submitContestProblem(request, principal.getName());
        // modified by PQD, process testcase by testcase
        ModelContestSubmissionResponse resp = problemTestCaseService.submitContestProblemTestCaseByTestCase(request,
                principal.getName());

        log.info("resp {}", resp);
        return ResponseEntity.status(200).body(resp);
    }

    @GetMapping("/get-contest-problem-submission-detail-by-testcase-of-a-submission/{submissionId}")
    public ResponseEntity<?> getContestProblemSubmissionDetailByTestCaseOfASubmission(Principal principal,
            @PathVariable UUID submissionId) {
        List<ModelProblemSubmissionDetailByTestCaseResponse> retLst = problemTestCaseService
                .getContestProblemSubmissionDetailByTestCaseOfASubmission(submissionId);
        return ResponseEntity.ok().body(retLst);
    }

    @GetMapping("/get-contest-problem-submission-detail-by-testcase-of-a-submission-viewed-by-participant/{submissionId}")
    public ResponseEntity<?> getContestProblemSubmissionDetailByTestCaseOfASubmissionViewedByParticipant(
            Principal principal, @PathVariable UUID submissionId) {
        List<ModelProblemSubmissionDetailByTestCaseResponse> retLst = problemTestCaseService
                .getContestProblemSubmissionDetailByTestCaseOfASubmissionViewedByParticipant(submissionId);
        return ResponseEntity.ok().body(retLst);
    }

    @GetMapping("/get-contest-problem-submission-detail-by-testcase")
    public ResponseEntity<?> getContestProblemSubmissionDetailByTestCase(Principal principal,
            @RequestParam int page, int size, Pageable pageable) {
        log.info("getContestProblemSubmissionDetailByTestCase, page = " + page + " size = " + size);
        Pageable sortedByCreatedStampDsc = PageRequest.of(page, size, Sort.by("createdStamp").descending());

        Page<ModelProblemSubmissionDetailByTestCaseResponse> lst = problemTestCaseService
                .getContestProblemSubmissionDetailByTestCase(sortedByCreatedStampDsc);

        return ResponseEntity.ok().body(lst);
    }

    @PostMapping("/upload-update-test-case/{testCaseId}")
    public ResponseEntity<?> uploadUpdateTestCase(Principal principal,
            @PathVariable String testCaseId,
            @RequestParam("inputJson") String inputJson,
            @RequestParam("file") MultipartFile file) {

        Gson gson = new Gson();
        ModelProgrammingContestUploadTestCase modelUploadTestCase = gson.fromJson(inputJson,
                ModelProgrammingContestUploadTestCase.class);
        String problemId = modelUploadTestCase.getProblemId();
        UUID testCaseUUID = UUID.fromString(testCaseId);
        log.info("uploadUpdateTestCase, problemId = " + problemId + " tesCaseId = " + testCaseId + " testCaseUUID = "
                + testCaseUUID);
        String testCase = "";
        ModelUploadTestCaseOutput res = new ModelUploadTestCaseOutput();
        if (file != null) {
            try {
                InputStream inputStream = file.getInputStream();
                Scanner in = new Scanner(inputStream);
                while (in.hasNext()) {
                    String line = in.nextLine();
                    testCase += line + "\n";
                    // System.out.println("contestSubmitProblemViaUploadFile: read line: " + line);
                }
                in.close();
                log.info("uploadUpdateTestCase, testCase not null, testCase = " + testCase.length());
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            log.info("uploadUpdateTestCase, multipart file is null");
        }
        // res = problemTestCaseService.addTestCase(testCase, modelUploadTestCase,
        // principal.getName());
        res = problemTestCaseService.uploadUpdateTestCase(testCaseUUID, testCase, modelUploadTestCase,
                principal.getName());
        return ResponseEntity.ok().body(res);

        // res.setStatus("FAILURE");
        // res.setMessage("Exception!!");
        // return ResponseEntity.ok().body(res);
    }

    @PostMapping("/update-test-case-without-file/{testCaseId}")
    public ResponseEntity<?> uploadUpdateTestCaseWithoutFile(Principal principal,
            @PathVariable String testCaseId,
            @RequestParam("inputJson") String inputJson) {

        Gson gson = new Gson();
        ModelProgrammingContestUploadTestCase modelUploadTestCase = gson.fromJson(inputJson,
                ModelProgrammingContestUploadTestCase.class);
        String problemId = modelUploadTestCase.getProblemId();
        UUID testCaseUUID = UUID.fromString(testCaseId);
        log.info("uploadUpdateTestCaseWithoutFile, problemId = " + problemId + " tesCaseId = " + testCaseId
                + " testCaseUUID = " + testCaseUUID);
        ModelUploadTestCaseOutput res = new ModelUploadTestCaseOutput();
        // res = problemTestCaseService.addTestCase(testCase, modelUploadTestCase,
        // principal.getName());
        res = problemTestCaseService.uploadUpdateTestCase(testCaseUUID, null, modelUploadTestCase, principal.getName());
        return ResponseEntity.ok().body(res);

        // res.setStatus("FAILURE");
        // res.setMessage("Exception!!");
        // return ResponseEntity.ok().body(res);
    }

    @PostMapping("/upload-test-case")
    public ResponseEntity<?> uploadTestCase(Principal principal,
            @RequestParam("inputJson") String inputJson,
            @RequestParam("file") MultipartFile file) {
        Gson gson = new Gson();
        ModelProgrammingContestUploadTestCase modelUploadTestCase = gson.fromJson(inputJson,
                ModelProgrammingContestUploadTestCase.class);
        String problemId = modelUploadTestCase.getProblemId();
        log.info("uploadTestCase, problemId = " + problemId);
        String testCase = "";
        ModelUploadTestCaseOutput res = new ModelUploadTestCaseOutput();
        try {
            InputStream inputStream = file.getInputStream();
            Scanner in = new Scanner(inputStream);
            while (in.hasNext()) {
                String line = in.nextLine();
                testCase += line + "\n";
                // System.out.println("contestSubmitProblemViaUploadFile: read line: " + line);
            }
            in.close();
            res = problemTestCaseService.addTestCase(testCase, modelUploadTestCase, principal.getName());
            return ResponseEntity.ok().body(res);
        } catch (Exception e) {
            e.printStackTrace();
        }
        res.setStatus("FAILURE");
        res.setMessage("Exception!!");
        return ResponseEntity.ok().body(res);
    }

    @PostMapping("/contest-submit-problem-via-upload-file-v3")
    public ResponseEntity<?> contestSubmitProblemViaUploadFileV3(
        Principal principal,
        @RequestParam("inputJson") String inputJson,
        @RequestParam("file") MultipartFile file
    ) {
        Gson gson = new Gson();
        ModelContestSubmitProgramViaUploadFile model = gson.fromJson(
            inputJson,
            ModelContestSubmitProgramViaUploadFile.class);
        ContestEntity contestEntity = contestRepo.findContestByContestId(model.getContestId());
        if (contestEntity.getJudgeMode() != null &&
            contestEntity.getJudgeMode().equals(ContestEntity.ASYNCHRONOUS_JUDGE_MODE_QUEUE)) {
            log.info("contestSubmitProblemViaUploadFileV3, mode using queue");
            return contestSubmitProblemViaUploadFileV2(principal, inputJson, file);
        }
        log.info("contestSubmitProblemViaUploadFileV3, mode synchronous, NOT using queue");
        return contestSubmitProblemViaUploadFile(principal, inputJson, file);
    }

    @PostMapping("/contest-submit-problem-via-upload-file")
    public ResponseEntity<?> contestSubmitProblemViaUploadFile(Principal principal,
            @RequestParam("inputJson") String inputJson,
            @RequestParam("file") MultipartFile file) {
        //log.info("contestSubmitProblemViaUploadFile, inputJson = " + inputJson);
        Gson gson = new Gson();
        ModelContestSubmitProgramViaUploadFile model = gson.fromJson(inputJson,
                ModelContestSubmitProgramViaUploadFile.class);
        ContestEntity contestEntity = contestRepo.findContestByContestId(model.getContestId());
        ContestProblem cp = contestProblemRepo.findByContestIdAndProblemId(model.getContestId(), model.getProblemId());
        Date currentDate = new Date();
        int timeTest = ((int) (currentDate.getTime() - contestEntity.getStartedAt().getTime())) / (60 * 1000); // minutes
        // System.out.println(currentDate);
        // System.out.println(testStartDate);
        // System.out.println(timeTest);
        // System.out.println(test.getDuration());
        //log.info("contestSubmitProblemViaUploadFile, currentDate = " + currentDate + ", contest started at"
        //        + contestEntity.getStartedAt()
        //        + " timeTest = " + timeTest + " contestSolvingTime = " + contestEntity.getContestSolvingTime());

        // if (timeTest > contestEntity.getContestSolvingTime()) {
        if (!contestEntity.getStatusId().equals(ContestEntity.CONTEST_STATUS_RUNNING)) {
            //log.info("contestSubmitProblemViaUploadFile, TIME OUT!!!!! currentDate = " + currentDate
            //        + ", contest started at" + contestEntity.getStartedAt()
            //        + " timeTest = " + timeTest + " contestSolvingTime = " +
             //       contestEntity.getContestSolvingTime());

            // return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(null);

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

        List<UserRegistrationContestEntity> userRegistrations = userRegistrationContestRepo
                .findUserRegistrationContestEntityByContestIdAndUserIdAndStatusAndRoleId(model.getContestId(),
                        principal.getName(), UserRegistrationContestEntity.STATUS_SUCCESSFUL,
                        UserRegistrationContestEntity.ROLE_PARTICIPANT);
        if (userRegistrations == null || userRegistrations.size() == 0) {
            ModelContestSubmissionResponse resp = ModelContestSubmissionResponse.builder()
                    .status("PARTICIPANT_NOT_APPROVED_OR_REGISTERED")
                    .message("Participant is not approved or not registered")
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
            //log.info("contestSubmitProblemViaUploadFile: Participant not approved or registered");
            return ResponseEntity.ok().body(resp);

        }

        for (UserRegistrationContestEntity u : userRegistrations) {
            if (u.getPermissionId() != null
                    && u.getPermissionId().equals(UserRegistrationContestEntity.PERMISSION_FORBIDDEN_SUBMIT)) {
                ModelContestSubmissionResponse resp = ModelContestSubmissionResponse.builder()
                        .status("PARTICIPANT_HAS_NOT_PERMISSION_TO_SUBMIT")
                        .message("Participant has not permission to submit")
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
                //log.info("contestSubmitProblemViaUploadFile: Participant has not permission to submit");
                return ResponseEntity.ok().body(resp);

            }
        }

        List<ContestSubmissionEntity> submissions = contestSubmissionRepo
                .findAllByContestIdAndUserIdAndProblemId(model.getContestId(), principal.getName(),
                        model.getProblemId());
        if (submissions.size() >= contestEntity.getMaxNumberSubmissions()) {
            ModelContestSubmissionResponse resp = ModelContestSubmissionResponse.builder()
                    .status("MAX_NUMBER_SUBMISSIONS_REACHED")
                    .message("Maximum Number of Submissions " + contestEntity.getMaxNumberSubmissions()
                            + " Reached! Cannot submit more")
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
            //log.info("contestSubmitProblemViaUploadFile: Maximum Number of Submissions "
            //        + contestEntity.getMaxNumberSubmissions() + " Reached! Cannot submit more");
            return ResponseEntity.ok().body(resp);
        }

        try {
            String source = "";
            InputStream inputStream = file.getInputStream();
            Scanner in = new Scanner(inputStream);
            while (in.hasNext()) {
                String line = in.nextLine();
                source += line + "\n";
                // System.out.println("contestSubmitProblemViaUploadFile: read line: " + line);
            }
            in.close();

            if (source.length() > contestEntity.getMaxSourceCodeLength()) {
                ModelContestSubmissionResponse resp = ModelContestSubmissionResponse.builder()
                        .status("MAX_SOURCE_CODE_LENGTH_VIOLATIONS")
                        .message("Max source code length violations " + source.length() + " > "
                                + contestEntity.getMaxSourceCodeLength() + " ")
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
                //log.info("contestSubmitProblemViaUploadFile: Max Source code Length violations " + source.length()
                //        + " > " + contestEntity.getMaxSourceCodeLength() + " --> Cannot submit more");
                return ResponseEntity.ok().body(resp);
            }
            ModelContestSubmission request = new ModelContestSubmission(model.getContestId(), model.getProblemId(),
                    source, model.getLanguage());
            ModelContestSubmissionResponse resp = null;
            if (contestEntity.getSubmissionActionType()
                    .equals(ContestEntity.CONTEST_SUBMISSION_ACTION_TYPE_STORE_AND_EXECUTE)) {
                if(cp != null && cp.getSubmissionMode() != null && cp.getSubmissionMode().equals(ContestProblem.SUBMISSION_MODE_SOLUTION_OUTPUT)){
                    //log.info("contestSubmitProblemViaUploadFile, mode submit output");
                    resp = problemTestCaseService.submitContestProblemStoreOnlyNotExecute(request, principal.getName());
                }else {
                    resp = problemTestCaseService.submitContestProblemTestCaseByTestCase(
                        request,
                        principal.getName());

                }
            } else {
                resp = problemTestCaseService.submitContestProblemStoreOnlyNotExecute(request, principal.getName());
            }
            //log.info("resp {}", resp);
            return ResponseEntity.status(200).body(resp);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok().body("OK");
    }

    @PostMapping("/contest-submit-problem-via-upload-file-v2")
    public ResponseEntity<?> contestSubmitProblemViaUploadFileV2(Principal principal,
            @RequestParam("inputJson") String inputJson,
            @RequestParam("file") MultipartFile file) {

        Gson gson = new Gson();
        ModelContestSubmitProgramViaUploadFile model = gson.fromJson(inputJson,
                ModelContestSubmitProgramViaUploadFile.class);
        ContestEntity contestEntity = contestRepo.findContestByContestId(model.getContestId());
        ContestProblem cp = contestProblemRepo.findByContestIdAndProblemId(model.getContestId(), model.getProblemId());

        if (!contestEntity.getStatusId().equals(ContestEntity.CONTEST_STATUS_RUNNING)) {
            ModelContestSubmissionResponse resp = buildSubmissionResponseTimeOut();
            return ResponseEntity.ok().body(resp);
        }

        List<UserRegistrationContestEntity> userRegistrations = userRegistrationContestRepo
                .findUserRegistrationContestEntityByContestIdAndUserIdAndStatusAndRoleId(model.getContestId(),
                        principal.getName(), UserRegistrationContestEntity.STATUS_SUCCESSFUL,
                        UserRegistrationContestEntity.ROLE_PARTICIPANT);
        if (userRegistrations == null || userRegistrations.size() == 0) {
            ModelContestSubmissionResponse resp = buildSubmissionResponseNotRegistered();
            return ResponseEntity.ok().body(resp);

        }

        for (UserRegistrationContestEntity u : userRegistrations) {
            if (u.getPermissionId() != null
                    && u.getPermissionId().equals(UserRegistrationContestEntity.PERMISSION_FORBIDDEN_SUBMIT)) {
                ModelContestSubmissionResponse resp = buildSubmissionResponseNoPermission();
                return ResponseEntity.ok().body(resp);
            }
        }

        int numOfSubmissions = contestSubmissionRepo
                .countAllByContestIdAndUserIdAndProblemId(model.getContestId(), principal.getName(), model.getProblemId());
        if (numOfSubmissions >= contestEntity.getMaxNumberSubmissions()) {
            ModelContestSubmissionResponse resp = buildSubmissionResponseReachMaxSubmission(contestEntity.getMaxNumberSubmissions());
            return ResponseEntity.ok().body(resp);
        }

        try {
            StringBuilder source = new StringBuilder();
            InputStream inputStream = file.getInputStream();
            Scanner in = new Scanner(inputStream);
            while (in.hasNext()) {
                String line = in.nextLine();
                source.append(line).append("\n");
            }
            in.close();

            if (source.length() > contestEntity.getMaxSourceCodeLength()) {
                ModelContestSubmissionResponse resp = buildSubmissionResponseReachMaxSourceLength(source.length(), contestEntity.getMaxSourceCodeLength());
                return ResponseEntity.ok().body(resp);
            }
            ModelContestSubmission request = new ModelContestSubmission(model.getContestId(), model.getProblemId(),
                                                                        source.toString(), model.getLanguage());
            ModelContestSubmissionResponse resp = null;
            if (contestEntity.getSubmissionActionType()
                    .equals(ContestEntity.CONTEST_SUBMISSION_ACTION_TYPE_STORE_AND_EXECUTE)) {
                if (cp != null && cp.getSubmissionMode() != null && cp.getSubmissionMode().equals(ContestProblem.SUBMISSION_MODE_SOLUTION_OUTPUT)){
                    resp = problemTestCaseService.submitContestProblemStoreOnlyNotExecute(request, principal.getName());
                }else {
                    problemTestCaseService.submitContestProblemTestCaseByTestCaseWithFile(request, principal.getName());
                }
            } else {
                resp = problemTestCaseService.submitContestProblemStoreOnlyNotExecute(request, principal.getName());
            }

            return ResponseEntity.status(200).body(resp);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok().body("OK");
    }

    private ModelContestSubmissionResponse buildSubmissionResponseTimeOut() {
        return ModelContestSubmissionResponse.builder()
                                             .status("TIME_OUT")
                                             .testCasePass("0")
                                             .runtime(0L)
                                             .memoryUsage((float) 0)
                                             .problemName("")
                                             .contestSubmissionID(null)
                                             .submittedAt(null)
                                             .score(0)
                                             .numberTestCasePassed(0)
                                             .totalNumberTestCase(0)
                                             .build();
    }
    private ModelContestSubmissionResponse buildSubmissionResponseNotRegistered() {
        return ModelContestSubmissionResponse.builder()
                                             .status("TIME_OUT")
                                             .testCasePass("0")
                                             .runtime(0L)
                                             .memoryUsage((float) 0)
                                             .problemName("")
                                             .contestSubmissionID(null)
                                             .submittedAt(null)
                                             .score(0)
                                             .numberTestCasePassed(0)
                                             .totalNumberTestCase(0)
                                             .build();
    }
    private ModelContestSubmissionResponse buildSubmissionResponseNoPermission() {
        return ModelContestSubmissionResponse.builder()
                                             .status("PARTICIPANT_HAS_NOT_PERMISSION_TO_SUBMIT")
                                             .message("Participant has no permission to submit")
                                             .testCasePass("0")
                                             .runtime(0L)
                                             .memoryUsage((float) 0)
                                             .problemName("")
                                             .contestSubmissionID(null)
                                             .submittedAt(null)
                                             .score(0)
                                             .numberTestCasePassed(0)
                                             .totalNumberTestCase(0)
                                             .build();
    }
    private ModelContestSubmissionResponse buildSubmissionResponseReachMaxSubmission(int maxNumberSubmission) {
        return ModelContestSubmissionResponse.builder()
                                             .status("MAX_NUMBER_SUBMISSIONS_REACHED")
                                             .message("Maximum Number of Submissions " + maxNumberSubmission
                                                      + " Reached! Cannot submit more")
                                             .testCasePass("0")
                                             .runtime(0L)
                                             .memoryUsage((float) 0)
                                             .problemName("")
                                             .contestSubmissionID(null)
                                             .submittedAt(null)
                                             .score(0)
                                             .numberTestCasePassed(0)
                                             .totalNumberTestCase(0)
                                             .build();
    }
    private ModelContestSubmissionResponse buildSubmissionResponseReachMaxSourceLength(int sourceLength, int maxLength) {
        return ModelContestSubmissionResponse.builder()
                                             .status("MAX_SOURCE_CODE_LENGTH_VIOLATIONS")
                                             .message("Max source code length violations " + sourceLength + " exceeded "
                                                      + maxLength + " ")
                                             .testCasePass("0")
                                             .runtime(0L)
                                             .memoryUsage((float) 0)
                                             .problemName("")
                                             .contestSubmissionID(null)
                                             .submittedAt(null)
                                             .score(0)
                                             .numberTestCasePassed(0)
                                             .totalNumberTestCase(0)
                                             .build();
    }

    @GetMapping("/test-jmeter")
    public ResponseEntity<?> testJmeter(@RequestParam String s) {
        s = s.concat("Hello");
        return ResponseEntity.ok().body(s);
    }

    @GetMapping("/evaluate-submission/{submissionId}")
    public ResponseEntity<?> evaluateSubmission(Principal principal, @PathVariable UUID submissionId) {
        ModelContestSubmissionResponse res = problemTestCaseService.evaluateSubmission(submissionId);
        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/evaluate-batch-submission-of-contest/{contestId}")
    public ResponseEntity<?> evaluateBatchSubmissionContest(Principal principal, @PathVariable String contestId) {
        log.info("evaluateBatchSubmissionContest, contestId = " + contestId);
        // ModelEvaluateBatchSubmissionResponse res =
        // problemTestCaseService.evaluateBatchSubmissionContest(contestId);
        ModelEvaluateBatchSubmissionResponse res = problemTestCaseService.reJudgeAllSubmissionsOfContest(contestId);
        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/evaluate-batch-not-evaluated-submission-of-contest/{contestId}")
    public ResponseEntity<?> evaluateBatchNotEvaluatedSubmissionContest(Principal principal,
            @PathVariable String contestId) {
        log.info("evaluateBatchNotEvaluatedSubmissionContest, contestId = " + contestId);
        // ModelEvaluateBatchSubmissionResponse res =
        // problemTestCaseService.evaluateBatchSubmissionContest(contestId);
        ModelEvaluateBatchSubmissionResponse res = problemTestCaseService.judgeAllSubmissionsOfContest(contestId);
        return ResponseEntity.ok().body(res);
    }
    @PostMapping("/submit-solution-output-of-testcase")
    public ResponseEntity<?> submitSolutionOutputOfATestCase(Principal principale,
                                                             @RequestParam("inputJson") String inputJson,
                                                             @RequestParam("file") MultipartFile file){
        Gson gson = new Gson();
        ModelSubmitSolutionOutputOfATestCase model = gson.fromJson(inputJson, ModelSubmitSolutionOutputOfATestCase.class);
        try {
            String solutionOutput = "";
            InputStream inputStream = file.getInputStream();
            Scanner in = new Scanner(inputStream);
            while (in.hasNext()) {
                String line = in.nextLine();
                solutionOutput += line + "\n";
                //System.out.println("submitSolutionOutputOfATestCase: read line: " + line);
            }
            in.close();
            ModelContestSubmissionResponse resp = problemTestCaseService.submitSolutionOutputOfATestCase(principale.getName(),
                                                                                                         solutionOutput,
                                                                                              model
                                                                                              );
            log.info("resp {}", resp);
            return ResponseEntity.status(200).body(resp);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok().body("OK");

    }
    @PostMapping("/submit-solution-output")
    public ResponseEntity<?> submitSolutionOutput(Principal principale,
            @RequestParam("inputJson") String inputJson,
            @RequestParam("file") MultipartFile file) {
        log.info("submitSolutionOutput, inputJson = " + inputJson);
        Gson gson = new Gson();
        ModelSubmitSolutionOutput model = gson.fromJson(inputJson, ModelSubmitSolutionOutput.class);
        try {
            String solutionOutput = "";
            InputStream inputStream = file.getInputStream();
            Scanner in = new Scanner(inputStream);
            while (in.hasNext()) {
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
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok().body("OK");
    }

    @PostMapping("/contest-submit-all")
    public ResponseEntity<?> contestSubmitAll(@RequestBody ModelContestSubmissionAll request, Principal principal) {
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

    @GetMapping("/get-ranking-contest-new/{contestId}")
    public ResponseEntity<?> getRankingContestNewVersion(@PathVariable("contestId") String contestId, Pageable pageable,
            @RequestParam Constants.GetPointForRankingType getPointForRankingType) {
        pageable = Pageable.unpaged();
        List<ContestSubmissionsByUser> page = problemTestCaseService.getRankingByContestIdNew(pageable, contestId,
                getPointForRankingType);
        // log.info("ranking page {}", page);
        return ResponseEntity.status(200).body(page);
    }

    @GetMapping("/get-ranking-contest/{contestId}")
    public ResponseEntity<?> getRankingContest(@PathVariable("contestId") String contestId, Pageable pageable) {
        log.info("getRankingContest page {}", pageable);
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("point").descending());
        Page<UserSubmissionContestResultNativeEntity> page = problemTestCaseService.getRankingByContestId(pageable,
                contestId);
        // log.info("ranking page {}", page);
        return ResponseEntity.status(200).body(page);
    }

    @PostMapping("/recalculate-ranking/{contestId}")
    public ResponseEntity<?> recalculateRanking(@PathVariable("contestId") String contestId) {
        log.info("/recalculate-ranking/ contestid {}", contestId);
        problemTestCaseService.calculateContestResult(contestId);
        return ResponseEntity.status(200).body(null);
    }

    @GetMapping("/get-problem-public-paging")
    public ResponseEntity<?> getProblemPublicPaging(Pageable pageable) {
        Page<ProblemEntity> page = problemTestCaseService.getPublicProblemPaging(pageable);
        return ResponseEntity.status(200).body(page);
    }

    @GetMapping("/get-test-case-list-by-problem/{problemId}")
    public ResponseEntity<?> getTestCaseListByProblem(@PathVariable("problemId") String problemId) {
        List<ModelGetTestCase> list = problemTestCaseService.getTestCaseByProblem(problemId);
        return ResponseEntity.status(200).body(list);
    }

    @GetMapping("/get-test-case-detail-short/{testCaseId}")
    public ResponseEntity<?> getTestCaseDetailShort(@PathVariable("testCaseId") UUID testCaseId)
            throws MiniLeetCodeException {
        ModelGetTestCaseDetail resp = problemTestCaseService.getTestCaseDetailShort(testCaseId);
        return ResponseEntity.status(200).body(resp);
    }
    @GetMapping("/get-test-case-detail/{testCaseId}")
    public ResponseEntity<?> getTestCaseDetail(@PathVariable("testCaseId") UUID testCaseId)
        throws MiniLeetCodeException {
        ModelGetTestCaseDetail resp = problemTestCaseService.getTestCaseDetail(testCaseId);
        return ResponseEntity.status(200).body(resp);
    }
    @PostMapping("/update-test-case/{testCaseId}")
    public ResponseEntity<?> updateDateTestCase(@PathVariable("testCaseId") UUID testCaseId,
            @RequestBody ModelSaveTestcase modelSaveTestcase) throws MiniLeetCodeException {
        problemTestCaseService.editTestCase(testCaseId, modelSaveTestcase);
        return ResponseEntity.status(200).body(null);
    }

    @PostMapping("/add-all-users-to-contest")
    public ResponseEntity<?> addAllUsersToContest(Principal principal,
            @RequestBody ModelAddUserToContest modelAddUserToContest) {
        int cnt = problemTestCaseService.addAllUsersToContest(modelAddUserToContest);
        return ResponseEntity.ok().body(cnt);
    }

    @PostMapping("/add-user-to-contest")
    public ResponseEntity<?> addUserContest(@RequestBody ModelAddUserToContest modelAddUserToContest) {
        problemTestCaseService.addUserToContest(modelAddUserToContest);
        return ResponseEntity.status(200).body(null);
    }

    @PostMapping("/delete-user-contest")
    public ResponseEntity<?> deleteUserFromContest(@RequestBody ModelAddUserToContest modelAddUserToContest)
            throws MiniLeetCodeException {
        problemTestCaseService.deleteUserContest(modelAddUserToContest);
        return ResponseEntity.status(200).body(null);
    }

    @GetMapping("/get-contests-using-a-problem/{problemId}")
    public ResponseEntity<?> getContestsUsingAProblem(Principal principal, @PathVariable String problemId) {
        List<ModelGetContestResponse> res = problemTestCaseService.getContestsUsingAProblem(problemId);
        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/get-contest-result-on-problem-of-a-user/{userLoginId}")
    public ResponseEntity<?> getContestResultOnProblemOfAUser(@PathVariable("userLoginId") String userLoginId,
            Pageable pageable) {
        log.info("getContestResultOnProblemOfAUser, user = " + userLoginId);
        List<ContestSubmission> lst = problemTestCaseService.getNewestSubmissionResults(userLoginId);

        return ResponseEntity.status(200).body(lst);
    }

    @GetMapping("/get-contest-submission-paging-of-a-user/{userLoginId}")
    public ResponseEntity<?> getContestSubmissionPagingOfAUser(@PathVariable("userLoginId") String userLoginId,
            Pageable pageable) {
        log.info("getContestSubmissionPagingOfAUser, user = " + userLoginId);
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("createdAt").descending());
        Page<ContestSubmission> page = problemTestCaseService.findContestSubmissionByUserLoginIdPaging(pageable,
                userLoginId);
        log.info("page {}", page);
        return ResponseEntity.status(200).body(page);
    }

    @GetMapping("/get-contest-submission-paging-of-a-user-and-contest/{contestId}")
    public ResponseEntity<?> getContestSubmissionPagingOfCurrentUser(Principal principal,
            @PathVariable String contestId, Pageable pageable) {
        log.info(
                "getContestSubmissionPagingOfCurrentUser, user = " + principal.getName() + " contestId = " + contestId);
        pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by("createdAt").descending());
        Page<ContestSubmission> page = problemTestCaseService
                .findContestSubmissionByUserLoginIdAndContestIdPaging(pageable, principal.getName(), contestId);
        log.info("page {}", page);
        return ResponseEntity.status(200).body(page);
    }

    @GetMapping("/get-contest-submission-paging/{contestId}")
    public ResponseEntity<?> getContestSubmissionPaging(@PathVariable("contestId") String contestId,
            Pageable pageable) {
        log.info("getContestSubmissionPaging, contestId = " + contestId);
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("createdAt").descending());
        Page<ContestSubmission> page = problemTestCaseService.findContestSubmissionByContestIdPaging(pageable,
                contestId);
        log.info("page {}", page);
        return ResponseEntity.status(200).body(page);
    }

    @GetMapping("/get-contest-not-evaluated-submission-paging/{contestId}")
    public ResponseEntity<?> getContestNotEvaluatedSubmissionPaging(@PathVariable("contestId") String contestId,
            Pageable pageable) {
        log.info("getContestNotEvaluatedSubmissionPaging, contestId = " + contestId);
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("createdAt").descending());
        Page<ContestSubmission> page = problemTestCaseService
                .findContestNotEvaluatedSubmissionByContestIdPaging(pageable, contestId);
        log.info("page {}", page);
        return ResponseEntity.status(200).body(page);
    }

    @GetMapping("/get-contest-submission-of-a-user-paging/{contestId}/{userId}")
    public ResponseEntity<?> getContestSubmissionOfAUserPaging(@PathVariable("contestId") String contestId,
            @PathVariable String userId, Pageable pageable) {
        log.info("getContestSubmissionPaging, contestId = " + contestId);
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("createdAt").descending());
        Page<ContestSubmission> page = problemTestCaseService
                .findContestSubmissionByUserLoginIdAndContestIdPaging(pageable, userId, contestId);
        log.info("page {}", page);
        return ResponseEntity.status(200).body(page);
    }

    @GetMapping("/get-contest-problem-submission-detail-viewed-by-participant/{submissionId}")
    public ResponseEntity<?> getContestSubmissionDetailViewedByParticipant(
            @PathVariable("submissionId") UUID submissionId) {
        log.info("get contest submission detail");
        ContestSubmissionEntity contestSubmission = problemTestCaseService.getContestSubmissionDetail(submissionId);
        return ResponseEntity.status(200).body(contestSubmission);
    }

    @GetMapping("/get-contest-infos-of-a-subsmission/{submissionId}")
    public ResponseEntity<?> getContestInfosOfASubmission(@PathVariable("submissionId") UUID submissionId) {
        ModelGetContestInfosOfSubmissionOutput res = problemTestCaseService.getContestInfosOfASubmission(submissionId);
        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/get-contest-problem-submission-detail-viewed-by-manager/{submissionId}")
    public ResponseEntity<?> getContestSubmissionDetailViewedByManager(
            @PathVariable("submissionId") UUID submissionId) {
        log.info("get contest submission detail");
        ContestSubmissionEntity contestSubmission = problemTestCaseService.getContestSubmissionDetail(submissionId);
        return ResponseEntity.status(200).body(contestSubmission);
    }

    // @DeleteMapping("/delete-contest/{contestId}")
    // public ResponseEntity<?> deleteContest(@PathVariable("contestId") String
    // contestId, Principal principal) throws MiniLeetCodeException {
    // log.info("delete-contest {}", contestId);
    // problemTestCaseService.deleteContest(contestId, principal.getName());
    // return ResponseEntity.status(HttpStatus.OK).body(null);
    // }
    //
    // @DeleteMapping("/delete-problem/{problemId}")
    // public ResponseEntity<?> deleteProblem(@PathVariable("problemId") String
    // problemId, Principal principal) throws MiniLeetCodeException {
    // log.info("delete-problem {}", problemId);
    // problemTestCaseService.deleteProblem(problemId, principal.getName());
    // return ResponseEntity.status(HttpStatus.OK).body(null);
    //
    // }

    @DeleteMapping("/delete-test-case/{testCaseId}")
    public ResponseEntity<?> deleteTestCase(@PathVariable("testCaseId") UUID testCaseId, Principal principal)
            throws MiniLeetCodeException {
        problemTestCaseService.deleteTestcase(testCaseId, principal.getName());
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    @GetMapping("/get-user-judged-problem-submission/{contestId}")
    public ResponseEntity<?> getUserJudgedProblemSubmission(@PathVariable String contestId) {
        List<ModelUserJudgedProblemSubmissionResponse> res = problemTestCaseService
                .getUserJudgedProblemSubmissions(contestId);
        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/get-roles-user-approved-notapproved-in-contest/{userId}/{contestId}")
    public ResponseEntity<?> getRolesUserParrovedNotApprovedInContest(Principal principal, @PathVariable String userId,
            @PathVariable String contestId) {
        ModelGetRolesOfUserInContestResponse res = problemTestCaseService.getRolesOfUserInContest(userId, contestId);
        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/get-permissions-of-members-of-contest")
    public ResponseEntity<?> getPermissionsOfMemberOfContest() {
        List<String> perms = UserRegistrationContestEntity.getListPermissions();
        return ResponseEntity.ok().body(perms);
    }

    @GetMapping("/rerun-create-testcase-solution/{problemId}/{testCaseId}")
    public ResponseEntity<?> rerunCreateTestCaseSolution(Principal principal, @PathVariable String problemId,
            @PathVariable UUID testCaseId) {
        log.info("rerunCreateTestCaseSolution problem " + problemId + " testCaseId " + testCaseId);
        ModelUploadTestCaseOutput res = problemTestCaseService.rerunCreateTestCaseSolution(problemId, testCaseId,
                principal.getName());
        return ResponseEntity.ok().body(res);
    }
    @GetMapping("/get-submission-modes")
    public ResponseEntity<?> getSubmissionModes(){
        List<String> res = ContestProblem.getSubmissionModes();
        return ResponseEntity.ok().body(res);
    }
    @PostMapping("/update-problem-contest")
    public ResponseEntity<?> updateProblemContest(Principal principal, @RequestBody ModelUpdateProblemContestInput I){
        boolean res = problemTestCaseService.updateProblemContest(principal.getName(), I);
        return ResponseEntity.ok().body(res);
    }
}
