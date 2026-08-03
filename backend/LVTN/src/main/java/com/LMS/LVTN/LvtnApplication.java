package com.LMS.LVTN;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LvtnApplication {

	public static void main(String[] args) {
		SpringApplication.run(LvtnApplication.class, args);
	}

}
