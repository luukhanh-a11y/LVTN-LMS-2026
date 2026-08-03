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
public class NoiDungTracNghiem extends NoiDungCoBan {
    private List<GameItemDTO> thanhPhanCauHoi;

    @JsonAlias({"luaChon", "danhSachLuaChon"})
    private List<GameItemDTO> luaChon;

    @JsonAlias({"dapAnDungId", "dap_an_dung_id", "dapAnDung"})
    private String dapAnDungId;
}
