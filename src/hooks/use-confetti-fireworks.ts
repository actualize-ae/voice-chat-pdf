import confetti from "canvas-confetti";

export function useConfettiFireworks({ duration = 5 * 1000, startVelocity = 30, spread = 360, ticks = 60, zIndex = 0 }: { duration?: number, startVelocity?: number, spread?: number, ticks?: number, zIndex?: number }) {
    const triggerConfetti = () => {
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity, spread, ticks, zIndex };

        const randomInRange = (min: number, max: number) =>
            Math.random() * (max - min) + min;

        const interval = window.setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);
    };

    return {
        triggerConfetti
    }
}
