// Force recompile
package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.game.common.GameDataSplitResult;
import com.LMS.LVTN.dto.request.DangBaiRequest;
import com.LMS.LVTN.dto.response.DangBaiResponse;
import com.LMS.LVTN.dto.response.DangBaiStudentResponse;
import com.LMS.LVTN.entity.DangBai;
import com.LMS.LVTN.enums.LoaiNoiDung;
import com.LMS.LVTN.enums.NguonGoc;
import com.LMS.LVTN.repository.DangBaiRepository;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.DangBaiMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DangBaiService {

    private final DangBaiRepository dangBaiRepository;
    private final GameService gameService;
    private final DangBaiMapper dangBaiMapper;

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
}
