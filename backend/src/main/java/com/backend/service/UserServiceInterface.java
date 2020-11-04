package com.backend.service;

import java.util.List;

import com.backend.model.User;

public interface UserServiceInterface {
	
	public String registerUser(User user);
	
	public List<User> getUsers();
	
	public String login(User user);

}
