package com.hust.baseweb.applications.taskmanagement.dto.dao;

import com.hust.baseweb.applications.taskmanagement.entity.Project;
import com.hust.baseweb.applications.taskmanagement.entity.Task;
import com.hust.baseweb.applications.taskmanagement.entity.TaskCategory;
import com.hust.baseweb.applications.taskmanagement.entity.TaskPriority;
import com.hust.baseweb.entity.StatusItem;
import lombok.Getter;
import lombok.Setter;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Getter
@Setter
public class TaskDao {
    private static final String STATUS_DONE = "TASK_RESOLVED";

    private UUID id;

    private String name;

    private String description;

    private Project project;

    private TaskCategory taskCategory;

    private StatusItem statusItem;

    private TaskPriority taskPriority;

    private String dueDate;

    private String timeRemaining;

    private boolean outOfDate;

    public TaskDao(Task task) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        this.setId(task.getId());
        this.setName(task.getName());
        this.setProject(task.getProject());
        this.setTaskCategory(task.getTaskCategory());
        this.setDescription(task.getDescription() != null ? task.getDescription() : "Không có mô tả");
        this.setStatusItem(task.getStatusItem());
        this.setTaskPriority(task.getTaskPriority());
        this.setDueDate(sdf.format(task.getDueDate()));

        try {
            Date d1 = task.getDueDate();
            Date d2 = new Date();
            long differenceInTime = d1.getTime() - d2.getTime();
            long differenceInSeconds
                = TimeUnit.MILLISECONDS
                      .toSeconds(differenceInTime)
                  % 60;

            long differenceInMinutes
                = TimeUnit
                      .MILLISECONDS
                      .toMinutes(differenceInTime)
                  % 60;

            long differenceInHours
                = TimeUnit
                      .MILLISECONDS
                      .toHours(differenceInTime)
                  % 24;

            long differenceInDays
                = TimeUnit
                      .MILLISECONDS
                      .toDays(differenceInTime)
                  % 365;
            if (differenceInSeconds <= 0) {
                this.setTimeRemaining("Quá hạn " + String.valueOf(-differenceInDays) + "ngày, "
                                      + String.valueOf(-differenceInHours) + "giờ, "
                                      + String.valueOf(-differenceInMinutes) + "phút, "
                                      + String.valueOf(-differenceInSeconds) + "giây");
                this.setOutOfDate(true);
            } else {
                this.setTimeRemaining("Còn " + String.valueOf(differenceInDays) + "ngày, "
                                      + String.valueOf(differenceInHours) + "giờ, "
                                      + String.valueOf(differenceInMinutes) + "phút, "
                                      + String.valueOf(differenceInSeconds) + "giây tới hạn!");
                this.setOutOfDate(false);
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        if(this.getStatusItem() != null && (this.getStatusItem().getStatusId().equals(STATUS_DONE))){
            this.setOutOfDate(false);
            this.setTimeRemaining("");
        }
    }
}
