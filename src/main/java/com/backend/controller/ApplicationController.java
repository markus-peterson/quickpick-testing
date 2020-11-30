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
	
	@PostMapping("/acceptApp")
	public Application acceptApp(@RequestBody List<String> ids) {
		return appService.acceptApplicant(ids.get(0), ids.get(1));
	}
	
	@PostMapping("/denyApp")
	public Application denyApp(@RequestBody List<String> ids) {
		return appService.denyApplicant(ids.get(0), ids.get(1));
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
	
	@GetMapping("/jobApplicants/{jobId}")
	public List<Object> getApplicants(@PathVariable String jobId) {
		return appService.getApplicants(jobId);
	}
	
	@PostMapping("/checkIfApplied")
	public String checkIfUsernameExists(@RequestBody Application app){
		return appService.checkIfApplied(app);
	}
}

