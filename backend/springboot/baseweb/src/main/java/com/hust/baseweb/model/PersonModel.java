package com.hust.baseweb.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PersonModel {

    private String userName;

    private String password;

    private List<String> roles;

    private String partyCode;

    private String firstName;

    private String lastName;

    private String middleName;

    private String gender;

    private Date birthDate;

    private String affiliations;

    public String getFullName(){
        return lastName + " " + middleName + " " + firstName;
    }
}
