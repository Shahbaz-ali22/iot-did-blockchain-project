import { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function IntroScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 500);
          return 100;
        }
        return p + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute w-[400px] h-[400px] bg-emerald-500/20 blur-3xl rounded-full animate-pulse"></div>

      {/* Logo animation */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold tracking-widest text-emerald-400 z-10"
      >
        IoT-DID
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-white/60 mt-2 z-10"
      >
        Secure IoT Onboarding via Blockchain
      </motion.p>

      {/* Progress bar */}
      <div className="mt-10 w-64 h-[4px] bg-white/10 rounded-full overflow-hidden z-10">
        <motion.div
          className="h-full bg-emerald-400"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      {/* Percentage */}
      <p className="text-xs text-white/40 mt-2 z-10">{progress}%</p>

    </div>
  );
}