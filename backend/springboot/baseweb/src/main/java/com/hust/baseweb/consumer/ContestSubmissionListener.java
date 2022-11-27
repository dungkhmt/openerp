package com.hust.baseweb.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hust.baseweb.applications.programmingcontest.entity.ContestSubmissionEntity;
import com.hust.baseweb.applications.programmingcontest.model.ModelContestSubmission;
import com.hust.baseweb.applications.programmingcontest.model.ModelContestSubmissionMessage;
import com.hust.baseweb.applications.programmingcontest.service.ProblemTestCaseService;
import com.hust.baseweb.config.rabbitmq.ProblemContestRoutingKey;
import com.hust.baseweb.config.rabbitmq.RabbitConfig;
import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class ContestSubmissionListener {

    private final ObjectMapper objectMapper;
    private final ProblemTestCaseService problemTestCaseService;

    @Value("${rabbit.RETRY_LIMIT:3}")
    private int retryLimit;

    public ContestSubmissionListener(
            ObjectMapper objectMapper,
            ProblemTestCaseService problemTestCaseService) {
        this.objectMapper = objectMapper;
        this.problemTestCaseService = problemTestCaseService;
    }

    @RabbitListener(queues = RabbitConfig.JUDGE_PROBLEM_QUEUE)
    public void onMessage(
            Message message, String messageBody, Channel channel,
            @Header(required = false, name = "x-delivery-count") Integer deliveryCount) throws Exception {
        if (deliveryCount == null || deliveryCount < retryLimit) {
            retryMessage(message, messageBody, channel);
        } else {
            sendMessageToDeadLetterQueue(message, channel);
        }
    }

    private void retryMessage(Message message, String messageBody, Channel channel) throws IOException {
//        if (true) {
//            System.out.println("Nack");
//            channel.basicNack(message.getMessageProperties().getDeliveryTag(), false, true);
//            return;
//        }

        try {
            ModelContestSubmissionMessage msg = objectMapper.readValue(
                    messageBody,
                    ModelContestSubmissionMessage.class);
            ModelContestSubmission contestSubmission = msg.getModelContestSubmission();
            ContestSubmissionEntity submissionEntity = msg.getSubmission();
            problemTestCaseService.submitContestProblemTestCaseByTestCaseWithFileProcessor(
                    contestSubmission,
                    submissionEntity);
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
        } catch (Exception e) {
            e.printStackTrace();
            channel.basicNack(message.getMessageProperties().getDeliveryTag(), false, true);
        }
    }

    private void sendMessageToDeadLetterQueue(Message message, Channel channel) throws IOException {
        channel.basicPublish(RabbitConfig.DEAD_LETTER_EXCHANGE,
                             ProblemContestRoutingKey.JUDGE_PROBLEM_DL,
                             new AMQP.BasicProperties.Builder().deliveryMode(2).build(),
                             message.getBody());
        channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
    }
}
