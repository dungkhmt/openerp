package com.hust.baseweb.applications.admin.dataadmin.education.service;

import com.hust.baseweb.applications.admin.dataadmin.education.model.statistic.TotalCodeSubmissionModel;
import com.hust.baseweb.applications.admin.dataadmin.education.repo.ProgrammingContestStatisticRepo;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
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
        return null;
    }

    @Override
    public Map<String, Long> statisticTotalSubmissionsAcceptedOnTheFirstSubmit(Date statisticFrom) {
        return null;
    }

    @Override
    public Map<String, Long> statisticTotalErrorSubmissions(Date statisticFrom) {
        return null;
    }
}
