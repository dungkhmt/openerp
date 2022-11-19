package com.hust.baseweb.applications.programmingcontest.utils.stringhandler;

import com.hust.baseweb.applications.programmingcontest.constants.Constants;
import com.hust.baseweb.applications.programmingcontest.entity.ContestSubmissionEntity;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class StringHandler {
    public static ProblemSubmission handleContestResponseSubmitSolutionOutputOneTestCase(String response, int point){
        log.info("handleContestResponseSubmitSolutionOutputOneTestCase, response = " + response);
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
                //score = Integer.valueOf(ans[0]);
                String[] s = ans[0].split(" ");
                if(s.length > 0){
                    score = Integer.valueOf(s[0]);
                    status = "OK ";
                    for(int i = 1; i < s.length; i++) status = status + s[i] + " ";
                }else{
                    score = Integer.valueOf(s[0]);
                    status = "OK";
                }
            }
        }catch(Exception e){
            e.printStackTrace();
        }
        return ProblemSubmission.builder()
                                .runtime(runtime)
                                .score(score)
                                //.status("OK")
                                .status(status)
                                .testCasePass("1/1")
                                .build();
    }
    public static ProblemSubmission handleContestResponse(String response, List<String> testCaseAns, List<Integer> points){
        //log.info("handleContestResponse, response {}", response);
        String orignalMessage = response;
        response = response.substring(0, response.length()-1);
        int lastIndex = response.lastIndexOf("\n");
        String status;
        if (lastIndex < 0) {
            return buildCompileErrorForSubmission(testCaseAns.size(), orignalMessage);
        } else {
            status = response.substring(lastIndex);
        }
        //log.info("status {}", status);
        if (status.contains("Compile Error")) {
            return buildCompileErrorForSubmission(testCaseAns.size(), orignalMessage);
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
                                .message(orignalMessage)
                                .testCasePass(cnt+"/"+testCaseAns.size())
                                .nbTestCasePass(cnt)
                                .testCaseAns(testCaseAns)
                                .participantAns(participantAns)
                                .build();
    }

    private static ProblemSubmission buildCompileErrorForSubmission(int numTestCases, String message) {
        return ProblemSubmission.builder()
                                .score(0)
                                .runtime(0L)
                                .testCasePass(0 + "/" + numTestCases)
                                .status("Compile Error")
                                .message(message)
                                .build();
    }

    private static String replaceSpace(String s){
        if(s == null){
            return null;
        }

        s = s.replaceAll("\n", " ");
        return s.replaceAll("( +)", " ").trim();

    }

    public static String shorthen(String s, int len){
        if(s == null || s.equals("")) return s;
        if(len >= s.length()) return s;
        return s.substring(0,len) + "...";
    }

    public static void main(String[] args){
        System.out.println(StringHandler.shorthen("pham quang dung",5));
    }
}

