package com.LMS.LVTN.dto.game.specialized;

import com.LMS.LVTN.dto.game.base.NoiDungCoBan;
import com.LMS.LVTN.dto.game.common.GameItemDTO;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class NoiDungDienKhuyet extends NoiDungCoBan {
    private List<GameItemDTO> thanhPhanDoanVan;

    @JsonAlias({"danhSachCho", "danhSachChoTrong", "danh_sach_cho"})
    private List<ChoTrong> danhSachCho;

    @JsonAlias({"dapAnTheoCho", "danhSachDapAn", "dap_an_theo_cho"})
    private Map<String, Object> dapAnTheoCho;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ChoTrong {
        private String id;
        private String vanBanTruoc;
        private String vanBanSau;
        private List<String> danhSachLuaChon;
        @JsonAlias({"dapAnDung", "dap_an_dung"})
        private List<String> dapAnDung;
    }
}
