package com.backend.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.backend.dao.FileDao;
import com.backend.dao.UserDao;
import com.backend.model.File;
import com.backend.model.User;

@Service
public class FileService {

	@Autowired
	private FileDao fileDao;
	@Autowired
	private UserDao userDao;

	public File storeProfile(String username, MultipartFile file) throws IOException {
		String fileName = StringUtils.cleanPath(file.getOriginalFilename());
		File newFile = new File(fileName, file.getContentType(), file.getBytes());
		if(newFile.getType().contains("image")) {
			return fileDao.save(newFile);
		}
		return null;
	}
	
	public File storeResume(String username, MultipartFile file) throws IOException {
		String fileName = StringUtils.cleanPath(file.getOriginalFilename());
		File newFile = new File(fileName, file.getContentType(), file.getBytes());
		if(!newFile.getType().contains("image")) {
			return fileDao.save(newFile);
		}
		return null;
	}

	public File getProfile(String username) {
		User user = userDao.findByusername(username);
		if(user != null) {
			File file = fileDao.findById(user.getProfileFileId());
			return file;
		}
		return null;
	}
	
	public File getResume(String username) {
		User user = userDao.findByusername(username);
		if(user != null) {
			File file = fileDao.findById(user.getResumeFileId());
			if(file != null) {
				return file;
			}
		}
		return null;
	}

	public File getFile(String id) {
		return fileDao.findById(id);
	}
}
//@Override
//public String saveProfile(String username, MultipartFile file) {
//	FileInfo thing;//Files.copy(file.getInputStream(), this.root.resolve(file.getOriginalFilename()));
//	thing.
//	User user = userDao.findByusername(username);
//	user.setProfileFileId(file);
//	userDao.save(user);
//	return "Success";
//}
//
//@Override
//public String saveResume(String username, MultipartFile file) {
//	User user = userDao.findByusername(username);
//	user.setResume(file);
//	userDao.save(user);
//	return "Success";
//}