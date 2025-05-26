/**
 * A class to manage and render a background image onto a canvas. Handles image loading,
 * dimension calculations, rendering based on aspect ratios and canvas properties, and
 * supports transparency and zoom.
 */
export class Background
{
    /**
     * Creates an instance of the class to manage and render an image onto a canvas.
     * Handles image loading, initializes properties related to dimensions, position,
     * and drawing options, and updates size calculations upon the image being loaded.
     *
     * @param {string} src - The source URL of the image to be rendered on the canvas.
     * @param {object} canvas_manager - An object representing the canvas manager, providing
     *                                   properties such as dimensions for rendering images.
     * @return {void}
     */
    constructor(src, canvas_manager)
    {
        this.canvas = canvas_manager;
        this.image = new Image();
        this.image.src = src;

        this.alpha = 1; // Default alpha (fully visible)

        // Set default placeholder dimensions in case the image is not immediately available.
        this.base_width = 1;
        this.base_height = 1;
        this.x = 0;
        this.y = 0;
        this.draw_width = canvas_manager.width;
        this.draw_height = canvas_manager.height;
        this.zoom = 1;
        this.img_aspect = 1;
        this.canvas_aspect = 1;

        // When the image loads, update the base dimensions and recalculate drawing size.
        this.image.addEventListener('load', () =>
        {
            this.base_width = this.image.width;
            this.base_height = this.image.height;
            this.update_size();
        });

    }

    /**
     * Updates the size and dimensions of the scene based on the canvas properties.
     * It calculates the new drawing dimensions, positions, zoom levels, and aspect ratios.
     * Additionally, updates the offset for the device.
     *
     * @return {void} This method does not return any value.
     */
    update_size()
    {
        const dimensions = this.background_dim_to_scene_dim(this.canvas.width, this.canvas.height);
        this.draw_width = dimensions.draw_width;
        this.draw_height = dimensions.draw_height;
        this.x = dimensions.x;
        this.y = dimensions.y;
        this.zoom = dimensions.zoom;
        this.img_aspect = dimensions.img_aspect;
        this.canvas_aspect = dimensions.canvas_aspect;
        this.offset = this.getOffsetForDevice();
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
        {// Canvas is wider than image
            draw_width = canvas_width;
            draw_height = canvas_width / img_aspect;
        } else {
            draw_height = canvas_height;
            draw_width = canvas_height * img_aspect;
        }
        draw_height += offset;
        draw_width = draw_height * img_aspect;

        const zoom = draw_width / this.base_width;
        //console.log("Bckgrnd_zoom", zoom, "aspect", img_aspect, "canvas_aspect", canvas_aspect);
        return {
            x: (canvas_width - draw_width) / 2,
            //y: (canvas_height - draw_height) / 2,
            y: canvas_height - draw_height + offset,
            draw_width: draw_width,
            draw_height: draw_height,
            zoom: zoom,
            img_aspect: img_aspect,
            canvas_aspect: canvas_aspect
        };
    }

    /**
     * Draws an image onto the given rendering context with the specified zoom level and alpha transparency.
     *
     * @param {CanvasRenderingContext2D} ctx - The rendering context on which to draw the image.
     * @param {number} [zoom=1] - The zoom level to apply when drawing the image. Defaults to 1.
     * @param {number|null} [alpha=null] - The alpha transparency level to apply. If null, a default alpha is used.
     * @return {void} No return value.
     */
    draw(ctx, zoom = 1, alpha = null)
    {
        if (!this.image.complete) return;

        this.zoom = zoom;
        this.alpha = alpha;

        const scaledWidth = this.draw_width * this.zoom;
        const scaledHeight = this.draw_height * this.zoom;
        const offsetX = this.x - (scaledWidth - this.draw_width) / 2;
        const offsetY = this.y - (scaledHeight - this.draw_height) / 2;

        ctx.save(); // Always good practice when changing globalAlpha
        ctx.globalAlpha = alpha !== null ? alpha : this.alpha;
        //console.log(this.x, this.y, offsetX, offsetY);
        ctx.drawImage(
            this.image,
            offsetX,
            offsetY,
            scaledWidth,
            scaledHeight);
        ctx.restore(); // Restore canvas state

    }

    /**
     * Calculates and returns the background offset based on the device's aspect ratio.
     * The offset is proportional to the aspect ratio, with a minimum value of -170 and a maximum value of 0.
     *
     * @return {number} The calculated background offset in pixels based on the device aspect ratio.
     */
    getOffsetForDevice()
    {
        // Offset should be proportional to the device aspect ratio with a max offset of -170
        const aspectRatio = window.innerWidth / window.innerHeight;
        let offset = Math.round((1 - aspectRatio) * -170);
        // min aspect ratio is 0,4 with a max offset of -170

        if (offset < -170)
        {
            offset = -170;
        } else if (offset > 0)
        {
            offset = 0;
        }
        const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || document.body.clientWidth;
        console.info("Background offset for device: " + offset + "px, width: " + width + "px, aspect ratio: " + aspectRatio);

        return offset;
    }
}
