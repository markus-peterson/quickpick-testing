package com.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.dao.ApplicationDao;
import com.backend.dao.ShiftDao;
import com.backend.dao.UserDao;
import com.backend.model.Application;
import com.backend.model.Shift;
import com.backend.model.User;

@Service
public class ShiftService {

	@Autowired
	private ShiftDao shiftDao;

	@Autowired
	private ApplicationDao applicationDao;

	@Transactional
	public String postShift(String applicationId, Shift shift) {
		if(shift != null && applicationDao.existsById(applicationId)) {
			Application currentApplication = applicationDao.findById(applicationId).orElse(null);
			if(currentApplication != null && shift.isValid()) {
				shiftDao.save(shift);
				shift.setApplicationId(applicationId);
				return "Post Shift " + shift.toString() + " Success";
			}
			return "Post Shift " + shift.toString() + " Failed: Must be accepted to post shift";
		}
		return "Post Shift " + shift.toString() + " Failed: Unknown error";
	}

	@Transactional
	public List<Shift> getShiftApp(String applicationId) {
		return shiftDao.findByApplicationId(applicationId);
	}

	@Transactional
	public String updateShift(String id, Shift shift) {
		try {
			Shift currentShift = shiftDao.findById(id).orElse(null);
			currentShift.setStartYear(shift.getStartYear() != 0 ? shift.getStartYear() : currentShift.getStartYear());
			currentShift.setStartMonth(shift.isValidMonth() ? shift.getStartMonth() : currentShift.getStartMonth());
			currentShift.setStartDay(shift.isValidDay() ? shift.getStartDay() : currentShift.getStartDay());
			currentShift.setStartHour(shift.isValidHour() ? shift.getStartHour(): currentShift.getStartHour());
			currentShift.setStartMinute(shift.isValidMinute() ? shift.getStartMinute() : currentShift.getStartMinute());
			currentShift.setEndYear(shift.getEndYear() != 0 ? shift.getEndYear() : currentShift.getEndYear());
			currentShift.setEndMonth(shift.isValidMonth() ? shift.getEndMonth() : currentShift.getEndMonth());
			currentShift.setEndDay(shift.isValidDay() ? shift.getEndDay() : currentShift.getEndDay());
			currentShift.setEndHour(shift.isValidHour() ? shift.getEndHour(): currentShift.getEndHour());
			currentShift.setEndMinute(shift.isValidMinute() ? shift.getEndMinute() : currentShift.getEndMinute());
			shiftDao.save(currentShift);
			return "Updated";
		} catch (Exception e) {
			return "Could not update information";
		}
	}

	public String approveShift(String id) {
		Shift shift = new Shift();
		shift.setStatus(Shift.Status.accepted);
		return updateShift(id, shift);
	}
	
	public String denyShift(String id) {
		Shift shift = new Shift();
		shift.setStatus(Shift.Status.denied);
		return updateShift(id, shift);
	}

	public List<Shift> getShifts() {
		try {
			return shiftDao.findAll();
		} catch(Exception e) {
			return null;
		}
	}

	public List<Shift> getShiftUser(String userId) {
		try {
			List<Application> apps = applicationDao.findAllByUserId(userId);
			List<Shift> shifts = new ArrayList<>();
			for(Application a : apps)
				shifts.addAll(shiftDao.findByApplicationId(a.getId()));
			return shifts;
		} catch(Exception e) {
			return null;
		}
	}
	
	public String deleteShiftById(String id) {
		try {
			shiftDao.deleteById(id);
			return "deleted shift " + id;
		}
		catch(Exception e) {
			return "could not delete shift " + id;
		}
	}

	public Shift getShiftById(String id) {
		return shiftDao.findById(id).orElse(null);
	}

} 