package com.backend.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.model.User;

@Repository
public interface UserDao extends JpaRepository<User, Integer>	{
	
	User findByusername(String username);
	
	Optional<User> findById(String id);
	
	User findByEmailId(String emailId);
	
	void deleteById(String id);
	
	Optional<User> findByResetToken(String token);
}
	