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
import org.springframework.web.bind.annotation.RestController;

import com.backend.model.Shift;
import com.backend.service.ShiftService;

@RestController
@RequestMapping("/shift")
@CrossOrigin(origins = "*")
public class ShiftController {

	@Autowired
	ShiftService shiftService;
	
	@GetMapping("/getShifts")
	public List<Shift> getShifts(){
		return shiftService.getShifts();
	}
	
	@GetMapping("/getShiftById/{applicationId}")
	public Shift getShiftById(@PathVariable String id){
		return shiftService.getShiftById(id);
	}
	
	@PostMapping("/postShift/{applicationId}")
	public String postShift(@PathVariable String applicationId, @RequestBody Shift shift){
		return shiftService.postShift(applicationId, shift);
	}

	@GetMapping("/getShiftApp/{applicationId}")
	public List<Shift> getShiftApp(@PathVariable String applicationId){
		return shiftService.getShiftApp(applicationId);
	}
	
	@GetMapping("/getShiftUser/{userId}")
	public List<Shift> getShiftUser(@PathVariable String userId){
		return shiftService.getShiftUser(userId);
	}

	@PostMapping("/approveShift/{id}")
	public String approveShift(@PathVariable String id){
		return shiftService.approveShift(id);
	}
	
	@PostMapping("/denyShift/{id}")
	public String denyShift(@PathVariable String id){
		return shiftService.denyShift(id);
	}

	@PostMapping("/updateShift/{id}")
	public String updateShift(@PathVariable String id, @RequestBody Shift shift){
		return shiftService.updateShift(id, shift);
	}
	
	@DeleteMapping("/deleteShiftById/{id}")
	public String deleteShiftById(@PathVariable String id) {
		return shiftService.deleteShiftById(id);
	}
}