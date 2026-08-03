package com.LMS.LVTN.dto.request;

import com.LMS.LVTN.enums.VaiTro;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpDateRoleUserRequest {
   private VaiTro Role;
}
