package com.hust.baseweb.applications.programmingcontest.utils.codesimilaritycheckingalgorithms;

public class CodeSimilarityCheck {
    public static double check(String code1, String code2){
        if(code1.equals(code2)) return 1;
        return 0;
    }
}
