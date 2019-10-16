;(function () {
    'use strict'

    class Loader {
        constructor () {
            this.loadOrder = {
                images: [],
                jsons: []
            }

            this.resources = {
                images: [],
                jsons: []
            }
        }

        addImage (name, src) {
            this.loadOrder.images.push({ name, src })
        }

        addJson (name, address) {
            this.loadOrder.jsons.push({ name, address })
        }

        load (callback) {
            const promises = []

            for (const imageData of this.loadOrder.images) {
                const { name, src } = imageData

                const promise = Loader
                    .loadImage(src)
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