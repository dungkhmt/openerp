package com.hust.baseweb.applications.taskmanagement.service.implement;

import com.hust.baseweb.applications.taskmanagement.dto.dao.TaskExecutionDao;
import com.hust.baseweb.applications.taskmanagement.entity.Task;
import com.hust.baseweb.applications.taskmanagement.entity.TaskExecution;
import com.hust.baseweb.applications.taskmanagement.repository.TaskExecutionRepository;
import com.hust.baseweb.applications.taskmanagement.service.TaskExecutionService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class TaskExecutionServiceImplement implements TaskExecutionService {

    private final TaskExecutionRepository taskExecutionRepository;

    @Override
    public TaskExecution create(TaskExecution taskExecution) {
        return taskExecutionRepository.save(taskExecution);
    }

    @Override
    public boolean delete(UUID taskExecutionId) {
        taskExecutionRepository.deleteById(taskExecutionId);
        return true;
    }

    @Override
    public void deleteComment(UUID commentId) {
        TaskExecution taskExecution = taskExecutionRepository.findByTaskExecutionId(commentId);
        taskExecution.setComment("");
        taskExecutionRepository.save(taskExecution);
    }

    @Override
    public TaskExecution findById(UUID taskExecutionId) {
        return taskExecutionRepository.findByTaskExecutionId(taskExecutionId);
    }

    @Override
    public TaskExecution save(TaskExecution taskExecution) {
        return taskExecutionRepository.save(taskExecution);
    }

    @Override
    public List<TaskExecution> getAllCommentsByTaskId(UUID taskId) {
        return taskExecutionRepository.getAllCommentsByTaskId(taskId);
    }

    @Override
    public List<Object[]> getAllDistinctDay(UUID projectId) {
        return taskExecutionRepository.getAllDistinctDay(projectId);
    }

    public List<TaskExecutionDao> getAllTaskExecutionByDate(Date date, UUID projectId) {
        String dateStr = new SimpleDateFormat("yyyy-MM-dd").format(date);
        Date startDate = null;
        Date endDate = null;
        try {
            startDate = new SimpleDateFormat("yyyy-MM-dd H:m:s").parse(dateStr + " 00:00:00.00");
            endDate = new SimpleDateFormat("yyyy-MM-dd H:m:s").parse(dateStr + " 23:59:59.99");
        } catch (ParseException e) {
            e.printStackTrace();
        }

        List<TaskExecution> taskExecutionList = taskExecutionRepository.getAllTaskExecutionByDate(startDate, endDate, projectId);
        List<TaskExecutionDao> taskExecutionDaoList = new ArrayList<>();
        for(TaskExecution taskExecution : taskExecutionList){
            taskExecutionDaoList.add(new TaskExecutionDao(taskExecution));
        }

        return taskExecutionDaoList;
    }
}
