package com.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.dao.ApplicationDao;
import com.backend.dao.ShiftDao;
import com.backend.model.Shift;

@Service
public class ShiftService {
	
	@Autowired
	private ShiftDao shiftDao;
	
	@Autowired
	private ApplicationDao applicationDao;

	@Transactional
	public String postShift(String username, String applicationId, Shift shift) {
		if(shift != null && shift.isValid() && applicationDao.existsById(applicationId)) {
			shiftDao.save(shift);
			shift.setApplicationId(applicationId);
			return "Post Shift " + shift.toString() + " Success";
		}
		return "Post Shift " + shift.toString() + " Failed";
	}

	@Transactional
	public List<Shift> getShift(String applicationId) {
		return shiftDao.findByApplicationId(applicationId);
	}

	@Transactional
	public String updateShift(String id, Shift shift) {
		try {
			Shift currentShift = shiftDao.findById(id).orElse(null);
			currentShift.setHourStart(shift.getHourStart() != null ? shift.getHourStart() : currentShift.getHourStart());
			currentShift.setHourEnd(shift.getHourEnd() != null ? shift.getHourEnd() : currentShift.getHourEnd());
			currentShift.setMinuteStart(shift.getMinuteStart() != null ? shift.getMinuteStart() : currentShift.getMinuteStart());
			currentShift.setMinuteEnd(shift.getMinuteEnd() != null ? shift.getMinuteEnd() : currentShift.getMinuteEnd());
			shiftDao.save(currentShift);
			return "Updated";
		} catch (Exception e) {
			return "Could not update information";
		}
	}

	public String approveShift(String id) {
		Shift shift = new Shift();
		shift.setApproved(true);
		return updateShift(id, shift);
	}

}