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

import com.backend.model.Shift;
import com.backend.service.ShiftService;

@RestController
@RequestMapping("/shift")
@CrossOrigin(origins = "*")
public class ShiftController {
	
	@Autowired
	ShiftService shiftService;
	
	@PostMapping("/postShift/{username}/{applicationId}")
	public String postShift(@PathVariable String username, @PathVariable String applicationId, @RequestBody Shift shift){
		return shiftService.postShift(username, applicationId, shift);
	}
	
	@GetMapping("/getShift/{applicationId}")
	public List<Shift> getShift(@PathVariable String applicationId){
		return shiftService.getShift(applicationId);
	}
	
	@PostMapping("/approveShift/{id}")
	public String approveShift(@PathVariable String id){
		return shiftService.approveShift(id);
	}
	
	@PostMapping("/updateShift/{id}")
	public String updateShift(@PathVariable String id, @RequestBody Shift shift){
		return shiftService.updateShift(id, shift);
	}
}