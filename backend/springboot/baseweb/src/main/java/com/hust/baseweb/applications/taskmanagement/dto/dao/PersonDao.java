package com.hust.baseweb.applications.taskmanagement.dto.dao;

import com.hust.baseweb.entity.Person;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class PersonDao {

    private UUID partyId;
    private String fullName;

    public PersonDao(Person person) {
        this.partyId = person.getPartyId();
        this.fullName = this.getFullNameRemoveNull(person);
    }

    private String getFullNameRemoveNull(Person person) {
        String firstName = person.getFirstName();
        String middleName = person.getMiddleName();
        String lastName = person.getLastName();
        String fullName = (firstName != null ? firstName + " " : "") +
                          (middleName != null ? middleName + " " : "") +
                          (lastName != null ? lastName : "");

        if (fullName == "") {
            return "Thành viên mặc định";
        } else if (fullName.startsWith("admin")) {
            return "admin";
        } else {
            return fullName;
        }
    }
}
