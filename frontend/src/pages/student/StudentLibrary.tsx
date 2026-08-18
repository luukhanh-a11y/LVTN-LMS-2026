import { ChevronLeft, Play, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

import { useState, useEffect } from 'react';
import { studentService } from '../../services/student.service';

export default function StudentLibrary() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const dashboard = await studentService.getDashboard();
        const mappedBooks = (dashboard.subjects || []).map((s: any, idx: number) => {
          // Dùng đúng ảnh bìa thật đã upload cho sách (anhBiaUrl) — trước đây gán cứng
          // theo tên môn (chỉ Toán/Tiếng Việt đúng, mọi môn khác đều hiện nhầm 1 ảnh mặc
          // định). Sách chưa có ảnh thật (anhBiaUrl null) thì để trống, dựa vào onError
          // bên dưới tự hiện khung chữ tên sách thay vì hiện ảnh sai.
          let imageUrl = s.anhBiaUrl || '';
          if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('blob')) {
            imageUrl = `http://localhost:8080${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
          }
          return {
            id: s.id || idx,
            title: s.name,
            image: imageUrl || `https://placehold.co/400x533/e2e8f0/475569?text=${encodeURIComponent(s.name)}`,
            progress: s.progress || 0,
          };
        });
        setBooks(mappedBooks.length > 0 ? mappedBooks : [
          // Mock dự phòng nếu DB không có sách
          { id: 1, title: 'Toán Học 1', image: 'https://cdnelearning.nxbgd.vn/uploads/202005290909086057_SHSToan1Tap1biacopy_size_285_404.png', progress: 85 },
          { id: 2, title: 'Tiếng Việt 1', image: 'https://cdnelearning.nxbgd.vn/uploads/202005290909541206_SHSTiengViet1tap2biacopy_size_285_404.png', progress: 40 }
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900 flex flex-col items-center">
      
      {/* HEADER Tối giản & Cao cấp */}
      <header className="w-full max-w-5xl px-6 py-8 flex items-center justify-between sticky top-0 z-20 bg-[#F8FAFC]/80 backdrop-blur-lg">
        <button 
          onClick={() => navigate('/student')}
          className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all shadow-sm cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="bg-white px-6 py-2.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h1 className="font-bold text-slate-800 tracking-wide uppercase text-sm">
            Tủ Sách
          </h1>
        </div>
        
        <div className="w-12"></div> {/* Spacer để cân bằng Header */}
      </header>

      {/* KHÔNG GIAN TRƯNG BÀY SÁCH */}
      <main className="w-full max-w-5xl px-6 py-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          
          {books.map((book) => (
            <div 
              key={book.id}
              onClick={() => navigate(`/student/roadmap?bookId=${book.id}`)}
              className="w-full max-w-[280px] bg-white rounded-[2rem] p-4 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col"
            >
              
              {/* VÙNG BÌA SÁCH (Tỷ lệ chuẩn 3:4 của SGK) */}
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-5 bg-slate-50 border border-slate-100 flex items-center justify-center">
                
                {/* 
                  Nếu ảnh bị lỗi (chưa có file), nó sẽ hiện màu xám và tên sách.
                  Khi bạn có file thật, ảnh sẽ phủ kín rất đẹp!
                */}
                <img 
                  src={book.image} 
                  alt={book.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback nếu không tìm thấy ảnh
                    e.currentTarget.src = 'https://placehold.co/400x533/e2e8f0/475569?text=' + encodeURIComponent(book.title);
                  }}
                />
                
                {/* Lớp Kính mờ (Frosted Glass) & Nút Play nổi lên khi Hover */}
                <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl text-blue-600 scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>
              </div>

              {/* VÙNG THÔNG TIN (Tên sách & Thanh Tiến độ) */}
              <div className="flex flex-col w-full px-2 pb-2">
                <h3 className="text-xl font-black text-slate-800 tracking-tight text-center mb-4">
                  {book.title}
                </h3>
                
                {/* Thanh Tiến độ */}
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tiến độ</span>
                    <span className="text-xs font-black text-blue-600">{book.progress}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        book.progress === 100 ? "bg-[#00D26A]" : "bg-blue-500"
                      )}
                      style={{ width: `${book.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

            </div>
          ))}

        </div>
      </main>
    </div>
  );
}
