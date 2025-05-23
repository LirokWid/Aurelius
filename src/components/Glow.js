/**
 * Represents the glow effect of a candle.
 */
export class Glow
{
    /**
     * Constructs a Glow instance.
     * @param {number} x - The x-coordinate for the glow.
     * @param {number} y - The y-coordinate for the glow.
     * @param {number} intensity - The intensity value of the glow.
     * @param {number} size - The base size of the glow.
     */
    constructor(x, y, intensity, size)
    {
        this.x = x;
        this.y = y;
        this.intensity = intensity;
        this.baseSize = size;
        this.timeOffset = Math.random() * 100;
    }

    /**
     * Updates the position of the glow.
     * @param {number} x - The new x-coordinate.
     * @param {number} y - The new y-coordinate.
     */
    updatePosition(x, y)
    {
        this.x = x;
        this.y = y;
    }

    /**
     * Draws the glow effect.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {number} time - Time value used for animating the glow (flickering).
     */
    draw(ctx, time)
    {
        if (!isFinite(this.x) || !isFinite(this.y)) return;

        const now = time * 0.002;
        const flicker = 1 + Math.sin(now * 5 + this.timeOffset) * 0.2;
        const radius = this.baseSize * flicker;

        if (!isFinite(radius)) return;


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
