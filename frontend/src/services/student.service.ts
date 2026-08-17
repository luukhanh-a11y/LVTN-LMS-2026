import { api } from '../lib/axios';

export interface Material {
  id: number;
  title: string;
  type: 'TAI_LIEU' | 'BAI_GIANG_H5P' | 'BAI_TAP_H5P';
  origin: 'THU_VIEN_GOC' | 'GIAO_VIEN_TAO';
  fileUrl: string | null;
  h5pContentId: string | null;
  xpReward: number;
  allowRetry: boolean;
}

export const studentService = {
  getBookRoadmap: async (bookId: number) => {
    // 1. Lấy thông tin sách
    const sachRes = await api.get(`/sach/${bookId}`);
    const sach = sachRes.data?.data || sachRes.data;

    // 2. Lấy danh sách chủ đề của sách
    const chuDeRes = await api.get(`/chude/sach/${bookId}`);
    const chuDes = chuDeRes.data?.data || chuDeRes.data || [];

    // 3. Lấy danh sách bài học cho từng chủ đề
    const roadMap = await Promise.all(
      chuDes.map(async (cd: any) => {
        const baiHocRes = await api.get(`/bai-hoc/chu-de/${cd.chuDeId}`);
        const baiHocs = baiHocRes.data?.data || baiHocRes.data || [];
        
        return {
          id: cd.chuDeId,
          tenChuDe: cd.tenChuDe || cd.tieuDe,
          icon: '🔢', // TODO: Lấy icon thật nếu có
          baiHoc: baiHocs.map((bh: any) => ({
            id: bh.baiHocId,
            tenBaiHoc: bh.tenBaiHoc || bh.tieuDe,
            type: 'CURRENT' // TODO: Hiện tại mở khóa tất cả, chờ API bulk progress
          }))
        };
      })
    );

    return {
      sachId: sach.sachId || sach.id,
      tenSach: sach.tenSach || sach.tenMonHoc || 'Sách',
      chuDe: roadMap
    };
  },
  getMaterials: async (): Promise<Material[]> => {
    const response = await api.get<Material[]>('/hoc-lieu');
    return response.data;
  },

  getDashboard: async () => {      let hoSo: any = {};
      try {
        const hsRes = await api.get('/hoso-hocsinh/my-profile');
        hoSo = hsRes.data.data || hsRes.data;
      } catch (err) {
      }
      
      let upcomingTasks: any[] = [];
      const lopHocId = hoSo.lopHocId;
      if (lopHocId) {
        try {
          const btRes = await api.get(`/bai-tap/lop-hoc/${lopHocId}`);
          let allTasks = (btRes.data.data || btRes.data || []).filter((t: any) => t.trangThai === 'DANG_MO' || !t.trangThai);
          
          let mySubmissions: any[] = [];
          const hsId = hoSo.hocSinhId || hoSo.id || hoSo.nguoiDungId;
          if (hsId) {
            try {
              const subRes = await api.get(`/bai-nop/hoc-sinh/${hsId}`);
              mySubmissions = subRes.data.data || subRes.data || [];
            } catch (e) {}
          }
          const submittedIds = new Set(mySubmissions.map((s: any) => s.baiTapId));
          allTasks = allTasks.filter((t: any) => !submittedIds.has(t.baiTapId));
          allTasks.sort((a: any, b: any) => (b.baiTapId || 0) - (a.baiTapId || 0));
          const rawTasks = allTasks.slice(0, 5);
          upcomingTasks = rawTasks.map((t: any) => {
            const dueDateStr = t.hanNop ? new Date(t.hanNop).toLocaleDateString('vi-VN') : 'Không thời hạn';
            return {
              id: t.baiTapId,
              title: t.tenBaiTap || t.tieuDe,
              dueDate: t.hanNop,
              time: dueDateStr,
              xpReward: t.xpReward || 0,
              subject: t.monHoc?.tenMon,
              subjectName: t.monHoc?.tenMon,
              completed: false,
              loaiBaiTap: t.loaiBaiTap
            };
          });
        } catch (err) {
        }
      }

      let recentNotifications: any[] = [];
      let nguoiDungId = null;
      try {
        const infoRes = await api.get('/nguoi-dung/my-info');
        nguoiDungId = (infoRes.data.data || infoRes.data).nguoiDungId;
      } catch (err) {
      }

      if (nguoiDungId) {
        try {
          const [ghimRes, khongGhimRes] = await Promise.all([
            api.get(`/hop-thu-thong-bao/nguoi-dung/${nguoiDungId}/ghim`),
            api.get(`/hop-thu-thong-bao/nguoi-dung/${nguoiDungId}/khong-ghim`)
          ]);
          const rawGhim = ghimRes.data.data || ghimRes.data || [];
          const rawKhongGhim = khongGhimRes.data.data || khongGhimRes.data || [];
          const allNotis = [...rawGhim, ...rawKhongGhim].slice(0, 5);
          recentNotifications = allNotis.map((n: any) => {
            const dateStr = (n.ngayDang || n.ngayTao) ? new Date(n.ngayDang || n.ngayTao).toLocaleDateString('vi-VN') : '';
            return {
              id: n.thongBaoId,
              title: n.tieuDe,
              content: n.noiDung,
              createdAt: n.ngayDang || n.ngayTao,
              date: dateStr,
              read: !!n.daDoc || !!n.trangThaiDoc,
              pinned: !!n.laGhim,
              type: n.loaiThongBao,
              isNew: !n.daDoc && !n.trangThaiDoc
            };
          });
        } catch (err) {
        }
      }
      
      let currentHocKyId = 1;
      try {
        const hkRes = await api.get('/hoc-ky');
        const listHk = hkRes.data?.data || hkRes.data || [];
        if (listHk.length > 0) {
          const hk = listHk.find((k: any) => k.soHocKy === 1 || k.hocKyId === 1) || listHk[0];
          currentHocKyId = hk.hocKyId || hk.id || 1;
        }
      } catch (err) {}

      let enrolledSubjects: any[] = [];
      const hocSinhId = hoSo.hocSinhId || hoSo.id || hoSo.nguoiDungId;
      if (hocSinhId || hoSo.lopHocId) {
        try {
          let myBooks: any[] = [];
          if (hocSinhId) {
            try {
              const sachRes = await api.get(`/sach/sach-giao-khoa/hoc-sinh/${hocSinhId}/hoc-ky/${currentHocKyId}`);
              myBooks = sachRes.data.data || sachRes.data || [];
            } catch (e) {
              myBooks = [];
            }
          }

          if (!myBooks || myBooks.length === 0) {
            if (hoSo.lopHocId) {
              const lopRes = await api.get(`/lophoc/${hoSo.lopHocId}`);
              const lop = lopRes.data.data || lopRes.data;
              if (lop?.khoiLop) {
                const currentHocKyId = localStorage.getItem('academic-storage') 
                  ? JSON.parse(localStorage.getItem('academic-storage') as string).state?.currentHocKyId 
                  : null;
                  
                if (currentHocKyId && hoSo.hocSinhId) {
                  const sachRes = await api.get(`/sach/sach-giao-khoa/hoc-sinh/${hoSo.hocSinhId}/hoc-ky/${currentHocKyId}`);
                  myBooks = sachRes.data.data || sachRes.data || [];
                } else {
                  // Fallback
                  const sachRes = await api.get(`/sach`);
                  const allBooks = sachRes.data.data || sachRes.data || [];
                  myBooks = allBooks.filter((s: any) => 
                    s.khoiLop === lop.khoiLop && 
                    (!s.loaiSach || s.loaiSach === 'SACH_GIAO_KHOA')
                  );
                }
              }
            }
          }

          enrolledSubjects = myBooks.map((s: any) => ({
            id: s.sachId || s.id,
            name: s.tenSach || s.tieuDe || "Môn học",
            desc: s.moTa || `Sách giáo khoa - Học kỳ ${s.hocKy || 1}`,
            icon: (s.tenSach || "").includes("Toán") ? "3d-math" : "3d-vietnamese",
            progress: 0
          }));
        } catch (err) {
          console.error("Failed to fetch subjects for dashboard:", err);
        }
      }
      let className = "1A";
      if (hoSo.lopHocId) {
        try {
          const lopRes = await api.get(`/lophoc/${hoSo.lopHocId}`);
          className = lopRes.data.data?.tenLop || lopRes.data?.tenLop || "1A";
        } catch (e) {
          console.warn("Could not fetch class for dashboard routing");
        }
      }
      
      return {
        studentName: hoSo.hoTen || "Học sinh",
        className: className, // Dùng className thực tế để route chuẩn xác
        totalXp: hoSo.tongXp || 0,
        level: Math.floor((hoSo.tongXp || 0) / 100) + 1,
        nextLevelXp: 100,
        completedLessons: 0,
        rank: 1,
        upcomingTasks,
        subjects: enrolledSubjects,
        recentNotifications
      };
    
  },

  getAssignments: async () => {
    let hoSo: any = {};
    try {
      const hsRes = await api.get('/hoso-hocsinh/my-profile');
      hoSo = hsRes.data.data || hsRes.data;
    } catch (err) {}
    
    if (!hoSo.lopHocId) return [];
    try {
      const btRes = await api.get(`/bai-tap/lop-hoc/${hoSo.lopHocId}`);
      const rawTasks = btRes.data.data || btRes.data || [];

      let mySubmissions: any[] = [];
      const hsId = hoSo.hocSinhId || hoSo.id || hoSo.nguoiDungId;
      if (hsId) {
        try {
          const subRes = await api.get(`/bai-nop/hoc-sinh/${hsId}`);
          mySubmissions = subRes.data.data || subRes.data || [];
        } catch (e) {}
      }
      const submittedMap = new Map(mySubmissions.map((s: any) => [s.baiTapId, s]));

      return rawTasks.map((t: any) => {
        const sub = submittedMap.get(t.baiTapId || t.id);
        const isCompleted = !!sub;
        return {
          id: t.baiTapId || t.id,
          title: t.tenBaiTap || t.tieuDe,
          dueDate: t.deadline || t.hanNop,
          assignedDate: t.thoiDiemBatDau || t.ngayTao,
          xpReward: t.xpReward || 0,
          completed: isCompleted,
          subjectName: t.monHoc?.tenMon,
          type: t.loaiBaiTap || 'TRAC_NGHIEM',
          status: isCompleted ? (sub.trangThai || 'DA_NOP') : (t.trangThai || t.status)
        };
      });
    } catch (err) {
      return [];
    }
  },

  // Sau khi nộp xong 1 bài, tìm route của bài tiếp theo còn phải làm (bỏ qua bài vừa nộp
  // và các bài đã nộp/đã chấm). Không còn bài nào thì trả về trang chủ học sinh.
  getNextTaskRoute: async (currentTaskId: number): Promise<string> => {
    try {
      const tasks: any[] = await studentService.getAssignments();
      const pending = tasks
        .filter((t) => t.id !== currentTaskId && t.status !== 'DA_NOP' && t.status !== 'DA_CHAM')
        .sort((a, b) => new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime());

      const next = pending[0];
      if (!next) return '/student';

      if (next.type === 'H5P') return `/student/tasks/${next.id}/play`;
      if (['TRAC_NGHIEM', 'NOI_CAP', 'DIEN_KHUYET', 'NHIEU_CAU'].includes(next.type)) return `/student/tasks/${next.id}/quiz`;
      return `/student/essay?id=${next.id}`;
    } catch (err) {
      return '/student';
    }
  },



  getNotifications: async () => {
    try {
      const infoRes = await api.get('/nguoi-dung/my-info');
      const nguoiDungId = (infoRes.data.data || infoRes.data).nguoiDungId;
      if (!nguoiDungId) return [];
      const [ghimRes, khongGhimRes] = await Promise.all([
        api.get(`/hop-thu-thong-bao/nguoi-dung/${nguoiDungId}/ghim`),
        api.get(`/hop-thu-thong-bao/nguoi-dung/${nguoiDungId}/khong-ghim`)
      ]);
      
      const rawGhim = (ghimRes.data.data || ghimRes.data || []).map((n: any) => ({
        id: n.thongBaoId,
        title: n.tieuDe,
        content: n.noiDung,
        createdAt: n.ngayDang || n.ngayTao,
        date: (n.ngayDang || n.ngayTao) ? new Date(n.ngayDang || n.ngayTao).toLocaleDateString('vi-VN') : '',
        read: !!n.daDoc || !!n.trangThaiDoc,
        pinned: true,
        type: n.loaiThongBao
      }));

      const rawKhongGhim = (khongGhimRes.data.data || khongGhimRes.data || []).map((n: any) => ({
        id: n.thongBaoId,
        title: n.tieuDe,
        content: n.noiDung,
        date: (n.ngayDang || n.ngayTao) ? new Date(n.ngayDang || n.ngayTao).toLocaleDateString('vi-VN') : '',
        read: !!n.daDoc || !!n.trangThaiDoc,
        pinned: false,
        type: n.loaiThongBao
      }));

      return [...rawGhim, ...rawKhongGhim];
    } catch (err) {
      return [];
    }
  },

  getPinnedNotifications: async () => {
    try {
      const infoRes = await api.get('/nguoi-dung/my-info');
      const nguoiDungId = (infoRes.data.data || infoRes.data).nguoiDungId;
      if (!nguoiDungId) return [];
      const res = await api.get(`/hop-thu-thong-bao/nguoi-dung/${nguoiDungId}/ghim`);
      return (res.data.data || res.data || []).map((n: any) => ({
        id: n.thongBaoId,
        title: n.tieuDe,
        content: n.noiDung,
        createdAt: n.ngayDang || n.ngayTao,
        date: (n.ngayDang || n.ngayTao) ? new Date(n.ngayDang || n.ngayTao).toLocaleDateString('vi-VN') : '',
        read: !!n.daDoc || !!n.trangThaiDoc,
        pinned: true,
        type: n.loaiThongBao
      }));
    } catch (err) {
      return [];
    }
  },

  getUnpinnedNotifications: async () => {
    try {
      const infoRes = await api.get('/nguoi-dung/my-info');
      const nguoiDungId = (infoRes.data.data || infoRes.data).nguoiDungId;
      if (!nguoiDungId) return [];
      const res = await api.get(`/hop-thu-thong-bao/nguoi-dung/${nguoiDungId}/khong-ghim`);
      return (res.data.data || res.data || []).map((n: any) => ({
        id: n.thongBaoId,
        title: n.tieuDe,
        content: n.noiDung,
        createdAt: n.ngayDang || n.ngayTao,
        date: (n.ngayDang || n.ngayTao) ? new Date(n.ngayDang || n.ngayTao).toLocaleDateString('vi-VN') : '',
        read: !!n.daDoc || !!n.trangThaiDoc,
        pinned: false,
        type: n.loaiThongBao
      }));
    } catch (err) {
      return [];
    }
  },

  markNotificationRead: async (notificationId: number) => {    
  },

  markAllNotificationsRead: async () => {    
  },

  getRewards: async () => {
    let hoSo: any = {};
    try {
      const hsRes = await api.get('/hoso-hocsinh/my-profile');
      hoSo = hsRes.data.data || hsRes.data;
    } catch (err) {}

    if (!hoSo.hocSinhId) return { huyHieu: [], thuKhen: [], tongXp: 0 };

    try {
      const [allBadgesRes, rewardsRes] = await Promise.all([
        api.get('/huy-hieu'),
        api.get(`/khen-thuong-hoc-sinh/hoc-sinh/${hoSo.hocSinhId}`)
      ]);

      const allBadges = allBadgesRes.data.data || allBadgesRes.data || [];
      const studentRewards = rewardsRes.data.data || rewardsRes.data || [];

      // Map badges
      const mappedBadges = allBadges.map((badge: any) => {
        const earnedReward = studentRewards.find((r: any) => r.huyHieuId === badge.huyHieuId || r.huyHieuId === badge.id);
        
        let iconPath = badge.iconUrl || badge.icon;
        // Fallback for broken mock paths
        if (!iconPath || iconPath.includes('/assets/badges/')) {
          const names = (badge.tenHuyHieu || badge.tieuDe || '').toLowerCase();
          if (names.includes('sáng')) iconPath = 'https://placehold.co/400x400/FCD34D/B45309.png?text=Sang+Tao';
          else if (names.includes('chăm')) iconPath = 'https://placehold.co/400x400/FCA5A5/991B1B.png?text=Cham+Chi';
          else if (names.includes('xuất')) iconPath = 'https://placehold.co/400x400/93C5FD/1E3A8A.png?text=Xuat+Sac';
          else iconPath = 'https://placehold.co/400x400/FDBA74/9A3412.png?text=Huy+Hieu';
        }

        return {
          id: badge.huyHieuId || badge.id,
          ten: badge.tenHuyHieu || badge.tieuDe,
          moTa: badge.moTa,
          icon: iconPath,
          daMoKhoa: !!earnedReward,
          ngayTrao: earnedReward ? new Date(earnedReward.thoiDiemTrao || earnedReward.createdAt).toLocaleDateString('vi-VN') : null
        };
      });

      // Map letters
      const mappedLetters = studentRewards
        .filter((r: any) => r.thuKhen && r.thuKhen.trim() !== '')
        .map((r: any) => ({
          id: r.khenThuongId || r.id,
          giaoVien: r.tenGiaoVien || 'Thầy Cô',
          monHoc: 'Môn học', // Backend DTO doesn't have monHoc, use placeholder
          ngayTrao: new Date(r.thoiDiemTrao || r.createdAt).toLocaleDateString('vi-VN'),
          noiDung: r.thuKhen
        }));

      return {
        huyHieu: mappedBadges,
        thuKhen: mappedLetters,
        tongXp: hoSo.tongXp || 0
      };
    } catch (err) {
      return { huyHieu: [], thuKhen: [], tongXp: 0 };
    }
  },

  getSubjectTree: async (subjectId: number) => {      try {
        const sachRes = await api.get(`/sach/${subjectId}`);
        const sach = sachRes.data.data || sachRes.data;
        
        let hoSo: any = {};
        try {
          const hsRes = await api.get('/hoso-hocsinh/my-profile');
          hoSo = hsRes.data.data || hsRes.data;
        } catch (err) {}

        const tdRes = await api.get(`/tien-do-hoc-sinh`);
        const allProgress = tdRes.data.data || tdRes.data || [];
        const myProgress = allProgress.filter((p: any) => p.hocSinhId === hoSo.hocSinhId);
        
        const chudeRes = await api.get(`/chude/sach/${subjectId}`);
        const chuDes = chudeRes.data.data || chudeRes.data || [];
        
        const chapters = await Promise.all(chuDes.map(async (cd: any) => {
          const bhRes = await api.get(`/bai-hoc/chu-de/${cd.chuDeId}`);
          const baiHocs = bhRes.data.data || bhRes.data || [];
          
          const lessonsList: any[] = [];
          for (const bh of baiHocs) {
            let dangBaiList: any[] = [];
            try {
              const dbRes = await api.get(`/he-thong/dang-bai/bai-hoc/${bh.baiHocId}/hoc-sinh`);
              dangBaiList = dbRes.data.data || dbRes.data || [];
            } catch (err) {}

            let lessonCompleted = true;
            if (dangBaiList.length === 0) {
              const prog = myProgress.find((p: any) => p.baiHocId === bh.baiHocId);
              lessonCompleted = prog ? prog.daHoanThanh === true : false;
            } else {
              for (const db of dangBaiList) {
                const prog = myProgress.find((p: any) => p.baiHocId === bh.baiHocId || p.contentNodeId === db.dangBaiId);
                if (!prog || prog.daHoanThanh !== true) {
                  lessonCompleted = false;
                }
              }
            }

            const hasH5p = dangBaiList.some(db => db.h5pNoiDungId != null);

            lessonsList.push({
              id: bh.baiHocId,
              title: bh.tenBaiHoc || bh.tieuDe || "Bài học",
              completed: lessonCompleted,
              xpReward: bh.xpReward || 20,
              type: hasH5p ? 'h5p' : 'quiz',
              status: 'current' // status will be determined below
            });
          }

          return {
            id: cd.chuDeId,
            title: cd.tenChuDe || cd.tieuDe || "Chủ đề",
            lessons: lessonsList
          };
        }));

        // Cập nhật trạng thái status: completed, current, locked theo bài học
        let foundCurrent = false;
        let completedCount = 0;
        let totalCount = 0;
        chapters.forEach((ch: any) => {
          ch.lessons.forEach((l: any) => {
            totalCount++;
            if (l.completed) {
              l.status = 'completed';
              completedCount++;
            } else if (!foundCurrent) {
              l.status = 'current';
              foundCurrent = true;
            } else {
              l.status = 'locked';
            }
          });
        });

        return {
          subjectName: sach.tenSach || sach.tenMon || "Môn học",
          totalLessons: totalCount,
          completedLessons: completedCount,
          chapters
        };
      } catch (err) {
        return { subjectName: "Môn học", totalLessons: 0, completedLessons: 0, chapters: [] };
      }
    
  },

  getNextLessonId: async (currentLessonId: number, subjectId: number | null): Promise<number | null> => {
    if (!subjectId) return null;
    try {
      const tree = await studentService.getSubjectTree(subjectId);
      const allLessons: any[] = [];
      (tree.chapters || []).forEach((ch: any) => {
        (ch.lessons || []).forEach((l: any) => {
          allLessons.push(l);
        });
      });
      const idx = allLessons.findIndex((l: any) => l.id === currentLessonId);
      if (idx !== -1 && idx < allLessons.length - 1) {
        return allLessons[idx + 1].id;
      }
      return null;
    } catch (err) {
      console.error("getNextLessonId failed:", err);
      return null;
    }
  },

  getContentNodeDetail: async (contentNodeId: number) => {      try {
        const baiHocId = contentNodeId;
        const res = await api.get(`/bai-hoc/${baiHocId}`);
        const bh = res.data.data || res.data;
        
        let hoSo: any = {};
        try {
          const hsRes = await api.get('/hoso-hocsinh/my-profile');
          hoSo = hsRes.data.data || hsRes.data;
        } catch (err) {}

        let allTd: any[] = [];
        try {
          const tdRes = await api.get('/tien-do-hoc-sinh');
          allTd = tdRes.data.data || tdRes.data || [];
        } catch (err) {
          console.warn('[LessonPlayer] /tien-do-hoc-sinh không khả dụng, bỏ qua tiến độ:', err);
        }
        const myProgress = allTd.filter((p: any) => p.hocSinhId === hoSo.hocSinhId);


        let dangBaiList: any[] = [];
        try {
          const dbRes = await api.get(`/he-thong/dang-bai/bai-hoc/${baiHocId}/hoc-sinh`);
          dangBaiList = dbRes.data.data || dbRes.data || [];
        } catch (err) {}

        let allCompleted = true;
        const items = dangBaiList.map((db: any) => {
          const prog = myProgress.find((p: any) => p.baiHocId === baiHocId || p.contentNodeId === db.dangBaiId);
          const completed = prog ? prog.daHoanThanh === true : false;
          if (!completed) {
            allCompleted = false;
          }

          let parsedCauHinh: any = {};
          try {
            parsedCauHinh = typeof db.duLieuGame === 'string' ? JSON.parse(db.duLieuGame) : (db.duLieuGame || {});
          } catch (err) {}

          let parsedDapAnChuan: any = null;
          try {
            parsedDapAnChuan = typeof db.dapAnChuan === 'string' ? JSON.parse(db.dapAnChuan) : (db.dapAnChuan || null);
          } catch (err) {}

          const loaiNoiDung = db.loaiNoiDung || (db.h5pNoiDungId ? 'H5P' : 'JSON_TEXT');
          const loai = parsedCauHinh.loai || (loaiNoiDung === 'H5P' ? null : 'LY_THUYET');

          return {
            id: db.dangBaiId,
            title: db.tenDangBai || bh.tenBaiHoc || "Dạng bài",
            completed,
            h5pContentId: db.h5pNoiDungId || null,
            loaiNoiDung,
            loai,
            dangBaiId: db.dangBaiId,
            cauHinh: parsedCauHinh,
            dapAnChuan: parsedDapAnChuan
          };
        });

        if (items.length === 0) {
          // Fallback bài học lý thuyết chay nếu không có game
          const prog = myProgress.find((p: any) => p.baiHocId === baiHocId);
          const completed = prog ? prog.daHoanThanh === true : false;
          items.push({
            id: baiHocId,
            title: bh.tenBaiHoc || "Nội dung lý thuyết",
            completed,
            h5pContentId: null,
            loaiNoiDung: 'JSON_TEXT',
            loai: 'LY_THUYET',
            dangBaiId: 0,
            cauHinh: {
              noiDung: `Bài học: ${bh.tenBaiHoc || ''}\nSố trang: ${bh.soTrang || 1}`
            },
            dapAnChuan: null
          });
        }

        return {
          id: baiHocId,
          title: bh.tenBaiHoc || "Nội dung bài học",
          completed: allCompleted,
          items
        };
      } catch (err) {
        throw err;
      }
    
  },

  submitContentNodeQuiz: async (contentNodeId: number, baiLam: any, dangBaiId: number | undefined, dapAnChuan: any) => {      try {
        let hoSo: any = {};
        try {
          const hsRes = await api.get('/hoso-hocsinh/my-profile');
          hoSo = hsRes.data.data || hsRes.data;
        } catch (err) {}

        if (!hoSo.hocSinhId || !dangBaiId) {
          return { diem: 0, xpEarned: 0, dapAnChuan: null };
        }

        const payload = {
          hocSinhId: hoSo.hocSinhId,
          dangBaiId: dangBaiId,
          chiTietBaiLam: JSON.stringify(baiLam)
        };

        // Kiểm tra xem học sinh đã có lịch sử làm bài này trước đó chưa
        let existingTuHocId: number | null = null;
        try {
          const checkRes = await api.get(`/lich-su-tu-hoc/dang-bai/${dangBaiId}`, {
            params: { maHocSinh: hoSo.hocSinhId }
          });
          const historyList = checkRes.data.data || checkRes.data;
          if (Array.isArray(historyList) && historyList.length > 0) {
            existingTuHocId = historyList[0].tuHocId;
          }
        } catch (err) {}

        let response: any;
        if (existingTuHocId) {
          // Làm lại bài cũ -> Gọi PUT update (ghi đè lịch sử duy nhất)
          response = await api.put(`/lich-su-tu-hoc/${existingTuHocId}`, payload);
        } else {
          // Làm lần đầu -> Gọi POST nop-bai
          response = await api.post('/lich-su-tu-hoc/nop-bai', payload);
        }
        const data = response.data.data || response.data;

        const diem = Number(data.diemSo || 0);
        let xpEarned = 0;
        // Chỉ tặng XP cho lần làm đầu tiên (tránh gian lận cày XP bằng cách làm lại liên tục)
        if (!existingTuHocId) {
          if (diem === 10) xpEarned = 20;
          else if (diem >= 7) xpEarned = 15;
          else if (diem >= 5) xpEarned = 10;
          else if (diem > 0) xpEarned = 5;
        }

        if (xpEarned > 0) {
          try {
            await api.put(`/hoso-hocsinh/${hoSo.hocSinhId}`, {
              ...hoSo,
              tongXp: (hoSo.tongXp || 0) + xpEarned
            });
          } catch (err) {}
        }

        let parsedDapAn: any = null;
        try {
          parsedDapAn = typeof data.dapAnChuan === 'string' ? JSON.parse(data.dapAnChuan) : data.dapAnChuan;
        } catch (err) {}

        return {
          diem,
          xpEarned,
          dapAnChuan: parsedDapAn
        };
      } catch (err) {
        return { diem: 0, xpEarned: 0, dapAnChuan: null };
      }
    
  },

  markContentNodeComplete: async (contentNodeId: number) => {      try {
        let hoSo: any = {};
        try {
          const hsRes = await api.get('/hoso-hocsinh/my-profile');
          hoSo = hsRes.data.data || hsRes.data;
        } catch (err) {}

        if (hoSo.hocSinhId) {
          // Chỉ cần gọi API update-progress của backend
          await api.post(`/tien-do-hoc-sinh/update-progress?hocSinhId=${hoSo.hocSinhId}&baiHocId=${contentNodeId}`);
          
          return {
            diem: 0,
            xpEarned: 10,
            dapAnChuan: null
          };
        }
        return { diem: 0, xpEarned: 0, dapAnChuan: null };
      } catch (err) {
        return { diem: 0, xpEarned: 0, dapAnChuan: null };
      }
  },

  unmarkContentNodeComplete: async (contentNodeId: number) => {
    try {
      let hoSo: any = {};
      try {
        const hsRes = await api.get('/hoso-hocsinh/my-profile');
        hoSo = hsRes.data.data || hsRes.data;
      } catch (err) {}

      if (hoSo.hocSinhId) {
        await api.post(`/tien-do-hoc-sinh/unmark-progress?hocSinhId=${hoSo.hocSinhId}&baiHocId=${contentNodeId}`);
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false };
    }
  },

  getQuizHistory: async (dangBaiId: number) => {
    return [];
  },

  getH5PAssignmentDetail: async (assignmentId: number) => {
    let hoSo: any = {};
    try {
      const hsRes = await api.get('/hoso-hocsinh/my-profile');
      hoSo = hsRes.data.data || hsRes.data;
    } catch (err) {}

    // BaiTapResponse (GET /bai-tap/{id}) không có field h5pContentId — nội dung H5P thật
    // sự nằm ở chi_tiet_bai_tap (CreateAssignment.tsx lưu qua danhSachChiTiet, không qua
    // FK đơn bai_tap.dang_bai_id). Lấy đúng nguồn dữ liệu này, cùng endpoint mà luồng Quiz
    // đang dùng — endpoint này cũng tự kiểm tra giới hạn số lần nộp ở server.
    const [btRes, dbRes] = await Promise.all([
      api.get(`/bai-tap/${assignmentId}`),
      api.get(`/he-thong/dang-bai/bai-tap/${assignmentId}/hoc-sinh`, { params: hoSo.hocSinhId ? { hocSinhId: hoSo.hocSinhId } : undefined }),
    ]);
    const detail = btRes.data?.data || btRes.data;
    const dangBais = dbRes.data?.data || dbRes.data || [];

    detail.h5pContentId = dangBais[0]?.h5pNoiDungId || null;
    // Nếu tới được đây (không bị chặn bởi giới hạn số lần nộp ở server) thì coi như còn được nộp.
    if (detail.canSubmit === undefined) detail.canSubmit = true;
    if (detail.attemptsUsed === undefined) detail.attemptsUsed = 0;
    if (!detail.h5pContentId) console.warn('[H5P] WARNING: h5pContentId is null/empty! BaiTap may not be linked to a DangBai with H5P content.');
    return detail;
  },

  submitH5PAssignment: async (
    assignmentId: number,
    payload: { rawScore: number; maxScore: number; completed: boolean; interactionDetails?: string }
  ) => {
    // BaiNopRequest (backend) không có field rawScore/maxScore/completed — chỉ có
    // baiTapId, hocSinhId, chiTietBaiLam (JSON). H5P không được backend tự chấm điểm
    // (loaiBaiTap=H5P luôn lưu diemTuDong=null, trạng thái CHUA_CHAM chờ GV chấm tay),
    // nên chỉ cần lưu lại thông tin tương tác vào chiTietBaiLam để GV tham khảo.
    let hoSo: any = {};
    try {
      const hsRes = await api.get('/hoso-hocsinh/my-profile');
      hoSo = hsRes.data.data || hsRes.data;
    } catch (err) {}

    const body = {
      baiTapId: assignmentId,
      hocSinhId: hoSo.hocSinhId,
      chiTietBaiLam: JSON.stringify(payload),
    };
    const response = await api.post(`/bai-nop`, body);
    return response.data?.data || response.data;
  },

  getQuizAssignmentDetail: async (assignmentId: number) => {
    let hoSo: any = {};
    try {
      const hsRes = await api.get('/hoso-hocsinh/my-profile');
      hoSo = hsRes.data.data || hsRes.data;
    } catch (err) {}

    const [btRes, dbRes] = await Promise.all([
      api.get(`/bai-tap/${assignmentId}`),
      api.get(`/he-thong/dang-bai/bai-tap/${assignmentId}/hoc-sinh`, { params: hoSo.hocSinhId ? { hocSinhId: hoSo.hocSinhId } : undefined }).catch((err) => {
        if (err.response?.data?.message) throw err;
        return { data: [] };
      })
    ]);
    const baiTap = btRes.data.data || btRes.data;
    const dangBais = dbRes.data.data || dbRes.data || [];

    const danhSachCauHoi = dangBais.map((db: any) => {
      let gameData = {};
      try {
        gameData = typeof db.duLieuGame === 'string' ? JSON.parse(db.duLieuGame) : (db.duLieuGame || {});
      } catch (e) {
        gameData = {};
      }
      return {
        ...gameData,
        id: db.dangBaiId?.toString(),
        kieu: (gameData as any).loai || 'TRAC_NGHIEM',
        giaoDien: (gameData as any).giaoDien || 'MAC_DINH'
      };
    });

    const result = {
      ...baiTap,
      loai: dangBais.length > 1 ? 'NHIEU_CAU' : (danhSachCauHoi[0]?.kieu || 'NHIEU_CAU'),
      cheDoGiaoDien: danhSachCauHoi[0]?.giaoDien || 'MAC_DINH',
      cauHinh: {
        loai: 'NHIEU_CAU',
        tieuDe: baiTap?.tieuDe,
        danhSachCauHoi,
        ...(danhSachCauHoi[0] || {})
      },
      danhSachChiTiet: dangBais
    };
    // BaiTapResponse (GET /bai-tap/{id}) không có canSubmit/attemptsUsed — gán mặc định
    // giống getH5PAssignmentDetail, tránh việc undefined bị hiểu nhầm là "đã hết lượt".
    if ((result as any).canSubmit === undefined) (result as any).canSubmit = true;
    if ((result as any).attemptsUsed === undefined) (result as any).attemptsUsed = 0;
    return result;
  },

  submitQuizAssignment: async (assignmentId: number, baiLam: Record<string, unknown>) => {
    let hoSo: any = {};
    try {
      const hsRes = await api.get('/hoso-hocsinh/my-profile');
      hoSo = hsRes.data.data || hsRes.data;
    } catch (err) {}

    const payload = {
      baiTapId: assignmentId,
      hocSinhId: hoSo.hocSinhId,
      chiTietBaiLam: JSON.stringify(baiLam)
    };
    const response = await api.post(`/bai-nop`, payload);
    return response.data;
  },

  getEssayAssignmentDetail: async (assignmentId: number) => {
    const response = await api.get(`/bai-tap/${assignmentId}`);
    return response.data?.data || response.data;
  },

  submitEssay: async (assignmentId: number, payload: { textContent: string; isDraft?: boolean; attachmentUrl?: string | null }) => {
    let hoSo: any = {};
    try {
      const hsRes = await api.get('/hoso-hocsinh/my-profile');
      hoSo = hsRes.data.data || hsRes.data;
    } catch (err) {}

    const requestData = {
      baiTapId: assignmentId,
      hocSinhId: hoSo.hocSinhId,
      noiDungText: payload.textContent,
      fileDinhKem: payload.attachmentUrl || null
    };
    const response = await api.post(`/bai-nop`, requestData);
    return response.data;
  },

  uploadFile: async (file: File): Promise<{ url: string; fileName: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
