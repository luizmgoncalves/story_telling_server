
var Space = {
    init: function () {
        var self = this;
        this.config = {
            perspective: 3,
            star_color: '255, 255, 255',
            speed: 10,
            stars_count: 10
        };
        this.estrelas = document.getElementById('estrelas');
        this.context = estrelas.getContext('2d');
        this.start();
        window.onresize = function () {
            self.start();
        };
    },

    start: function () {
        var self = this;

        this.estrelas.width = this.estrelas.offsetWidth;
        this.estrelas.height = this.estrelas.offsetHeight;
        this.estrelas_center_x = this.estrelas.width / 2;
        this.estrelas_center_y = this.estrelas.height / 2;

        this.stars_count = this.estrelas.width / this.config.stars_count;
        this.focal_length = this.estrelas.width / this.config.perspective;
        this.speed = this.config.speed * this.estrelas.width / 2000;

        this.stars = [];

        for (i = 0; i < this.stars_count; i++) {
            this.stars.push({
                x: Math.random() * this.estrelas.width,
                y: Math.random() * this.estrelas.height,
                z: Math.random() * this.estrelas.width,
            });
        }

        window.cancelAnimationFrame(this.animation_frame);
        this.estrelas.style.opacity = 1;

        this.cow = new Image();
        this.cow.src = 'https://gallery.yopriceville.com/var/resizes/Free-Clipart-Pictures/Fast-Food-PNG-Clipart/Hamburger_PNG_Vector_Picture.png?m=1507172108';
        this.cow.onload = function () {
            self.render();
        }
    },

    render: function () {
        var self = this;
        this.animation_frame = window.requestAnimationFrame(function () {
            self.render();
        });
        this.context.clearRect(0, 0, this.estrelas.width, this.estrelas.height);
        for (var i = 0, length = this.stars.length; i < length; i += 1) {
            var star = this.stars[i];
            star.z -= this.speed;
            if (star.z <= 0) {
                this.stars[i] = {
                    x: Math.random() * this.estrelas.width,
                    y: Math.random() * this.estrelas.height,
                    z: this.estrelas.width,
                };
            }

            var star_x = (star.x - this.estrelas_center_x) * (this.focal_length / star.z) + this.estrelas_center_x;
            var star_y = (star.y - this.estrelas_center_y) * (this.focal_length / star.z) + this.estrelas_center_y;
            var star_radius = Math.max(0, 1.4 * (this.focal_length / star.z) / 2);
            var star_opacity = 1.2 - star.z / this.estrelas.width;
            var cow_width = Math.max(0.1, 100 * (this.focal_length / star.z) / 2);

            if (star.cow) {
                this.context.save();
                this.context.translate((star_x - cow_width) + (cow_width / 2), (star_y - cow_width) + (cow_width / 2));
                this.context.rotate(star.z / star.rotation_speed);
                this.context.translate(-((star_x - cow_width) + (cow_width / 2)), -((star_y - cow_width) + (cow_width / 2)));
                this.context.globalAlpha = star_opacity;
                this.context.drawImage(this.cow, 0, 0, this.cow.width, this.cow.width, star_x - cow_width, star_y - cow_width, cow_width, cow_width);
                this.context.restore();
            } else {
                this.context.fillStyle = 'rgba(' + this.config.star_color + ',' + star_opacity + ')';
                this.context.beginPath();
                this.context.arc(star_x, star_y, star_radius, 0, Math.PI * 2);
                this.context.fill();
            }
        }
    }
};

window.onload = function () {
    Space.init();
};
