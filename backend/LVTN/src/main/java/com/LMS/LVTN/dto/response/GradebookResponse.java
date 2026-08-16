package com.LMS.LVTN.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
public class GradebookResponse {
    private Long classId;
    private String className;
    private Integer semesterId;
    private Boolean isHomeroomTeacher;
    private List<StudentGradeResponse> students;

    @Data
    @NoArgsConstructor
    public static class StudentGradeResponse {
        private Long studentId;
        private String studentCode;
        private String fullName;
        private String status; // Trạng thái: Đạt / Cần cố gắng
        private List<SubjectGradeData> subjectGrades; 
        private HomeroomGradeData homeroomGrades;
    }

    @Data
    @NoArgsConstructor
    public static class SubjectGradeData {
        private String subjectName;
        private List<AssignmentScore> assignments;
        private Double averageAssignmentScore;
        
        private Short selfStudyProgress;
        private Integer selfStudyCount;
        private Double averageSelfStudyScore;
        
        private Double finalSubjectScore;
    }

    @Data
    @NoArgsConstructor
    public static class AssignmentScore {
        private Long assignmentId;
        private String title;
        private Double score;
    }

    @Data
    @NoArgsConstructor
    public static class HomeroomGradeData {
        private List<SubjectAverage> subjectAverages;
        private Double overallProgress;
        private Double semesterAverage;
    }

    @Data
    @NoArgsConstructor
    public static class SubjectAverage {
        private String subjectName;
        private Double finalSubjectScore;
    }
}
