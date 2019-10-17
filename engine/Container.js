;(function() {
    'use strict';

    class Container {
        constructor () {
            this.displayObjects = []//хранилищк картинок
        }
        

         add (displayObject) {//добавление в хранилище
            if (!this.displayObjects.includes(displayObject)) {
                this.displayObjects.push(displayObject)
            }
         }

         remove () {

         }

         draw (canvas, context) {//пройдемся по всем картинкам и отрисуем
            for (const displayObject of this.displayObjects) {
                displayObject.draw(canvas, context)
            }
         }
    }

    window.GameEngine = window.GameEngine || {}
    window.GameEngine.Container = Container
})();