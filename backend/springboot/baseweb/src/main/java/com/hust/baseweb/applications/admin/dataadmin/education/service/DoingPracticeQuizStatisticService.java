package com.hust.baseweb.applications.admin.dataadmin.education.service;

import java.util.Date;
import java.util.UUID;

public interface DoingPracticeQuizStatisticService {

    long countTotalQuizDoingTimes(String studentLoginId, UUID classId);

    Date findLatestTimeDoingQuiz(String studentLoginId, UUID classId);

    long countNumberOfQuizDoingPeriods(String studentLoginId, UUID classId, int hoursBetweenTwoPeriod);
}
