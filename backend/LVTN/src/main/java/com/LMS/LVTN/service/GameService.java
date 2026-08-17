package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.game.base.*;
import com.LMS.LVTN.dto.game.specialized.*;
import com.LMS.LVTN.dto.game.common.*;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GameService {

    private final ObjectMapper readMapper;
    private final ObjectMapper writeMapper;

    public GameService() {
        this.readMapper = new ObjectMapper();
        this.writeMapper = new ObjectMapper();
        this.writeMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    }

    /**
     * Splits a game JSON containing both question and answer into two separate JSON strings.
     *
     * @param rawJson The original JSON string containing both question and answer.
     * @return GameDataSplitResult containing the separated question JSON and answer JSON.
     */
    public GameDataSplitResult splitGameData(String rawJson) {
        try {
            NoiDungGameDTO gameData = readMapper.readValue(rawJson, NoiDungGameDTO.class);

            if (gameData instanceof NoiDungTracNghiem) {
                NoiDungTracNghiem tracNghiem = (NoiDungTracNghiem) gameData;

                // Extract answer
                String dapAn = tracNghiem.getDapAnDungId();
                String dapAnJson = writeMapper.writeValueAsString(Map.of("dapAnDungId", dapAn != null ? dapAn : ""));

                // Remove answer from question DTO to hide it
                tracNghiem.setDapAnDungId(null);
                String cauHoiJson = writeMapper.writeValueAsString(tracNghiem);

                return new GameDataSplitResult(cauHoiJson, dapAnJson);

            } else if (gameData instanceof NoiDungNoiCap) {
                NoiDungNoiCap noiCap = (NoiDungNoiCap) gameData;

                // Extract answer
                List<NoiDungNoiCap.CapDung> dapAn = noiCap.getCapDung();
                String dapAnJson = writeMapper.writeValueAsString(Map.of("capDung", dapAn != null ? dapAn : List.of()));

                // Remove answer from question DTO to hide it
                noiCap.setCapDung(null);
                String cauHoiJson = writeMapper.writeValueAsString(noiCap);

                return new GameDataSplitResult(cauHoiJson, dapAnJson);

            } else if (gameData instanceof NoiDungDienKhuyet) {
                NoiDungDienKhuyet dienKhuyet = (NoiDungDienKhuyet) gameData;

                // Extract answer: check dapAnTheoCho first, then fallback to extracting from danhSachCho
                Map<String, Object> dapAnMap = new HashMap<>();
                if (dienKhuyet.getDapAnTheoCho() != null) {
                    dapAnMap.putAll(dienKhuyet.getDapAnTheoCho());
                    dienKhuyet.setDapAnTheoCho(null);
                }

                List<NoiDungDienKhuyet.ChoTrong> choTrongs = dienKhuyet.getDanhSachCho();
                if (choTrongs != null) {
                    for (NoiDungDienKhuyet.ChoTrong choTrong : choTrongs) {
                        if (choTrong.getDapAnDung() != null) {
                            dapAnMap.putIfAbsent(choTrong.getId(), choTrong.getDapAnDung());
                        }
                        // Remove answer from question DTO to hide it
                        choTrong.setDapAnDung(null);
                    }
                }
                // Extract dapAnChoTrong
                List<Map<String, Object>> dapAnChoTrongList = null;
                if (dienKhuyet.getDapAnChoTrong() != null) {
                    dapAnChoTrongList = dienKhuyet.getDapAnChoTrong();
                    dienKhuyet.setDapAnChoTrong(null);
                }

                Map<String, Object> dapAnFinalMap = new HashMap<>();
                dapAnFinalMap.put("dapAnTheoCho", dapAnMap);
                if (dapAnChoTrongList != null) {
                    dapAnFinalMap.put("dapAnChoTrong", dapAnChoTrongList);
                }
                
                String dapAnJson = writeMapper.writeValueAsString(dapAnFinalMap);

                String cauHoiJson = writeMapper.writeValueAsString(dienKhuyet);

                return new GameDataSplitResult(cauHoiJson, dapAnJson);

            } else if (gameData instanceof NoiDungCoBan && ("LY_THUYET".equalsIgnoreCase(((NoiDungCoBan) gameData).getLoai()) || "TU_LUAN".equalsIgnoreCase(((NoiDungCoBan) gameData).getLoai()))) {
                // Lý thuyết và Tự luận không có đáp án tự động chấm cần giấu, trả về rỗng cho đáp án
                String cauHoiJson = writeMapper.writeValueAsString(gameData);
                return new GameDataSplitResult(cauHoiJson, "{}");
            }

            throw new AppExceptions(Errorcode.GAME_TYPE_UNSUPPORTED);

        } catch (JsonProcessingException e) {
            throw new AppExceptions(Errorcode.JSON_PROCESSING_ERROR);
        }
    }

    /**
     * Chấm điểm tự động dựa trên JSON đáp án chuẩn và bài làm của học sinh.
     * Thang điểm: 10.00
     *
     * @param dapAnChuanJson Chuỗi JSON đáp án chuẩn từ Database
     * @param chiTietBaiLamJson Chuỗi JSON bài làm của học sinh gửi lên
     * @return Điểm số kiểu BigDecimal (0.00 -> 10.00)
     */
    public BigDecimal chamDiem(String dapAnChuanJson, String chiTietBaiLamJson) {
        if (dapAnChuanJson == null || chiTietBaiLamJson == null || chiTietBaiLamJson.isEmpty()) {
            return BigDecimal.ZERO;
        }

        try {
            JsonNode dapAnNode = readMapper.readTree(dapAnChuanJson);
            JsonNode baiLamNode = readMapper.readTree(chiTietBaiLamJson);

            // 1. Dạng Trắc Nghiệm
            if (dapAnNode.has("dapAnDungId") || dapAnNode.has("dapAnDung") || dapAnNode.has("dap_an_dung_id")) {
                String dapAnDung = dapAnNode.has("dapAnDungId") ? dapAnNode.get("dapAnDungId").asText() : 
                                  (dapAnNode.has("dapAnDung") ? dapAnNode.get("dapAnDung").asText() : dapAnNode.get("dap_an_dung_id").asText());
                String dapAnChon = baiLamNode.has("dapAnDungId") ? baiLamNode.get("dapAnDungId").asText() : "";
                
                if (dapAnDung.trim().equalsIgnoreCase(dapAnChon.trim())) {
                    return new BigDecimal("10.00");
                }
                return java.math.BigDecimal.ZERO;
            }

            // 2. Dạng Nối Cặp
            if (dapAnNode.has("capDung") || dapAnNode.has("danhSachCapDung")) {
                JsonNode mangDapAn = dapAnNode.has("capDung") ? dapAnNode.get("capDung") : dapAnNode.get("danhSachCapDung");
                JsonNode mangBaiLam = baiLamNode.has("capChon") ? baiLamNode.get("capChon") : baiLamNode.get("capDung");
                
                if (mangDapAn == null || mangDapAn.isEmpty()) return new BigDecimal("10.00");
                if (mangBaiLam == null || mangBaiLam.isEmpty()) return BigDecimal.ZERO;

                int tongSoCau = mangDapAn.size();
                int soCauDung = 0;

                Map<String, String> mapDapAn = new HashMap<>();
                for (JsonNode capDung : mangDapAn) {
                    String src = capDung.has("traiId") ? capDung.get("traiId").asText() : (capDung.has("idNguon") ? capDung.get("idNguon").asText() : "");
                    String dst = capDung.has("phaiId") ? capDung.get("phaiId").asText() : (capDung.has("idDich") ? capDung.get("idDich").asText() : "");
                    if (!src.isEmpty() && !dst.isEmpty()) {
                        mapDapAn.put(dst, src);
                    }
                }

                for (JsonNode capBaiLam : mangBaiLam) {
                    String src = capBaiLam.has("traiId") ? capBaiLam.get("traiId").asText() : (capBaiLam.has("idNguon") ? capBaiLam.get("idNguon").asText() : "");
                    String dst = capBaiLam.has("phaiId") ? capBaiLam.get("phaiId").asText() : (capBaiLam.has("idDich") ? capBaiLam.get("idDich").asText() : "");
                    if (!dst.isEmpty() && src.equals(mapDapAn.get(dst))) {
                        soCauDung++;
                    }
                }

                double diem = (soCauDung * 10.0) / tongSoCau;
                return new BigDecimal(diem).setScale(2, RoundingMode.HALF_UP);
            }

            // 3. Dạng Điền Khuyết
            if (dapAnNode.has("dapAnTheoCho") || dapAnNode.has("danhSachDapAn")) {
                JsonNode mapDapAn = dapAnNode.has("dapAnTheoCho") ? dapAnNode.get("dapAnTheoCho") : dapAnNode.get("danhSachDapAn");
                JsonNode mapBaiLam = baiLamNode.has("traLoiTheoCho") ? baiLamNode.get("traLoiTheoCho") : baiLamNode.get("dapAnTheoCho");

                if (mapDapAn == null || mapDapAn.isEmpty()) return new BigDecimal("10.00");
                if (mapBaiLam == null || mapBaiLam.isEmpty()) return BigDecimal.ZERO;

                int tongSoCau = mapDapAn.size();
                int soCauDung = 0;

                var fields = mapDapAn.fields();
                while (fields.hasNext()) {
                    var entry = fields.next();
                    String idChoTrong = entry.getKey();
                    JsonNode cacDapAnChapNhan = entry.getValue();

                    String dapAnHocSinh = null;
                    if (mapBaiLam.has(idChoTrong)) {
                        dapAnHocSinh = mapBaiLam.get(idChoTrong).asText();
                    }

                    if (dapAnHocSinh != null) {
                        dapAnHocSinh = dapAnHocSinh.trim().toLowerCase();
                        boolean isDung = false;
                        if (cacDapAnChapNhan.isArray()) {
                            for (JsonNode dapAn : cacDapAnChapNhan) {
                                if (dapAn.asText().trim().toLowerCase().equals(dapAnHocSinh)) {
                                    isDung = true;
                                    break;
                                }
                            }
                        } else if (cacDapAnChapNhan.isTextual()) {
                            if (cacDapAnChapNhan.asText().trim().toLowerCase().equals(dapAnHocSinh)) {
                                isDung = true;
                            }
                        }
                        if (isDung) {
                            soCauDung++;
                        }
                    }
                }

                double diem = (soCauDung * 10.0) / tongSoCau;
                return new BigDecimal(diem).setScale(2, RoundingMode.HALF_UP);
            }

            // Mặc định trả về 0 nếu không khớp cấu trúc nào (Ví dụ H5P tự chấm)
            return BigDecimal.ZERO;

        } catch (Exception e) {
            e.printStackTrace();
            return BigDecimal.ZERO;
        }
    }
}
