package com.backend.dao;	

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.model.File;

@Repository
public interface FileDao extends JpaRepository<File, String> {

	Optional<File> findById(String id);
	
	void deleteById(String id);
}