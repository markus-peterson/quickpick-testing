package com.backend.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.model.Job;

@Repository
public interface JobDao extends JpaRepository<Job, String>{
	
	void deleteById(String id);
	
	Boolean existsByAuthor(String author);
	
	List<Job> findAllByAuthor(String author);

	@Query(value = "select * FROM \"job\" j WHERE LOWER(j.job_title) LIKE LOWER(CONCAT('%',:searchKey,'%')) AND LOWER(j.location) LIKE LOWER(CONCAT('%',:location,'%'))",
			nativeQuery = true)
	List<Job> findBySearchParams(
	  @Param("searchKey") String searchKey, 
	  @Param("location") String location);
	
	@Query(value = "select * FROM \"job\" j WHERE LOWER(j.location) LIKE LOWER(CONCAT('%',:location,'%'))",
			nativeQuery = true)
	List<Job> findBySearchLocation(@Param("location") String location);
	
	@Query(value = "select * FROM \"job\" j WHERE LOWER(j.job_title) LIKE LOWER(CONCAT('%',:searchKey,'%'))",
			nativeQuery = true)
	List<Job> findBySearchKeyword(@Param("searchKey") String searchKey);
	
	
}
