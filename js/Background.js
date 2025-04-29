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

        this.offset = 100; // Offset for the Y position of the background image

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
        console.log(dimensions);
        this.draw_width = dimensions.draw_width;
        this.draw_height = dimensions.draw_height;
        this.x = dimensions.x;
        this.y = dimensions.y;
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

        const offset = this.offset || 0; // par défaut 0

        let draw_width, draw_height;

        if (canvas_aspect > img_aspect)
        {
            draw_width = canvas_width;
            draw_height = canvas_width / img_aspect;
        } else {
            draw_height = canvas_height;
            draw_width = canvas_height * img_aspect;
        }
        draw_height += offset;
        draw_width = draw_height * img_aspect;

        const zoom = draw_width / this.base_width;
        console.log("zoom", zoom);
        return {
            x: (canvas_width - draw_width) / 2,
            //y: (canvas_height - draw_height) / 2,
            y: canvas_height - draw_height,
            draw_width: draw_width,
            draw_height: draw_height,
            zoom: zoom,
            img_aspect: img_aspect,
            canvas_aspect: canvas_aspect
        };
    }

    /**
     * Draws the background image with optional zoom.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} zoom - Scaling factor (1 = original size)
     */
    draw(ctx, zoom = 1)
    {
        if (!this.image.complete) return;

        const scaledWidth = this.draw_width * zoom;
        const scaledHeight = this.draw_height * zoom;
        const offsetX = this.x - (scaledWidth - this.draw_width) / 2;
        const offsetY = this.y - (scaledHeight - this.draw_height) / 2;

        //console.log(this.x, this.y, offsetX, offsetY);
        ctx.drawImage(this.image, offsetX, offsetY, scaledWidth, scaledHeight);
    }
}
