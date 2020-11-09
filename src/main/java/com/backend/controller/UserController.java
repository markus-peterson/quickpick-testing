package com.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dao.UserDao;
import com.backend.model.User;
import com.backend.service.UserService;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")	// heroku
public class UserController {
	
	@Autowired
	UserService userService;
	
	@Autowired
	private UserDao userDao;
	
	@PostMapping("/login")
	public String login(@RequestBody User user){
		return userService.login(user);
	}
	
	@PostMapping("/register")
	public String registerUser(@RequestBody User user) {
		userService.registerUser(user);
		return "Saved Successfully ";
	}
	
	@GetMapping("/getUsers")
	public List<User> getUsers(){
		return userService.getUsers();
	}
	
	@GetMapping("/getUser/{username}")
	public User getUser(@PathVariable String username) {
		return userService.getUser(username);
	}
	
	@GetMapping("/checkUsername/{username}")
	public String checkIfUsernameExists(@PathVariable String username){
		return userService.checkIfUsernameExists(username);
	}
	
	@PostMapping("/updateUser/{username}")
	public String updateUser(@PathVariable String username, @RequestBody User user) {
		try {
			// Updating all fields but the username and id
			User currentUser = userDao.findByusername(username);
			if(user.getAddress() != null && !user.getAddress().isEmpty())
				currentUser.setAddress(user.getAddress());
			if(user.getEmailId() != null && !user.getEmailId().isEmpty())
				currentUser.setEmailId(user.getEmailId());
			if(user.getFirstName() != null && !user.getFirstName().isEmpty())
				currentUser.setFirstName(user.getFirstName());
			if(user.getLastName() != null && !user.getLastName().isEmpty())
				currentUser.setLastName(user.getLastName());
			if(user.getPassword() != null && !user.getPassword().isEmpty())
				currentUser.setPassword(user.getPassword());
			if(user.getProfileFileId() != null && !user.getProfileFileId().isEmpty())
				currentUser.setProfileFileId(user.getProfileFileId());
			if(user.getResumeFileId() != null && !user.getResumeFileId().isEmpty())
				currentUser.setResumeFileId(user.getResumeFileId());
			userDao.save(currentUser);
			return "Updated";
		} catch (Exception e) {
			return "Could not update information";
		}
	}
}
