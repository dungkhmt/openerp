package com.hust.baseweb.applications.taskmanagement.dto.form;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class BoardFilterInputForm {
    private UUID projectId;
    private String categoryId;
    private UUID partyId;
}
