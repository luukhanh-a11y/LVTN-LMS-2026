package com.LMS.LVTN.dto.game.specialized;

import com.LMS.LVTN.dto.game.base.NoiDungCoBan;
import com.LMS.LVTN.dto.game.common.GameItemDTO;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class NoiDungNoiCap extends NoiDungCoBan {
    private List<GameItemDTO> cotTrai;
    private List<GameItemDTO> cotPhai;

    @JsonAlias({"capDung", "danhSachCapDung", "danh_sach_cap_dung"})
    private List<CapDung> capDung;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CapDung {
        @JsonAlias({"traiId", "left", "leftId", "trai_id"})
        private String traiId;

        @JsonAlias({"phaiId", "right", "rightId", "phai_id"})
        private String phaiId;
    }
}
