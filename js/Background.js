export class Background 
{
    constructor(src) {
        this.image = new Image();
        this.image.src = src;
    }

    // Stick background to center of window while managing aspect ratios
    draw(ctx, canvas_width, canvas_height) 
    {
        if (!this.image.complete) return;
        const coords = this.background_px_to_scene_px( canvas_width, canvas_height)

        ctx.drawImage(this.image, x, y, coords.x, coords.y);
    }

    background_px_to_scene_px( canvas_width, canvas_height )
    {
        const img_aspect = this.image.width / this.image.height;
        const canvas_aspect = canvas_width / canvas_height;

        let draw_width, draw_height;

        // Shrink horizontally or vertically depending on aspect ratio difference
        if (canvas_aspect > img_aspect)
        {
            draw_width = canvas_width;
            draw_height = canvas_width / img_aspect;
        }
        else
        {
            draw_height = canvas_height;
            draw_width = canvas_height * img_aspect;
        }

        let pos;

        pos.x = (canvas_width - draw_width) / 2;
        pos.y = (canvas_height - draw_height) / 2;

        return pos;
    }
}