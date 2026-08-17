package com.LMS.LVTN.configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "LVTN-LMS API",
                version = "v1",
                description = "Toàn bộ API nghiệp vụ của hệ thống LMS (Spring Boot, cổng 8080). "
                        + "Bấm nút Authorize và dán access token (không cần chữ 'Bearer ') để gọi thử các API cần đăng nhập."
        )
)
@SecurityRequirement(name = "bearerAuth")
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class OpenApiConfig {
}
