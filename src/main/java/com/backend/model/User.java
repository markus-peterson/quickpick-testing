package com.backend.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name="\"User\"")	// heroku
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "user_id")
	private int id;
	private String firstName;
	private String lastName;
	
	@Column(unique= true)
	private String username;
	
	private String emailId;
	private String address;
	private String password;
	
	private String profileFileId;
	private String resumeFileId;
	
	public void setProfileFileId(String profileFileId) {
		this.profileFileId = profileFileId;
	}
	public void setResumeFileId(String resumeFileId) {
		this.resumeFileId = resumeFileId;
	}
}
