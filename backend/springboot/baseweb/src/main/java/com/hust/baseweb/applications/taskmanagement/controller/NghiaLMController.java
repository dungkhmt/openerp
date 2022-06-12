package com.hust.baseweb.applications.taskmanagement.controller;

import com.hust.baseweb.applications.taskmanagement.dto.dao.*;
import com.hust.baseweb.applications.taskmanagement.dto.form.CommentForm;
import com.hust.baseweb.applications.taskmanagement.dto.form.ProjectForm;
import com.hust.baseweb.applications.taskmanagement.dto.form.ProjectMemberForm;
import com.hust.baseweb.applications.taskmanagement.dto.form.TaskForm;
import com.hust.baseweb.applications.taskmanagement.entity.*;
import com.hust.baseweb.applications.taskmanagement.repository.ProjectMemberRepository;
import com.hust.baseweb.applications.taskmanagement.service.*;
import com.hust.baseweb.entity.Person;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.service.PartyService;
import com.hust.baseweb.service.UserService;
import com.hust.baseweb.service.PersonService;
import lombok.AllArgsConstructor;
import okhttp3.Response;
import org.bouncycastle.cert.ocsp.RespID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@CrossOrigin
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class NghiaLMController {

    private final ProjectService projectService;

    private final ProjectMemberService projectMemberService;

    private final ProjectMemberRepository projectMemberRepository;

    private final PartyService partyService;

    private final PersonService personService;

    private final TaskService taskService;

    private final TaskCategoryService taskCategoryService;

    private final TaskPriorityService taskPriorityService;

    private final TaskAssignableService taskAssignableService;

    private final UserService userService;

    private final TaskStatusService taskStatusService;

    private final TaskExecutionService taskExecutionService;

    @GetMapping("/nghialm")
    public ResponseEntity<?> testController() {
        String bodyResponse = "Hello Nghia Le Minh, test spring boot api";
        return ResponseEntity.ok().body(bodyResponse);
    }

    @GetMapping("/projects")
    public ResponseEntity<Object> getListProjects() {
        List<Project> listProject = projectService.getListProject();
        List<ProjectDao> projectDaos = new ArrayList<>();
        for (Project project : listProject) {
            projectDaos.add(new ProjectDao(project));
        }
        return ResponseEntity.ok().body(projectDaos);
    }

    @PostMapping("/projects")
    public ResponseEntity<Object> postProjects(Principal principal, @RequestBody Project project) {
        String userLoginId = principal.getName();
        UserLogin userLogin = userService.findById(userLoginId);
        UUID partyId = userLogin.getParty().getPartyId();
        Project projectRes = projectService.createProject(project);
        ProjectMember projectMember = new ProjectMember();
        ProjectMemberId projectMemberId = new ProjectMemberId();
        projectMemberId.setProjectId(projectRes.getId());
        projectMemberId.setPartyID(partyId);
        projectMember.setId(projectMemberId);
        projectMemberService.create(projectMember);
        return ResponseEntity.ok().body(projectRes);
    }

    @GetMapping("/projects/{projectId}")
    public ResponseEntity<Object> getProject(@PathVariable("projectId") UUID projectId) {
        return ResponseEntity.ok(new ProjectDao(projectService.getProjectById(projectId)));
    }

    @GetMapping("/projects/{projectId}/members")
    public ResponseEntity<Object> getMembersJoinedProject(@PathVariable("projectId") UUID projectId) {
        List<PersonDao> personDaos = new ArrayList<>();
        List<Person> persons = projectMemberService.getMemberIdJoinedProject(projectId);
        for (Person person : persons) {
            String userLoginIdTemp = projectMemberService.getUserLoginByPartyId(person.getPartyId()).getUserLoginId();
            personDaos.add(new PersonDao(person, userLoginIdTemp));
        }
        return ResponseEntity.ok(personDaos);
    }

    @PostMapping("/projects/{projectId}/members")
    public ResponseEntity<Object> addMemberToProject(
        @PathVariable("projectId") UUID projectId, @RequestBody
        ProjectMemberForm projectMemberForm
    ) {
        ProjectMember projectMember = new ProjectMember();
        ProjectMemberId projectMemberId = new ProjectMemberId();
        projectMemberId.setProjectId(UUID.fromString(projectMemberForm.getProjectId()));
        projectMemberId.setPartyID((UUID.fromString(projectMemberForm.getPartyId())));
        projectMember.setId(projectMemberId);

        return ResponseEntity.ok(projectMemberService.create(projectMember));
    }


    @GetMapping("/tasks")
    public ResponseEntity<Object> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<Object> getAllTasksInProject(@PathVariable("projectId") UUID projectId) {
        List<Task> tasks = taskService.getAllTaskInProject(projectId);
        List<TaskDao> taskDaoList = new ArrayList<>();
        for (Task task : tasks) {
            TaskAssignable taskAssignable = taskAssignableService.getByTaskId(task.getId());
            String userLoginIdTemp = "";
            String fullName = "Không xác định";
            if (taskAssignable != null) {
                UUID partyId = taskAssignable.getPartyId();
                userLoginIdTemp = projectMemberService.getUserLoginByPartyId(partyId).getUserLoginId();
                fullName = new PersonDao(personService.findByPartyId(partyId), userLoginIdTemp).getFullName();
            }

            taskDaoList.add(new TaskDao(task, userLoginIdTemp + " (" + fullName + ")"));
        }

        return ResponseEntity.ok(taskDaoList);
    }

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<Object> createNewTask(
        Principal principal,
        @RequestBody TaskForm taskForm,
        @PathVariable("projectId") UUID projectId
    ) throws ParseException {
        Task task = new Task();
        task.setName(taskForm.getName());
        task.setDescription(taskForm.getDescription());
        task.setAttachmentPaths(taskForm.getAttachmentPaths());
        task.setDueDate(taskForm.getDueDate());
        task.setProject(projectService.getProjectById(projectId));
        task.setStatusItem(taskService.getStatusItemByStatusId(taskForm.getStatusId()));
        task.setTaskCategory(taskCategoryService.getTaskCategory(taskForm.getCategoryId()));
        task.setTaskPriority(taskPriorityService.getTaskPriorityById(taskForm.getPriorityId()));
        task.setCreatedByUserLoginId(principal.getName());
        Task taskRes = taskService.createTask(task);

        TaskAssignable taskAssignable = new TaskAssignable();
        taskAssignable.setTask(task);
        taskAssignable.setPartyId(UUID.fromString(taskForm.getPartyId()));
        taskAssignableService.create(taskAssignable);

        TaskExecution taskExecution = new TaskExecution();
        taskExecution.setTask(taskRes);
        taskExecution.setCreatedByUserLoginId(principal.getName());
        taskExecution.setExecutionTags("issue");
        taskExecution.setProjectId(projectId);
        taskExecutionService.create(taskExecution);
        return ResponseEntity.ok(taskRes);
    }

    @GetMapping("/task-categories")
    public ResponseEntity<Object> getListCategories() {
        return ResponseEntity.ok(taskCategoryService.getAllTaskCategory());
    }

    @GetMapping("/task-priorities")
    public ResponseEntity<Object> getListPriorities() {
        return ResponseEntity.ok(taskPriorityService.getAll());
    }

    @GetMapping("/task-persons")
    public ResponseEntity<Object> getListPersons() {
        List<PersonDao> personDaos = new ArrayList<>();
        List<Person> persons = personService.getALL();
        for (Person person : persons) {
            String userLoginIdTemp = projectMemberService.getUserLoginByPartyId(person.getPartyId()).getUserLoginId();
            personDaos.add(new PersonDao(person, userLoginIdTemp));
        }
        return ResponseEntity.ok(personDaos);
    }

    @GetMapping("/assigned-tasks-user-login")
    public ResponseEntity<Object> getAssignedTasksUserLogin(Principal principal) {
        String userLoginId = principal.getName();
        UserLogin userLogin = userService.findById(userLoginId);
        UUID partyId = userLogin.getParty().getPartyId();
        List<TaskAssignable> taskAssignableList = taskAssignableService.getByPartyId(partyId);
        List<TaskDao> taskDaoList = new ArrayList<>();
        for (TaskAssignable taskAssignable : taskAssignableList) {
            String userLoginIdTemp = projectMemberService
                .getUserLoginByPartyId(taskAssignable.getPartyId())
                .getUserLoginId();
            PersonDao personDao = new PersonDao(
                personService.findByPartyId(taskAssignable.getPartyId()),
                userLoginIdTemp);
            taskDaoList.add(new TaskDao(
                taskAssignable.getTask(),
                personDao.getUserLoginId() + " (" + personDao.getFullName() + ")"));
        }
        return ResponseEntity.ok(taskDaoList);
    }

    @GetMapping("/projects/{projectId}/statics/{type}")
    public ResponseEntity<Object> getTasksStaticsInProject(
        @PathVariable("projectId") UUID projectID,
        @PathVariable("type") String type
    ) {
        int sumTasks = 0;
        List<Object[]> listTasks = null;

        if (type.equals("category")) {
            listTasks = taskService.getTaskStaticsCategoryInProject(projectID);
        } else if (type.equals("status")) {
            listTasks = taskService.getTaskStaticsStatusInProject(projectID);
        }

        List<Map<String, String>> result = new ArrayList<>();
        if (listTasks != null && !listTasks.isEmpty()) {
            for (Object[] objects : listTasks) {
                sumTasks += (int) objects[2];
            }
            for (Object[] objects : listTasks) {
                Map<String, String> temp = new HashMap<>();
                temp.put("id", (String) objects[0]);
                temp.put("name", (String) objects[1]);
                temp.put(
                    "value",
                    String.valueOf(Math.round(((int) objects[2] * 100 / (sumTasks * 1.0)) * 100.0) / 100.0));
                result.add(temp);
            }
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/task-status-list")
    public ResponseEntity<Object> getListTaskStatus() {
        return ResponseEntity.ok(taskStatusService.getAllTaskStatus());
    }

    @GetMapping("/tasks/{taskId}/status/{statusId}")
    public ResponseEntity<Object> updateStatusTask(
        @PathVariable("taskId") UUID taskId,
        @PathVariable("statusId") String statusId
    ) {
        Task task = taskService.getTask(taskId);
        task.setStatusItem(taskService.getStatusItemByStatusId(statusId));
        return ResponseEntity.ok(taskService.updateTask(task));
    }

    @PutMapping("/projects/{projectId}")
    public ResponseEntity<Object> updateProject(
        @PathVariable("projectId") UUID projectId,
        @RequestBody ProjectForm projectForm
    ) {
        Project project = projectService.getProjectById(projectId);
        project.setName(projectForm.getName());
        project.setCode(projectForm.getCode());
        return ResponseEntity.ok(projectService.save(project));
    }

    @DeleteMapping("/projects/{projectId}")
    public ResponseEntity<Object> deleteProject(@PathVariable("projectId") UUID projectId) {
        projectService.deleteProjectById(projectId);
        return ResponseEntity.ok("delete success!");
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<Object> showTask(@PathVariable("taskId") UUID taskId) {
        Task task = taskService.getTask(taskId);
        String assignee = "";
        if (taskAssignableService.getByTaskId(taskId) != null) {
            UUID partyId = taskAssignableService.getByTaskId(taskId).getPartyId();
            assignee = projectMemberService.getUserLoginByPartyId(partyId).getUserLoginId();
        }

        return ResponseEntity.ok(new TaskDao(task, assignee));
    }

    @PostMapping("/tasks/{taskId}/comment")
    public ResponseEntity<Object> commentOnTask(
        Principal principal,
        @PathVariable("taskId") UUID taskId,
        @RequestBody CommentForm commentForm
    ) {
        TaskExecution taskExecution = new TaskExecution();
        taskExecution.setComment(commentForm.getComment());
        Task task = taskService.getTask(taskId);
        taskExecution.setTask(task);
        taskExecution.setCreatedByUserLoginId(principal.getName());
        taskExecution.setProjectId(commentForm.getProjectId());
        taskExecution.setExecutionTags("comment");
        return ResponseEntity.ok(taskExecutionService.create(taskExecution));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Object> deleteComment(@PathVariable("commentId") UUID commentId) {
        taskExecutionService.delete(commentId);
        return ResponseEntity.ok("success");
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<Object> updateCommentOnTask(
        @PathVariable("commentId") UUID commentId,
        @RequestBody CommentForm commentForm
    ) {
        TaskExecution taskExecution = taskExecutionService.findById(commentId);
        taskExecution.setComment(commentForm.getComment());
        return ResponseEntity.ok(taskExecutionService.save(taskExecution));
    }

    @GetMapping("/tasks/{taskId}/comments")
    public ResponseEntity<Object> getAllComments(@PathVariable("taskId") UUID taskId) {
        List<TaskExecution> taskExecutions = taskExecutionService.getAllCommentsByTaskId(taskId);
        List<CommentDao> commentDaos = new ArrayList<>();
        for (TaskExecution taskExecution : taskExecutions) {
            commentDaos.add(new CommentDao(taskExecution));
        }
        return ResponseEntity.ok(commentDaos);
    }

    @GetMapping("/projects/{projectId}/history")
    public ResponseEntity<Object> getHistory(@PathVariable("projectId") UUID projectId) {
        List<HistoryDao> historyDaos = new ArrayList<>();
        List<Object[]> objects = taskExecutionService.getAllDistinctDay(projectId);
        for(Object[] object: objects){
            Date date = (Date) object[0];
            String dateStr = new SimpleDateFormat("E, dd MMM yyyy").format(date);
            HistoryDao historyDao = new HistoryDao();
            historyDao.setDate(dateStr);
            historyDao.setTaskExecutionList(taskExecutionService.getAllTaskExecutionByDate(date, projectId));
            historyDaos.add(historyDao);
        }
        return ResponseEntity.ok(historyDaos);
    }
}
