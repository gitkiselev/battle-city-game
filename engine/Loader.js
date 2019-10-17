;(function () {
    'use strict'

    class Loader {
        constructor () {
            // очередь на загрузку - хранит данные, которые должны быть загружены методом load()
            this.loadOrder = {
                images: [],
                jsons: []
            }
            // хранилище ресурсов - хранит ресурсы, загруженные метод load() из очереди загрузки
            this.resources = {
                images: [],
                jsons: []
            }
        }
        // добавляет изображение в очередь на загрузку
        addImage (name, src) {
            this.loadOrder.images.push({ name, src })
        }
        // добавляет json файл в очередь на загрузку
        addJson (name, address) {
            this.loadOrder.jsons.push({ name, address })
        }

        getImage (name) {
            return this.resources.images[name]
        }

        getJson (name) {
            return this.resources.jsons[name]
        }
        // загружает данные из очереди загрузки (loadOrder) и сохраняет их в хранилище ресурсов (resources)
        // после загрузки ресурсов вызываем callback-функцию переданную в качестве аргумента
        load (callback) {
            const promises = []
            // обрабатываем все изображения из очереди загрузки
            for (const imageData of this.loadOrder.images) {
                // деструктуризация объекта - чтобы не обращаться к свойствам объекта, сразу их вытаскиваем в переменные
                const { name, src } = imageData   // свойства name, src текущего изображения записываем в соответствующие переменные
                // в текущий промис записываем результат выполнения метода загрузки изображения (return new Promise())
                // then - подписываем на результат выполнения данного промиса и выполняем callback-функцию
                const promise = Loader
                    .loadImage(src)  // загружаем текущее изображение из указанного пути
                    // выполняем callback-функцию после успешной загрузки изображения и подписываемся на resolve()
                    .then(image => {
                        this.resources.images[name] = image
                        
                        if (this.loadOrder.images.includes(imageData)) {
                            const index = this.loadOrder.images.indexOf(imageData)
                            this.loadOrder.images.splice(index, 1)
                        }
                    })

                promises.push(promise)
            }

            for (const jsonData of this.loadOrder.jsons) {
                const { name, address } = jsonData

                const promise = Loader
                    .loadJson(address)
                    .then(json => {
                        this.resources.jsons[name] = json
                        
                        if (this.loadOrder.jsons.includes(jsonData)) {
                            const index = this.loadOrder.jsons.indexOf(jsonData)
                            this.loadOrder.jsons.splice(index, 1)
                        }
                    })

                promises.push(promise)
            }

            Promise.all(promises).then(callback)
        }

        static loadImage (src) {
            return new Promise((resolve, reject) => {
                try {
                    const image = new Image
                    image.onload = () => resolve(image)
                    image.src = src
                }

                catch (err) {
                    reject(err)
                }
            })
        }

        static loadJson (address) {
            return new Promise((resolve, reject) => {
                fetch(address)
                    .then(result => result.json())
                    .then(result => resolve(result))
                    .catch(err => reject(err))
            })
        }
    }

    window.GameEngine = window.GameEngine || {}
    window.GameEngine.Loader = Loader

})();