package com.backend.model;

import java.util.Arrays;
import java.util.stream.Collector;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

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
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	private String id;
	
	private String firstName;
	private String lastName;
	
	@Column(unique= true)
	private String username;
	
	@Column(unique= true)
	private String emailId;
	
	private String address;
	private String password;
	
	@Lob
	private String biography;
	
	public String profileFileId;
	public String resumeFileId;
	
	//Forget Password Functionality
	private String resetToken;
	
	public String getProfileFileId() {
		return profileFileId;
	}
	public void setProfileFileId(String profileFileId) {
		this.profileFileId = profileFileId;
	}
	public String getResumeFileId() {
		return resumeFileId;
	}
	public void setResumeFileId(String resumeFileId) {
		this.resumeFileId = resumeFileId;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmailId() {
		return emailId;
	}
	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getBiography() {
		return biography;
	}
	public void setBiography(String biography) {
		this.biography = biography;
	}
	public String getId() {
		return id;
	}
	public String getResetToken() {
		return resetToken;
	}
	public void setResetToken(String resetToken) {
		this.resetToken = resetToken;
	}
	
}
