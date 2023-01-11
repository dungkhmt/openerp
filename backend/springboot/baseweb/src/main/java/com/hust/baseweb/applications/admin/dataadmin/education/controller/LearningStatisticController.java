package com.hust.baseweb.applications.admin.dataadmin.education.controller;

import com.hust.baseweb.applications.admin.dataadmin.education.service.LearningStatisticService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/statistic/learning")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class LearningStatisticController {

    private final LearningStatisticService learningStatisticService;

    @GetMapping("/basic")
    public ResponseEntity<?> basicLearningStatistic() {
        learningStatisticService.statisticLearningGeneral();
        return ResponseEntity.ok().build();
    }
}
