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

import com.backend.model.Job;
import com.backend.service.JobService;

@RestController
@RequestMapping("/job")
@CrossOrigin(origins = "*")
public class JobController {

	@Autowired
	JobService jobService;
	
	@GetMapping("/getAllJobs")
	public List<Job> getUsers(){
		return jobService.getJobs();
	}
	
	@GetMapping("/getJob/{uniqueId}")
	public Job getUser(@PathVariable String uniqueId) {
		return jobService.getJobByID(uniqueId);
	}

	@PostMapping("/createJob")
	public String createJob(@RequestBody Job jobDetails) {
		try {
			jobService.addNewJob(jobDetails);
			return "Job Created Successfully";
		} catch (Exception e) {
			return "Could Not Create Job";
		}
	}
	
}
