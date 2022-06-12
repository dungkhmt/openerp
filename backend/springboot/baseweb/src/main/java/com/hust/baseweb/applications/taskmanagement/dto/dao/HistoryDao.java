package com.hust.baseweb.applications.taskmanagement.dto.dao;

import com.hust.baseweb.applications.taskmanagement.entity.TaskExecution;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class HistoryDao {
    private String date;
    private List<TaskExecution> taskExecutionList;
}
