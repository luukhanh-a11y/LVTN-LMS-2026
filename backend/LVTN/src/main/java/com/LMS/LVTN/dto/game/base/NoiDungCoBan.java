package com.LMS.LVTN.dto.game.base;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class NoiDungCoBan implements NoiDungGameDTO {
    private String loai;
    private String giaoDien;
    private String cauHoi;
    private String noiDung;
    private String hinhAnh;
    private String amThanh;
    private String video;
}
