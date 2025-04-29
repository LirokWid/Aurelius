// main.js
import {CanvasManager} from "./CanvasManager";
import {Background} from "./Background";
import {Candle} from "./Candle";
import {Book} from "./Book";
import gsap from "gsap";
import {SysHelper} from "./SysHelper";

/**
 * Manages the overall scene, including the background and candles.
 */
class Scene
{
    constructor() {
        const canvas_id = 'main-canvas';
        const background_src = '/img/library.jpeg';
        const book_src = '/img/book.png'

        this.scene_zoom = 1.0;

        this.canvas_manager = new CanvasManager(canvas_id);
        this.background = new Background(background_src, this.canvas_manager);

        this.candles_coordinates = [
            {x: 667, y: 610, intensity: 100, size: 50},
            {x: 1636, y: 490, intensity: 50, size: 25},
            {x: 2388, y: 652, intensity: 80, size: 50},
            {x: 2458, y: 567, intensity: 110, size: 50}
        ];

        this.candles = this.candles_coordinates.map(setting =>
            new Candle(setting.x, setting.y, setting.intensity, setting.size, this.background)
        );

        //Burning text ?

        this.book = new Book(book_src, this.canvas_manager, this.background,
            {
                init_x: 600,
                init_y: 890,
                baseZoom: 0.6,
                hoverZoom: 0.7,
                levitationHeight: 12
            });

        // Fade in animation parameters
        this.backgroundFadeAlpha = 0;
        this.currentZoom = 1.1;

        window.addEventListener('resize', () => {
            this.update_size_and_positions();
        })

        // Update the size and positions of the background after 10ms delay
        setTimeout(() => {
            this.update_size_and_positions();
            this.backgroundFadeAlpha = 1;
        }, 10);


        // Fade in animation for the background then, animation loop

        this.background.alpha = 0; // Force starting alpha to 0

        startFade.call(this);



        // Debug click position
        this.canvas_manager.canvas.addEventListener('click', (e) => {
            SysHelper.debugClickPosition(e, this.background, this.canvas_manager.canvas);
        });


        requestAnimationFrame((time) => this.animate(time));
    }

    async startFade() {
    await new Promise((resolve) => {
        gsap.to(this.background, {
            duration: 1,
            alpha: 1,
            onUpdate: () => this.update_size_and_positions(),
            onComplete: resolve
        });
    });

    console.log('Animation complete!');
}


    /**
     * Updates the background size and maps each candle's position to the resized background.
     */
    update_size_and_positions()
    {
        this.canvas_manager.resize();
        // Update background dimensions based on the current canvas size.
        this.background.update_size();
        this.candles.forEach(candle =>
        {// Update each candle's position according to the new background dimensions.
            candle.map_to_background(this.background);
        });
        this.book.updatePosition();
    }

    /**
     * The animation loop: clears the canvas, draws the background, and then draws each candle.
     * @param {number} time - Timestamp provided by requestAnimationFrame.
     */
    animate(time)
    {
        // Clear the canvas.
        //this.canvas_manager.clear();
        const ctx = this.canvas_manager.getContext();

        this.background.draw(ctx);

        this.book.draw();

        // Draw glowing candles
        this.candles.forEach(candle =>
        {
            candle.draw(ctx, time);
        });
        //}

        requestAnimationFrame((t) => this.animate(t));
    }
}

// Initialize and start the scene.
new Scene();
