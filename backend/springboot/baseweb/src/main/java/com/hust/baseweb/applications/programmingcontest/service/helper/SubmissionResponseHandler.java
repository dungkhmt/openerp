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
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.hust.baseweb.config.rabbitmq.ProblemContestRoutingKey.JUDGE_CUSTOM_PROBLEM;
import static com.hust.baseweb.config.rabbitmq.RabbitProgrammingContestConfig.EXCHANGE;

@Slf4j
@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class SubmissionResponseHandler {

    private ContestSubmissionRepo contestSubmissionRepo;
    private ContestSubmissionTestCaseEntityRepo contestSubmissionTestCaseEntityRepo;
    private RabbitTemplate rabbitTemplate;

    @Transactional
    public void processSubmissionResponse(
            List<TestCaseEntity> testCaseEntityList,
            List<String> listSubmissionResponse,
            ModelContestSubmission modelContestSubmission,
            ContestSubmissionEntity submission,
            String problemEvaluationType) throws Exception {
        int runtime = 0;
        int score = 0;
        int nbTestCasePass = 0;

        String totalStatus;
        String message = "";
        boolean compileError = false;
        boolean processing = false;

        int mb = 1000 * 1000;
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();

        int i = 0;

        long startTime1 = System.nanoTime();
        for (TestCaseEntity testCaseEntity : testCaseEntityList) {
            String response = listSubmissionResponse.get(i++);
            List<String> testCaseAns = Collections.singletonList(testCaseEntity.getCorrectAnswer());
            List<Integer> points = Collections.singletonList(testCaseEntity.getTestCasePoint());

            ProblemSubmission problemSubmission;

            try {
                problemSubmission = StringHandler.handleContestResponseV2(
                        response,
                        testCaseAns,
                        points,
                        problemEvaluationType);

                if (problemSubmission.getStatus().equals(ContestSubmissionEntity.SUBMISSION_STATUS_COMPILE_ERROR)) {
                    message = problemSubmission.getMessage();
                    compileError = true;
                    break;
                } else if (problemSubmission
                        .getStatus()
                        .equals(ContestSubmissionEntity.SUBMISSION_STATUS_WAIT_FOR_CUSTOM_EVALUATION)) {
                    processing = true;
                }
            } catch (Exception e) {
                e.printStackTrace();
                // System.out.println("LOG FOR TESTING STRING HANDLER ERROR: " + response);
                throw new Exception("error from StringHandler");
            }

            runtime = runtime + problemSubmission.getRuntime().intValue();
            score = score + problemSubmission.getScore();
            nbTestCasePass += problemSubmission.getNbTestCasePass();

            List<String> output = problemSubmission.getParticipantAns();
            String participantAns = output != null && output.size() > 0 ? output.get(0) : "";

            ContestSubmissionTestCaseEntity cste = ContestSubmissionTestCaseEntity.builder()
                    .contestId(modelContestSubmission.getContestId())
                    .contestSubmissionId(submission.getContestSubmissionId())
                    .problemId(modelContestSubmission.getProblemId())
                    .testCaseId(testCaseEntity.getTestCaseId())
                    .submittedByUserLoginId(submission.getUserId())
                    .point(problemSubmission.getScore())
                    .status(StringHandler.removeNullCharacter(
                            problemSubmission.getStatus()))
                    .participantSolutionOtput(
                            StringHandler.removeNullCharacter(
                                    participantAns))
                    .runtime(problemSubmission.getRuntime())
                    .createdStamp(submission.getCreatedAt())
                    .build();

            long startTime = System.nanoTime();
            contestSubmissionTestCaseEntityRepo.save(cste);
            long endTime = System.nanoTime();
            log.info(
                    "Save contestSubmissionTestCaseEntity to DB, execution time = {} ms",
                    (endTime - startTime) / 1000000);

        }

        long endTime1 = System.nanoTime();
        log.info(
                "Total handle response time = {} ms",
                (endTime1 - startTime1) / 1000000);

        long used = memoryBean.getHeapMemoryUsage().getUsed() / mb;
        long committed = memoryBean.getHeapMemoryUsage().getCommitted() / mb;
        System.out.println("Memory used / committed :  " + used + "mb / " + committed + "mb");

        if (compileError) {
            totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_COMPILE_ERROR;
        } else if (processing) {
            message = "Evaluating";
            totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_WAIT_FOR_CUSTOM_EVALUATION;
        } else if (nbTestCasePass == 0) {
            totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_FAILED;
        } else if (nbTestCasePass > 0 && nbTestCasePass < testCaseEntityList.size()) {
            totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_PARTIAL;
        } else {
            message = "Successful";
            totalStatus = ContestSubmissionEntity.SUBMISSION_STATUS_ACCEPTED;
        }

        ContestSubmissionEntity submissionEntity = contestSubmissionRepo
                .findContestSubmissionEntityByContestSubmissionId(submission.getContestSubmissionId());

        submissionEntity.setStatus(totalStatus);
        submissionEntity.setPoint(score);
        submissionEntity.setTestCasePass(nbTestCasePass + "/" + testCaseEntityList.size());
        submissionEntity.setSourceCode(modelContestSubmission.getSource());
        submissionEntity.setSourceCodeLanguage(modelContestSubmission.getLanguage());
        submissionEntity.setRuntime((long) runtime);
        submissionEntity.setMessage(message);
        submissionEntity.setUpdateAt(new Date());
        contestSubmissionRepo.save(submissionEntity);

        if (processing) {
            rabbitTemplate.convertAndSend(
                    EXCHANGE,
                    JUDGE_CUSTOM_PROBLEM,
                    submission.getContestSubmissionId());
        }
    }

    @Transactional
    public void processCustomSubmissionResponse(ContestSubmissionEntity submission,
            Map<UUID, String> submissionResponses) {

        int totalPoint = 0;
        
        for (Map.Entry<UUID, String> testCaseResponse : submissionResponses.entrySet()) {
            UUID submissionTestCaseId = testCaseResponse.getKey();
            ContestSubmissionTestCaseEntity submissionTestCase = contestSubmissionTestCaseEntityRepo.findById(submissionTestCaseId).get();

            String response = testCaseResponse.getValue();

            int point = 0;
            String message = "";
            if (response.length() > 0) {
                String pointString = response.substring(0, response.indexOf(' '));
                point = Integer.parseInt(pointString);
                totalPoint += point;

                message = response.substring(response.indexOf(' '));
            }

            submissionTestCase.setPoint(point);
            submissionTestCase.setStatus(message);

            contestSubmissionTestCaseEntityRepo.save(submissionTestCase);
        }

        submission.setPoint(totalPoint);
        submission.setStatus("Evaluated");
        submission.setTestCasePass("");
        submission.setUpdateAt(new Date());

        contestSubmissionRepo.save(submission);
    }

}
