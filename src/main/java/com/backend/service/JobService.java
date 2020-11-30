package com.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.dao.JobDao;
import com.backend.model.Job;

@Service
public class JobService implements JobServiceInterface {
	
	@Autowired
	private JobDao jobDao;

	@Override
	public Job addNewJob(Job jobDetails) {
		return jobDao.save(jobDetails);
	}

	@Override
	public List<Job> getJobs() {
		return (List<Job>) jobDao.findAll();
	}

	@Override
	public Job getJobByID(String id) {
		
		if(id != null) { 
			Job result = jobDao.findById(id).orElse(null);
			if(result!= null) {
				return result;
			}
		}
		return null;
	}
	
	public Boolean checkCreated(String author) {
		List<Job> jobs = jobDao.findAllByAuthor(author);
		if(jobs != null) {
			if(jobs.size() > 0) {
				return true;
			}else {
				return false;
			}
		}else {
			return false;
		}
	}
	
	public List<Job> getJobsByAuthor(String author){
		return jobDao.findAllByAuthor(author);
	}
	
	public List<Job> getJobsByFilter(String searchKey, String location) {
		
		List<Job> jobs;
		if((null == searchKey || searchKey.equals("")) && (null == location || location.equals("") )) {
			jobs= jobDao.findAll();
		}else if((null == location || location.equals(""))) {
			jobs= jobDao.findBySearchKeyword(searchKey);
		}else if((null == searchKey || searchKey.equals("") )) {
			jobs= jobDao.findBySearchLocation(location);
		}else {
			jobs = jobDao.findBySearchParams(searchKey, location);
		}
		return jobs;	
	}
	
	public Job updateJob(Job jobDetails) {
		if (jobDetails != null) {
			Job current = jobDao.findById(jobDetails.getId()).orElse(null);
			if (current != null) {
				current = jobDetails;
				if(!current.getCountry().equals(jobDetails.getCountry())) {
					current.setCountry(jobDetails.getCountry());
				}
				if(!current.getJobSalary().equals(jobDetails.getJobSalary())) {
					current.setJobSalary(jobDetails.getJobSalary());
				}
				if(!current.getJobTitle().equals(jobDetails.getJobTitle())) {
					current.setJobTitle(jobDetails.getJobTitle());
				}
				if(!current.getJobDescription().equals(jobDetails.getJobDescription())) {
					current.setJobDescription(jobDetails.getJobDescription());
				}
				if(!current.getOrganization().equals(jobDetails.getOrganization())) {
					current.setOrganization(jobDetails.getOrganization());
				}
				if(!current.getLocation().equals(jobDetails.getLocation())) {
					current.setLocation(jobDetails.getLocation());
				}
				if(!current.getPageUrl().equals(jobDetails.getPageUrl())) {
					current.setPageUrl(jobDetails.getPageUrl());
				}
				return jobDao.save(current);
			}
		}
		
		return null;
	}
}