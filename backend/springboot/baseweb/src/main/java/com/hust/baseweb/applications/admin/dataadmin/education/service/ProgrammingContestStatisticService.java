package com.hust.baseweb.applications.admin.dataadmin.education.service;

import java.util.Date;

public interface ProgrammingContestStatisticService {

    long countTotalCodeSubmissions(String studentLoginId, String contestId);

    Date findLatestTimeSubmittingCode(String studentLoginId, String contestId);


}
