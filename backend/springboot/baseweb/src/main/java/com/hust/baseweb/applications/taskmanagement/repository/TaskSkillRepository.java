package com.hust.baseweb.applications.taskmanagement.repository;

import com.hust.baseweb.applications.taskmanagement.entity.TaskSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface TaskSkillRepository extends JpaRepository<TaskSkill, Integer>, CrudRepository<TaskSkill, Integer> {

}
