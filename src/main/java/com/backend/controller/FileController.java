package com.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.backend.dao.UserDao;
import com.backend.message.UploadFileResponse;
import com.backend.service.FileService;

import com.backend.model.File;
import com.backend.model.User;

@RestController
@CrossOrigin(origins = "*") // local
public class FileController {
	@Autowired
	private FileService fileService;
	@Autowired
	private UserDao userDao;

	@PostMapping("/uploadProfile/{username}")
	public UploadFileResponse uploadProfile(@PathVariable String username, @RequestParam("file") MultipartFile file) {
		String message = "";
		try {
			File newFile = fileService.storeProfile(username, file);
			User user = userDao.findByusername(username);
			user.setProfileFileId(newFile.getId());
			userDao.save(user);
			String fileLoadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
	                .path("/load/")
	                .path(newFile.getId())
	                .toUriString();
			return new UploadFileResponse(newFile.getName(), fileLoadUri, file.getContentType(), file.getSize());
//			message = "Uploaded the file successfully: " + file.getOriginalFilename();
//			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not upload the file: " + file.getOriginalFilename() + "!";
			return new UploadFileResponse(message);
//			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}

	@PostMapping("/uploadResume/{username}")
	public UploadFileResponse uploadResume(@PathVariable String username, @RequestParam("file") MultipartFile file) {
		String message = "";
		try {
			File newFile = fileService.storeResume(username, file);
			User user = userDao.findByusername(username);
			user.setProfileFileId(newFile.getId());
			userDao.save(user);
			String fileLoadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
	                .path("/load/")
	                .path(newFile.getId())
	                .toUriString();
			return new UploadFileResponse(newFile.getName(), fileLoadUri, file.getContentType(), file.getSize());
//			message = "Uploaded the file successfully: " + file.getOriginalFilename();
//			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not upload the file: " + file.getOriginalFilename() + "!";
			return new UploadFileResponse(message);
//			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}

	@GetMapping("/getProfile/{username}")
	public ResponseEntity<byte[]> getProfile(@PathVariable String username) {
		File file = fileService.getProfile(username);

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
				.body(file.getData());
	}

	@GetMapping("/getResume/{username}")
	public ResponseEntity<byte[]> getResume(@PathVariable String username) {
		File file = fileService.getResume(username);

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
				.body(file.getData());
	}
	
	@GetMapping("/load/{id}")
	public ResponseEntity<byte[]> getFile(@PathVariable String id) {
		File file = fileService.getFile(id);

		return ResponseEntity.ok()
				.contentType(MediaType.parseMediaType(file.getType()))
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
				.body(file.getData());
	}
	
	@GetMapping("/getFileName/{id}")
	public String getFileName(@PathVariable String id) {
		File file = fileService.getFile(id);
		return file.getName();
	}
}
