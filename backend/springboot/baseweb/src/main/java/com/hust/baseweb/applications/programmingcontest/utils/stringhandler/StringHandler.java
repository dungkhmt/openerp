package com.hust.baseweb.applications.programmingcontest.utils.stringhandler;

import com.hust.baseweb.applications.programmingcontest.constants.Constants;
import com.hust.baseweb.applications.programmingcontest.entity.ContestSubmissionEntity;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class StringHandler {
    public static ProblemSubmission handleContestResponseSubmitSolutionOutputOneTestCase(String response, int point){
        response = response.substring(0, response.length()-1);
        int lastIndex = response.lastIndexOf("\n");
        String status = response.substring(lastIndex);
        log.info("status {}", status);
        if(status.contains("Compile Error")){
            return ProblemSubmission.builder()
                                    .score(0)
                                    .runtime(0L)
                                    .testCasePass(0+"/"+1)
                                    .status("Compile Error")
                                    .build();
        }
        response = response.substring(0, lastIndex);
        int runTimeIndex = response.lastIndexOf("\n");
        String runtimeString = response.substring(runTimeIndex+1);
        Long runtime = Long.parseLong(runtimeString);
        response = response.substring(0, runTimeIndex);
        String []ans = response.split(Constants.SPLIT_TEST_CASE); // ans[0] is the score returned by the checker
        int score = 0;
        try{
            if(ans != null && ans.length > 0){
                score = Integer.valueOf(ans[0]);
            }
        }catch(Exception e){
            e.printStackTrace();
        }
        return ProblemSubmission.builder()
                                .runtime(runtime)
                                .score(score)
                                .status("OK")
                                .testCasePass("1/1")
                                .build();
    }
    public static ProblemSubmission handleContestResponse(String response, List<String> testCaseAns, List<Integer> points){
        log.info("handleContestResponse, response {}", response);
        response = response.substring(0, response.length()-1);
        int lastIndex = response.lastIndexOf("\n");
        String status = response.substring(lastIndex);
        log.info("status {}", status);
        if(status.contains("Compile Error")){
            return ProblemSubmission.builder()
                                    .score(0)
                                    .runtime(0L)
                                    .testCasePass(0+"/"+testCaseAns.size())
                                    .status("Compile Error")
                                    .build();
        }
        response = response.substring(0, lastIndex);
        int runTimeIndex = response.lastIndexOf("\n");
        String runtimeString = response.substring(runTimeIndex+1);
        Long runtime = Long.parseLong(runtimeString);
        response = response.substring(0, runTimeIndex);
        String []ans = response.split(Constants.SPLIT_TEST_CASE);
        List<String> participantAns = new ArrayList();
        if(ans != null)
        for(int i = 0; i < ans.length; i++)
            participantAns.add(ans[i]);
        status = null;
        int cnt = 0;
        int score = 0;
        for(int i = 0; i < testCaseAns.size(); i++){
            String a = replaceSpace(testCaseAns.get(i));
            String b = replaceSpace(ans[i]);
            if(!a.equals(b)){
                //if(status == null && ans[i].contains("Time Limit Exceeded")){
                if(status == null && ans[i].contains(ContestSubmissionEntity.SUBMISSION_STATUS_TIME_LIMIT_EXCEEDED)){
                    status = ContestSubmissionEntity.SUBMISSION_STATUS_TIME_LIMIT_EXCEEDED;
                //}else if(!ans[i].contains("Time Limit Exceeded")){
                }else if(!ans[i].contains(ContestSubmissionEntity.SUBMISSION_STATUS_TIME_LIMIT_EXCEEDED)){
                    status = ContestSubmissionEntity.SUBMISSION_STATUS_WRONG;
                }
            }else{
                score += points.get(i);
                cnt++;
            }
        }

        if(status == null){
            //status = "Accept";
            status = ContestSubmissionEntity.SUBMISSION_STATUS_ACCEPTED;
        }
        return ProblemSubmission.builder()
                                .runtime(runtime)
                                .score(score)
                                .status(status)
                                .testCasePass(cnt+"/"+testCaseAns.size())
                                .nbTestCasePass(cnt)
                                .testCaseAns(testCaseAns)
                                .participantAns(participantAns)
                                .build();
    }

    private static String replaceSpace(String s){
        if(s == null){
            return null;
        }

        s = s.replaceAll("\n", " ");
        return s.replaceAll("( +)", " ").trim();

    }
}

