package com.backend.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.backend.dao.FileDao;
import com.backend.model.File;

@Service
public class FileService {

	@Autowired
	private FileDao fileDao;

	@Transactional
	public File storeProfile(String username, MultipartFile file) throws IOException {
		String fileName = StringUtils.cleanPath(file.getOriginalFilename());
		File newFile = new File(fileName, file.getContentType(), file.getBytes());
		if(newFile.getType().contains("image")) {
			return fileDao.save(newFile);
		}
		return null;
	}
	
	@Transactional
	public File storeResume(String username, MultipartFile file) throws IOException {
		String fileName = StringUtils.cleanPath(file.getOriginalFilename());
		File newFile = new File(fileName, file.getContentType(), file.getBytes());
		if(!newFile.getType().contains("image")) {
			return fileDao.save(newFile);
		}
		return null;
	}

	@Transactional
	public File getFile(String id) {
		return fileDao.findById(id).orElse(null);
	}
}
