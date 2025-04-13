import {CanvasManager} from "./CanvasManager";
import {Background} from "./Background";
import {Candles} from "./Candles";

class Scene
{
    constructor()
    {
        const canvas_id = 'main-canvas';
        const background_src = '/img/library.jpeg';

        this.canvas_manager = new CanvasManager( canvas_id );
        this.background = new Background( background_src );
        this.candles = new Candles( this.canvas_manager );

        // Set candle candles_parameters and elements

        // Manage Background and glow candles_parameters
        window.addEventListener('resize', () => this.canvas_manager.update_positions());

        // Start animation loop
        requestAnimationFrame((time) => this.animate(time));
    }


    animate(time)
    {
        // Clear canvas
        this.canvas_manager.clear();

        // Draw background with right aspect ratio
        this.background.draw(this.canvas_manager.getContext(), this.canvas_manager.width, this.canvas_manager.height);

        // Draw candles glow over the background at right coordinates
        this.candles.forEach(candle => {
            candle.draw(this.canvas_manager.getContext(), time);
        });

        requestAnimationFrame((t) => this.animate(t));
    }
}

// Initialize scene
new Scene();
