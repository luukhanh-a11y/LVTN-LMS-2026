package com.LMS.LVTN.dto.game.base;

import com.LMS.LVTN.dto.game.specialized.NoiDungDienKhuyet;
import com.LMS.LVTN.dto.game.specialized.NoiDungNoiCap;
import com.LMS.LVTN.dto.game.specialized.NoiDungTracNghiem;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME, 
    include = JsonTypeInfo.As.PROPERTY, 
    property = "loai", 
    visible = true
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = NoiDungTracNghiem.class, name = "TRAC_NGHIEM"),
    @JsonSubTypes.Type(value = NoiDungNoiCap.class, name = "NOI_CAP"),
    @JsonSubTypes.Type(value = NoiDungDienKhuyet.class, name = "DIEN_KHUYET"),
    @JsonSubTypes.Type(value = NoiDungCoBan.class, name = "LY_THUYET"),
    @JsonSubTypes.Type(value = NoiDungCoBan.class, name = "TU_LUAN")
})
public interface NoiDungGameDTO {
}
