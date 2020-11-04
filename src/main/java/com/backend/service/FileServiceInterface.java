package com.backend.service;

import java.nio.file.Path;
import java.util.stream.Stream;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileServiceInterface {
	public void init();

	public String saveProfile(String username, MultipartFile file);
	
	public String saveResume(String username, MultipartFile file);

	public Resource load(String filename);

	public void deleteAll();

	public Stream<Path> loadAll();
}