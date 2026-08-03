import React, { useState, useEffect, useRef } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface GameProps {
  cauHinh: any;
  result: any;
  activeDapAnChuan: any;
  onSubmit: (data: { dapAnDungId: string }) => void;
}

const ANIMALS = ['chick', 'cow', 'pig', 'dog', 'hippo', 'horse', 'monkey', 'panda', 'parrot', 'penguin', 'rabbit', 'snake', 'bear', 'buffalo', 'chicken', 'crocodile', 'duck', 'elephant', 'frog', 'giraffe', 'goat', 'gorilla', 'moose', 'narwhal', 'owl', 'rhino', 'sloth', 'walrus', 'whale', 'zebra'];

interface BouncingAnimal {
  id: string;
  noiDung: string;
  image: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isWrong: boolean;
  isCorrect: boolean;
  isFake?: boolean;
}

export const CatchingGame: React.FC<GameProps> = ({ cauHinh, result, activeDapAnChuan, onSubmit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [animals, setAnimals] = useState<BouncingAnimal[]>([]);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Initialize animals
  useEffect(() => {
    if (!cauHinh?.danhSachLuaChon) return;
    
    const luaChon = cauHinh.danhSachLuaChon;
    
    // Create actual options
    const initialAnimals: BouncingAnimal[] = luaChon.map((lc: any, index: number) => {
      const animalImage = ANIMALS[index % ANIMALS.length];
      const speed = 100 + Math.random() * 100;
      const angle = Math.random() * Math.PI * 2;
      return {
        id: lc.id,
        noiDung: typeof lc === 'string' ? lc : lc.noiDung || lc.text || lc.content || JSON.stringify(lc),
        image: animalImage,
        x: 200 + Math.random() * 400,
        y: 100 + Math.random() * 200,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        width: 100,
        height: 100,
        isWrong: false,
        isCorrect: false,
        isFake: false
      };
    });

    // Add 6 fake distractor animals
    const usedImages = initialAnimals.map(a => a.image);
    const availableFakeImages = ANIMALS.filter(a => !usedImages.includes(a));
    
    for (let i = 0; i < 6; i++) {
      const animalImage = availableFakeImages[i % availableFakeImages.length];
      const speed = 150 + Math.random() * 100; // Fakes are slightly faster
      const angle = Math.random() * Math.PI * 2;
      initialAnimals.push({
        id: `fake_${i}`,
        noiDung: '', // No text for fakes, or maybe some random distractors? Empty is fine.
        image: animalImage,
        x: 100 + Math.random() * 600,
        y: 100 + Math.random() * 300,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        width: 80, // Slightly smaller
        height: 80,
        isWrong: false,
        isCorrect: false,
        isFake: true
      });
    }
    
    setAnimals(initialAnimals);
  }, [cauHinh]);

  // Timer logic
  useEffect(() => {
    if (result || gameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          // If time runs out, submit wrong answer
          onSubmit({ dapAnDungId: "" });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [result, gameOver, onSubmit]);

  // Animation Loop
  const updatePhysics = (time: number) => {
    if (lastTimeRef.current !== undefined && containerRef.current) {
      const deltaTime = (time - lastTimeRef.current) / 1000; // in seconds
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      setAnimals((prevAnimals) => 
        prevAnimals.map((animal) => {
          if (animal.isCorrect) return animal; // Stop moving if correct

          let newX = animal.x + animal.vx * deltaTime;
          let newY = animal.y + animal.vy * deltaTime;
          let newVx = animal.vx;
          let newVy = animal.vy;

          // Wall collisions (bounce)
          // Top bar takes up about 80px, so min Y is around 80
          const minY = 80;
          const maxY = containerHeight - animal.height;
          const minX = 0;
          const maxX = containerWidth - animal.width;

          if (newX <= minX) {
            newX = minX;
            newVx = Math.abs(newVx);
          } else if (newX >= maxX) {
            newX = maxX;
            newVx = -Math.abs(newVx);
          }

          if (newY <= minY) {
            newY = minY;
            newVy = Math.abs(newVy);
          } else if (newY >= maxY) {
            newY = maxY;
            newVy = -Math.abs(newVy);
          }

          return { ...animal, x: newX, y: newY, vx: newVx, vy: newVy };
        })
      );
    }
    
    lastTimeRef.current = time;
    if (!result && !gameOver) {
      requestRef.current = requestAnimationFrame(updatePhysics);
    }
  };

  useEffect(() => {
    if (!result && !gameOver) {
      requestRef.current = requestAnimationFrame(updatePhysics);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [result, gameOver]);

  // Handle Click
  const handleAnimalClick = (animal: BouncingAnimal) => {
    if (result || gameOver) return;
    
    // Evaluate correctness locally (fakes are always wrong)
    const isCorrect = !animal.isFake && (activeDapAnChuan?.dapAnDungId || activeDapAnChuan) === animal.id;
    
    if (isCorrect) {
      // Correct!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setAnimals(prev => prev.map(a => a.id === animal.id ? { ...a, isCorrect: true, vx: 0, vy: 0 } : a));
      onSubmit({ dapAnDungId: animal.id });
    } else {
      // Wrong!
      setTimeLeft(prev => Math.max(0, prev - 3));
      
      setAnimals(prev => prev.map(a => 
        a.id === animal.id ? { ...a, isWrong: true } : a
      ));
      
      // Remove wrong animation after 500ms
      setTimeout(() => {
        setAnimals(prev => prev.map(a => 
          a.id === animal.id ? { ...a, isWrong: false } : a
        ));
      }, 500);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video min-h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#8B5A2B] select-none bg-gradient-to-b from-sky-300 via-sky-200 to-green-400"
    >
      {/* Decorations */}
      <img src="/custom-assets/data-object-backgroud-for-all-game/Retina/foliagePack_006.png" className="absolute bottom-0 left-0 w-32 h-32 object-contain opacity-90 z-0 pointer-events-none" />
      <img src="/custom-assets/data-object-backgroud-for-all-game/Retina/foliagePack_011.png" className="absolute bottom-0 right-0 w-40 h-40 object-contain opacity-90 z-0 pointer-events-none" />
      
      {/* CSS Clouds */}
      <div className="absolute top-10 left-0 w-[200%] h-32 flex pointer-events-none opacity-80 z-0 animate-[slide_30s_linear_infinite]">
        <div className="h-16 w-32 bg-white rounded-full blur-md mr-64 shadow-[20px_10px_0_10px_white,-20px_5px_0_5px_white]"></div>
        <div className="h-24 w-48 bg-white rounded-full blur-md mr-64 mt-8 shadow-[30px_15px_0_15px_white,-30px_10px_0_10px_white]"></div>
        <div className="h-16 w-32 bg-white rounded-full blur-md shadow-[20px_10px_0_10px_white,-20px_5px_0_5px_white]"></div>
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-white/40 backdrop-blur-md border-b-2 border-white/50 z-50 flex items-center justify-center px-6">
        <div className="flex-1"></div>
        <div className="text-2xl md:text-3xl font-black text-[#5C3A21] drop-shadow-md text-center max-w-2xl px-4">
          {cauHinh?.cauHoi}
        </div>
        <div className="flex-1 flex justify-end">
          <div className={`flex items-center space-x-2 px-6 py-2 rounded-2xl border-4 shadow-lg transition-colors ${
            timeLeft <= 5 ? 'bg-rose-500 border-rose-700 text-white animate-pulse' : 'bg-white border-[#8B5A2B] text-[#8B5A2B]'
          }`}>
            <Clock className={`w-8 h-8 ${timeLeft <= 5 ? 'text-white' : 'text-[#8B5A2B]'}`} />
            <span className="text-2xl font-black">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Animals */}
      {animals.map((animal) => (
        <div
          key={animal.id}
          onClick={() => handleAnimalClick(animal)}
          className={`absolute flex flex-col items-center justify-center cursor-pointer transition-transform ${
            animal.isCorrect ? 'scale-125 z-40 animate-bounce' : 'hover:scale-110 z-20'
          } ${animal.isWrong ? 'animate-shake opacity-70 hue-rotate-180' : ''}`}
          style={{
            transform: `translate(${animal.x}px, ${animal.y}px)`,
            width: animal.width,
            height: animal.height
          }}
        >
          {/* Drop shadow */}
          <div className="absolute bottom-0 w-16 h-4 bg-black/20 rounded-full blur-sm"></div>
          
          <img 
            src={`/custom-assets/data-character-backgroud-for-all-game/Round/${animal.image}.png`} 
            alt={animal.noiDung}
            className="w-full h-full object-contain drop-shadow-xl"
            draggable={false}
          />
          
          {/* Answer Label (only if it has text) */}
          {animal.noiDung && (
            <div className="absolute -bottom-8 px-4 py-1.5 bg-white border-2 border-slate-300 rounded-xl shadow-lg whitespace-nowrap z-50">
              <span className="font-bold text-slate-700 text-lg">{animal.noiDung}</span>
            </div>
          )}
        </div>
      ))}

      {/* Game Over Modal */}
      {gameOver && !result && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm border-4 border-rose-500">
            <AlertCircle className="w-20 h-20 text-rose-500 mb-4" />
            <h2 className="text-3xl font-black text-slate-800 mb-2">Hết Giờ!</h2>
            <p className="text-slate-600 mb-6 font-medium">Bạn chưa bắt được đáp án đúng.</p>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes shake {
          0%, 100% { transform: translate(${animals[0]?.x || 0}px, ${animals[0]?.y || 0}px) rotate(0deg); }
          25% { transform: translate(${animals[0]?.x || 0}px, ${animals[0]?.y || 0}px) rotate(-10deg); }
          50% { transform: translate(${animals[0]?.x || 0}px, ${animals[0]?.y || 0}px) rotate(10deg); }
          75% { transform: translate(${animals[0]?.x || 0}px, ${animals[0]?.y || 0}px) rotate(-10deg); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}} />
    </div>
  );
}
