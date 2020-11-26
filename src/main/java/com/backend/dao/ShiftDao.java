package com.backend.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.model.Shift;

@Repository
public interface ShiftDao extends JpaRepository<Shift, String> {
	
	Optional<Shift> findById(String id);
	
	List<Shift> findByApplicationId(String applicationId);
}
