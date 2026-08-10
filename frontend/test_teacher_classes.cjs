const axios = require('axios');
async function test() {
  try {
    const api = axios.create({ baseURL: 'http://localhost:8080/api' });
    const loginRes = await api.post('/auth/login', { tenDangNhap: 'gv_an', password: '123456' });
    const token = loginRes.data.data.token;
    api.defaults.headers.Authorization = 'Bearer ' + token;
    
    // getClasses logic
    const profileRes = await api.get('/hoso-giaovien/my-profile');
    const profile = profileRes.data.data;

    const phanCongRes = await api.get('/phan-cong-giang-day/giao-vien/' + profile.giaoVienId);
    const phanCongs = phanCongRes.data.data;
    
    const currentHocKyId = null; 
    const filtered = currentHocKyId ? phanCongs.filter(p => p.hocKyId === currentHocKyId) : phanCongs;

    const lopHocRes = await api.get('/lophoc', { params: { size: 1000 } });
    const tatCaLopHoc = lopHocRes.data.data.content.map(c => ({
      lopHocId: c.lopHocId,
      tenLop: c.tenLop,
      giaoVienChuNhiem: c.giaoVienChuNhiemId ? { giaoVienId: c.giaoVienChuNhiemId } : null
    }));

    const byLop = new Map();
    filtered.forEach(p => {
      if (!byLop.has(p.lopHocId)) {
        byLop.set(p.lopHocId, { lopHocId: p.lopHocId, tenLop: p.tenLop, monHocList: [] });
      }
      byLop.get(p.lopHocId).monHocList.push({ monHocId: p.monHocId, tenMon: p.tenMon, hocKyId: p.hocKyId });
    });

    const selectedNamHocId = null;
    tatCaLopHoc.forEach(lop => {
      if (selectedNamHocId && lop.namHoc?.namHocId !== selectedNamHocId) return;
      if (lop.giaoVienChuNhiem?.giaoVienId === profile.giaoVienId) {
        if (!byLop.has(lop.lopHocId)) {
          byLop.set(lop.lopHocId, { lopHocId: lop.lopHocId, tenLop: lop.tenLop, monHocList: [] });
        }
      }
    });
    
    console.log("ByLop size:", byLop.size);
    
    const result = await Promise.all(
      Array.from(byLop.values()).map(async (item) => {
        try {
          const detailRes = await api.get(`/lophoc/${item.lopHocId}`);
          const detail = detailRes.data.data;
          return {
            id: item.lopHocId,
            name: item.tenLop,
            grade: detail.khoiLop
          };
        } catch(e) {
          return { id: item.lopHocId, error: e.message };
        }
      })
    );
    console.log("Result:", result);

  } catch (e) {
    console.error('Error:', e.message);
  }
}
test();
