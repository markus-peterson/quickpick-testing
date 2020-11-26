package com.backend.service;

import java.util.List;

import com.backend.model.Job;

public interface JobServiceInterface {

	public Job addNewJob(Job job);
	
	public List<Job> getJobs();
	
	public Job getJobByID(String id);

//	List<Job> getJobsByFilter(Job jobDetails);
	
	public List<Job> getJobsByFilter(String searchKey, String location);

}