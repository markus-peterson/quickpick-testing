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
	
	@PostMapping("/acceptApp/{username}")
	public String acceptJob(@PathVariable String username, @RequestBody String jobID) {
		try {
			appService.acceptApplicant(jobID, username);
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
	
	@GetMapping("/userApplications/{username}")
	public List<Application> getApplied(@PathVariable String username) {
		return appService.getUserApps(username);
	}
	
	@PostMapping("/checkIfApplied")
	public String checkIfUsernameExists(@RequestBody Application app){
		return appService.checkIfApplied(app);
	}
}

