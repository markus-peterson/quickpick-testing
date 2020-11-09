package com.backend.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.model.Application;

@Repository
public interface ApplicationDao extends JpaRepository<Application, String> {

	List<Application> findAllByJobID(String jobID);
	
	List<Application> findAllByUsername(String username);
	
}
