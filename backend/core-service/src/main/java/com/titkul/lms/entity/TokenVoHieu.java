package com.titkul.lms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "invalidated_token")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenVoHieu {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime;
}
