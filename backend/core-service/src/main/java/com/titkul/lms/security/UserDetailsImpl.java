package com.titkul.lms.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.titkul.lms.entity.NguoiDung;
import com.titkul.lms.entity.TrangThaiNguoiDung;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {

    private Long id;
    private String username;

    @JsonIgnore
    private String password;

    private Boolean requirePasswordChange;

    private TrangThaiNguoiDung status;

    private Collection<? extends GrantedAuthority> authorities;

    public static UserDetailsImpl build(NguoiDung user) {
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getVaiTro().name());

        return new UserDetailsImpl(
                user.getNguoiDungId(),
                user.getTenDangNhap(),
                user.getMatKhauHash(),
                user.getBatBuocDoiMk(),
                user.getTrangThai(),
                Collections.singletonList(authority)
        );
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status != TrangThaiNguoiDung.LOCKED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status != TrangThaiNguoiDung.DISABLED;
    }
}
