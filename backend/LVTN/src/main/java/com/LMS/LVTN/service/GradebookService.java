package com.LMS.LVTN.service;

import com.LMS.LVTN.dto.response.GradebookResponse;
import com.LMS.LVTN.entity.*;
import com.LMS.LVTN.exception.AppExceptions;
import com.LMS.LVTN.exception.Errorcode;
import com.LMS.LVTN.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GradebookService {

    private final LopHocRepository lopHocRepository;
    private final HoSoGiaoVienRepository hoSoGiaoVienRepository;
    private final PhanCongGiangDayRepository phanCongGiangDayRepository;
    private final HoSoHocSinhRepository hoSoHocSinhRepository;
    private final BaiTapRepository baiTapRepository;
    private final BaiNopRepository baiNopRepository;
    private final TienDoHocSinhRepository tienDoHocSinhRepository;
    private final LichSuTuHocRepository lichSuTuHocRepository;
    private final HocKyRepository hocKyRepository;

    public GradebookResponse getGradebook(Long giaoVienId, Long classId, Integer semesterId) {
        LopHoc lopHoc = lopHocRepository.findById(classId)
                .orElseThrow(() -> new AppExceptions(Errorcode.LOP_HOC_NOT_FOUND));
        
        HocKy hocKy = hocKyRepository.findById(semesterId)
                .orElseThrow(() -> new AppExceptions(Errorcode.DATA_NOT_FOUND));

        HoSoGiaoVien giaoVien = hoSoGiaoVienRepository.findById(giaoVienId)
                .orElseThrow(() -> new AppExceptions(Errorcode.HO_SO_GIAO_VIEN_NOT_FOUND));

        boolean isHomeroom = lopHoc.getGiaoVienChuNhiem() != null && 
                             lopHoc.getGiaoVienChuNhiem().getGiaoVienId().equals(giaoVienId);

        GradebookResponse response = new GradebookResponse();
        response.setClassId(classId);
        response.setClassName(lopHoc.getTenLop());
        response.setSemesterId(semesterId);
        response.setIsHomeroomTeacher(isHomeroom);

        List<HoSoHocSinh> hocSinhs = hoSoHocSinhRepository.findByLopHoc_LopHocId(classId);
        List<GradebookResponse.StudentGradeResponse> studentResponses = new ArrayList<>();

        // Lấy danh sách môn học của giáo viên này nếu không phải GVCN (hoặc lấy tất cả nếu là GVCN)
        List<PhanCongGiangDay> phanCongs = phanCongGiangDayRepository.findByLopHoc_LopHocIdAndHocKy_HocKyId(classId, semesterId);
        
        for (HoSoHocSinh hs : hocSinhs) {
            GradebookResponse.StudentGradeResponse studentResp = new GradebookResponse.StudentGradeResponse();
            studentResp.setStudentId(hs.getHocSinhId());
            studentResp.setStudentCode(hs.getMaHocSinh());
            studentResp.setFullName(hs.getHoTen());
            
            // Xử lý GVBM (Lấy điểm các môn giáo viên này dạy)
            List<GradebookResponse.SubjectGradeData> subjectGrades = new ArrayList<>();
            for (PhanCongGiangDay pc : phanCongs) {
                if (!isHomeroom && !pc.getGiaoVien().getGiaoVienId().equals(giaoVienId)) {
                    continue; // GVBM chỉ xem môn mình dạy
                }
                
                GradebookResponse.SubjectGradeData subjectData = calculateSubjectGrade(hs, pc.getGiaoVien().getGiaoVienId(), pc.getMonHoc().getTenMon(), pc.getMonHoc().getMaMon(), classId, semesterId);
                subjectGrades.add(subjectData);
            }
            studentResp.setSubjectGrades(subjectGrades);
            
            // Xử lý GVCN
            if (isHomeroom) {
                GradebookResponse.HomeroomGradeData hrData = new GradebookResponse.HomeroomGradeData();
                List<GradebookResponse.SubjectAverage> subjectAverages = new ArrayList<>();
                double totalScore = 0;
                double totalProgress = 0;
                int subjectCount = 0;
                
                for (GradebookResponse.SubjectGradeData sg : subjectGrades) {
                    GradebookResponse.SubjectAverage sa = new GradebookResponse.SubjectAverage();
                    sa.setSubjectName(sg.getSubjectName());
                    sa.setFinalSubjectScore(sg.getFinalSubjectScore());
                    subjectAverages.add(sa);
                    
                    if (sg.getFinalSubjectScore() != null) {
                        totalScore += sg.getFinalSubjectScore();
                    }
                    if (sg.getSelfStudyProgress() != null) {
                        totalProgress += sg.getSelfStudyProgress();
                    }
                    subjectCount++;
                }
                
                hrData.setSubjectAverages(subjectAverages);
                hrData.setSemesterAverage(subjectCount > 0 ? totalScore / subjectCount : 0.0);
                hrData.setOverallProgress(subjectCount > 0 ? totalProgress / subjectCount : 0.0);
                studentResp.setHomeroomGrades(hrData);
                
                studentResp.setStatus(hrData.getSemesterAverage() >= 5.0 ? "Đạt" : "Cần cố gắng");
            } else {
                 // For GVBM status based on their subjects average
                 double avg = subjectGrades.stream().filter(s -> s.getFinalSubjectScore() != null).mapToDouble(GradebookResponse.SubjectGradeData::getFinalSubjectScore).average().orElse(0.0);
                 studentResp.setStatus(avg >= 5.0 ? "Đạt" : "Cần cố gắng");
            }
            
            studentResponses.add(studentResp);
        }
        
        response.setStudents(studentResponses);
        return response;
    }

    private GradebookResponse.SubjectGradeData calculateSubjectGrade(HoSoHocSinh hs, Long teacherId, String subjectName, String maMon, Long classId, Integer semesterId) {
        GradebookResponse.SubjectGradeData subjectData = new GradebookResponse.SubjectGradeData();
        subjectData.setSubjectName(subjectName);
        
        // Bài tập
        List<BaiTap> baiTaps = baiTapRepository.findByLopHoc_LopHocIdAndGiaoVien_GiaoVienIdAndHocKy_HocKyId(classId, teacherId, semesterId);
        List<GradebookResponse.AssignmentScore> assignmentScores = new ArrayList<>();
        double totalAssScore = 0;
        int assCount = 0;
        
        for (BaiTap bt : baiTaps) {
            GradebookResponse.AssignmentScore as = new GradebookResponse.AssignmentScore();
            as.setAssignmentId(bt.getBaiTapId());
            as.setTitle(bt.getTieuDe());
            
            // Tìm BaiNop của học sinh này cho bài tập này
            Double score = null;
            List<BaiNop> bns = baiNopRepository.findByBaiTap_BaiTapIdAndHocSinh_HocSinhId(bt.getBaiTapId(), hs.getHocSinhId());
            if (!bns.isEmpty()) {
                BaiNop bn = bns.get(bns.size() - 1); // Lấy bài nộp mới nhất
                if (bn.getDanhGiaBaiLam() != null && bn.getDanhGiaBaiLam().getDiemSo() != null) {
                    score = bn.getDanhGiaBaiLam().getDiemSo().doubleValue();
                } else if (bn.getDiemTuDong() != null) {
                    score = bn.getDiemTuDong().doubleValue();
                }
            }
            as.setScore(score);
            assignmentScores.add(as);
            
            if (score != null) {
                totalAssScore += score;
                assCount++;
            }
        }
        subjectData.setAssignments(assignmentScores);
        Double avgAss = assCount > 0 ? totalAssScore / assCount : null;
        subjectData.setAverageAssignmentScore(avgAss != null ? Math.round(avgAss * 100.0) / 100.0 : null);
        
        // Tự học - Lấy tiến độ
        Double avgProgress = tienDoHocSinhRepository.getAverageProgressByStudentAndSubject(hs.getHocSinhId(), maMon, semesterId);
        subjectData.setSelfStudyProgress(avgProgress != null ? avgProgress.shortValue() : 0);
        
        // Tự học - Điểm số
        Double avgSelfScore = lichSuTuHocRepository.getAverageScoreByStudentAndSubject(hs.getHocSinhId(), maMon);
        Integer selfStudyCount = lichSuTuHocRepository.countByStudentAndSubject(hs.getHocSinhId(), maMon);
        
        subjectData.setSelfStudyCount(selfStudyCount != null ? selfStudyCount : 0);
        subjectData.setAverageSelfStudyScore(avgSelfScore != null ? Math.round(avgSelfScore * 100.0) / 100.0 : null);
        
        // Tính tổng kết môn
        Double finalScore = null;
        if (avgAss != null && avgSelfScore != null) {
            finalScore = (avgAss + avgSelfScore) / 2.0;
        } else if (avgAss != null) {
            finalScore = avgAss;
        } else if (avgSelfScore != null) {
            finalScore = avgSelfScore;
        }
        
        subjectData.setFinalSubjectScore(finalScore != null ? Math.round(finalScore * 100.0) / 100.0 : null);
        return subjectData;
    }
}
