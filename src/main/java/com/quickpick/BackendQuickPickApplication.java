package com.quickpick;

import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@SpringBootApplication
@ComponentScan({"com.backend.controller","com.backend.service","com.backend.Springsecurity.Configuration"})
@EnableJpaRepositories({"com.backend.dao"})
@EntityScan("com.backend.model")
public class BackendQuickPickApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendQuickPickApplication.class, args);
	}

	@Value("${spring.datasource.url}")
	private String dbUrl;

	@Bean
	public DataSource dataSource() throws SQLException {
		if (dbUrl == null || dbUrl.isEmpty()) {
			return new HikariDataSource();
		} else {
			HikariConfig config = new HikariConfig();
			config.setJdbcUrl(dbUrl);
			return new HikariDataSource(config);
		}
	}
}
