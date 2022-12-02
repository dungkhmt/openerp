package com.hust.baseweb.applications.programmingcontest.service.helper;

import com.hust.baseweb.applications.programmingcontest.entity.ContestSubmissionEntity;
import com.hust.baseweb.applications.programmingcontest.entity.ContestSubmissionTestCaseEntity;
import com.hust.baseweb.applications.programmingcontest.entity.TestCaseEntity;
import com.hust.baseweb.applications.programmingcontest.model.ModelContestSubmission;
import com.hust.baseweb.applications.programmingcontest.repo.ContestSubmissionRepo;
import com.hust.baseweb.applications.programmingcontest.repo.ContestSubmissionTestCaseEntityRepo;
import com.hust.baseweb.applications.programmingcontest.utils.stringhandler.ProblemSubmission;
import com.hust.baseweb.applications.programmingcontest.utils.stringhandler.StringHandler;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class SubmissionResponseHandler {

    private ContestSubmissionRepo contestSubmissionRepo;
    private ContestSubmissionTestCaseEntityRepo contestSubmissionTestCaseEntityRepo;

    @Transactional
    public void processSubmissionResponse(
        List<TestCaseEntity> testCaseEntityList,
        List<String> listSubmissionResponse,
        ModelContestSubmission modelContestSubmission,
        ContestSubmissionEntity submission
    ) throws Exception {
        int runtime = 0;
        int score = 0;
        int nbTestCasePass = 0;
        String totalStatus = "";
        List<String> statusList = new ArrayList<>();
        String message = "";
        boolean compileError = false;

        int i = 0;
        for (TestCaseEntity testCaseEntity : testCaseEntityList) {
            String response = listSubmissionResponse.get(i++);
            List<String> testCaseAns = Collections.singletonList(testCaseEntity.getCorrectAnswer());
            List<Integer> points = Collections.singletonList(testCaseEntity.getTestCasePoint());

            ProblemSubmission problemSubmission;
            try {
                // int mb = 1000 * 1000;
                // MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();

                problemSubmission = StringHandler.handleContestResponseV2(response, testCaseAns, points);

                // long used = memoryBean.getHeapMemoryUsage().getUsed() / mb;
                // long committed = memoryBean.getHeapMemoryUsage().getCommitted() / mb;
                // System.out.println("Memory used / committed :  " + used + "mb / " + committed + "mb");

                if (problemSubmission.getMessage() != null && !problemSubmission.getMessage().contains("successful")) {
                    message = problemSubmission.getMessage();
                    compileError = true;
                    //log.info("submitContestProblemTestCaseByTestCaseWithFileProcessor, Compiler Error, msg  = " + message);
                    break;
                }
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("LOG FOR TESTING STRING HANDLER ERROR: " + response);
                throw new Exception("error from StringHandler");
            }

            runtime = runtime + problemSubmission.getRuntime().intValue();
            score = score + problemSubmission.getScore();
            nbTestCasePass += problemSubmission.getNbTestCasePass();
            statusList.add(problemSubmission.getStatus());
            List<String> output = problemSubmission.getParticipantAns();
            String participantAns = "";
            if (output != null && output.size() > 0) {
                participantAns = output.get(0);
            }

            ContestSubmissionTestCaseEntity cste;
            cste = ContestSubmissionTestCaseEntity.builder()
                                                  .contestId(modelContestSubmission.getContestId())
                                                  .contestSubmissionId(submission.getContestSubmissionId())
                                                  .problemId(modelContestSubmission.getProblemId())
                                                  .testCaseId(testCaseEntity.getTestCaseId())
                                                  .submittedByUserLoginId(submission.getUserId())
                                                  .point(problemSubmission.getScore())
                                                  .status(StringHandler.removeNullCharacter(
                                                      problemSubmission.getStatus()))
                                                  .testCaseOutput(StringHandler.removeNullCharacter(
                                                      testCaseEntity.getCorrectAnswer()))
                                                  .participantSolutionOtput(
                                                      StringHandler.removeNullCharacter(
                                                          participantAns))
                                                  .runtime(problemSubmission.getRuntime())
                                                  .createdStamp(submission.getCreatedAt())
                                                  .build();
            contestSubmissionTestCaseEntityRepo.save(cste);
        }
        boolean accepted = true;

        for (String s : statusList) {
            if (s.equals(ContestSubmissionEntity.SUBMISSION_STATUS_COMPILE_ERROR)) {
                totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_COMPILE_ERROR;
                accepted = false;
                break;
            } else if (s.equals(ContestSubmissionEntity.SUBMISSION_STATUS_TIME_LIMIT_EXCEEDED)) {
                totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_TIME_LIMIT_EXCEEDED;
                accepted = false;
                break;
            } else if (s.equals(ContestSubmissionEntity.SUBMISSION_STATUS_WRONG)) {
                totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_WRONG;
                accepted = false; //break;
            }
        }

        if (accepted) {
            totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_ACCEPTED;
        }

        if (compileError) {
            // keep compile error message above
            totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_COMPILE_ERROR;
            //log.info("submitContestProblemTestCaseByTestCaseWithFileProcessor, Summary Compile error " + message);
        } else if (nbTestCasePass == 0) {
            totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_WRONG;
        } else if (nbTestCasePass > 0 && nbTestCasePass < testCaseEntityList.size()) {
            totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_PARTIAL;
        } else {
            message = "Successful";
        }

        ContestSubmissionEntity submissionEntity = contestSubmissionRepo.
            findContestSubmissionEntityByContestSubmissionId(submission.getContestSubmissionId());

        submissionEntity.setStatus(totalStatus);
        submissionEntity.setPoint(score);
        submissionEntity.setTestCasePass(nbTestCasePass + "/" + testCaseEntityList.size());
        submissionEntity.setSourceCode(modelContestSubmission.getSource());
        submissionEntity.setSourceCodeLanguage(modelContestSubmission.getLanguage());
        submissionEntity.setRuntime((long) runtime);
        submissionEntity.setMessage(message);
        submissionEntity.setUpdateAt(new Date());
        contestSubmissionRepo.save(submissionEntity);
    }

}
