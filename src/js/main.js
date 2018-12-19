var panzoom = require("pan-zoom");
var App = require("./app");

window.onload = async (e) => {

    var c = document.getElementById("canvas");
    var app = new App(c);
    window.app = app;

    // enable panning the pixel-grid
    panzoom(c, e => {
        app.offset.x += e.dx;
        app.offset.y += e.dy;
        app.draw()
    });

    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            console.log("waiting for unlock");
            await ethereum.enable();
            console.log("unlocked!")

            app.setPixelStorage("0x004e702aa7e3850f7da045f65da3218059b09381");
            //app.setPixelStorage("0x2599a71F7136Ac749866dd6d7203d18e9540FDb7");
            document.getElementById("addressInfo").innerHTML = "Hello " + web3.eth.accounts[0];

        } catch (error) {
            // User denied account access...
            console.log("error:", error)
        }
    }
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        console.log("Old browser")
    }
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    // initial draw
    app.getPixels();
    app.draw();

}
