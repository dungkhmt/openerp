package com.hust.baseweb.applications.admin.dataadmin.education.service;

import com.hust.baseweb.applications.admin.dataadmin.education.model.statistic.QuizDoingTimeModel;
import com.hust.baseweb.applications.admin.dataadmin.education.model.statistic.TotalQuizDoingTimeModel;
import com.hust.baseweb.applications.admin.dataadmin.education.model.repo.DoingPracticeQuizStatisticRepo;
import com.hust.baseweb.applications.education.repo.LogUserLoginQuizQuestionRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class DoingPracticeQuizStatisticServiceImpl implements DoingPracticeQuizStatisticService {

    private static final Date latestStatisticTime = null;

    private final LogUserLoginQuizQuestionRepo doingPracticeQuizLogRepo;

    private final DoingPracticeQuizStatisticRepo doingPracticeQuizStatisticRepo;

    public Map<String, Long> statisticTotalQuizDoingTimes(Date statisticFrom) {
        List<TotalQuizDoingTimeModel> doingTimes = doingPracticeQuizStatisticRepo.countTotalQuizDoingTimes(statisticFrom);

        return doingTimes.stream().collect(
            Collectors.toMap(elem -> elem.getLoginId(), elem -> elem.getTotalQuizDoingTimes())
        );
    }

    @Override
    public long countTotalQuizDoingTimes(String studentLoginId, UUID classId) {
        return doingPracticeQuizStatisticRepo.countTotalQuizDoingTimes(studentLoginId, classId);
    }

    public Map<String, LocalDateTime> statisticLatestTimeDoingQuiz(Date statisticFrom) {
        List<QuizDoingTimeModel> latestDoingTimes = doingPracticeQuizStatisticRepo.findLatestTimesDoingQuiz(statisticFrom);

        return latestDoingTimes.stream().collect(
            Collectors.toMap(elem -> elem.getLoginId(), elem -> elem.getDoingTime())
        );
    }

    @Override
    public Date findLatestTimeDoingQuiz(String studentLoginId, UUID classId) {
        return doingPracticeQuizStatisticRepo.findLatestTimeDoingQuiz(studentLoginId, classId);
    }

    public Map<String, Long> statisticNumberOfQuizDoingPeriods(Date statisticFrom, int hoursBetweenPeriods) {
        List<QuizDoingTimeModel> doingTimes = doingPracticeQuizStatisticRepo.findDoingTimesSortAsc(statisticFrom);
        Map<String, List<QuizDoingTimeModel>> mapDoingTimesByLoginId = doingTimes.stream().collect(
            Collectors.groupingBy(elem -> elem.getLoginId(), Collectors.toList())
        );

        List<QuizDoingTimeModel> latestDoingTimesBeforeLatestStatistic = doingPracticeQuizStatisticRepo.findLatestDoingTimesBefore(
            statisticFrom, mapDoingTimesByLoginId.keySet()
        );
        Map<String, LocalDateTime> mapLatestDoingTimeBeforeLatestStatisticByLoginId =
            latestDoingTimesBeforeLatestStatistic.stream().collect(
                Collectors.toMap(elem -> elem.getLoginId(), elem -> elem.getDoingTime())
            );

        Map<String, Long> result = new HashMap<>();
        mapDoingTimesByLoginId.forEach((loginId, doingTimesAfterLatestStatistic) -> {
            long numberOfPeriodsAfterLatestStatistic = countNumberOfQuizDoingPeriodsFrom(
                mapLatestDoingTimeBeforeLatestStatisticByLoginId.get(loginId),
                doingTimesAfterLatestStatistic,
                hoursBetweenPeriods
            );
            result.put(loginId, numberOfPeriodsAfterLatestStatistic);
        });

        return result;
    }

    public long countNumberOfQuizDoingPeriodsFrom(LocalDateTime latestDoingTimeBeforeLatestStatistic,
                                                  List<QuizDoingTimeModel> doingTimesAfterLatestStatistic,
                                                  int hoursBetweenPeriods) {
        if (doingTimesAfterLatestStatistic.size() == 0) return 0L;

        long numberOfPeriods = 0;
        LocalDateTime firstDoingTimeAfterLatestStatistic = doingTimesAfterLatestStatistic.get(0).getDoingTime();
        if (latestDoingTimeBeforeLatestStatistic.plusHours(hoursBetweenPeriods)
                                                .isBefore(firstDoingTimeAfterLatestStatistic)) {
            numberOfPeriods = 1;
        }

        for (int i = 0; i < doingTimesAfterLatestStatistic.size() - 1; i++) {
            LocalDateTime aDoingTime = doingTimesAfterLatestStatistic.get(i).getDoingTime();
            LocalDateTime nextDoingTime = doingTimesAfterLatestStatistic.get(i+1).getDoingTime();

            if (aDoingTime.plusHours(hoursBetweenPeriods).isBefore(nextDoingTime)) {
                numberOfPeriods++;
            }
        }

        return numberOfPeriods;
    }

    @Override
    public long countNumberOfQuizDoingPeriods(String studentLoginId, UUID classId, int hoursBetweenTwoPeriod) {
        ArrayList<LocalDateTime> doingTimes = doingPracticeQuizStatisticRepo.findAllDoingTimesSortAsc(studentLoginId, classId);

        if (doingTimes.size() == 0) return 0;

        long numberOfQuizDoingPeriods = 1;
        for (int i = 0; i < doingTimes.size() - 1; i++) {
            LocalDateTime aDoingTime = doingTimes.get(i);
            LocalDateTime nextDoingTime = doingTimes.get(i+1);

            if (aDoingTime.plusHours(hoursBetweenTwoPeriod).isAfter(nextDoingTime)) {
                numberOfQuizDoingPeriods++;
            }
        }

        return numberOfQuizDoingPeriods;
    }

}
