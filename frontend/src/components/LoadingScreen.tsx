import { motion } from "framer-motion"

export const LoadingScreen = () => {
    // ⏱️ Konfigurace vln
    const waveCount = 3
    const waveDelay = 2 // sekundy mezi vlnami
    const waveDuration = 5

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-background overflow-hidden">
            {/* 🌊 Více radarových vln */}
            {Array.from({ length: waveCount }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-300 dark:border-green-500"
                    style={{ width: 220, height: 220, zIndex: 0 }}
                    initial={{ scale: 0.3, opacity: 0.25 }}
                    animate={{
                        scale: [0.3, 2, 2, 2],
                        opacity: [0.25, 0, 1, 0],
                    }}
                    transition={{
                        duration: waveDuration + 1,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: i * waveDelay,
                        times: [0, 0.8, 0.9, 1],
                    }}
                />
            ))}

            {/* 🔄 Rotující spinner */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
                className="z-10"
            >

            </motion.div>

            {/* 📝 Texty */}
            <motion.h1
                className="z-10 text-2xl font-semibold mt-4 text-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                Načítám mapu...
            </motion.h1>

            <motion.p
                className="z-10 text-muted-foreground mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
            >
                Připojuji k serveru a stahuji jednotky
            </motion.p>
        </div>
    )
}
