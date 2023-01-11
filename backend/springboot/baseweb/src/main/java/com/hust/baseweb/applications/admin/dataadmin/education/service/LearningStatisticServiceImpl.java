package com.hust.baseweb.applications.admin.dataadmin.education.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class LearningStatisticServiceImpl implements LearningStatisticService {

    private static Date latestStatistic = new Date(2000, 0, 1, 0, 0, 0);
    private final DoingPracticeQuizStatisticService doingQuizStatisticService;

    private final ProgrammingContestStatisticService contestStatisticService;

    @Override
    public void statisticLearningGeneral() {
        Map<String, Long> totalDoingTimes = doingQuizStatisticService.statisticTotalQuizDoingTimes(latestStatistic);
        totalDoingTimes.forEach((loginId, doingTimes) -> {
            log.error(loginId + ": " + doingTimes);
        });
    }
}
