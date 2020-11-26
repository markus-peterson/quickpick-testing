package com.backend.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.model.Job;

@Repository
public interface JobDao extends JpaRepository<Job, String>{
	
	Optional<Job> findById(String id);
	
	void deleteById(String id);

	@Query(value = "select * FROM job j WHERE j.job_title LIKE CONCAT('%',:searchKey,'%') AND j.location LIKE CONCAT('%',:location,'%')",
			nativeQuery = true)
	List<Job> findBySearchParams(
	  @Param("searchKey") String searchKey, 
	  @Param("location") String location);
	
	@Query(value = "select * FROM job j WHERE j.location LIKE CONCAT('%',:location,'%')",
			nativeQuery = true)
	List<Job> findBySearchLocation(@Param("location") String location);
	
	@Query(value = "select * FROM job j WHERE j.job_title LIKE CONCAT('%',:searchKey,'%')",
			nativeQuery = true)
	List<Job> findBySearchKeyword(@Param("searchKey") String searchKey);
	
	
}
