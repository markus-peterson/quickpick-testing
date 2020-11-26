package com.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.dao.ApplicationDao;
import com.backend.dao.UserDao;
import com.backend.model.Application;
import com.backend.model.User;

@Service
public class UserService implements UserServiceInterface {

	@Autowired
	private UserDao userDao;
	
	@Autowired
	private ApplicationDao appDao;
	
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
			}
		}
		return target;
	}

	@Override
	public User login(User user) {
		User fail = new User();
		if(user != null) { 
			if (user.getUsername() != null && user.getPassword() != null ) {
				User result = userDao.findByusername(user.getUsername());
				if(result!= null) {
					if(result.getPassword() != null && result.getPassword().equals(user.getPassword())  ) {
						return result;
					} else {
						fail.setUsername("Incorrect Password");
						return fail;
					}
				}else {
					result = userDao.findByEmailId(user.getEmailId());
					if(result!= null) {
						if(result.getPassword() != null && result.getPassword().equals(user.getPassword())  ) {
							return result;
						} else {
							fail.setUsername("Incorrect Password");
							return fail;
						}
					}else {
						fail.setUsername("Not registered");
						return fail;
					}
				}
			}else if (user.getEmailId() != null && user.getPassword() != null ) {
				User result = userDao.findByEmailId(user.getEmailId());
				if(result!= null) {
					if(result.getPassword() != null && result.getPassword().equals(user.getPassword())  ) {
						return result;
					} else {
						fail.setUsername("Incorrect Password");
						return fail;
					}
				}else {
					fail.setUsername("Not registered");
					return fail;
				}
			}
		}
		fail.setUsername("Error");
		return fail;
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
	
	public String checkIfEmailExists(String emailId) {
		if(emailId != null) {
			User result = userDao.findByEmailId(emailId);
			if(result!= null) {
				return "Email not available";
			}else {
				return "Email available";
			}
		}
		return "Something went wrong";
	}
	
	public User updateUser(String id, User user) {
		User currentUser = userDao.findById(id);//userDao.findByusername(username);
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
		if(user.getBiography() != null)
			currentUser.setBiography(user.getBiography());
		if(user.getUsername() != null && !user.getUsername().isEmpty())
			try {
				List<Application> userApps = appDao.findAllByUsername(currentUser.getUsername());
				currentUser.setUsername(user.getUsername());
				for(Application app : userApps) {
					app.setUsername(user.getUsername());
					
				}
				appDao.saveAll(userApps);
			} catch (Exception e) {}
		return userDao.save(currentUser);
	}
}
