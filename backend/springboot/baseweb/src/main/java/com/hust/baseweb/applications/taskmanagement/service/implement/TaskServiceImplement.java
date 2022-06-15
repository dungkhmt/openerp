package com.hust.baseweb.applications.taskmanagement.service.implement;

import com.hust.baseweb.applications.taskmanagement.dto.form.TaskForm;
import com.hust.baseweb.applications.taskmanagement.dto.form.TaskStatusForm;
import com.hust.baseweb.applications.taskmanagement.entity.*;
import com.hust.baseweb.applications.taskmanagement.repository.TaskAssignableRepository;
import com.hust.baseweb.applications.taskmanagement.repository.TaskExecutionRepository;
import com.hust.baseweb.applications.taskmanagement.repository.TaskRepository;
import com.hust.baseweb.applications.taskmanagement.service.*;
import com.hust.baseweb.entity.StatusItem;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.hust.baseweb.repo.StatusItemRepo;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class TaskServiceImplement implements TaskService {

    private final TaskRepository taskRepository;

    private final StatusItemRepo statusItemRepo;

    private TaskAssignableRepository taskAssignableRepository;

    private ProjectService projectService;

    private TaskCategoryService taskCategoryService;

    private TaskPriorityService taskPriorityService;

    private TaskExecutionRepository taskExecutionRepository;

    private ProjectMemberService projectMemberService;

    @Override
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public List<Task> getAllTaskInProject(UUID projectId) {
        return taskRepository.findAllTasksByProjectId(projectId);
    }

    @Override
    public List<Object[]> getTaskStaticsCategoryInProject(UUID projectId) {
        return taskRepository.getTaskStaticsCategoryInProject(projectId);
    }

    @Override
    public List<Object[]> getTaskStaticsStatusInProject(UUID projectId) {
        return taskRepository.getTaskStaticsStatusInProject(projectId);
    }

    @Override
    public StatusItem getStatusItemByStatusId(String statusId) {
        return statusItemRepo.findByStatusId(statusId);
    }

    @Override
    public Task getTask(UUID taskId) {
        return taskRepository.getOne(taskId);
    }

    @Override
    public Task updateTasks(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public Task updateStatusTask(UUID taskId, TaskStatusForm taskStatusForm, String userLoginId) {
        Task task = this.getTask(taskId);
        Date oldDueDate = task.getDueDate();
        StatusItem oldStatusItem = task.getStatusItem();
        StatusItem statusItem = this.getStatusItemByStatusId(taskStatusForm.getStatusId());
        task.setStatusItem(statusItem);
        task.setDueDate(taskStatusForm.getDueDate());
        Task taskRes = taskRepository.save(task);

        TaskAssignable taskAssignable = taskAssignableRepository.getByTaskId(taskId);
        UUID partyIdOld = taskAssignable.getPartyId();
        if(!taskAssignable.getPartyId().toString().equals(taskStatusForm.getPartyId().toString())){
            taskAssignable.setPartyId(taskStatusForm.getPartyId());
        }
        taskAssignableRepository.save(taskAssignable);

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        String assignee = projectMemberService.getUserLoginByPartyId(taskStatusForm.getPartyId()).getUserLoginId();
        String dueDate = sdf.format(taskStatusForm.getDueDate());
        TaskExecution taskExecution = new TaskExecution();
        taskExecution.setTask(taskRes);
        taskExecution.setExecutionTags("updated");
        taskExecution.setCreatedByUserLoginId(userLoginId);
        taskExecution.setProjectId(task.getProject().getId());
        if(!taskStatusForm.getStatusId().equals(oldStatusItem.getStatusId())){
            taskExecution.setStatus(statusItem.getDescription());
        }

        if(!partyIdOld.toString().equals(taskStatusForm.getPartyId().toString())){
            taskExecution.setAssignee(assignee);
        }

        if(!sdf.format(taskStatusForm.getDueDate()).equals(sdf.format(oldDueDate))){
            taskExecution.setDueDate(dueDate);
        }

        taskExecutionRepository.save(taskExecution);
        return taskRes;
    }

    @Override
    public Task updateTask(UUID taskId, TaskForm taskForm, String createdByUserLoginId) {
        StatusItem statusItem = this.getStatusItemByStatusId(taskForm.getStatusId());
        TaskPriority taskPriority = taskPriorityService.getTaskPriorityById(taskForm.getPriorityId());
        TaskCategory taskCategory = taskCategoryService.getTaskCategory(taskForm.getCategoryId());
        String assignee = projectMemberService.getUserLoginByPartyId(taskForm.getPartyId()).getUserLoginId();
        String temp = taskForm.getAttachmentPaths().split(",")[0];
        String fileName = !temp.equals("") ? temp : "Không có tệp đính kèm";

        Task task = this.getTask(taskId);
        Task oldTask = new Task(task);
        task.setName(taskForm.getName());
        task.setDescription(taskForm.getDescription());
        task.setAttachmentPaths(taskForm.getAttachmentPaths());
        task.setDueDate(taskForm.getDueDate());
        task.setProject(projectService.getProjectById(taskForm.getProjectId()));
        task.setStatusItem(statusItem);
        task.setTaskCategory(taskCategory);
        task.setTaskPriority(taskPriority);
        task.setCreatedByUserLoginId(createdByUserLoginId);

        Task taskRes = taskRepository.save(task);

        TaskAssignable taskAssignable = taskAssignableRepository.getByTaskId(taskId);
        UUID oldPartyId = taskAssignable.getPartyId();
        if(taskAssignable.getPartyId() != taskForm.getPartyId()){
            taskAssignable.setPartyId(taskForm.getPartyId());
        }
        taskAssignableRepository.save(taskAssignable);

        TaskExecution taskExecution = new TaskExecution();
        taskExecution.setTask(taskRes);
        taskExecution.setCreatedByUserLoginId(createdByUserLoginId);
        taskExecution.setExecutionTags("updated");
        taskExecution.setProjectId(taskForm.getProjectId());

        if(!taskForm.getCategoryId().equals(oldTask.getTaskCategory().getCategoryId())){
            taskExecution.setCategory(taskCategory.getCategoryName());
        }

        if(!taskForm.getName().equals(oldTask.getName())){
            taskExecution.setTaskName(taskForm.getName());
        }

        if(!taskForm.getDescription().equals(oldTask.getDescription())){
            taskExecution.setTaskDescription(taskForm.getDescription());
        }

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        if(!sdf.format(taskForm.getDueDate()).equals(sdf.format(oldTask.getDueDate()))){
            taskExecution.setDueDate(sdf.format(taskForm.getDueDate()));
        }

        if(!taskForm.getStatusId().equals(oldTask.getStatusItem().getStatusId())){
            taskExecution.setStatus(statusItem.getDescription());
        }

        if(!oldPartyId.toString().equals(taskForm.getPartyId().toString())){
            taskExecution.setAssignee(assignee);
        }

        if(!taskForm.getPriorityId().equals(oldTask.getTaskPriority().getPriorityId())){
            taskExecution.setPriority(taskPriorityService.getTaskPriorityById(taskForm.getPriorityId()).getPriorityName());
        }

        if(!taskForm.getAttachmentPaths().equals(oldTask.getAttachmentPaths())){
            taskExecution.setFileName(fileName);
        }
        taskExecutionRepository.save(taskExecution);
        return taskRepository.save(taskRes);
    }
}
