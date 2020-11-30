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
}