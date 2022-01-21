package com.hust.baseweb.applications.programmingcontest.utils.stringhandler;

import com.hust.baseweb.applications.programmingcontest.constants.Constants;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
public class StringHandler {
    public static ProblemSubmission handleContestResponse(String response, List<String> testCaseAns, List<Integer> points){
        log.info("response {}", response);
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

        status = null;
        int cnt = 0;
        int score = 0;
        for(int i = 0; i < testCaseAns.size(); i++){
            String a = replaceSpace(testCaseAns.get(i));
            String b = replaceSpace(ans[i]);
            if(!a.equals(b)){
                if(status == null && ans[i].contains("Time Limit Exceeded")){
                    status = "Time Limit Exceeded";
                }else if(!ans[i].contains("Time Limit Exceeded")){
                    status = "Wrong Answer";
                }
            }else{
                score += points.get(i);
                cnt++;
            }
        }

        if(status == null){
            status = "Accept";
        }
        return ProblemSubmission.builder()
                                .runtime(runtime)
                                .score(score)
                                .status(status)
                                .testCasePass(cnt+"/"+testCaseAns.size())
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

