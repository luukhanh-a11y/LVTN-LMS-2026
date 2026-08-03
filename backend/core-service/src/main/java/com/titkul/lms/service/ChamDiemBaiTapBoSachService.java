package com.titkul.lms.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

// Chấm điểm tự động cho bài tập bộ sách (dang_bai kiểu JSON_TEXT: trắc nghiệm/nối cặp/
// điền khuyết) — thuật toán chuyển thể từ backend/LVTN's GameService.chamDiem(), viết lại
// theo schema riêng của core-service (xem GoiYAiBaiTapService/NoiDungBaiTapController cho
// cấu trúc JSON). Không tin điểm client gửi lên — luôn tính lại từ dap_an_chuan lưu ở server.
@Slf4j
@Service
@RequiredArgsConstructor
public class ChamDiemBaiTapBoSachService {

    private final ObjectMapper objectMapper;

    public BigDecimal chamDiem(String dapAnChuanJson, String baiLamJson) {
        if (dapAnChuanJson == null || baiLamJson == null || baiLamJson.isBlank()) {
            return BigDecimal.ZERO;
        }
        try {
            JsonNode dapAn = objectMapper.readTree(dapAnChuanJson);
            JsonNode baiLam = objectMapper.readTree(baiLamJson);

            // Trắc nghiệm: đúng/sai tuyệt đối
            if (dapAn.has("dapAnDungId")) {
                String dung = dapAn.get("dapAnDungId").asText();
                String chon = baiLam.has("dapAnDungId") ? baiLam.get("dapAnDungId").asText() : "";
                return dung.equals(chon) ? new BigDecimal("10.00") : BigDecimal.ZERO;
            }

            // Nối cặp: tỷ lệ cặp đúng / tổng số cặp
            if (dapAn.has("capDung")) {
                JsonNode dsDapAn = dapAn.get("capDung");
                JsonNode dsBaiLam = baiLam.get("capChon");
                if (dsDapAn == null || dsDapAn.isEmpty()) return new BigDecimal("10.00");
                if (dsBaiLam == null || dsBaiLam.isEmpty()) return BigDecimal.ZERO;

                Map<String, String> mapDung = new HashMap<>();
                for (JsonNode cap : dsDapAn) {
                    if (cap.has("traiId") && cap.has("phaiId")) {
                        mapDung.put(cap.get("phaiId").asText(), cap.get("traiId").asText());
                    }
                }
                int soDung = 0;
                for (JsonNode cap : dsBaiLam) {
                    if (cap.has("traiId") && cap.has("phaiId")
                            && cap.get("traiId").asText().equals(mapDung.get(cap.get("phaiId").asText()))) {
                        soDung++;
                    }
                }
                return tinhDiemTyLe(soDung, dsDapAn.size());
            }

            // Điền khuyết: tỷ lệ chỗ trống đúng / tổng số chỗ trống, so khớp không phân biệt hoa/thường
            if (dapAn.has("dapAnTheoCho")) {
                JsonNode mapDapAn = dapAn.get("dapAnTheoCho");
                JsonNode mapBaiLam = baiLam.get("traLoiTheoCho");
                if (mapDapAn == null || mapDapAn.isEmpty()) return new BigDecimal("10.00");
                if (mapBaiLam == null || mapBaiLam.isEmpty()) return BigDecimal.ZERO;

                int tongSo = mapDapAn.size();
                int soDung = 0;
                var it = mapDapAn.fields();
                while (it.hasNext()) {
                    var entry = it.next();
                    String choId = entry.getKey();
                    JsonNode chapNhan = entry.getValue();
                    if (mapBaiLam.has(choId)) {
                        String traLoi = mapBaiLam.get(choId).asText().strip().toLowerCase();
                        boolean dung = false;
                        if (chapNhan.isArray()) {
                            for (JsonNode dapAnChapNhan : chapNhan) {
                                if (dapAnChapNhan.asText().strip().toLowerCase().equals(traLoi)) {
                                    dung = true;
                                    break;
                                }
                            }
                        }
                        if (dung) soDung++;
                    }
                }
                return tinhDiemTyLe(soDung, tongSo);
            }

            log.warn("dap_an_chuan không khớp shape trắc nghiệm/nối cặp/điền khuyết nào");
            return BigDecimal.ZERO;
        } catch (Exception e) {
            log.warn("Lỗi chấm điểm bài tập bộ sách: {}", e.getMessage());
            return BigDecimal.ZERO;
        }
    }

    private BigDecimal tinhDiemTyLe(int soDung, int tongSo) {
        double diem = (soDung * 10.0) / tongSo;
        return new BigDecimal(diem).setScale(2, RoundingMode.HALF_UP);
    }
}
