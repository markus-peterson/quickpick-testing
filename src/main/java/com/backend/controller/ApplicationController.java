package com.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.model.Application;
import com.backend.service.ApplicationService;

@RestController
@RequestMapping("/apps")
@CrossOrigin(origins = "*")
public class ApplicationController {
	
	@Autowired
	ApplicationService appService;
	
	@PostMapping("/acceptApp/{userId}")
	public String acceptJob(@PathVariable String userId, @RequestBody String jobId) {
		try {
			appService.acceptApplicant(jobId, userId);
			return "Job Accepted Successfully";
		} catch (Exception e) {
			return "Could Not Accept Job";
		}
	}
	
	@PostMapping("/apply")
	public String applyTo(@RequestBody Application app) {
		try {
			appService.addApplication(app);
			return "Applied Successfully";
		} catch (Exception e) {
			return "Could not apply";
		}
	}
	
	@GetMapping("/userApplications/{userId}")
	public List<Application> getApplied(@PathVariable String userId) {
		return appService.getUserApps(userId);
	}
	
	@PostMapping("/checkIfApplied")
	public String checkIfUsernameExists(@RequestBody Application app){
		return appService.checkIfApplied(app);
	}
}

