var abi = require("../../build/contracts/PixelStorage.json").abi;

class PixelStorage {
    constructor(address) {
        var pixelStorage = web3.eth.contract(abi);
        this.contract = pixelStorage.at(address);
        window.contract = this.contract;
    }

    buyPixel(x, y, rgba, value) {
        return new Promise((resolve, reject) => {
            this.contract.buyPixel(x, y, rgba,
                { from: web3.eth.accounts[0], value: value },
                (error, result) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(result);
                    }
                });
        });
    }


    getPixelCount() {
        return new Promise((resolve, reject) => {
            this.contract.pixelCount.call((error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result);
                }
            });
        });
    }

    getPixels() {
        return new Promise((resolve, reject) => {
            this.contract.getPixels((error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result);
                }
            });
        });
    }

    getPixel(x, y) {
        return new Promise((resolve, reject) => {
            this.contract.getPixel(x, y, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result);
                }
            });
        });
    }

}

module.exports = PixelStorage;