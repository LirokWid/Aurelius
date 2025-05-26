import gsap from 'gsap';

//let menu_path = "src/chronicon/chronicon.html"
//let menu_path = "src/codex/codex hermetica.html"
//let menu_path = "src/fragment/fragment aurelius 232.html"
//let menu_path = "src/page1/index.html"; // Default path, can be changed later
//let menu_path = "src/page2/index.html"; // Default path, can be changed later

let menu_path = "src/gamerules/index.html"; // Default path, can be changed later

export class Book
{
    constructor(src, canvas_manager, background, options = {})
    {
        this.canvas = canvas_manager;
        this.ctx = canvas_manager.getContext();
        this.image = new Image();
        this.image.src = src;
        this.background = background;

        this.init_x = options.init_x || 1000;
        this.init_y = options.init_y || 500;

        this.baseZoomRatio = options.baseZoom;
        this.hoverZoomRatio = options.hoverZoom;

        this.baseZoom = this.background.zoom * this.baseZoomRatio;
        this.hoverZoom = this.background.zoom * this.hoverZoomRatio;
        this.zoom = this.baseZoom;

        this.hovered = false;
        this.levitationHeight = options.levitationHeight || 10;

        this.offsetY = 0; // GSAP-animated Y offset
        this.fadeAlpha = 0;
        this.hovered = false;

        this.draw_width = 0;
        this.draw_height = 0;

        this.baseX = 0;
        this.baseY = 0;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;

        this.image.onload = () =>
        {
            this.draw_width = this.image.width;
            this.draw_height = this.image.height;
            this.updatePosition();
        };

        this.initListeners();
    }

    updateZoomFromBackground()
    {
        this.baseZoom = this.background.zoom * this.baseZoomRatio;
        this.hoverZoom = this.background.zoom * this.hoverZoomRatio;

        // Reset zoom if not hovered
        if (!this.hovered)
        {
            this.zoom = this.baseZoom;
        }
    }

    initListeners() {
        this.canvas.canvas.addEventListener('mousemove', (e) =>
        {
            const { isInside } = this.getMouseEventInsideBounds(e);

            if (isInside && !this.hovered)
            {
                this.hovered = true;
                gsap.to(this, { zoom: this.hoverZoom, duration: 0.3, ease: "power2.out" });
                this.canvas.canvas.style.cursor = 'pointer';
            } else if (!isInside && this.hovered)
            {
                this.hovered = false;
                gsap.to(this, { zoom: this.baseZoom, duration: 0.3, ease: "power2.out" });
                this.canvas.canvas.style.cursor = 'default';
            }
        });

        this.canvas.canvas.addEventListener('click', (e) =>
        {
            const { isInside } = this.getMouseEventInsideBounds(e);

            if (isInside)
            {
                const base = import.meta.env.BASE_URL;
                window.location.href = base + menu_path;
            }
        });
    }

    getMouseEventInsideBounds(e) {
        const rect = this.canvas.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const isInside =
            mouseX >= this.x && mouseX <= this.x + this.width &&
            mouseY >= this.y && mouseY <= this.y + this.height;

        return { isInside, mouseX, mouseY };
    }

    updatePosition() {
        const scaleX = this.background.draw_width / this.background.base_width;
        const scaleY = this.background.draw_height / this.background.base_height;

        this.baseX = this.background.x + this.init_x * scaleX;
        this.baseY = this.background.y + this.init_y * scaleY;
    }

    update()
    {
        this.updatePosition();
    }
    draw(alpha = 1)
    {
        if (!this.image.complete) return;

        const scaledWidth = this.draw_width * this.zoom;
        const scaledHeight = this.draw_height * this.zoom;

        // CENTER the image at baseX/baseY
        const offsetX = this.baseX - scaledWidth / 2;
        const offsetY = this.baseY - scaledHeight / 2 + this.offsetY;

        this.x = offsetX;
        this.y = offsetY;
        this.width = scaledWidth;
        this.height = scaledHeight;

        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.drawImage(this.image, offsetX, offsetY, scaledWidth, scaledHeight);
        this.ctx.restore();
    }

    startLevitation()
    {
        gsap.to(this,
            {
            offsetY: -this.levitationHeight,
            duration: 1.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    }

    updateBaseZoom(zoom)
    {
        this.baseZoom = zoom;
    }
}