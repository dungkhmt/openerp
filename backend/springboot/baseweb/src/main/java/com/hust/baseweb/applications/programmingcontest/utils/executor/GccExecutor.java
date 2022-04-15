package com.hust.baseweb.applications.programmingcontest.utils.executor;



import com.hust.baseweb.applications.programmingcontest.constants.Constants;
import com.hust.baseweb.applications.programmingcontest.entity.TestCaseEntity;

import java.util.List;

public class GccExecutor {
    private static final String buildCmd = "g++ -o main main.cpp";
    private static final String suffixes =".cpp";
    private static final String SHFileStart = "#!/bin/bash\n";

    public GccExecutor(){

    }

    public String generateScriptFileWithTestCaseAndCorrectSolution(String source, String testCase, String tmpName, int timeLimit){

        String sourceSH = SHFileStart
                          + "mkdir -p " + tmpName +"\n"
                          + "cd " + tmpName +"\n"
                          + "cat <<EOF >> main"  + suffixes + "\n"
                          + source + "\n"
                          + "EOF" + "\n"
                          + "cat <<EOF >> testcase.txt \n"
                          + testCase +"\n"
                          + "EOF" + "\n"
                          + buildCmd +"\n"
                          + "FILE=main" +"\n"
                          +"if test -f \"$FILE\"; then" +"\n"
                          + "    cat testcase.txt | timeout " + timeLimit +"s " +"./main && echo -e \"\\nSuccessful\" || echo Time Limit Exceeded" + "\n"
                          + "else\n"
                          + "  echo Compile Error\n"
                          + "fi" + "\n"
                          + "cd .. \n"
                          + "rm -rf " + tmpName + " & "+"\n"
                          + "rm -rf " + tmpName+".sh" + " & "+"\n";

        return sourceSH;
    }

    public String checkCompile(String source, String tmpName){

        String sourceSH = SHFileStart
                          + "mkdir -p " + tmpName +"\n"
                          + "cd " + tmpName +"\n"
                          + "cat <<EOF >> main"  + suffixes + "\n"
                          + source + "\n"
                          + "EOF" + "\n"
                          + buildCmd +"\n"
                          + "FILE=main" +"\n"
                          +"if test -f \"$FILE\"; then" +"\n"
                          + "  echo Successful\n"
                          + "else\n"
                          + "  echo Compile Error\n"
                          + "fi" + "\n"
                          + "cd .. \n"
                          + "rm -rf " + tmpName + " & "+"\n"
                          + "rm -rf " + tmpName+".sh" + " & "+"\n";

        return sourceSH;
    }
    public String genSubmitScriptFileChecker(String sourceChecker, TestCaseEntity testCase, String solutionOutput, String tmpName, int timeLimit){
        System.out.println("genSubmitScriptFileChecker, sourceChecker = " + sourceChecker + " solutionOutput = " + solutionOutput);
        String genTestCase = "";
        //for(int i = 0; i < testCaseEntities.size(); i++){
            String testcase = "cat <<EOF >> testcase" + 0 + ".txt \n"
                              + testCase.getTestCase() +"\n"
                              + testCase.getCorrectAnswer() + "\n"
                              + solutionOutput + "\n"
                              +"EOF" + "\n";
            genTestCase += testcase;
        //}

        String sourceSH = SHFileStart
                          + "mkdir -p " + tmpName + "\n"
                          + "cd " + tmpName + "\n"
                          + "cat <<EOF >> main" + suffixes + "\n"
                          + sourceChecker + "\n"
                          + "EOF" + "\n"
                          + buildCmd + "\n"
                          + "FILE=main" + "\n"
                          + "if test -f \"$FILE\"; then" + "\n"
                          + genTestCase + "\n"
                          + "n=0\n"
                          + "start=$(date +%s%N)\n"
                          + "while [ \"$n\" -lt " + 1 + " ]" + "\n"
                          + "do\n"
                          + "f=\"testcase\"$n\".txt\"" + "\n"
                          + "cat $f | timeout " + timeLimit + "s " + "./main  || echo Time Limit Exceeded" + "\n"
                          + "echo " + Constants.SPLIT_TEST_CASE + "\n"
                          + "n=`expr $n + 1`\n"
                          + "done\n"
                          + "end=$(date +%s%N)\n"
                          + "echo \n"
                          + "echo \"$(($(($end-$start))/1000000))\"\n"
                          + "echo successful\n"
                          + "else\n"
                          + "echo Compile Error\n"
                          + "fi" + "\n"
                          + "cd .. \n"
                          + "rm -rf " + tmpName + " & " + "\n"
                          + "rm -rf " + tmpName + ".sh" + " & " + "\n";
        return sourceSH;

    }

    public String genSubmitScriptFile(List<TestCaseEntity> testCaseEntities, String source, String tmpName, int timeLimit){
        String genTestCase = "";
        for(int i = 0; i < testCaseEntities.size(); i++){
            String testcase = "cat <<EOF >> testcase" + i + ".txt \n"
                              + testCaseEntities.get(i).getTestCase() +"\n"
                              +"EOF" + "\n";
            genTestCase += testcase;
        }
        String sourceSH = SHFileStart
                          + "mkdir -p " + tmpName + "\n"
                          + "cd " + tmpName + "\n"
                          + "cat <<EOF >> main" + suffixes + "\n"
                          + source + "\n"
                          + "EOF" + "\n"
                          + buildCmd + "\n"
                          + "FILE=main" + "\n"
                          + "if test -f \"$FILE\"; then" + "\n"
                          + genTestCase + "\n"
                          + "n=0\n"
                          + "start=$(date +%s%N)\n"
                          + "while [ \"$n\" -lt " + testCaseEntities.size() + " ]" + "\n"
                          + "do\n"
                          + "f=\"testcase\"$n\".txt\"" + "\n"
                          + "cat $f | timeout " + timeLimit + "s " + "./main  || echo Time Limit Exceeded" + "\n"
                          + "echo " + Constants.SPLIT_TEST_CASE + "\n"
                          + "n=`expr $n + 1`\n"
                          + "done\n"
                          + "end=$(date +%s%N)\n"
                          + "echo \n"
                          + "echo \"$(($(($end-$start))/1000000))\"\n"
                          + "echo successful\n"
                          + "else\n"
                          + "echo Compile Error\n"
                          + "fi" + "\n"
                          + "cd .. \n"
                          + "rm -rf " + tmpName + " & " + "\n"
                          + "rm -rf " + tmpName + ".sh" + " & " + "\n";
        return sourceSH;
    }
}
