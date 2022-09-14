package com.hust.baseweb.applications.apprunlocal;

import com.google.gson.Gson;
import com.hust.baseweb.applications.programmingcontest.model.ModelUserJudgedProblemSubmissionResponse;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class ProgrammingContest {
    class Wrapper{
        public List<ModelUserJudgedProblemSubmissionResponse> list;
        public Wrapper(List<ModelUserJudgedProblemSubmissionResponse> list){
            this.list = list;
        }
    }
    public static void main(String[]  args){

        try{
            Gson gson = new Gson();
            BufferedReader bufferedReader = new BufferedReader(new FileReader("C:\\DungPQ\\projects\\openerp\\submissions.json"));

            Wrapper w = gson.fromJson(bufferedReader, Wrapper.class);
            HashMap<String, List<ModelUserJudgedProblemSubmissionResponse>> m = new HashMap();
            for(ModelUserJudgedProblemSubmissionResponse e: w.list){
                System.out.println(e.getUserId() + "\t" + e.getProblemId());
                if(m.get(e.getUserId())==null){
                    m.put(e.getUserId(),new ArrayList());
                }
                m.get(e.getUserId()).add(e);
            }
            for(String u: m.keySet()) {
                PrintWriter out = new PrintWriter(u + ".txt");
                for (ModelUserJudgedProblemSubmissionResponse e : m.get(u)) {
                    out.println("Account: " + u);
                    out.println("Fullname: " + e.getFullName());
                    out.println("Problem " + e.getProblemName());
                    out.println("----");
                    out.println(e.getSubmissionSourceCode());
                    out.println("*****************************************" + "\n");
                }
                out.close();
            }
        }catch(Exception e){
            e.printStackTrace();
        }
    }

}
