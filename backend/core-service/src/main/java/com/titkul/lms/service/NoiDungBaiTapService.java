package com.titkul.lms.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titkul.lms.dto.NoiDungBaiTapRequest;
import com.titkul.lms.entity.DangBai;
import com.titkul.lms.repository.DangBaiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// Soạn thảo nội dung quiz (trắc nghiệm/nối cặp/điền khuyết) cho dang_bai kiểu JSON_TEXT —
// dành cho Admin (biên soạn sách chuẩn) và GV (thêm bài bổ sung, theo đúng thiết kế gốc
// của db/new_db.sql). Chỉ dùng cho AI-03/bộ-sách-quiz — không đụng tới dang_bai kiểu H5P.
@Service
@RequiredArgsConstructor
public class NoiDungBaiTapService {

    private final DangBaiRepository dangBaiRepository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getThuVienGocLibrary() {
        return dangBaiRepository.findAllBoSachOrdered().stream()
                .map(db -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", db.getDangBaiId());
                    map.put("tenDangBai", db.getTenDangBai());
                    map.put("loai", extractLoai(db.getCauHinh()));
                    map.put("hasContent", db.getDapAnChuan() != null);
                    map.put("xpThuong", db.getXpThuong());
                    map.put("baiHocId", db.getBaiHoc().getBaiHocId());
                    map.put("tenBaiHoc", db.getBaiHoc().getTenBaiHoc());
                    map.put("tenChuDe", db.getBaiHoc().getChuDe().getTenChuDe());
                    map.put("tenSach", db.getBaiHoc().getChuDe().getSach().getTenSach());
                    map.put("khoiLop", db.getBaiHoc().getChuDe().getSach().getKhoiLop());
                    map.put("hocKy", db.getBaiHoc().getChuDe().getSach().getHocKy());
                    map.put("monHocId", db.getMonHoc().getMonHocId());
                    map.put("tenMon", db.getMonHoc().getTenMon());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getBaiHocDetail(Integer baiHocId) {
        List<DangBai> items = dangBaiRepository.findByBaiHocIdOrdered(baiHocId);
        if (items.isEmpty()) {
            throw new RuntimeException("Không tìm thấy nội dung cho bài này");
        }
        DangBai first = items.get(0);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("baiHocId", baiHocId);
        result.put("tenBaiHoc", first.getBaiHoc().getTenBaiHoc());
        result.put("tenChuDe", first.getBaiHoc().getChuDe().getTenChuDe());
        result.put("tenSach", first.getBaiHoc().getChuDe().getSach().getTenSach());
        result.put("khoiLop", first.getBaiHoc().getChuDe().getSach().getKhoiLop());
        result.put("tenMon", first.getMonHoc().getTenMon());
        result.put("items", items.stream().map(db -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", db.getDangBaiId());
            map.put("tenDangBai", db.getTenDangBai());
            map.put("loai", extractLoai(db.getCauHinh()));
            map.put("xpThuong", db.getXpThuong());
            map.put("cauHinh", parseJsonOrNull(db.getCauHinh()));
            map.put("dapAnChuan", parseJsonOrNull(db.getDapAnChuan()));
            return map;
        }).collect(Collectors.toList()));
        return result;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getQuizSlots(Integer subjectId, Integer grade) {
        return dangBaiRepository.findBySubjectAndGradeOrdered(subjectId, grade).stream()
                .filter(db -> db.getLoaiNoiDung() == com.titkul.lms.entity.LoaiNoiDung.JSON_TEXT)
                .filter(db -> !"LY_THUYET".equals(extractLoai(db.getCauHinh())))
                .map(db -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", db.getDangBaiId());
                    map.put("tenDangBai", db.getTenDangBai());
                    map.put("tenChuDe", db.getBaiHoc().getChuDe().getTenChuDe());
                    map.put("hasContent", db.getDapAnChuan() != null);
                    map.put("loai", extractLoai(db.getCauHinh()));
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getNoiDung(Integer dangBaiId) {
        DangBai db = dangBaiRepository.findById(dangBaiId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài"));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", db.getDangBaiId());
        result.put("tenDangBai", db.getTenDangBai());
        result.put("loai", extractLoai(db.getCauHinh()));
        result.put("cauHinh", parseJsonOrNull(db.getCauHinh()));
        result.put("dapAnChuan", parseJsonOrNull(db.getDapAnChuan()));
        return result;
    }

    @Transactional
    public void luuNoiDung(Integer dangBaiId, NoiDungBaiTapRequest dto) {
        DangBai db = dangBaiRepository.findById(dangBaiId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài"));
        if (db.getLoaiNoiDung() != com.titkul.lms.entity.LoaiNoiDung.JSON_TEXT) {
            throw new RuntimeException("Chỉ soạn được nội dung quiz cho bài kiểu JSON_TEXT (bộ sách)");
        }
        if (dto.getLoai() == null || dto.getCauHinh() == null || dto.getDapAnChuan() == null) {
            throw new RuntimeException("Thiếu loại câu hỏi, câu hỏi hoặc đáp án");
        }

        try {
            Map<String, Object> cauHinhVoiLoai = new LinkedHashMap<>(dto.getCauHinh());
            cauHinhVoiLoai.put("loai", dto.getLoai());
            db.setCauHinh(objectMapper.writeValueAsString(cauHinhVoiLoai));
            db.setDapAnChuan(objectMapper.writeValueAsString(dto.getDapAnChuan()));
        } catch (Exception e) {
            throw new RuntimeException("Lỗi lưu nội dung: " + e.getMessage());
        }
        dangBaiRepository.save(db);
    }

    private String extractLoai(String cauHinhJson) {
        if (cauHinhJson == null) return null;
        try {
            JsonNode node = objectMapper.readTree(cauHinhJson);
            return node.has("loai") ? node.get("loai").asText() : null;
        } catch (Exception e) {
            return null;
        }
    }

    private Object parseJsonOrNull(String json) {
        if (json == null) return null;
        try {
            return objectMapper.readValue(json, Object.class);
        } catch (Exception e) {
            return null;
        }
    }
}
