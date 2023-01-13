package com.hust.baseweb.applications.admin.dataadmin.education.service;

import com.hust.baseweb.applications.admin.dataadmin.education.entity.LearningStatisticEntity;
import com.hust.baseweb.applications.admin.dataadmin.education.repo.LearningStatisticRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class LearningStatisticServiceImpl implements LearningStatisticService {

    private final DoingPracticeQuizStatisticService doingQuizStatisticService;

    private final ProgrammingContestStatisticService contestStatisticService;

    private final LearningStatisticRepo learningStatisticRepo;

    @Override
    public void statisticLearningGeneral() throws ParseException {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date MIN_STATISTIC_TIME = formatter.parse("2000-01-01 00:00:00");

        Optional<Date> optionalLatestStatisticTime = learningStatisticRepo.findLatestStatisticTime();
        Date latestStatisticTime = optionalLatestStatisticTime.isPresent() ? optionalLatestStatisticTime.get() : MIN_STATISTIC_TIME;

        Map<String, Long> totalDoingTimes = doingQuizStatisticService.statisticTotalQuizDoingTimes(latestStatisticTime);
        Map<String, LocalDateTime> latestDoingTimes = doingQuizStatisticService.statisticLatestTimeDoingQuiz(latestStatisticTime);
        Map<String, Long> numberOfDoingPeriods = doingQuizStatisticService.statisticNumberOfQuizDoingPeriods(latestStatisticTime, 10);
        Map<String, Long> totalSubmissions = contestStatisticService.statisticTotalSubmissions(latestStatisticTime);
        Map<String, LocalDateTime> latestSubmitTimes = contestStatisticService.statisticLatestTimesSubmittingCode(latestStatisticTime);
        Map<String, Long> totalSubmissionsAcceptedOnTheFirstSubmit = contestStatisticService.statisticTotalSubmissionsAcceptedOnTheFirstSubmit(latestStatisticTime);
        Map<String, Long> totalErrorSubmissions = contestStatisticService.statisticTotalErrorSubmissions(latestStatisticTime);

        Set<String> loginIdsHaveNewOrChangedStatistic = new HashSet<>();
        loginIdsHaveNewOrChangedStatistic.addAll(totalDoingTimes.keySet());
        loginIdsHaveNewOrChangedStatistic.addAll(latestDoingTimes.keySet());
        loginIdsHaveNewOrChangedStatistic.addAll(numberOfDoingPeriods.keySet());
        loginIdsHaveNewOrChangedStatistic.addAll(totalSubmissions.keySet());
        loginIdsHaveNewOrChangedStatistic.addAll(latestSubmitTimes.keySet());
        loginIdsHaveNewOrChangedStatistic.addAll(totalSubmissionsAcceptedOnTheFirstSubmit.keySet());
        loginIdsHaveNewOrChangedStatistic.addAll(totalErrorSubmissions.keySet());

        List<LearningStatisticEntity> newOrChangedStatistics = getNewOrChangedStatistics(loginIdsHaveNewOrChangedStatistic);

        newOrChangedStatistics.forEach(statistic -> {
            String loginId = statistic.getLoginId();
            accumulateStatisticChanges(
                statistic,
                totalDoingTimes.get(loginId),
                latestDoingTimes.get(loginId),
                numberOfDoingPeriods.get(loginId),
                totalSubmissions.get(loginId),
                latestSubmitTimes.get(loginId),
                totalSubmissionsAcceptedOnTheFirstSubmit.get(loginId),
                totalErrorSubmissions.get(loginId)
            );
        });

        learningStatisticRepo.saveAll(newOrChangedStatistics);
    }

    private List<LearningStatisticEntity> getNewOrChangedStatistics(Collection<String> statisticLoginIds) {
        List<LearningStatisticEntity> changedStatistics = learningStatisticRepo.findAllById(statisticLoginIds);
        Map<String, LearningStatisticEntity> mapChangedStatisticByLoginId = changedStatistics.stream().collect(
            Collectors.toMap(LearningStatisticEntity::getLoginId, Function.identity())
        );

        Function<String, LearningStatisticEntity> identityOrNewOneIfNotExist = loginId -> {
            LearningStatisticEntity statistic = mapChangedStatisticByLoginId.get(loginId);
            return statistic == null ? new LearningStatisticEntity(loginId) : statistic;
        };

        return statisticLoginIds.parallelStream()
            .map(identityOrNewOneIfNotExist)
            .collect(Collectors.toList());
    }

    private void accumulateStatisticChanges(
        LearningStatisticEntity statistic,
        Long additionalDoingTimes,
        LocalDateTime latestDoingTime,
        Long additionalDoingPeriods,
        Long additionalSubmissions,
        LocalDateTime latestSubmitTime,
        Long additionalSubmissionsAcceptedOnTheFirstSubmit,
        Long additionalErrorSubmissions
    ) {
        if (latestDoingTime != null) {
            statistic.setLatestTimeDoingQuiz(latestDoingTime);
        }
        if (latestSubmitTime != null) {
            statistic.setLatestTimeSubmittingCode(latestSubmitTime);
        }
        if (additionalDoingTimes != null) {
            statistic.setTotalQuizDoingTimes(statistic.getTotalQuizDoingTimes() + additionalDoingTimes);
        }
        if (additionalDoingPeriods != null) {
            statistic.setTotalQuizDoingPeriods(statistic.getTotalQuizDoingPeriods() + additionalDoingPeriods);
        }
        if (additionalSubmissions != null) {
            statistic.setTotalCodeSubmissions(statistic.getTotalCodeSubmissions() + additionalSubmissions);
        }
        if (additionalSubmissionsAcceptedOnTheFirstSubmit != null) {
            statistic.setSubmissionsAcceptedOnTheFirstTime(
                statistic.getSubmissionsAcceptedOnTheFirstTime() + additionalSubmissionsAcceptedOnTheFirstSubmit
            );
        }
        if (additionalErrorSubmissions != null) {
            statistic.setTotalErrorSubmissions(statistic.getTotalErrorSubmissions() + additionalErrorSubmissions);
        }
    }
}
