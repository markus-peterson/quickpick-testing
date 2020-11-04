package com.backend.service;

import java.io.IOException;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.backend.dao.FileDao;
import com.backend.model.File;
import com.backend.model.User;

@Service
public class FileService {

	@Autowired
	private FileDao fileDao;
	
	// Only updates when given applications	 (pdf, docx, ...)
	public File storeResume(MultipartFile mfile, User user) throws IOException {
		String fileName = StringUtils.cleanPath(mfile.getOriginalFilename());
		File file = new File(fileName, mfile.getContentType(), mfile.getBytes());
		String type = file.getType();
		String[] typeSplit = type.split("/");
		if(typeSplit.length == 2 && typeSplit[0].equals("application")) {
			user.setResume(file);
			return fileDao.save(file);
		}
		return null;
	}
	
	// Only updates when given images (png, jpg, ...)
	public File storeProfile(MultipartFile mfile, User user) throws IOException {
		String fileName = StringUtils.cleanPath(mfile.getOriginalFilename());
		File file = new File(fileName, mfile.getContentType(), mfile.getBytes());
		String type = file.getType();
		String[] typeSplit = type.split("/");
		if(typeSplit.length == 2 && typeSplit[0].equals("image")) {
			user.setProfile(file);
			return fileDao.save(file);
		}
		return null;
	}

	public File getFile(String id) {
		return fileDao.findById(id).get();
	}

	public Stream<File> getAllFiles() {
		return fileDao.findAll().stream();
	}
}