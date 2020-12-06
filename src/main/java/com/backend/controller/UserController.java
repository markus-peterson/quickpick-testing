package com.backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

//import com.backend.dao.UserDao;
import com.backend.model.User;
import com.backend.service.EmailService;
import com.backend.service.UserService;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")	// heroku
public class UserController {
	
	@Autowired
	UserService userService;
	
	@Autowired
	EmailService emailService;
	
	@Value("${resetPassword.Url}")
	private String url;
	
	@PostMapping("/login")
	public User login(@RequestBody User user){
		return userService.login(user);
	}
	
	@PostMapping("/register")
	public String registerUser(@RequestBody User user) {
		userService.registerUser(user);
		return "Saved Successfully";
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
		if(userService.checkIfUsernameExists(username).contains("not")) {
			return "registered";
		} else {
			return "new";
		}
	}
	
	@GetMapping("/checkEmail/{emailId}")
	public String checkIfEmailExists(@PathVariable String emailId){
		if(userService.checkIfEmailExists(emailId).contains("not")) {
			return "registered";
		} else {
			return "new";
		}
	}
	
	@PostMapping("/updateUser/{id}")
	public String updateUser(@PathVariable String id, @RequestBody User user) {
		String out = "no function";
		try {
			// Updating all fields but the username and id
			out = userService.updateUser(id, user);
			return "updated : " + out;
		} catch (Exception e) {
			return "failed to update : " + out;
		}
	}

	@GetMapping(value = "/forgotpassword")
	public String processForgotPasswordForm(@RequestParam("email") String userEmail) {

		// Lookup user in database by e-mail
		User user = userService.findUserByEmail(userEmail);

		if (null == user) {
			return "Email Not Registered";
		} else {

			// Generate random 36-character string token for reset password
			user.setResetToken(UUID.randomUUID().toString());

			// Save token to database
			userService.save(user);

			// Email message
			SimpleMailMessage passwordResetEmail = new SimpleMailMessage();
			passwordResetEmail.setFrom("support@Quick-Pick.com");
			passwordResetEmail.setTo(user.getEmailId());
			passwordResetEmail.setSubject("Password Reset Request");
			passwordResetEmail.setText("To reset your password, click the link below:\n" + url + user.getResetToken());
			emailService.sendEmail(passwordResetEmail);
//			 Add success message to view
			return "A password reset link has been sent to registered Email.";
		}
	}

	// Process reset password form
	@GetMapping(value = "/reset")
	public String setNewPassword(@RequestParam("token") String token, @RequestParam("password") String password) {

		// Find the user associated with the reset token
		Optional<User> user = userService.findUserByResetToken(token);

		// This should always be non-null but we check just in case
		if (user.isPresent()) {

			User resetUser = user.get();

			// Set new password
			resetUser.setPassword(password);

			// Set the reset token to null so it cannot be used again
			resetUser.setResetToken(null);

			// Save user
			userService.save(resetUser);

			// In order to set a model attribute on a redirect, we must use
			// return "You have successfully reset your password. You may now login.";
			return "Successful";
		} else {
			// return "Oops! This is an invalid password reset link.";
			return "Invalid reset link.";
		}

	}
}
