/**
 * Manages the canvas element and its rendering context.
 */
export class CanvasManager
{
    /**
     * Constructs a CanvasManager instance.
     * @param {string} canvas_id - The id of the canvas DOM element.
     */
    constructor(canvas_id)
    {
        this.canvas = document.getElementById(canvas_id);
        if (!this.canvas)
        {
            throw new Error(`Canvas element with id ${canvas_id} not found`);
        }
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        // Debounce resize events to prevent excessive updates.
        //window.addEventListener('resize', () => this.resize());
    }

    /**
     * Resizes the canvas to match the window dimensions.
     */
    resize()
    {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    /**
     * Debounces the resize event to limit how often resize() is called.
     */
    debouncedResize()
    {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => this.resize(), 100);
    }

    /**
     * Clears the entire canvas.
     */
    clear()
    {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Draws an image on the canvas.
     * @param {CanvasImageSource} image - The image to draw.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @param {number} width - The width to draw the image.
     * @param {number} height - The height to draw the image.
     */
    draw_image(image, x, y, width, height)
    {
        this.ctx.drawImage(image, x, y, width, height);
    }

    /**
     * Creates a radial gradient.
     * @param  {...any} args - Parameters for createRadialGradient.
     * @returns {CanvasGradient}
     */
    createRadialGradient(...args)
    {
        return this.ctx.createRadialGradient(...args);
    }

    /**
     * Retrieves the canvas rendering context.
     * @returns {CanvasRenderingContext2D}
     */
    getContext()
    {
        return this.ctx;
    }

    /**
     * Returns the current size of the canvas.
     * @returns {object} Object containing width and height.
     */
    get_canvas_size()
    {
        return {
            width: this.width,
            height: this.height
        };
    }
}
