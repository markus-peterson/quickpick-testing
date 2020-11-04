package com.backend.service;

import java.util.List;

import com.backend.model.Job;

public interface JobServiceInterface {

	public String addNewJob(Job job);
	
	public List<Job> getJobs();
	
	public Job getJobByID(String uniqueId);

	List<Job> getJobsByFilter(Job jobDetails);

}
