import {Glow} from "./Glow";

/**
 * Represents a Candle with a glowing effect, which can be dynamically
 * mapped to a background and drawn on a canvas.
 */
export class Candle
{
    /**
     * Constructs a Candle instance.
     * @param {number} init_x - The original x-coordinate on the background image.
     * @param {number} init_y - The original y-coordinate on the background image.
     * @param {number} intensity - The intensity of the candle's glow.
     * @param {number} size - The base size of the candle's glow.
     * @param background
     */
    constructor(init_x, init_y, intensity, size, background = null)
    {
        this.init_x = init_x;
        this.init_y = init_y;
        this.x = init_x;
        this.y = init_y;

        this.glow = new Glow(this.x, this.y, intensity, size);

        this.map_to_background(background); // Map the initial position to the background
    }

    /**
     * Maps the original candle coordinates to the resized background using scale factors
     * and updates the glow effect position accordingly.
     *
     * @param {Background} background - The background instance with updated properties.
     */
    map_to_background(background)
    {
        // Calculate scaling factors comparing the drawn dimensions to the original image dimensions.
        const scaleX = background.draw_width / background.base_width;
        const scaleY = background.draw_height / background.base_height;

        // Map the original coordinate (relative to the base image) to the new canvas coordinates.
        this.x = background.x + this.init_x * scaleX;
        this.y = background.y + this.init_y * scaleY;

        // Update the glow effect to follow the candle.
        this.glow.updatePosition(this.x, this.y);
    }

    /**
     * Draws the candle’s glow. (The candle itself is represented by its glow.)
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {number} time - The current time, used to animate the glow.
     */
    draw(ctx, time)
    {
        this.glow.draw(ctx, time);
    }
}
