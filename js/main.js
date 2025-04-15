import {CanvasManager} from "./CanvasManager";
import {Background} from "./Background";
import {Candle} from "./Candle";

/**
 * Manages the overall scene, including the background and candles.
 */
class Scene
{
    constructor()
    {
        const canvas_id = 'main-canvas';
        const background_src = '/img/library.jpeg';

        this.canvas_manager = new CanvasManager(canvas_id);
        this.background = new Background(background_src, this.canvas_manager);

        this.candles_coordinates = [
            { x: 667,  y: 610 , intensity: 100, size: 50 },
            { x: 1636, y: 490 , intensity: 50, size: 25 },
            { x: 2388, y: 652 , intensity: 80, size: 50 },
            { x: 2458, y: 567 , intensity: 110, size: 50 }
        ];

        this.candles = this.candles_coordinates.map(setting =>
            new Candle(setting.x, setting.y, setting.intensity, setting.size)
        );

        // Immediately update the scene layout to reflect initial canvas and background sizes.
        this.update_size_and_positions();

        // Update positions whenever the window is resized.
        window.addEventListener('resize', () => this.update_size_and_positions());

        // Start the animation loop.
        requestAnimationFrame((time) => this.animate(time));
    }

    /**
     * Updates the background size and maps each candle's position to the resized background.
     */
    update_size_and_positions()
    {
        // Update background dimensions based on the current canvas size.
        this.background.update_size();

        // Update each candle's position according to the new background dimensions.
        this.candles.forEach(candle =>
        {
            candle.map_to_background(this.background);
        });
    }

    /**
     * The animation loop: clears the canvas, draws the background, and then draws each candle.
     * @param {number} time - Timestamp provided by requestAnimationFrame.
     */
    animate(time)
    {
        // Clear the canvas.
        this.canvas_manager.clear();

        // Draw the background.
        this.background.draw(this.canvas_manager.getContext());

        // Draw each candle's glow effect.
        this.candles.forEach(candle => {
            candle.draw(this.canvas_manager.getContext(), time);
        });

        requestAnimationFrame((t) => this.animate(t));
    }
}

// Initialize and start the scene.
new Scene();
