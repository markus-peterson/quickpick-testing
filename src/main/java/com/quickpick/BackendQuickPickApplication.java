package com.quickpick;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan({"com.backend.controller","com.backend.service","com.backend.Springsecurity.Configuration"})
@EnableJpaRepositories({"com.backend.dao"})
@EntityScan("com.backend.model")
public class BackendQuickPickApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendQuickPickApplication.class, args);
	}

}
