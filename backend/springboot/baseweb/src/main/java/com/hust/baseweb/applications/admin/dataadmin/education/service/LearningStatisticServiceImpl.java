package com.hust.baseweb.applications.admin.dataadmin.education.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class LearningStatisticServiceImpl implements LearningStatisticService {

    private final DoingPracticeQuizStatisticService doingQuizStatisticService;

    private final ProgrammingContestStatisticService contestStatisticService;

    @Override
    public void statisticLearningGeneral() throws ParseException {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date MIN_STATISTIC_TIME = formatter.parse("2000-01-01 00:00:00");

        Map<String, Long> totalDoingTimes = doingQuizStatisticService.statisticTotalQuizDoingTimes(MIN_STATISTIC_TIME);
        Map<String, LocalDateTime> latestDoingTimes = doingQuizStatisticService.statisticLatestTimeDoingQuiz(MIN_STATISTIC_TIME);
        Map<String, Long> numberOfDoingPeriods = doingQuizStatisticService.statisticNumberOfQuizDoingPeriods(MIN_STATISTIC_TIME, 10);
        Map<String, Long> totalSubmissions = contestStatisticService.statisticTotalSubmissions(MIN_STATISTIC_TIME);
        Map<String, LocalDateTime> latestSubmitTimes = contestStatisticService.statisticLatestTimesSubmittingCode(MIN_STATISTIC_TIME);
        Map<String, Long> totalSubmissionsAcceptedOnTheFirstSubmit = contestStatisticService.statisticTotalSubmissionsAcceptedOnTheFirstSubmit(MIN_STATISTIC_TIME);
        totalSubmissionsAcceptedOnTheFirstSubmit.forEach((loginId, totalSubmitAccepted) -> {
            log.info(loginId + ": " + totalSubmitAccepted);
        });
    }
}
