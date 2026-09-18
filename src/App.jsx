import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  User, 
  Gamepad2, 
  Shield, 
  Clock, 
  Zap,
  ArrowRight,
  CheckCircle,
  Lock,
  RefreshCw
} from 'lucide-react';

// Steam Guard Modal Component
const SteamGuardModal = ({ isOpen, onClose, gameName }) => {
  const [guardCode, setGuardCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [enteredCode, setEnteredCode] = useState('');
  const [verified, setVerified] = useState(false);

  const generateGuardCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleRequestCode = () => {
    if (cooldown > 0) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const newCode = generateGuardCode();
      setGuardCode(newCode);
      setIsLoading(false);
      setCooldown(30);
      setVerified(false);
      setEnteredCode('');
    }, 2000);
  };

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleVerify = () => {
    if (enteredCode.toUpperCase() === guardCode) {
      setVerified(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Steam Account Access</h3>
          <p className="text-zinc-400">{gameName}</p>
        </div>

        {/* Account Credentials */}
        <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-400 uppercase tracking-wider">Username</label>
              <div className="flex items-center gap-2 mt-1">
                <Lock className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-300 blur-sm select-none">steam_user_2024</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-400 uppercase tracking-wider">Password</label>
              <div className="flex items-center gap-2 mt-1">
                <Lock className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-300 blur-sm select-none">••••••••••••</span>
              </div>
            </div>
          </div>
        </div>

        {/* Steam Guard Verification */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Steam Guard Verification
          </h4>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="h-12 bg-zinc-800 rounded-lg animate-pulse" />
                <p className="text-sm text-zinc-400 text-center">Requesting secure code...</p>
              </motion.div>
            ) : guardCode ? (
              <motion.div 
                key="code"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-zinc-800 rounded-lg p-4 text-center">
                  <p className="text-xs text-zinc-400 mb-2">Your Guard Code</p>
                  <p className="text-3xl font-mono font-bold text-accent tracking-widest">
                    {guardCode}
                  </p>
                </div>

                {cooldown > 0 ? (
                  <button 
                    disabled
                    className="w-full py-3 bg-zinc-800 text-zinc-500 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Wait {cooldown}s
                  </button>
                ) : (
                  <button 
                    onClick={handleRequestCode}
                    className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Request New Code
                  </button>
                )}

                {!verified && (
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-2">
                        Enter Guard Code to Login
                      </label>
                      <input 
                        type="text" 
                        value={enteredCode}
                        onChange={(e) => setEnteredCode(e.target.value.toUpperCase().slice(0, 5))}
                        placeholder="ABCDE"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-center text-xl font-mono tracking-widest focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <button 
                      onClick={handleVerify}
                      disabled={enteredCode.length !== 5}
                      className="w-full py-3 bg-accent hover:bg-orange-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
                    >
                      Verify & Connect
                    </button>
                  </div>
                )}

                {verified && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-4 bg-green-900/30 border border-green-700 rounded-lg flex items-center gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="font-semibold text-green-400">Successfully Verified!</p>
                      <p className="text-sm text-green-300">You can now access your Steam account.</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button 
                  onClick={handleRequestCode}
                  className="w-full py-4 bg-accent hover:bg-orange-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Request New Guard Code
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// Game Card Component
const GameCard = ({ game, onOpenGuard }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800"
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img 
          src={game.image} 
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-xl font-bold mb-2">{game.title}</h3>
        <p className="text-zinc-300 text-sm mb-4">${game.price}</p>
        <button 
          onClick={() => onOpenGuard(game)}
          className="w-full py-3 bg-accent hover:bg-orange-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-orange-500/25"
        >
          Buy Account
        </button>
      </div>
      
      <div className="p-4 group-hover:opacity-0 transition-opacity duration-300">
        <h3 className="text-lg font-bold">{game.title}</h3>
        <p className="text-accent font-semibold mt-1">${game.price}</p>
      </div>
    </motion.div>
  );
};

// Main App Component
function App() {
  const [isGuardModalOpen, setIsGuardModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    { id: 1, title: 'Elden Ring', price: '29.99', image: 'https://images.unsplash.com/photo-1627856014759-08529612289d?w=500&h=667&fit=crop' },
    { id: 2, title: 'Cyberpunk 2077', price: '24.99', image: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=500&h=667&fit=crop' },
    { id: 3, title: 'RDR 2', price: '34.99', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=667&fit=crop' },
    { id: 4, title: 'Hogwarts Legacy', price: '39.99', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&h=667&fit=crop' },
    { id: 5, title: 'God of War', price: '27.99', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&h=667&fit=crop' },
    { id: 6, title: 'Spider-Man 2', price: '44.99', image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&h=667&fit=crop' },
    { id: 7, title: 'Starfield', price: '49.99', image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&h=667&fit=crop' },
    { id: 8, title: 'Baldur\'s Gate 3', price: '42.99', image: 'https://images.unsplash.com/photo-1612287230217-969b698eb650?w=500&h=667&fit=crop' },
  ];

  const handleOpenGuard = (game) => {
    setSelectedGame(game);
    setIsGuardModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-black/50 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Gamepad2 className="w-8 h-8 text-accent" />
              <span className="text-xl font-bold">Opss<span className="text-accent">Gamer</span>Shop</span>
            </motion.div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {['Discover', 'Games', 'Discounts', 'My Guard Code'].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-zinc-300 hover:text-white transition-colors relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Your next{' '}
              <span className="text-accent">adventure</span>{' '}
              is here.
            </h1>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl">
              Instantly access premium game accounts with full security and Steam Guard protection. Start playing your favorite games within minutes.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-accent hover:bg-orange-600 text-white rounded-lg font-semibold text-lg transition-all hover:shadow-lg hover:shadow-orange-500/25"
              >
                Explore Games
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white/30 hover:border-white text-white rounded-lg font-semibold text-lg transition-all flex items-center gap-2 hover:bg-white/10"
              >
                How it works
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature/Trust Bar */}
      <section className="py-12 border-y border-zinc-800 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Instant Delivery', desc: 'Get your account immediately after purchase' },
              { icon: Shield, title: 'Always in Control', desc: 'Full Steam Guard access and security' },
              { icon: Clock, title: '24/7 Support', desc: 'Round-the-clock customer assistance' },
            ].map((feature, index) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start gap-4 ${index !== 2 ? 'md:border-r border-zinc-800 md:pr-8' : ''}`}
              >
                <feature.icon className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                  <p className="text-zinc-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 text-center"
          >
            Which world should we go to?
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <GameCard game={game} onOpenGuard={handleOpenGuard} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-accent" />
              <span className="font-bold">Opss<span className="text-accent">Gamer</span>Shop</span>
            </div>
            <p className="text-zinc-400 text-sm">
              © 2024 OpssGamerShop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Steam Guard Modal */}
      <AnimatePresence>
        {isGuardModalOpen && (
          <SteamGuardModal 
            isOpen={isGuardModalOpen}
            onClose={() => setIsGuardModalOpen(false)}
            gameName={selectedGame?.title}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
