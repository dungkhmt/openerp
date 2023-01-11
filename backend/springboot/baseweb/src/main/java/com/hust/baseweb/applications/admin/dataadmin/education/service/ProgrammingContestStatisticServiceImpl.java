package com.hust.baseweb.applications.admin.dataadmin.education.service;

import com.hust.baseweb.applications.admin.dataadmin.education.model.statistic.CodeSubmissionTimeModel;
import com.hust.baseweb.applications.admin.dataadmin.education.model.statistic.TotalCodeSubmissionModel;
import com.hust.baseweb.applications.admin.dataadmin.education.repo.ProgrammingContestStatisticRepo;
import com.hust.baseweb.applications.programmingcontest.entity.ContestSubmissionEntity;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class ProgrammingContestStatisticServiceImpl implements ProgrammingContestStatisticService {

    private final ProgrammingContestStatisticRepo programmingContestStatisticRepo;

    @Override
    public Map<String, Long> statisticTotalSubmissions(Date statisticFrom) {
        List<TotalCodeSubmissionModel> listTotalSubmissions = programmingContestStatisticRepo.countTotalCodeSubmissions(statisticFrom);

        return listTotalSubmissions.stream().collect(
            Collectors.toMap(elem -> elem.getLoginId(), elem -> elem.getTotalSubmissions())
        );
    }

    @Override
    public Map<String, LocalDateTime> statisticLatestTimesSubmittingCode(Date statisticFrom) {
        List<CodeSubmissionTimeModel> submissionTimes = programmingContestStatisticRepo.findLatestTimesSubmittingCode(statisticFrom);

        return submissionTimes.stream().collect(
            Collectors.toMap(elem -> elem.getLoginId(), elem -> elem.getSubmitTime())
        );
    }

    private static final List<String> ACCEPT_STATUSES = Arrays.asList(
        ContestSubmissionEntity.SUBMISSION_STATUS_ACCEPTED,
        ContestSubmissionEntity.SUBMISSION_STATUS_PARTIAL
    );

    @Override
    public Map<String, Long> statisticTotalSubmissionsAcceptedOnTheFirstSubmit(Date statisticFrom) {
        List<TotalCodeSubmissionModel> totalSubmissionsAcceptedFirstSubmit = programmingContestStatisticRepo.countSubmissionsHasFirstSubmitStatusIn(
            statisticFrom, ACCEPT_STATUSES
        );

        return totalSubmissionsAcceptedFirstSubmit.stream().collect(
            Collectors.toMap(elem -> elem.getLoginId(), elem -> elem.getTotalSubmissions())
        );
    }

    @Override
    public Map<String, Long> statisticTotalErrorSubmissions(Date statisticFrom) {
        return null;
    }
}
