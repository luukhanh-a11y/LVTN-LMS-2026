package com.titkul.lms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hoc_ky", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"nam_hoc_id", "so_hoc_ky"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HocKy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hoc_ky_id", columnDefinition = "INT UNSIGNED")
    private Integer hocKyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nam_hoc_id", nullable = false)
    private NamHoc namHoc;

    @Column(name = "so_hoc_ky", nullable = false)
    private Integer soHocKy;
}
