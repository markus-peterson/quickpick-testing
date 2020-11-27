package com.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.dao.ApplicationDao;
import com.backend.model.Application;

@Service
public class ApplicationService {
	
	@Autowired
	private ApplicationDao appDao;
	
	public Application addApplication(Application app) {
		Application newApp = app;
		newApp.setStatus("Pending");
		return appDao.save(newApp);
	}
	
	public List<Application> getApplicants(String jobId) {
		return appDao.findAllByJobId(jobId);
	}
	
	public List<Application> getUserApps(String userId){
		return appDao.findAllByUserId(userId);
	}
	
	public Application acceptApplicant(String jobId, String userId) {
		List<Application> appList = appDao.findAllByJobId(jobId);
		for(Application app : appList) {
			if(app.getUserId().equals(userId) && app.getStatus().equals("Pending")) {
				app.setStatus("Accepted");
				return appDao.save(app);
			}
		}
		return null;
	}
	
	public Application denyApplicant(String jobId, String userId) {
		List<Application> appList = appDao.findAllByJobId(jobId);
		for(Application app : appList) {
			if(app.getUserId().equals(userId) && app.getStatus().equals("Pending")) {
				app.setStatus("Denied");
				return appDao.save(app);
			}
		}
		return null;
	}
	
	public String checkIfApplied(Application app) {
		if(app != null) {
			List<Application> appList = appDao.findAllByJobId(app.getJobId());
			for(Application apps : appList) {
				if(apps.getUserId().equals(app.getUserId())) {
					return apps.getStatus();
				}
			}
			return null;
		}
		return null;
	}
}
