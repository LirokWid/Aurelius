// main.js
import {CanvasManager} from "./src/components/CanvasManager";
import {Background} from "./src/components/Background";
import {Candle} from "./src/components/Candle";
import {Book} from "./src/components/Book";
import gsap from "gsap";
import {SysHelper} from "./src/components/SysHelper";

/**
 * Manages the overall scene, including the background and candles.
 */
class Scene
{
    constructor() {
        const canvas_id =  'main-canvas';
        const background_src = import.meta.env.BASE_URL +'assets/library.jpeg';
        const book_src = import.meta.env.BASE_URL +'assets/book.png'

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

                init_x: 1470,
                init_y: 1197,
                zoomHoverFactor: 1.1, // 10% of base zoom
                levitationHeight: 12, // sin animation height
                baseZoom: 0.6,        // Base zoom level
                hoverZoom: 0.7
            });

        this.drawables = [this.book, ...this.candles];

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

        this.background.image.onload = () => {
            this.update_size_and_positions();
            this.backgroundFadeAlpha = 1;

            // Start background fade only after size is valid
            this.background.alpha = 0;
            start_background_fade.call(this).then(() =>
            {
                this.book.updateBaseZoom(this.background.zoom);
                requestAnimationFrame((time) => this.animate(time));
            });
        };

        // Debug click position
        this.canvas_manager.canvas.addEventListener('click', (e) => {
            SysHelper.debugClickPosition(e, this.background, this.canvas_manager.canvas);
        });
        this.canvas_manager.canvas.addEventListener('click', (e) => {
            const canvas = this.canvas_manager.canvas;
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const bg = this.background;

            const scaledWidth = bg.draw_width * bg.zoom;
            const scaledHeight = bg.draw_height * bg.zoom;

            const drawX = bg.x - (scaledWidth - bg.draw_width) / 2;
            const drawY = bg.y - (scaledHeight - bg.draw_height) / 2;

            const scaleX = scaledWidth / bg.base_width;
            const scaleY = scaledHeight / bg.base_height;

            const imageX = (mouseX - drawX) / scaleX;
            const imageY = (mouseY - drawY) / scaleY;

            console.log("📌 Clicked position on background image:");
            console.log("  imageX:", Math.round(imageX));
            console.log("  imageY:", Math.round(imageY));
        });

    }


    /**
     * Updates the background size and maps each candle's position to the resized background.
     */
    update_size_and_positions()
    {
        this.canvas_manager.resize();
        this.background.update_size();

        this.candles.forEach(candle => candle.map_to_background(this.background));
        this.book.update();
        this.book.updateBaseZoom(this.background.zoom);
    }

    /**
     * The animation loop: clears the canvas, draws the background, and then draws each candle.
     * @param {number} time - Timestamp provided by requestAnimationFrame.
     */
    animate(time)
    {
        const ctx = this.canvas_manager.getContext();
        //ctx.clearRect(0, 0, this.canvas_manager.width, this.canvas_manager.height);

        this.background.draw(ctx, 1, 1);
        //this.book.draw();

        this.drawables.forEach(drawable =>
        {
            //drawable.update?.(time);
            drawable.draw?.(ctx, time);
        });

        requestAnimationFrame((t) => this.animate(t));
    }
}

/**
 * Starts the fade-in animation for the background.
 * @returns {Promise<void>}
 */
async function start_background_fade()
{
    this.background.alpha = 0;
    this.background.zoom = 0.8;

    await new Promise((resolve) =>
    {
        gsap.to(this.background,
            {
                duration: 1,
                alpha: 1,
                zoom: 1,
                onUpdate: () =>
                {
                    this.background.draw(this.canvas_manager.getContext(), this.background.zoom, this.background.alpha)

                    //console.log("zooom", this.background.zoom);
                    //console.log("alpha", this.background.alpha);
                },
                onComplete: resolve
            });
    });
    console.log('Background fade in complete!');
}
// Initialize and start the scene.
new Scene();