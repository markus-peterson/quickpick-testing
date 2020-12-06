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

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public int getStartYear() {
		return startYear;
	}

	public void setStartYear(int startYear) {
		this.startYear = startYear;
	}

	public int getStartMonth() {
		return startMonth;
	}

	public void setStartMonth(int startMonth) {
		this.startMonth = startMonth;
	}

	public int getStartDay() {
		return startDay;
	}

	public void setStartDay(int startDay) {
		this.startDay = startDay;
	}

	public int getStartHour() {
		return startHour;
	}

	public void setStartHour(int startHour) {
		this.startHour = startHour;
	}

	public int getStartMinute() {
		return startMinute;
	}

	public void setStartMinute(int startMinute) {
		this.startMinute = startMinute;
	}

	public int getEndYear() {
		return endYear;
	}

	public void setEndYear(int endYear) {
		this.endYear = endYear;
	}

	public int getEndMonth() {
		return endMonth;
	}

	public void setEndMonth(int endMonth) {
		this.endMonth = endMonth;
	}

	public int getEndDay() {
		return endDay;
	}

	public void setEndDay(int endDay) {
		this.endDay = endDay;
	}

	public int getEndHour() {
		return endHour;
	}

	public void setEndHour(int endHour) {
		this.endHour = endHour;
	}

	public int getEndMinute() {
		return endMinute;
	}

	public void setEndMinute(int endMinute) {
		this.endMinute = endMinute;
	}
}