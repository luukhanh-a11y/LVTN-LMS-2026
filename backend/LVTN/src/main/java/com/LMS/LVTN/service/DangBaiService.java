// Force recompile
package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.game.common.GameDataSplitResult;
import com.LMS.LVTN.dto.request.DangBaiRequest;
import com.LMS.LVTN.dto.response.DangBaiResponse;
import com.LMS.LVTN.dto.response.DangBaiStudentResponse;
import com.LMS.LVTN.entity.BaiHoc;
import com.LMS.LVTN.entity.BaiTap;
import com.LMS.LVTN.entity.DangBai;
import com.LMS.LVTN.enums.LoaiNoiDung;
import com.LMS.LVTN.enums.NguonGoc;
import com.LMS.LVTN.repository.DangBaiRepository;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.DangBaiMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.LMS.LVTN.entity.ChiTietBaiTap;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DangBaiService {

    private final DangBaiRepository dangBaiRepository;
    private final GameService gameService;
    private final DangBaiMapper dangBaiMapper;
    private final com.LMS.LVTN.repository.ChiTietBaiTapRepository chiTietBaiTapRepository;
    private final com.LMS.LVTN.repository.BaiTapRepository baiTapRepository;
    private final com.LMS.LVTN.repository.BaiNopRepository baiNopRepository;
    private final com.LMS.LVTN.repository.BaiHocRepository baiHocRepository;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    public List<DangBaiResponse> getAllDangBaiHeThong() {
        return dangBaiRepository.findAll().stream()
                .filter(db -> db.getNguonGoc() == NguonGoc.HE_THONG)
                .map(dangBaiMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<DangBaiResponse> getByBaiHocId(Integer baiHocId) {
        return dangBaiRepository.findByBaiHoc_BaiHocId(baiHocId).stream()
                .map(dangBaiMapper::toResponse)
                .collect(Collectors.toList());
    }

    public DangBaiResponse getDangBaiById(Integer id) {
        DangBai dangBai = dangBaiRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DANG_BAI_NOT_FOUND));
        return dangBaiMapper.toResponse(dangBai);
    }

    public List<DangBaiStudentResponse> getByBaiHocIdForStudent(Integer baiHocId) {
        return dangBaiRepository.findByBaiHoc_BaiHocId(baiHocId).stream()
                .map(dangBaiMapper::toStudentResponse)
                .collect(Collectors.toList());
    }

    public DangBaiStudentResponse getDangBaiByIdForStudent(Integer id) {
        DangBai dangBai = dangBaiRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DANG_BAI_NOT_FOUND));
        return dangBaiMapper.toStudentResponse(dangBai);
    }

//    public List<DangBaiStudentResponse> getByBaiTapIdForStudent(Long baiTapId) {
//        return getByBaiTapIdForStudent(baiTapId, null);
//    }

    public List<DangBaiStudentResponse> getByBaiTapIdForStudent(Long baiTapId, Long hocSinhId) {
        BaiTap baiTap = baiTapRepository.findById(baiTapId)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        if (baiTap.getThoiDiemBatDau() != null && LocalDateTime.now().isBefore(baiTap.getThoiDiemBatDau())) {
            throw new AppExceptions(Errorcode.BAI_TAP_CHUA_MO);
        }

        if (hocSinhId != null && baiTap.getSoLanNopLaiToiDa() != null && baiTap.getSoLanNopLaiToiDa() != -1) {
            long soLanDaLam = baiNopRepository.countByBaiTap_BaiTapIdAndHocSinh_HocSinhId(baiTapId, hocSinhId);
            long tongSoLanChoPhep = 1 + (baiTap.getSoLanNopLaiToiDa() > 0 ? baiTap.getSoLanNopLaiToiDa() : 0);
            if (soLanDaLam >= tongSoLanChoPhep) {
                throw new AppExceptions(Errorcode.VUOT_QUA_SO_LAN_NOP_TOI_DA);
            }
        }

        List<ChiTietBaiTap> chiTietList = chiTietBaiTapRepository.findByBaiTap_BaiTapIdOrderByThuTuAsc(baiTapId);
        List<DangBaiStudentResponse> responseList = new ArrayList<>();



        for (ChiTietBaiTap ct : chiTietList) {
            Integer dangBaiId = ct.getDangBai().getDangBaiId();
            if (dangBaiRepository.isSachGiaoKhoa(dangBaiId)) {
                throw new AppExceptions(Errorcode.DATA_NOT_FOUND);
            }

            DangBaiStudentResponse res = dangBaiMapper.toStudentResponse(ct.getDangBai());
            String duLieuGame = res.getDuLieuGame();
            if (duLieuGame != null && !duLieuGame.isEmpty() && ct.getCheDoGiaoDien() != null) {
                try {
                    JsonNode rootNode = objectMapper.readTree(duLieuGame);
                    if (rootNode instanceof ObjectNode) {
                        ((ObjectNode) rootNode).put("giaoDien", ct.getCheDoGiaoDien());
                        updateGiaoDienInNode(rootNode, ct.getCheDoGiaoDien());
                        res.setDuLieuGame(objectMapper.writeValueAsString(rootNode));
                    }
                } catch (Exception e) {

                }
            }
            responseList.add(res);
        }

        return responseList;
    }

    private void updateGiaoDienInNode(JsonNode node, String cheDoGiaoDien) {
        if (node instanceof ObjectNode) {
            ObjectNode objNode = (ObjectNode) node;
            if (objNode.has("giaoDien")) {
                objNode.put("giaoDien", cheDoGiaoDien);
            }
            objNode.fields().forEachRemaining(entry -> updateGiaoDienInNode(entry.getValue(), cheDoGiaoDien));
        } else if (node instanceof ArrayNode) {
            node.forEach(element -> updateGiaoDienInNode(element, cheDoGiaoDien));
        }
    }

    @Transactional
    public DangBaiResponse createDangBaiHeThong(DangBaiRequest request) {
        DangBai dangBai = new DangBai();
        dangBaiMapper.updateEntityFromRequest(request, dangBai);

        dangBai.setNguonGoc(NguonGoc.HE_THONG);

        if (request.getLoaiNoiDung() == LoaiNoiDung.JSON_TEXT && request.getDuLieuGame() != null) {
            GameDataSplitResult splitResult = gameService.splitGameData(request.getDuLieuGame());
            dangBai.setDuLieuGame(splitResult.getCauHoiJson());
            dangBai.setDapAnChuan(splitResult.getDapAnJson());
        }

        DangBai saved = dangBaiRepository.save(dangBai);
        return dangBaiMapper.toResponse(saved);
    }

    @Transactional
    public DangBaiResponse updateDangBaiHeThong(Integer id, DangBaiRequest request) {
        DangBai dangBai = dangBaiRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.DANG_BAI_NOT_FOUND));
                
        dangBaiMapper.updateEntityFromRequest(request, dangBai);
        dangBai.setNguonGoc(NguonGoc.HE_THONG);

        if (request.getLoaiNoiDung() == LoaiNoiDung.JSON_TEXT && request.getDuLieuGame() != null) {
            GameDataSplitResult splitResult = gameService.splitGameData(request.getDuLieuGame());
            dangBai.setDuLieuGame(splitResult.getCauHoiJson());
            dangBai.setDapAnChuan(splitResult.getDapAnJson());
        }

        DangBai saved = dangBaiRepository.save(dangBai);
        return dangBaiMapper.toResponse(saved);
    }

    public void deleteDangBai(Integer id) {
        if (!dangBaiRepository.existsById(id))
            throw new AppExceptions(Errorcode.DANG_BAI_NOT_FOUND);
        dangBaiRepository.deleteById(id);
    }

    @Transactional
    public List<DangBaiResponse> nhanBanDangBai(Integer baiHocCuId, Integer baiHocMoiId) {
        BaiHoc baiHocMoi = baiHocRepository.findById(baiHocMoiId)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        // Chỉ lấy dạng bài gốc từ hệ thống (HE_THONG), không lấy dạng bài do giáo viên tạo bổ sung
        List<DangBai> dangBaiCuList = dangBaiRepository.findByBaiHoc_BaiHocIdAndNguonGoc(baiHocCuId, NguonGoc.HE_THONG);
        List<DangBai> dangBaiMoiList = new ArrayList<>();

        for (DangBai dangBaiCu : dangBaiCuList) {
            DangBai dangBaiMoi = new DangBai();
            dangBaiMoi.setBaiHoc(baiHocMoi);
            dangBaiMoi.setTenDangBai(dangBaiCu.getTenDangBai());
            dangBaiMoi.setSlug(dangBaiCu.getSlug() != null ? dangBaiCu.getSlug() + "-bh" + baiHocMoiId : null);
            dangBaiMoi.setSoTrang(dangBaiCu.getSoTrang());
            dangBaiMoi.setSoThuTu(dangBaiCu.getSoThuTu());
            dangBaiMoi.setLoaiNoiDung(dangBaiCu.getLoaiNoiDung());
            dangBaiMoi.setNguonGoc(NguonGoc.HE_THONG); // Nguồn gốc hệ thống
            dangBaiMoi.setGiaoVien(null);
            dangBaiMoi.setH5pNoiDungId(dangBaiCu.getH5pNoiDungId());
            dangBaiMoi.setXpThuong(dangBaiCu.getXpThuong());
            dangBaiMoi.setDuLieuGame(dangBaiCu.getDuLieuGame());
            dangBaiMoi.setDapAnChuan(dangBaiCu.getDapAnChuan());
            dangBaiMoi.setBookIndexIdNgoai(dangBaiCu.getBookIndexIdNgoai());

            dangBaiMoiList.add(dangBaiRepository.save(dangBaiMoi));
        }

        return dangBaiMoiList.stream()
                .map(dangBaiMapper::toResponse)
                .collect(Collectors.toList());
    }
}
