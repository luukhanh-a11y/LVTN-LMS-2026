package com.LMS.LVTN.dto.game.common;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GameItemDTO {
    private String id;

    @JsonAlias({"noiDung", "content", "text", "value", "word"})
    private String noiDung;

    @JsonAlias({"hinhAnh", "url", "image"})
    private String hinhAnh;

    @JsonAlias({"amThanh", "audio"})
    private String amThanh;

    private String type;
    private List<GameItemDTO> elements;
}
