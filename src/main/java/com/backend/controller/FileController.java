package com.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.backend.message.ResponseFile;
import com.backend.message.ResponseMessage;
import com.backend.model.File;
import com.backend.service.FileService;
import com.backend.service.UserService;

@Controller
//@CrossOrigin("http://localhost:3000")	// local
@CrossOrigin(origins = "*")	// heroku
public class FileController {

	@Autowired
	private FileService fileService;
	
	@Autowired
	private UserService userService;
	
	@PostMapping("/upload/resume/{username}")
	public ResponseEntity<ResponseMessage> uploadResume(@PathVariable String username, @RequestParam("file") MultipartFile file) {
		String message = "";
		try {
			File tmpFile = fileService.storeResume(file, userService.getUser(username));
			if(tmpFile == null)
				message = "Invalid file type: " + file.getOriginalFilename();
			else
				message = "Uploaded the file successfully: " + file.getOriginalFilename();
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not upload the file: " + file.getOriginalFilename() + "!";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}
	
	@PostMapping("/upload/profile/{username}")
	public ResponseEntity<ResponseMessage> uploadProfile(@PathVariable String username, @RequestParam("file") MultipartFile file) {
		String message = "";
		try {
			File tmpFile = fileService.storeProfile(file, userService.getUser(username));
			if(tmpFile == null)
				message = "Invalid file type: " + file.getOriginalFilename();
			else
				message = "Uploaded the file successfully: " + file.getOriginalFilename();
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not upload the file: " + file.getOriginalFilename() + "!";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}

	@GetMapping("/files")
	public ResponseEntity<List<ResponseFile>> getListFiles() {
		List<ResponseFile> files = fileService.getAllFiles().map(file -> {
			String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/files/")
					.path(file.getId()).toUriString();

			return new ResponseFile(file.getName(), fileDownloadUri, file.getType(), file.getData().length);
		}).collect(Collectors.toList());

		return ResponseEntity.status(HttpStatus.OK).body(files);
	}

	@GetMapping("/files/{id}")
	public ResponseEntity<byte[]> getFile(@PathVariable String id) {
		File file = fileService.getFile(id);

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
				.body(file.getData());
	}
}
