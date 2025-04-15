/**
 * Handles background image rendering and resizing while maintaining aspect ratio.
 */
export class Background
{
    /**
     * Constructs a Background instance.
     * @param {string} src - Source path for the background image.
     * @param {CanvasManager} canvas_manager - Instance managing the canvas.
     */
    constructor(src, canvas_manager)
    {
        this.canvas = canvas_manager;
        this.image = new Image();
        this.image.src = src;

        // Set default placeholder dimensions in case the image is not immediately available.
        this.base_width = 1;
        this.base_height = 1;
        this.x = 0;
        this.y = 0;
        this.draw_width = canvas_manager.width;
        this.draw_height = canvas_manager.height;

        // When the image loads, update the base dimensions and recalculate drawing size.
        this.image.onload = () =>
        {
            this.base_width = this.image.width;
            this.base_height = this.image.height;
            this.update_size();
            // Optionally, you could trigger an event here to notify other components.
        };
    }

    /**
     * Updates the background's drawing dimensions and position based on current canvas size.
     */
    update_size()
    {
        const dimensions = this.background_dim_to_scene_dim(this.canvas.width, this.canvas.height);
        this.draw_width = dimensions.draw_width;
        this.draw_height = dimensions.draw_height;
        this.x = dimensions.x;
        this.y = dimensions.y;
    }

    /**
     * Draws the background image on the provided canvas rendering context.
     * @param {CanvasRenderingContext2D} ctx - The drawing context.
     */
    draw(ctx)
    {
        if (!this.image.complete) return;
        ctx.drawImage(this.image, this.x, this.y, this.draw_width, this.draw_height);
    }

    /**
     * Converts canvas dimensions to appropriate background drawing dimensions while
     * preserving the image's aspect ratio.
     *
     * @param {number} canvas_width - The current width of the canvas.
     * @param {number} canvas_height - The current height of the canvas.
     * @returns {object} An object containing x, y, draw_width, and draw_height.
     */
    background_dim_to_scene_dim(canvas_width, canvas_height)
    {
        const img_aspect = this.base_width / this.base_height;
        const canvas_aspect = canvas_width / canvas_height;

        let draw_width, draw_height;

        if (canvas_aspect > img_aspect)
        {
            draw_width = canvas_width;
            draw_height = canvas_width / img_aspect;
        } else {
            draw_height = canvas_height;
            draw_width = canvas_height * img_aspect;
        }

        return {
            x: (canvas_width - draw_width) / 2,
            y: (canvas_height - draw_height) / 2,
            draw_width: draw_width,
            draw_height: draw_height
        };
    }
}
