import { useState } from 'react';
import { Plus, X, ChefHat } from 'lucide-react';

interface WelcomeScreenProps {
  tableNumber: number;
  onSubmit: (names: string[]) => void;
  onNavigateToKDS: () => void;
}

const AVATAR_COLORS = [
  '#FF5C00', '#FFA500', '#FFD700', '#FF6347', '#FF8C00',
  '#FF4500', '#FF7F50', '#FFA07A'
];

export function WelcomeScreen({ tableNumber, onSubmit, onNavigateToKDS }: WelcomeScreenProps) {
  const [names, setNames] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');

  const addName = () => {
    if (currentInput.trim() && names.length < 8) {
      setNames([...names, currentInput.trim()]);
      setCurrentInput('');
    }
  };

  const removeName = (index: number) => {
    setNames(names.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (names.length > 0) {
      onSubmit(names);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addName();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1600&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#0A0A0A'
    }}>
      <div className="w-full max-w-md backdrop-blur-xl bg-card/80 p-8 rounded-3xl border border-border shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black tracking-tighter mb-1" style={{ color: '#FF5C00' }}>ServeEase</h1>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">Table {tableNumber}</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-3 text-xs font-black uppercase tracking-widest text-white ml-1">Add Guest Names</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter a name"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-5 py-4 rounded-2xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder:text-muted-foreground/50 transition-all"
                maxLength={20}
                disabled={names.length >= 8}
              />
              <button
                onClick={addName}
                disabled={!currentInput.trim() || names.length >= 8}
                className="p-4 rounded-2xl transition-all disabled:opacity-30 shadow-lg shadow-[#FF5C00]/20 active:scale-95"
                style={{ backgroundColor: '#FF5C00' }}
              >
                <Plus size={24} className="text-white" />
              </button>
            </div>
            <p className="text-[10px] font-bold text-white/70 mt-3 ml-1 uppercase tracking-wider">
              {names.length}/8 guests added
            </p>
          </div>

          {names.length > 0 && (
            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
              {names.map((name, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-secondary/30 border border-white/5 group hover:bg-secondary/50 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-lg"
                    style={{ backgroundColor: AVATAR_COLORS[index] }}
                  >
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <span className="flex-1 font-bold text-white/90">{name}</span>
                  <button
                    onClick={() => removeName(index)}
                    className="p-2 rounded-xl hover:bg-destructive/20 text-destructive/70 hover:text-destructive transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={names.length === 0}
            className="w-full py-5 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] transition-all disabled:opacity-20 shadow-2xl shadow-[#FF5C00]/20 active:scale-95"
            style={{ backgroundColor: '#FF5C00' }}
          >
            See Menu
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <button
            onClick={onNavigateToKDS}
            className="w-full flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-white/50 hover:text-[#FF5C00] transition-colors"
          >
            <ChefHat size={16} />
            <span>Staff Kitchen Portal</span>
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
