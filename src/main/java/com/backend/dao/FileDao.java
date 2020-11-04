package com.backend.dao;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.model.File;

@Repository
public interface FileDao extends JpaRepository<File, Integer>{

	File findById(String id);

}