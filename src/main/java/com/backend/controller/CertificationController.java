package com.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.model.Certification;
import com.backend.service.CertificationService;

@RestController
@RequestMapping("/certify")
@CrossOrigin(origins = "*")
public class CertificationController {

	@Autowired
	CertificationService certService;
	
	@PostMapping("/addCertification")
	public String addCertification(@RequestBody Certification certification) {
		certService.addCertification(certification);
		return "Saved Successfully";
	}
	
	@GetMapping("/getCertifications/{userId}")
	public List<Certification> getCertifications(@PathVariable String userId) {
		return certService.getCertifications(userId);
	}
	
	@GetMapping("/getAllByCertificate/{certificate}")
	public List<Certification> getAllByCertificate(@PathVariable String certificate) {
		return certService.getAllByCertificate(certificate);
	}
	
	@GetMapping("/checkCertified/{userId}/{certificate}")
	public Certification checkCertified(@PathVariable String userId, @PathVariable String certificate) {
		return certService.checkCertified(userId, certificate);
	}
	
//	@PostMapping("/updateCertification")
//	public String updateCertification(@RequestBody Certification certification) {
//		certService.updateCertification(certification);
//		return "Saved Successfully";
//	}
}
