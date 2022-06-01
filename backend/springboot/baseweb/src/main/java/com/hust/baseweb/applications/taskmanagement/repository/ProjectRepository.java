package com.hust.baseweb.applications.taskmanagement.repository;

import com.hust.baseweb.applications.taskmanagement.entity.Project;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;


public interface ProjectRepository extends JpaRepository<Project, Integer>, CrudRepository<Project, Integer> {

    Project findById(UUID id);
}