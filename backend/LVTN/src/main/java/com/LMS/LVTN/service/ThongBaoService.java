package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.request.ThongBaoRequest;
import com.LMS.LVTN.dto.response.ThongBaoResponse;
import com.LMS.LVTN.entity.HopThuThongBao;
import com.LMS.LVTN.entity.HoSoHocSinh;
import com.LMS.LVTN.entity.NguoiDung;
import com.LMS.LVTN.entity.ThongBao;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.mapper.ThongBaoMapper;
import com.LMS.LVTN.repository.HopThuThongBaoRepository;
import com.LMS.LVTN.repository.HoSoHocSinhRepository;
import com.LMS.LVTN.repository.NguoiDungRepository;
import com.LMS.LVTN.repository.ThongBaoRepository;
import com.LMS.LVTN.repository.NamHocRepository;
import com.LMS.LVTN.entity.NamHoc;
import com.LMS.LVTN.repository.CauHinhHeThongRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ThongBaoService {

    ThongBaoRepository thongBaoRepository;
    ThongBaoMapper thongBaoMapper;
    NguoiDungRepository nguoiDungRepository;
    HoSoHocSinhRepository hoSoHocSinhRepository;
    HopThuThongBaoRepository hopThuThongBaoRepository;
    NamHocRepository namHocRepository;
    CauHinhHeThongRepository cauHinhHeThongRepository;

    @Transactional
    public ThongBaoResponse create(ThongBaoRequest request) {
        ThongBao thongBao = thongBaoMapper.toEntity(request);
        
        if (request.getNguoiGuiId() != null) {
            NguoiDung nguoiGui = nguoiDungRepository.findById(request.getNguoiGuiId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            thongBao.setNguoiGui(nguoiGui);
        }
        
        ThongBao savedThongBao = thongBaoRepository.save(thongBao);

        List<NguoiDung> danhSachNhan = new ArrayList<>();

        if (request.getNguoiNhanId() != null) {

            NguoiDung nguoiNhan = nguoiDungRepository.findById(request.getNguoiNhanId())
                    .orElseThrow(() -> new AppExceptions(Errorcode.USER_NOT_FOUND));
            danhSachNhan.add(nguoiNhan);
        } else if (request.getLopHocId() != null) {

            List<HoSoHocSinh> hsList = hoSoHocSinhRepository.findByLopHoc_LopHocId(request.getLopHocId());
            for (HoSoHocSinh hs : hsList) {
                danhSachNhan.add(hs.getNguoiDung());
                // TODO: Thêm logic lấy phụ huynh của học sinh nếu muốn gửi cho cả PH
            }

        } else {
            danhSachNhan.addAll(nguoiDungRepository.findAll());
        }

        List<HopThuThongBao> hopThuList = danhSachNhan.stream().map(nd -> {
            HopThuThongBao ht = new HopThuThongBao();
            ht.setNguoiDung(nd);
            ht.setThongBao(savedThongBao);
            ht.setDaDoc(false);
            return ht;
        }).collect(Collectors.toList());

        hopThuThongBaoRepository.saveAll(hopThuList);
        
        return thongBaoMapper.toResponse(savedThongBao);
    }

    public List<ThongBaoResponse> getAll(Integer namHocId) {
        List<ThongBao> list;
        if (namHocId != null) {
            NamHoc namHoc = namHocRepository.findById(namHocId).orElse(null);
            if (namHoc != null && namHoc.getNgayBatDau() != null) {
                java.time.LocalDateTime startDate = namHoc.getNgayBatDau().atStartOfDay();
                java.time.LocalDateTime endDate = null;
                
                List<NamHoc> allNamHocs = namHocRepository.findAll(org.springframework.data.domain.Sort.by("ngayBatDau").ascending());
                for (int i = 0; i < allNamHocs.size(); i++) {
                    if (allNamHocs.get(i).getNamHocId().equals(namHoc.getNamHocId())) {
                        if (i + 1 < allNamHocs.size()) {
                            endDate = allNamHocs.get(i + 1).getNgayBatDau().atStartOfDay();
                        }
                        break;
                    }
                }
                
                if (endDate != null) {
                    list = thongBaoRepository.findAllByDateRange(startDate, endDate);
                } else {
                    list = thongBaoRepository.findAll().stream()
                            .filter(t -> !t.getNgayDang().isBefore(startDate))
                            .collect(Collectors.toList());
                }
            } else {
                list = thongBaoRepository.findAll();
            }
        } else {
            list = thongBaoRepository.findAll();
        }
        
        return list.stream()
                .map(thongBaoMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ThongBaoResponse getById(Long id) {
        ThongBao thongBao = thongBaoRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.THONG_BAO_NOT_FOUND));
        return thongBaoMapper.toResponse(thongBao);
    }

    @Transactional
    public ThongBaoResponse update(Long id, ThongBaoRequest request) {
        ThongBao thongBao = thongBaoRepository.findById(id)
                .orElseThrow(() -> new AppExceptions(Errorcode.THONG_BAO_NOT_FOUND));

        thongBaoMapper.updateThongBao(request, thongBao);
        return thongBaoMapper.toResponse(thongBaoRepository.save(thongBao));
    }

    @Transactional
    public List<ThongBaoResponse> getAllByid(String id){
        if (!nguoiDungRepository.existsById(id))
            throw new AppExceptions(Errorcode.USER_NOT_FOUND);

        List<HopThuThongBao> list = hopThuThongBaoRepository.findByNguoiDung_NguoiDungId(id);

        return list.stream()
                .map(hopThu -> thongBaoMapper.toResponse(hopThu.getThongBao()))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<ThongBaoResponse> getAllSentByid(String id){
        if (!nguoiDungRepository.existsById(id))
            throw new AppExceptions(Errorcode.USER_NOT_FOUND);

        return thongBaoRepository.findByNguoiGui_NguoiDungIdOrderByNgayDangDesc(id).stream()
                .map(thongBaoMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        if (!thongBaoRepository.existsById(id)) {
            throw new AppExceptions(Errorcode.THONG_BAO_NOT_FOUND);
        }
        
        // Remove related records in hop_thu_thong_bao first to avoid foreign key constraint violations
        hopThuThongBaoRepository.deleteByThongBao_ThongBaoId(id);
        
        thongBaoRepository.deleteById(id);
    }
}
