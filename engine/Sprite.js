;(function() {
    'use strict';
    class Sprite {
        constructor(texture, args = {}) {
            this.texture = texture//это изображение, которое мы загрузили

            const frame = args.frame || {}
            this.frame = {//фрейм -кусок изображения, который нужно отрисовать
                x: frame.x || 0,
                y: frame.y || 0,
                width: frame.width || texture.width,
                height: frame.height || texture.height
            }
            

            this.x = args.x || 0//координаты нашего изображения
            this.y = args.y || 0

            this.anchorX = args.anchorX || 0
            this.anchorY = args.anchorY || 0
            this.width = args.width || this.frame.width//ширина нашего отрисовываемого изображения
            this.height = args.height || this.frame.height//фрейм - это тот участок изображения, который мы хотим отобразить

            if (args.scale !== undefined) {
                this.setScale(args.scale)
            }
        }

        setScale (value) {
            this.scaleX = value
            this.scaleY = value
        }

        get absoluteX () {
            return this.x - this.anchorX * this.width
        }

        set absoluteX (value) {
            this.x = value + this.anchorX * this.width
            return value
        }
        get absoluteY () {
            return this.y - this.anchorY * this.height
        }

        set absoluteY (value) {
            this.y = value + this.anchorY * this.height
            return value
        }
        get scaleX () {
            return this.width / this.frame.width
        }

        set scaleX (value) {
            this.width = this.frame.width * value
            return value
        }

        get scaleY () {
            return this.height / this.frame.height
        }

        set scaleY (value) {
            this.height = this.frame.height * value
            return value
        }

        draw (canvas, context) {
            context.drawImage(
                this.texture,
                this.frame.x,
                this.frame.y,
                this.frame.width,
                this.frame.height,
                this.absoluteX,
                this.absoluteY,
                this.width,
                this.height
            )
        }
    }

    window.GameEngine = window.GameEngine || {}
    window.GameEngine.Sprite = Sprite
})();