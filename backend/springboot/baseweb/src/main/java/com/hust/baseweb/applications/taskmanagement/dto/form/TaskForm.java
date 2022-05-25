package com.hust.baseweb.applications.taskmanagement.dto.form;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaskForm {

    private String name;
    private String description;
    private String dueDate;
    private String attachmentPaths;
    private String projectId;
    private String statusId;
    private String priorityId;
    private String categoryId;
    private String partyId;
}
