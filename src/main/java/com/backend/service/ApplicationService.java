package com.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.dao.ApplicationDao;
import com.backend.dao.UserDao;
import com.backend.model.Application;
import com.backend.model.User;

@Service
public class ApplicationService {
	
	@Autowired
	private ApplicationDao appDao;
	
	@Autowired
	private UserDao userDao;
	
	public Application addApplication(Application app) {
		Application newApp = app;
		newApp.setStatus("Pending");
		return appDao.save(newApp);
	}
	
	public List<Object> getApplicants(String jobId) {
		List<Application> apps = appDao.findAllByJobId(jobId);
		List<User> users = new ArrayList<>();
		List<Object> out = new ArrayList<>();
		
		for(Application app : apps) {
			User user = userDao.findById(app.getUserId()).orElse(null);
			if(user != null) {
				user.setPassword("");
				users.add(user);
			}
		}
		out.add(apps);
		out.add(users);
		return out;
	}
	
	public List<Application> getUserApps(String userId){
		return appDao.findAllByUserId(userId);
	}
	
	public Application acceptApplicant(String jobId, String userId) {
		List<Application> appList = appDao.findAllByJobId(jobId);
		for(Application app : appList) {
			if(app.getUserId().equals(userId)) {
				app.setStatus("Accepted");
				return appDao.save(app);
			}
		}
		return null;
	}
	
	public Application denyApplicant(String jobId, String userId) {
		List<Application> appList = appDao.findAllByJobId(jobId);
		for(Application app : appList) {
			if(app.getUserId().equals(userId)) {
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
