package com.LMS.LVTN.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoiYAiBaiTapResponse {
    private List<String> suggestions;
}
