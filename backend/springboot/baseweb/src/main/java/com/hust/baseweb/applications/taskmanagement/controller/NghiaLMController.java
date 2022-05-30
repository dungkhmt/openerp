package com.hust.baseweb.applications.taskmanagement.controller;

import com.hust.baseweb.applications.taskmanagement.dto.dao.PersonDao;
import com.hust.baseweb.applications.taskmanagement.dto.dao.ProjectDao;
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

    @GetMapping("/nghialm")
    public ResponseEntity<?> testController() {
        String bodyResponse = "Hello Nghia Le Minh, test spring boot api";
        return ResponseEntity.ok().body(bodyResponse);
    }

    @GetMapping("/projects")
    public ResponseEntity<Object> getListProjects() {
        List<Project> listProject = projectService.getListProject();
        List<ProjectDao> projectDaos = new ArrayList<>();
        for(Project project: listProject){
            projectDaos.add(new ProjectDao(project));
        }
        return ResponseEntity.ok().body(projectDaos);
    }

    @PostMapping("/projects")
    public ResponseEntity<Object> postProjects(@RequestBody Project project) {
        return ResponseEntity.ok().body(projectService.createProject(project));
    }

    @GetMapping("/projects/{projectId}")
    public ResponseEntity<Object> getProject(@PathVariable("projectId") UUID projectId){
        return ResponseEntity.ok(new ProjectDao(projectService.getProjectById(projectId)));
    }

    @GetMapping("/projects/{projectId}/members")
    public ResponseEntity<Object> getMembersJoinedProject(@PathVariable("projectId") UUID projectId) {
        List<PersonDao> personDaos = new ArrayList<>();
        List<Person> persons = projectMemberService.getMemberIdJoinedProject(projectId);
        for(Person person: persons){
            personDaos.add(new PersonDao(person));
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

        return ResponseEntity.ok(projectMemberRepository.save(projectMember));
    }


    @GetMapping("/tasks")
    public ResponseEntity<Object> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<Object> getAllTasksInProject(@PathVariable("projectId") UUID projectId) {
        List<Task> tasks = taskService.getAllTaskInProject(projectId);

        return ResponseEntity.ok(tasks);
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
        task.setDueDate(new SimpleDateFormat("yyyy-MM-dd").parse(taskForm.getDueDate()));
        task.setProject(projectService.getProjectById(projectId));
        task.setStatusItem(taskService.getStatusItemByStatusId(taskForm.getStatusId()));
        task.setTaskCategory(taskCategoryService.getTaskCategory(taskForm.getCategoryId()));
        task.setTaskPriority(taskPriorityService.getTaskPriorityById(taskForm.getPriorityId()));
        task.setUserLoginId(principal.getName());
        Task taskRes = taskService.createTask(task);

        TaskAssignable taskAssignable = new TaskAssignable();
        taskAssignable.setTask(task);
        taskAssignable.setPartyId(UUID.fromString(taskForm.getPartyId()));
        taskAssignableService.create(taskAssignable);

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
        return ResponseEntity.ok(personService.getALL());
    }

    @GetMapping("/assigned-tasks-user-login")
    public ResponseEntity<Object> getAssignedTasksUserLogin(Principal principal) {
        String userLoginId = principal.getName();
        UserLogin userLogin = userService.findById(userLoginId);
        UUID partyId = userLogin.getParty().getPartyId();
        List<TaskAssignable> taskAssignableList = taskAssignableService.getByPartyId(partyId);
        List<Task> taskList = new ArrayList<>();
        for (TaskAssignable taskAssignable : taskAssignableList) {
            taskList.add(taskAssignable.getTask());
        }
        return ResponseEntity.ok(taskList);
    }

    @GetMapping("/projects/{projectId}/statics")
    public ResponseEntity<Object> getTasksStaticsInProject(@PathVariable("projectId") UUID projectID) {
        int sumTasks = 0;
        List<Object[]> listTasks = taskService.getTaskStaticsInProject(projectID);
        List<Map<String, String>> result = new ArrayList<>();
        if (listTasks != null && !listTasks.isEmpty()) {
            for (Object[] objects : listTasks) {
                sumTasks += (int) objects[2];
            }

            for (Object[] objects : listTasks) {
                Map<String, String> temp = new HashMap<>();
                temp.put((String) "id", (String) objects[0]);
                temp.put((String) "name", (String) objects[1]);
                temp.put((String) "value", String.valueOf(((int) objects[2] / ((float) sumTasks)) * 100));
                result.add(temp);
            }
        }

        return ResponseEntity.ok(result);
    }

}
