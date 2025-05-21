
export class SysHelper
{
    // If called add debug the clicked position to the console
    static debugClickPosition(e, background, canvas)
    {
        const canvasRect = canvas.getBoundingClientRect();
        const clickX = e.clientX - canvasRect.left;
        const clickY = e.clientY - canvasRect.top;

        const scaleX = background.base_width / background.draw_width;
        const scaleY = background.base_height / background.draw_height;

        const init_x = (clickX - background.x) * scaleX;
        const init_y = (clickY - background.y) * scaleY;

        console.log(`bckgrnd x: ${Math.round(init_x)}, bckgrnd y: ${Math.round(init_y)}`);
    }

}