package com.backend.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Table(name="\"Shift\"")
public class Shift {
	public enum Status {
	    accepted,
	    pending,
	    denied
	}
	
	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	private String id;

	// Approved or not
	private Status status = Status.pending;

	// Application shift is for
	private String applicationId;

	// Time start and end of shift, 24 hr time
	private int startYear;
	private int startMonth;
	private int startDay;
	private int startHour;
	private int startMinute;
	private int endYear;
	private int endMonth;
	private int endDay;
	private int endHour;
	private int endMinute;
	
	public boolean isValid() {
		return	isValidMonth() && isValidDay() && isValidHour() && isValidMonth();
	}
	
	// js date object is weird, im just gonna store whatever they give me
	public boolean isValidMonth() {
		return true;
//		return startMonth >= 0 && startMonth <= 11 && endMonth >= 0 && endMonth <= 11;
	}
	
	// js date object is weird, im just gonna store whatever they give me
	public boolean isValidDay() {
		return true;
//		return startDay >= 1 && startDay <= 31 && endDay >= 1 && endDay <= 31;
	}
	
	public boolean isValidHour() {
		return startHour >= 0 && startHour <= 24 && endHour >= 0 && endHour <= 24;
	}
	
	public boolean isValidMinute() {
		return startMinute >= 0 && startMinute <= 59 && startMinute >= 0 && startMinute <= 59;
	}

	public String toString() {
		return "(" + startYear + ", " + startMonth + ", " + startDay + ", " + startHour + ", " + startMinute + " - " + endYear + ", " + endMonth + ", " + endDay + ", " + endHour + ", " + endMinute + ")";
	}

	public String getApplicationId() {
		return applicationId;
	}

	public void setApplicationId(String applicationId) {
		this.applicationId = applicationId;
	}

	public String getId() {
		return id;
	}

}