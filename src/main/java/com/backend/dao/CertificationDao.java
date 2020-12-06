package com.backend.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.model.Certification;

@Repository
public interface CertificationDao extends JpaRepository<Certification, Integer> {
	
	List<Certification> findAllByUserId(String userId);
	
	List<Certification> findAllByCertificate(String certificate);
}
