package com.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
	public List<Job> getJobs(){
		return jobService.getJobs();
	}
	
	@GetMapping("/getJob/{id}")
	public Job getjob(@PathVariable String id) {
		return jobService.getJobById(id);
	}
	
	@GetMapping("/checkByAuthor/{author}")
	public Boolean checkByAuthor(@PathVariable String author) {
		return jobService.checkCreated(author);
	}
	
	@GetMapping("/getByAuthor/{author}")
	public List<Job> getByAuthor(@PathVariable String author) {
		return jobService.getJobsByAuthor(author);
	}
	
	@GetMapping("/getJobsByFilter")
	public List<Job> getjobBySearchKey(@RequestParam("searchKey") String searchKey, @RequestParam("location") String location ) {
		return jobService.getJobsByFilter(searchKey, location);
	}

	@PostMapping("/createJob")
	public Job createJob(@RequestBody Job jobDetails) {
		return jobService.addNewJob(jobDetails);
	}
	
	@PostMapping("/updateJob")
	public String updateJob(@RequestBody Job jobDetails) {
		try {
			jobService.updateJob(jobDetails);
			return "Job Updated Successfully";
		} catch (Exception e) {
			return "Could Not Create Job";
		}
	}
	@DeleteMapping("/deleteJob/{id}")
	public String deleteJob(@PathVariable String id) {
		return jobService.deleteJob(id);
	}
}
