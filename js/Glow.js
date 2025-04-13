export class Glow {
    constructor(x, y, intensity, size)
    {
        this.x = x;
        this.y = y;
        this.intensity = intensity;
        this.baseSize = size;
        this.timeOffset = Math.random() * 100;
    }

    // If resizing window, glow effect position updates here
    updatePosition(x, y)
    {
        this.x = x;
        this.y = y;
    }

    updateCandlePositions()
    {
        const mapped_w = 0;

        const w = this.canvasManager.width;
        const h = this.canvasManager.height;

        const newPositions = [
            { x: w * 0.3, y: h * 0.75 },
            { x: w * 0.5, y: h * 0.78 },
            { x: w * 0.7, y: h * 0.74 }
        ];

        newPositions.forEach((pos, i) => {
            this.candles[i].updatePosition(pos.x, pos.y);
        });
    }

    draw(ctx, time)
    {
        const now = time * 0.002;
        const flicker = 1 + Math.sin(now * 5 + this.timeOffset) * 0.2;
        const radius = this.baseSize * flicker;

        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
        gradient.addColorStop(0, 'rgba(255, 170, 51, 0.9)');
        gradient.addColorStop(1, 'rgba(255, 170, 51, 0)');

        ctx.save();
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}