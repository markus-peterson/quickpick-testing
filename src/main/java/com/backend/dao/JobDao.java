package com.backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.model.Job;

@Repository
public interface JobDao extends JpaRepository<Job, Integer>{


	Job findByUniqueId(String uniqueId);

	
}
