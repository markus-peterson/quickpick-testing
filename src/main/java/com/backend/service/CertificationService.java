package com.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.dao.CertificationDao;
import com.backend.model.Certification;

@Service
public class CertificationService {
	
	@Autowired
	CertificationDao certDao;
	
	@Transactional
	public Certification addCertification(Certification certification) {
		List<Certification> certificates = certDao.findAllByUserId(certification.getUserId());
		for(Certification cert: certificates) {
			if(cert.getCertificate().equals(certification.getCertificate())) {
				if(cert.getScore() < certification.getScore()) {
					cert.setScore(certification.getScore());
					return certDao.save(cert);
				}
				return cert;
			}
		}
		
		return certDao.save(certification);
	}

	@Transactional
	public List<Certification> getCertifications(String userId) {
		return certDao.findAllByUserId(userId);
	}
	
	@Transactional
	public List<Certification> getAllByCertificate(String certificate) {
		return certDao.findAllByCertificate(certificate);
	}
	
	@Transactional
	public Certification checkCertified(String userId, String certificate) {
		List<Certification> userCerts = certDao.findAllByUserId(userId);
		if(userCerts != null) {
			for(Certification cert : userCerts) {
				if(cert.getCertificate().equals(certificate)) {
					return cert;
				}
			}
		}
		return null;
	}
}
