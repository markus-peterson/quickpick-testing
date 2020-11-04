package com.backend.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Table(name="\"Job\"")
public class Job {

	private String country;
	private String dateAdded;
	private String hasExpired;
	private String jobBoard;
	private String jobDescription;
	private String jobTitle;
	private String jobType;
	private String location;
	private String organization;
	private String pageUrl;
	private String jobSalary;
	private String sector;
	
	@Id
	@GeneratedValue
	@Column(unique= true)
	private int uniqueId;
}
