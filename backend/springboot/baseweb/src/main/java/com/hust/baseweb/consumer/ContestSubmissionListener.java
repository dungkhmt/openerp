package com.hust.baseweb.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hust.baseweb.applications.programmingcontest.entity.ContestSubmissionEntity;
import com.hust.baseweb.applications.programmingcontest.model.ModelContestSubmission;
import com.hust.baseweb.applications.programmingcontest.model.ModelContestSubmissionMessage;
import com.hust.baseweb.applications.programmingcontest.service.ProblemTestCaseService;
import com.hust.baseweb.config.rabbitmq.RabbitConfig;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class ContestSubmissionListener {

    private final ObjectMapper objectMapper;
    private final ProblemTestCaseService problemTestCaseService;

    public ContestSubmissionListener(
        ObjectMapper objectMapper,
        ProblemTestCaseService problemTestCaseService
    ) {
        this.objectMapper = objectMapper;
        this.problemTestCaseService = problemTestCaseService;
    }

    @RabbitListener(queues = RabbitConfig.JUDGE_PROBLEM_QUEUE)
    public void onMessage(String message) throws Exception {
        ModelContestSubmissionMessage msg = objectMapper.readValue(message, ModelContestSubmissionMessage.class);
        ModelContestSubmission contestSubmission = msg.getModelContestSubmission();
        ContestSubmissionEntity submissionEntity = msg.getSubmission();
        problemTestCaseService.submitContestProblemTestCaseByTestCaseWithFileProcessor(
            contestSubmission,
            submissionEntity);
    }
}
