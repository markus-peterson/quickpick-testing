package com.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.dao.JobDao;
import com.backend.model.Job;

@Service
public class JobService implements JobServiceInterface{
	
	@Autowired
	private JobDao jobDao;

	@Override
	public String addNewJob(Job jobDetails ) {
		jobDao.save(jobDetails);
		return "Job Added";
	}

	@Override
	public List<Job> getJobs() {
		return (List<Job>) jobDao.findAll();
	}

	@Override
	public Job getJobByID(String uniqueId) {
		
		if(uniqueId != null) { 
			Job result = jobDao.findByUniqueId(uniqueId);
			if(result!= null) {
				return result;
			}
		}
		return null;
	}
	
	
	@Override
	public List<Job> getJobsByFilter(Job jobDetails ) {
		
//		if(uniqueId != null) { 
//			Job result = jobDao.findByUniqueId(uniqueId);
//			if(result!= null) {
//				return result;
//			}
//		}
		return null;
	}
}
