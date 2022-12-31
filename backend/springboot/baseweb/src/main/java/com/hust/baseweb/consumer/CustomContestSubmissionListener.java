package com.hust.baseweb.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hust.baseweb.applications.programmingcontest.service.ProblemTestCaseService;
import com.hust.baseweb.config.rabbitmq.RabbitProgrammingContestProperties;
import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

import static com.hust.baseweb.config.rabbitmq.ProblemContestRoutingKey.JUDGE_CUSTOM_PROBLEM_DL;
import static com.hust.baseweb.config.rabbitmq.RabbitProgrammingContestConfig.DEAD_LETTER_EXCHANGE;
import static com.hust.baseweb.config.rabbitmq.RabbitProgrammingContestConfig.JUDGE_CUSTOM_PROBLEM_QUEUE;

@Component
public class CustomContestSubmissionListener {

    private final ObjectMapper objectMapper;
    private final ProblemTestCaseService problemTestCaseService;

    private final RabbitProgrammingContestProperties rabbitConfig;

    public CustomContestSubmissionListener(
        ObjectMapper objectMapper,
        ProblemTestCaseService problemTestCaseService,
        RabbitProgrammingContestProperties rabbitConfig
    ) {
        this.objectMapper = objectMapper;
        this.problemTestCaseService = problemTestCaseService;
        this.rabbitConfig = rabbitConfig;
    }

    @RabbitListener(queues = JUDGE_CUSTOM_PROBLEM_QUEUE)
    public void onMessage(
        Message message, String messageBody, Channel channel,
        @Header(required = false, name = "x-delivery-count") Integer deliveryCount
    ) throws Exception {
        if (deliveryCount == null || deliveryCount < rabbitConfig.getRetryLimit()) {
            retryMessage(message, messageBody, channel);
        } else {
            sendMessageToDeadLetterQueue(message, channel);
        }
    }

    private void retryMessage(Message message, String messageBody, Channel channel) throws IOException {
        try {
            UUID contestSubmissionId = UUID.fromString(messageBody);
            problemTestCaseService.evaluateCustomProblemSubmission(contestSubmissionId);
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
        } catch (Exception e) {
            e.printStackTrace();
            channel.basicNack(message.getMessageProperties().getDeliveryTag(), false, true);
        }
    }

    private void sendMessageToDeadLetterQueue(Message message, Channel channel) throws IOException {
        channel.basicPublish(
            DEAD_LETTER_EXCHANGE,
            JUDGE_CUSTOM_PROBLEM_DL,
            new AMQP.BasicProperties.Builder().deliveryMode(2).build(),
            message.getBody());
        channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
    }
}