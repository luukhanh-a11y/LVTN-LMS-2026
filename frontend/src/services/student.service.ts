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
          const rawTasks = (btRes.data.data || btRes.data || []).filter((t: any) => t.trangThai === 'DANG_MO' || !t.trangThai).slice(0, 5);
          upcomingTasks = rawTasks.map((t: any) => ({
            id: t.baiTapId,
            title: t.tenBaiTap || t.tieuDe || "Bài tập tương tác",
            dueDate: t.hanNop || new Date(Date.now() + 86400000 * 3).toISOString(),
            xpReward: t.xpReward || 50,
            subjectName: t.monHoc?.tenMon || "Bài tập",
            completed: false
          }));
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
          recentNotifications = allNotis.map((n: any) => ({
            id: n.thongBaoId,
            title: n.tieuDe,
            content: n.noiDung,
            createdAt: n.ngayDang || n.ngayTao || new Date().toISOString(),
            date: new Date(n.ngayDang || n.ngayTao || new Date()).toLocaleDateString('vi-VN'),
            read: !!n.daDoc || !!n.trangThaiDoc,
            pinned: !!n.laGhim,
            type: n.loaiThongBao
          }));
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
                const sachRes = await api.get(`/sach`);
                const allBooks = sachRes.data.data || sachRes.data || [];
                myBooks = allBooks.filter((s: any) => 
                  s.khoiLop === lop.khoiLop && 
                  (!s.loaiSach || s.loaiSach === 'SACH_GIAO_KHOA') &&
                  (!s.hocKy || s.hocKy === 1)
                );
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
      
      return {
        studentName: hoSo.hoTen || "Học sinh",
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

  getAssignments: async () => {      let hoSo: any = {};
      try {
        const hsRes = await api.get('/hoso-hocsinh/my-profile');
        hoSo = hsRes.data.data || hsRes.data;
      } catch (err) {
      }
      if (!hoSo.lopHocId) return [];
      try {
        const btRes = await api.get(`/bai-tap/lop-hoc/${hoSo.lopHocId}`);
        const rawTasks = btRes.data.data || btRes.data || [];
        return rawTasks.map((t: any) => ({
          id: t.baiTapId,
          title: t.tenBaiTap || t.tieuDe || "Bài tập tương tác",
          dueDate: t.hanNop,
          xpReward: t.xpReward || 50,
          completed: false,
          subjectName: t.monHoc?.tenMon || "Bài tập",
          type: t.dangBai?.loaiNoiDung || 'TRAC_NGHIEM'
        }));
      } catch (err) {
        return [];
      }
    
  },

  getNotifications: async () => {      try {
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
          createdAt: n.ngayDang || n.ngayTao || new Date().toISOString(),
          date: new Date(n.ngayDang || n.ngayTao || new Date()).toLocaleDateString('vi-VN'),
          read: !!n.daDoc || !!n.trangThaiDoc,
          pinned: true,
          type: n.loaiThongBao
        }));

        const rawKhongGhim = (khongGhimRes.data.data || khongGhimRes.data || []).map((n: any) => ({
          id: n.thongBaoId,
          title: n.tieuDe,
          content: n.noiDung,
          createdAt: n.ngayDang || n.ngayTao || new Date().toISOString(),
          date: new Date(n.ngayDang || n.ngayTao || new Date()).toLocaleDateString('vi-VN'),
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
        createdAt: n.ngayDang || n.ngayTao || new Date().toISOString(),
        date: new Date(n.ngayDang || n.ngayTao || new Date()).toLocaleDateString('vi-VN'),
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
        createdAt: n.ngayDang || n.ngayTao || new Date().toISOString(),
        date: new Date(n.ngayDang || n.ngayTao || new Date()).toLocaleDateString('vi-VN'),
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

  getRewards: async () => {      let hoSo: any = {};
      try {
        const hsRes = await api.get('/hoso-hocsinh/my-profile');
        hoSo = hsRes.data.data || hsRes.data;
      } catch (err) {
      }
      if (!hoSo.hocSinhId) return [];
      try {
        const ktRes = await api.get(`/khen-thuong-hoc-sinh/hoc-sinh/${hoSo.hocSinhId}`);
        const rawRewards = ktRes.data.data || ktRes.data || [];
        return rawRewards.map((r: any) => ({
          id: r.khenThuongId,
          title: r.tenKhenThuong || r.tieuDe,
          description: r.moTa,
          unlockedAt: r.ngayKhenThuong || new Date().toISOString(),
          xpBonus: r.xpBonus || 50,
          iconName: r.iconName || "badge-star"
        }));
      } catch (err) {
        return [];
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

        const tdRes = await api.get('/tien-do-hoc-sinh');
        const allTd = tdRes.data.data || tdRes.data || [];
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
    const response = await api.get(`/bai-tap/${assignmentId}`);
    return response.data;
  },

  submitH5PAssignment: async (
    assignmentId: number,
    payload: { rawScore: number; maxScore: number; completed: boolean; interactionDetails?: string }
  ) => {
    const response = await api.post(`/bai-nop`, payload);
    return response.data;
  },

  getQuizAssignmentDetail: async (assignmentId: number, studentId?: number) => {
    const [btRes, dbRes] = await Promise.all([
      api.get(`/bai-tap/${assignmentId}`),
      api.get(`/he-thong/dang-bai/bai-tap/${assignmentId}/hoc-sinh`, { params: studentId ? { hocSinhId: studentId } : undefined }).catch((err) => {
        if (err.response?.data?.message) throw err;
        return { data: [] };
      })
    ]);
    const baiTap = btRes.data;
    const dangBais = dbRes.data || [];

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

    return {
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
  },

  submitQuizAssignment: async (assignmentId: number, studentId: number, baiLam: Record<string, unknown>) => {
    const payload = {
      baiTapId: assignmentId,
      hocSinhId: studentId,
      chiTietBaiLam: JSON.stringify(baiLam)
    };
    const response = await api.post(`/bai-nop`, payload);
    return response.data;
  },

  getEssayAssignmentDetail: async (assignmentId: number) => {
    const response = await api.get(`/bai-tap/${assignmentId}`);
    return response.data;
  },

  submitEssay: async (assignmentId: number, studentId: number, payload: { textContent: string; isDraft?: boolean; attachmentUrl?: string | null }) => {
    const requestData = {
      baiTapId: assignmentId,
      hocSinhId: studentId,
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
