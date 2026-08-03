package com.titkul.lms.repository;

import com.titkul.lms.entity.TokenVoHieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenVoHieuRepository extends JpaRepository<TokenVoHieu, String> {
}
