import { useState } from 'react';
import { X, Volume2, ArrowRight, Check, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

// Các màu sắc tươi sáng dùng để đánh dấu các cặp đã nối
const PAIR_COLORS = [
  'bg-pink-100 border-pink-400 text-pink-700',
  'bg-blue-100 border-blue-400 text-blue-700',
  'bg-green-100 border-green-400 text-green-700',
  'bg-purple-100 border-purple-400 text-purple-700',
  'bg-orange-100 border-orange-400 text-orange-700',
];

export default function StudentMatchGame() {
  const navigate = useNavigate();
  
  // Giả lập Dữ liệu JSON từ API (Loại: NOI_CAP)
  const gameData = {
    loai: 'NOI_CAP',
    cauHoi: 'Em hãy tìm thức ăn yêu thích của các bạn động vật nhé!',
    cotTrai: [
      { id: 'L1', noiDung: 'Bạn Mèo', hinhAnh: '🐱' },
      { id: 'L2', noiDung: 'Bạn Khỉ', hinhAnh: '🐒' },
      { id: 'L3', noiDung: 'Bạn Thỏ', hinhAnh: '🐰' },
    ],
    cotPhai: [
      { id: 'R1', noiDung: 'Củ Cà rốt', hinhAnh: '🥕' },
      { id: 'R2', noiDung: 'Con Cá', hinhAnh: '🐟' },
      { id: 'R3', noiDung: 'Quả Chuối', hinhAnh: '🍌' },
    ]
  };

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  
  // Lưu trữ các cặp đã nối: { leftId, rightId, colorClass }
  const [pairs, setPairs] = useState<Array<{left: string, right: string, color: string}>>([]);
  const [isChecking, setIsChecking] = useState(false);

  // Xử lý khi bé bấm vào thẻ bên trái
  const handleSelectLeft = (id: string) => {
    if (isChecking) return;
    
    // Nếu thẻ này đã được nối trước đó, gỡ bỏ cặp nối cũ
    const existingPair = pairs.find(p => p.left === id);
    if (existingPair) {
      setPairs(pairs.filter(p => p.left !== id));
      toast('Đã tháo ghép nối', { icon: '🔓', duration: 1000 });
      return;
    }

    setSelectedLeft(id);
    
    // Nếu đã chọn 1 thẻ bên phải trước đó rồi -> Tạo thành cặp
    if (selectedRight) {
      createPair(id, selectedRight);
    } else {
      toast('Bây giờ em hãy chọn 1 thẻ bên phải nhé!', { icon: '✨', duration: 1500 });
    }
  };

  // Xử lý khi bé bấm vào thẻ bên phải
  const handleSelectRight = (id: string) => {
    if (isChecking) return;

    // Nếu thẻ này đã được nối trước đó, gỡ bỏ cặp nối cũ
    const existingPair = pairs.find(p => p.right === id);
    if (existingPair) {
      setPairs(pairs.filter(p => p.right !== id));
      toast('Đã tháo ghép nối', { icon: '🔓', duration: 1000 });
      return;
    }

    setSelectedRight(id);
    
    // Nếu đã chọn 1 thẻ bên trái trước đó rồi -> Tạo thành cặp
    if (selectedLeft) {
      createPair(selectedLeft, id);
    }
  };

  // Hàm tạo cặp
  const createPair = (leftId: string, rightId: string) => {
    // Tìm màu chưa được sử dụng
    const usedColors = pairs.map(p => p.color);
    const availableColor = PAIR_COLORS.find(c => !usedColors.includes(c)) || PAIR_COLORS[0];

    setPairs([...pairs, { left: leftId, right: rightId, color: availableColor }]);
    setSelectedLeft(null);
    setSelectedRight(null);
    toast.success('Đã ghép 1 cặp!', { icon: '🔗' });
  };

  const handleSubmit = () => {
    setIsChecking(true);
    
    // Tạo JSON chứa các cặp ghép gửi lên Backend (ẩn cặp màu UI đi)
    const payload = {
      dapAnDaChon: pairs.map(p => ({ traiId: p.left, phaiId: p.right }))
    };
    
    console.log('Đang nộp payload Nối cặp:', payload);
    toast.success('Nộp bài thành công! +20 XP', { 
      icon: '🎉',
      style: { background: '#22c55e', color: '#fff', fontWeight: 'bold' }
    });

    setTimeout(() => {
      navigate('/student'); 
    }, 2000);
  };

  // Kiểm tra xem bài đã làm xong chưa (đã nối hết chưa)
  const isAllPaired = pairs.length === gameData.cotTrai.length;

  // Hàm helper để render UI của từng thẻ
  const getCardStyle = (id: string, side: 'left' | 'right') => {
    const pair = pairs.find(p => side === 'left' ? p.left === id : p.right === id);
    if (pair) return pair.color; // Trả về màu nếu đã nối
    
    const isSelected = side === 'left' ? selectedLeft === id : selectedRight === id;
    if (isSelected) return "border-blue-500 bg-blue-50 shadow-[0_4px_20px_rgba(59,130,246,0.3)] scale-105 ring-4 ring-blue-100";
    
    return "border-slate-200 bg-white hover:border-slate-300 shadow-sm";
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] font-sans text-slate-900 flex flex-col fixed inset-0 z-50">
      
      {/* HEADER */}
      <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-green-100 shadow-sm sticky top-0 z-20">
        <button 
          onClick={() => navigate('/student')}
          className="w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-7 h-7" />
        </button>

        <div className="flex items-center gap-3 bg-green-50 px-6 py-2 rounded-full border border-green-200">
          <Volume2 className="w-5 h-5 text-green-600" />
          <h1 className="font-bold text-green-800">{gameData.cauHoi}</h1>
        </div>
        
        <button 
          onClick={() => { setPairs([]); setSelectedLeft(null); setSelectedRight(null); }}
          className="w-12 h-12 rounded-full flex items-center justify-center text-orange-500 bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer"
          title="Chơi lại từ đầu"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </header>

      {/* GAME WORKSPACE - KHU VỰC NỐI CẶP */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10 flex justify-center items-center relative">
        
        {/* Nền trang trí đám mây */}
        <div className="absolute top-10 left-20 w-32 h-16 bg-white/60 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute bottom-20 right-20 w-40 h-20 bg-white/60 rounded-full blur-xl pointer-events-none"></div>

        <div className="max-w-4xl w-full grid grid-cols-2 gap-12 sm:gap-24 relative z-10">
          
          {/* CỘT TRÁI */}
          <div className="space-y-6">
            {gameData.cotTrai.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectLeft(item.id)}
                className={cn(
                  "w-full p-6 sm:p-8 rounded-[2rem] border-4 flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer",
                  getCardStyle(item.id, 'left')
                )}
              >
                <div className="text-6xl sm:text-7xl drop-shadow-md bg-white/50 w-24 h-24 rounded-full flex items-center justify-center">
                  {item.hinhAnh}
                </div>
                <span className="text-xl sm:text-2xl font-black">{item.noiDung}</span>
                
                {/* Dấu check nếu đã nối */}
                {pairs.find(p => p.left === item.id) && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Check className="w-6 h-6" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* CỘT PHẢI */}
          <div className="space-y-6">
            {gameData.cotPhai.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectRight(item.id)}
                className={cn(
                  "w-full p-6 sm:p-8 rounded-[2rem] border-4 flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer",
                  getCardStyle(item.id, 'right')
                )}
              >
                <div className="text-6xl sm:text-7xl drop-shadow-md bg-white/50 w-24 h-24 rounded-full flex items-center justify-center">
                  {item.hinhAnh}
                </div>
                <span className="text-xl sm:text-2xl font-black">{item.noiDung}</span>

                {/* Dấu check nếu đã nối */}
                {pairs.find(p => p.right === item.id) && (
                  <div className="absolute top-4 left-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Check className="w-6 h-6" />
                  </div>
                )}
              </button>
            ))}
          </div>

        </div>
        
        <div className="h-32"></div> {/* Spacer */}
      </main>

      {/* FOOTER: Nút Hoàn thành (Chỉ nổi lên khi nối xong) */}
      <footer className={cn(
        "fixed bottom-0 left-0 right-0 p-6 flex justify-center transition-all duration-500 transform",
        isAllPaired ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
      )}>
        <button
          onClick={handleSubmit}
          disabled={isChecking}
          className="flex items-center gap-3 px-12 py-6 bg-[#00D26A] text-white rounded-[2rem] font-black text-2xl hover:bg-[#00e676] shadow-xl shadow-green-500/40 hover:scale-105 transition-all duration-300 border-4 border-white cursor-pointer"
        >
          {isChecking ? 'Đang nộp...' : 'NỘP BÀI'} 
          {!isChecking && <ArrowRight className="w-8 h-8" />}
        </button>
      </footer>

    </div>
  );
}
