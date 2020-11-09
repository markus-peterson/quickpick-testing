package com.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.dao.UserDao;
import com.backend.model.User;

@Service
public class UserService implements UserServiceInterface {

	@Autowired
	private UserDao userDao;
	
	@Override
	public String registerUser(User user) {
		userDao.save(user);
		return "Success";
	}

	@Override
	public List<User> getUsers() {
		
		return (List<User>) userDao.findAll();
	}
	
	public User getUser(String username) {
		User target = null;
		for(User current : userDao.findAll()) {
			if(current.getUsername().equals(username)) {
				target = current;
				//System.out.println(current.getProfile() != null ? current.getProfile().getName() : current.getProfile());
			}
		}
		return target;
	}

	@Override
	public String login(User user) {
		
		if(user != null) { 
				
			if (user.getUsername() != null && user.getPassword() != null ) {
				User result = userDao.findByusername(user.getUsername());
				if(result!= null) {
					if(result.getPassword() != null && result.getPassword().equals(user.getPassword())  ) {
						
						return "Login Successful";
						
					}
				}else {
					return "User Not Found";
				}
			}
		}
		return "Login Failed";
	}
	
	public String checkIfUsernameExists(String username) {
		if(username != null) {
			User result = userDao.findByusername(username);
			if(result!= null) {
				return "Username not available";
			}else {
				return "Username available";
			}
		}
		return "Something went wrong";
	}
}
