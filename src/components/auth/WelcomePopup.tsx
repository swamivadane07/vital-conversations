import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface WelcomePopupProps {
  isVisible: boolean;
  onClose: () => void;
}

export const WelcomePopup = ({ isVisible, onClose }: WelcomePopupProps) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isVisible]);

  // Auto close after 10 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const floatingHearts = Array.from({ length: 12 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute"
      initial={{ 
        x: Math.random() * 400 - 200,
        y: 100,
        opacity: 0,
        scale: 0
      }}
      animate={{ 
        y: -100,
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
        rotate: 360
      }}
      transition={{
        duration: 3,
        delay: i * 0.2,
        repeat: Infinity,
        repeatDelay: 2
      }}
    >
      <Heart className="w-4 h-4 text-primary fill-primary/20" />
    </motion.div>
  ));

  const sparkles = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        rotate: 180
      }}
      transition={{
        duration: 2,
        delay: i * 0.1,
        repeat: Infinity,
        repeatDelay: 3
      }}
    >
      <Sparkles className="w-3 h-3 text-primary-glow" />
    </motion.div>
  ));

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {floatingHearts}
              {sparkles}
            </div>

            {/* Main Popup */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                duration: 0.8
              }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="relative w-full max-w-md mx-auto bg-gradient-to-br from-card via-background to-card/90 backdrop-blur-lg border-2 border-primary/20 shadow-2xl shadow-primary/25 overflow-hidden">
                {/* Gradient Background Effects */}
                <div className="absolute inset-0 bg-gradient-medical opacity-10"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-glow/10 rounded-full blur-3xl"></div>
                
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>

                <div className="relative p-8 text-center space-y-6">
                  {/* Animated Logo */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: 0.3,
                      type: "spring",
                      stiffness: 150,
                      damping: 15
                    }}
                    className="relative mx-auto"
                  >
                    <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary-glow"
                      />
                      <Heart className="w-10 h-10 text-white fill-white" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -inset-2 bg-primary/20 rounded-full blur-xl"
                    />
                  </motion.div>

                  {/* Welcome Message */}
                  <AnimatePresence>
                    {showContent && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="space-y-4"
                      >
                        <motion.h2
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                          className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent"
                        >
                          Welcome to MedCare AI!
                        </motion.h2>
                        
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1, duration: 0.6 }}
                          className="relative"
                        >
                          <div className="p-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary-glow/5 rounded-lg border border-primary/20">
                            <p className="text-sm text-muted-foreground mb-2">
                              ✨ This application is developed and deployed by
                            </p>
                            <motion.p
                              animate={{ 
                                textShadow: [
                                  "0 0 0px hsl(var(--primary))",
                                  "0 0 10px hsl(var(--primary) / 0.5)",
                                  "0 0 0px hsl(var(--primary))"
                                ]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="text-lg font-bold text-primary"
                            >
                              Dhananjay
                            </motion.p>
                            <motion.p
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                              className="text-sm text-muted-foreground mt-1"
                            >
                              with ❤️, driven by his passion for AI and Cloud
                            </motion.p>
                          </div>
                        </motion.div>
                        
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                          className="text-sm text-muted-foreground"
                        >
                          Your health journey starts here. Let's make healthcare accessible for everyone! 🚀
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Progress Bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 10, ease: "linear" }}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-primary-glow to-primary"
                  />
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};