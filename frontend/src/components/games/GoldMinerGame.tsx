import React, { useState, useEffect, useRef } from 'react';
import { Clock, AlertCircle, Magnet } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface GameProps {
  cauHinh: any;
  result: any;
  activeDapAnChuan: any;
  onSubmit: (data: { dapAnDungId: string }) => void;
}

const ANIMALS = ['monkey', 'panda', 'parrot', 'penguin', 'pig', 'rabbit', 'snake', 'chick', 'cow', 'dog', 'hippo', 'horse'];

interface GoldBlock {
  id: string;
  noiDung: string;
  image: string;
  x: number;
  y: number;
  isWrong: boolean;
}

type ClawState = 'SWINGING' | 'EXTENDING' | 'RETRACTING';

export const GoldMinerGame: React.FC<GameProps> = ({ cauHinh, result, activeDapAnChuan, onSubmit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [blocks, setBlocks] = useState<GoldBlock[]>([]);
  const blocksRef = useRef<GoldBlock[]>([]);
  
  // Game Physics State
  const [angle, setAngle] = useState(0);
  const [length, setLength] = useState(80);
  const [clawState, setClawState] = useState<ClawState>('SWINGING');
  const [grabbedId, setGrabbedId] = useState<string | null>(null);

  // Refs for physics loop
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const clawStateRef = useRef<ClawState>('SWINGING');
  const lengthRef = useRef<number>(80);
  const angleRef = useRef<number>(0);
  const grabbedIdRef = useRef<string | null>(null);

  // Sync refs with state for the animation loop
  useEffect(() => { clawStateRef.current = clawState; }, [clawState]);
  useEffect(() => { lengthRef.current = length; }, [length]);
  useEffect(() => { angleRef.current = angle; }, [angle]);
  useEffect(() => { grabbedIdRef.current = grabbedId; }, [grabbedId]);
  useEffect(() => { blocksRef.current = blocks; }, [blocks]);

  // Initialize blocks
  useEffect(() => {
    if (!cauHinh?.danhSachLuaChon || !containerRef.current) return;
    
    // Defer initialization to get accurate container width/height
    const initBlocks = () => {
      const containerW = containerRef.current!.clientWidth;
      const containerH = containerRef.current!.clientHeight;
      const luaChon = cauHinh.danhSachLuaChon;
      
      const cols = luaChon.length;
      const colWidth = containerW / cols;
      
      const initialBlocks = luaChon.map((lc: any, index: number) => {
        const animalImage = ANIMALS[index % ANIMALS.length];
        
        // Spread them out horizontally, keep them at the bottom
        const x = (index * colWidth) + (colWidth / 2) + (Math.random() * 40 - 20);
        const y = containerH - 100 - (Math.random() * 60);
        
        return {
          id: lc.id,
          noiDung: typeof lc === 'string' ? lc : lc.noiDung || lc.text || lc.content || JSON.stringify(lc),
          image: animalImage,
          x,
          y,
          isWrong: false
        };
      });
      setBlocks(initialBlocks);
    };

    // Small delay to ensure DOM is rendered and dimensions are accurate
    setTimeout(initBlocks, 100);
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
    if (lastTimeRef.current !== 0 && containerRef.current) {
      const deltaTime = (time - lastTimeRef.current) / 1000;
      const containerW = containerRef.current.clientWidth;
      const containerH = containerRef.current.clientHeight;
      const pivotX = containerW / 2;
      const pivotY = 40; // Under the ceiling
      const SPEED = 400; // pixels per second
      const MIN_LENGTH = 80;

      if (clawStateRef.current === 'SWINGING') {
        // Swing pendulum using sine wave
        const swingSpeed = 0.002;
        const maxAngle = 70;
        const newAngle = Math.sin(time * swingSpeed) * maxAngle;
        setAngle(newAngle);
      } 
      else if (clawStateRef.current === 'EXTENDING') {
        const newLength = lengthRef.current + SPEED * deltaTime;
        setLength(newLength);
        
        const angleRad = angleRef.current * (Math.PI / 180);
        const tipX = pivotX + newLength * Math.sin(angleRad);
        const tipY = pivotY + newLength * Math.cos(angleRad);
        
        // Collision detection
        let hitId = null;
        for (const b of blocksRef.current) {
          if (b.isWrong) continue; // Skip if marked wrong recently
          
          // Distance formula
          const dist = Math.sqrt(Math.pow(tipX - b.x, 2) + Math.pow(tipY - b.y, 2));
          if (dist < 100) { // INCREASED HIT RADIUS
            hitId = b.id;
            break;
          }
        }

        if (hitId) {
          setGrabbedId(hitId);
          setClawState('RETRACTING');
        } else if (tipX < 0 || tipX > containerW || tipY > containerH) {
          // Hit boundaries
          setClawState('RETRACTING');
        }
      } 
      else if (clawStateRef.current === 'RETRACTING') {
        let newLength = lengthRef.current - SPEED * deltaTime;
        
        if (newLength <= MIN_LENGTH) {
          newLength = MIN_LENGTH;
          setLength(newLength);
          setClawState('SWINGING');
          
          if (grabbedIdRef.current) {
            checkAnswer(grabbedIdRef.current);
            setGrabbedId(null);
          }
        } else {
          setLength(newLength);
        }
      }
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

  // Interaction
  const handleInteraction = () => {
    if (result || gameOver || clawState !== 'SWINGING') return;
    setClawState('EXTENDING');
  };

  const checkAnswer = (id: string) => {
    const isCorrect = (activeDapAnChuan?.dapAnDungId || activeDapAnChuan) === id;
    
    if (isCorrect) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onSubmit({ dapAnDungId: id });
    } else {
      // Wrong! Mark block as wrong temporarily
      setBlocks(prev => prev.map(b => b.id === id ? { ...b, isWrong: true } : b));
      setTimeout(() => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, isWrong: false } : b));
      }, 1500); // Disable it for 1.5s
    }
  };

  // Rendering
  const pivotX = containerRef.current ? containerRef.current.clientWidth / 2 : 0;
  const pivotY = 40;
  const clawTipX = pivotX + length * Math.sin(angle * (Math.PI / 180));
  const clawTipY = pivotY + length * Math.cos(angle * (Math.PI / 180));

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleInteraction}
      onTouchStart={handleInteraction}
      className="relative w-full aspect-video min-h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700 select-none cursor-pointer bg-slate-800"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-slate-900 to-slate-950"></div>
      
      {/* Ceiling */}
      <div 
        className="absolute top-0 left-0 right-0 h-16 z-20 flex items-end drop-shadow-xl bg-slate-700 border-b-8 border-slate-900"
      ></div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 flex items-end overflow-hidden opacity-50">
        {[...Array(20)].map((_, i) => (
          <img 
            key={i} 
            src="/custom-assets/data-object-backgroud-for-all-game/Retina/foliagePack_054.png" 
            className="w-16 h-16 object-cover -mx-2" 
          />
        ))}
      </div>

      {/* Top Question Board */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#FFF3E0] border-4 border-[#8B4513] rounded-2xl px-8 py-3 shadow-[0_10px_0_0_#5C2E0C] z-30 min-w-[300px] max-w-[80%] text-center pointer-events-none">
        <span className="text-xl md:text-2xl font-black text-[#5C2E0C]">{cauHinh?.cauHoi}</span>
      </div>

      {/* Top Right Timer */}
      <div className="absolute top-4 right-4 z-30 pointer-events-none">
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-4 shadow-lg transition-colors ${
          timeLeft <= 10 ? 'bg-rose-500 border-rose-700 text-white animate-pulse' : 'bg-slate-800 border-slate-600 text-yellow-400'
        }`}>
          <Clock className="w-6 h-6" />
          <span className="text-xl font-black">{timeLeft}s</span>
        </div>
      </div>

      {/* The Line (Rope) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
        <line 
          x1={pivotX} 
          y1={pivotY} 
          x2={clawTipX} 
          y2={clawTipY} 
          stroke="#475569" 
          strokeWidth="4" 
        />
      </svg>

      {/* The Claw (Magnet) */}
      <div 
        className="absolute z-30 pointer-events-none flex items-center justify-center transition-transform duration-75"
        style={{
          left: clawTipX,
          top: clawTipY,
          transform: `translate(-50%, -10%) rotate(${180 - angle}deg)`,
          width: '64px',
          height: '64px'
        }}
      >
        <Magnet 
          className={`w-full h-full text-slate-300 drop-shadow-xl transition-all ${grabbedId || clawState === 'RETRACTING' ? 'text-amber-400 scale-110' : ''}`}
        />
        
        {/* Render grabbed item inside the claw visually */}
        {grabbedId && (() => {
          const block = blocks.find(b => b.id === grabbedId);
          if (!block) return null;
          return (
            <div className="absolute top-[80%] flex flex-col items-center">
              <img 
                src={`/custom-assets/data-character-backgroud-for-all-game/Square/${block.image}.png`}
                className="w-16 h-16 object-contain"
              />
              <div className="px-2 py-0.5 bg-white border border-slate-300 rounded shadow whitespace-nowrap text-xs font-bold text-slate-800 -mt-2">
                {block.noiDung}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Blocks on the Ground */}
      {blocks.map((block) => {
        // Hide if grabbed
        if (grabbedId === block.id) return null;

        return (
          <div
            key={block.id}
            className={`absolute flex flex-col items-center justify-center pointer-events-none transition-all duration-300 ${
              block.isWrong ? 'opacity-30 grayscale blur-sm scale-90' : 'opacity-100 drop-shadow-2xl'
            }`}
            style={{
              left: block.x,
              top: block.y,
              transform: 'translate(-50%, -50%)',
              width: '80px',
              height: '80px'
            }}
          >
            <img 
              src={`/custom-assets/data-character-backgroud-for-all-game/Square/${block.image}.png`}
              className="w-full h-full object-contain"
            />
            <div className="absolute -bottom-6 px-3 py-1 bg-white border-2 border-slate-300 rounded-lg shadow-md whitespace-nowrap z-40">
              <span className="font-bold text-slate-800 text-sm">{block.noiDung}</span>
            </div>
            
            {block.isWrong && (
              <div className="absolute -top-10 text-rose-500 font-black animate-bounce text-xl drop-shadow-md">
                Sai!
              </div>
            )}
          </div>
        );
      })}

      {/* Game Over Modal */}
      {gameOver && !result && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm border-4 border-rose-500">
            <AlertCircle className="w-20 h-20 text-rose-500 mb-4" />
            <h2 className="text-3xl font-black text-slate-800 mb-2">Hết Giờ!</h2>
            <p className="text-slate-600 mb-6 font-medium">Bạn chưa gắp được đáp án đúng.</p>
          </div>
        </div>
      )}
    </div>
  );
}
