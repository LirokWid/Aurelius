import gsap from 'gsap';

export class Book {
    constructor(src, canvas_manager, background, options = {}) {
        this.canvas = canvas_manager;
        this.ctx = canvas_manager.getContext();
        this.image = new Image();
        this.image.src = src;

        this.background = background;

        this.init_x = options.init_x || 1000;
        this.init_y = options.init_y || 500;
        this.baseZoom = options.baseZoom || 1.1;
        this.hoverZoom = options.hoverZoom || 1.25;

        this.zoom = this.baseZoom;
        this.hovered = false;

        this.offsetY = 0; // GSAP-animated Y offset
        this.fadeAlpha = 0;

        this.draw_width = 0;
        this.draw_height = 0;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;

        this.image.onload = () => {
            this.draw_width = this.image.width;
            this.draw_height = this.image.height;

            this.fadeIn();
            this.startLevitation();
        };

        this.initListeners();
    }

    initListeners() {
        this.canvas.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            if (
                mouseX >= this.x &&
                mouseX <= this.x + this.width &&
                mouseY >= this.y &&
                mouseY <= this.y + this.height
            ) {
                if (!this.hovered) {
                    this.hovered = true;
                    gsap.to(this, { zoom: this.hoverZoom, duration: 0.3, ease: "power2.out" });
                    this.canvas.canvas.style.cursor = 'pointer';
                }
            } else if (this.hovered) {
                this.hovered = false;
                gsap.to(this, { zoom: this.baseZoom, duration: 0.3, ease: "power2.out" });
                this.canvas.canvas.style.cursor = 'default';
            }
        });

        this.canvas.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            if (
                mouseX >= this.x &&
                mouseX <= this.x + this.width &&
                mouseY >= this.y &&
                mouseY <= this.y + this.height
            ) {
                const base = import.meta.env.BASE_URL;
                window.location.href = `${base}gamerules/`;
            }
        });
    }

    updatePosition() {
        const scaleX = this.background.draw_width / this.background.base_width;
        const scaleY = this.background.draw_height / this.background.base_height;

        this.baseX = this.background.x + this.init_x * scaleX;
        this.baseY = this.background.y + this.init_y * scaleY;
    }

    startLevitation() {
        gsap.to(this, {
            offsetY: -10,
            duration: 1.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    }

    fadeIn() {
        gsap.to(this, {
            fadeAlpha: 1,
            duration: 1.5,
            ease: "power2.out"
        });
    }

    draw() {
        if (!this.image.complete) return;

        this.updatePosition();

        const scaledWidth = this.draw_width * this.zoom;
        const scaledHeight = this.draw_height * this.zoom;

        const offsetX = this.baseX - (scaledWidth - this.draw_width) / 2;
        const offsetY = this.baseY - (scaledHeight - this.draw_height) / 2 + this.offsetY;

        this.x = offsetX;
        this.y = offsetY;
        this.width = scaledWidth;
        this.height = scaledHeight;

        this.ctx.save();
        this.ctx.globalAlpha = this.fadeAlpha;
        this.ctx.drawImage(this.image, offsetX, offsetY, scaledWidth, scaledHeight);
        this.ctx.restore();
    }
}