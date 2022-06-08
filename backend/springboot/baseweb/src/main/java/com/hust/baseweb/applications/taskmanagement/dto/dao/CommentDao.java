package com.hust.baseweb.applications.taskmanagement.dto.dao;

import com.hust.baseweb.applications.taskmanagement.entity.TaskExecution;
import lombok.Getter;
import lombok.Setter;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
public class CommentDao {
    private UUID id;
    private UUID taskId;
    private String createdByUserId;
    private String executionTag;
    private String comment;
    private String createdDate;

    public CommentDao(TaskExecution taskExecution){
        SimpleDateFormat sdf = new SimpleDateFormat("E, dd MMM yyyy H:m:s");
        this.setId(taskExecution.getId());
        this.setTaskId(taskExecution.getTask().getId());
        this.setCreatedByUserId(taskExecution.getCreatedByUserLoginId());
        this.setExecutionTag(taskExecution.getExecutionTags());
        this.setComment(taskExecution.getComment());
        this.setCreatedDate(taskExecution.getCreatedStamp() != null ? sdf.format(taskExecution.getCreatedStamp()) : null);
    }
}
