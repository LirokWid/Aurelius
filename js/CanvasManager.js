export class CanvasManager
{
    constructor(canvasId)
    {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize()
    {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    clear()
    {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawImage(image, x, y, width, height) {
        this.ctx.drawImage(image, x, y, width, height);
    }

    createRadialGradient(...args) {
        return this.ctx.createRadialGradient(...args);
    }

    getContext()
    {
        return this.ctx;
    }

    update_positions()
    {

    }
}