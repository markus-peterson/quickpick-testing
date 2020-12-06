package com.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.dao.UserDao;
import com.backend.model.User;

@Service
public class UserService implements UserServiceInterface {

	@Autowired
	private UserDao userDao;
	
	@Transactional
	@Override
	public String registerUser(User user) {
		userDao.save(user);
		return "Success";
	}

	@Transactional
	@Override
	public List<User> getUsers() {
		return (List<User>) userDao.findAll();
	}
	
	@Transactional
	public User getUser(String username) {
		User target = null;
		for(User current : userDao.findAll()) {
			if(current.getUsername().equals(username)) {
				target = current;
			}
		}
		return target;
	}

	@Transactional
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
					result = userDao.findByEmailId(user.getUsername());
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
	
	@Transactional
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
	
	@Transactional
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
	
	@Transactional
	public User findUserByEmail(String userEmail) {		
		return userDao.findByEmailId(userEmail);
	}

	@Transactional
	public Optional<User> findUserByResetToken(String token) {
		return userDao.findByResetToken(token);
	}

	@Transactional
	public void save(User resetUser) {
		userDao.save(resetUser);
	}
	
	@Transactional
	public String updateUser(String id, User user) {
		String out = "service failed";
		try {
			out = "start - " + id;
			User currentUser = userDao.findById(id).orElse(null);//userDao.findByusername(username);
			out = "user found";
			if(user.getAddress() != null && !user.getAddress().isEmpty())
				currentUser.setAddress(user.getAddress());
			out = "address";
			if(user.getEmailId() != null && !user.getEmailId().isEmpty())
				currentUser.setEmailId(user.getEmailId());
			out = "email";
			if(user.getFirstName() != null && !user.getFirstName().isEmpty())
				currentUser.setFirstName(user.getFirstName());
			out = "fname";
			if(user.getLastName() != null && !user.getLastName().isEmpty())
				currentUser.setLastName(user.getLastName());
			out = "lname";
			if(user.getProfileFileId() != null && !user.getProfileFileId().isEmpty())
				currentUser.setProfileFileId(user.getProfileFileId());
			out = "profile";
			if(user.getResumeFileId() != null && !user.getResumeFileId().isEmpty())
				currentUser.setResumeFileId(user.getResumeFileId());
			out = "resume";
			if(user.getBiography() != null)
				currentUser.setBiography(user.getBiography());
			out = "biography";
			if(user.getUsername() != null && !user.getUsername().isEmpty()) {
				try {
					currentUser.setUsername(user.getUsername());
				} catch (Exception e) {}
			}
			out = "username";
			userDao.save(currentUser);
			out = "end";
			return out;
		} catch(Exception e) {
			return out;
		}
	}
}
