var getPixels = require("./util").getPixels;
var unpackBytes = require("./util").unpackBytes;
var packBytes = require("./util").packBytes;
var hex2rgba = require("./util").hex2rgba;
var PixelStorage = require("./PixelStorage");
class App {
    constructor(canvas) {
        this.pixelStorage = null;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.lineWidth = 0.5;
        this.width = canvas.width;
        this.height = canvas.height;
        this.pixelSize = 4;
        //this.pixelCount = (canvas.width / this.pixelSize) * (canvas.width / this.pixelSize);

        // its always square
        this.rows = canvas.width / this.pixelSize;
        this.columns = this.rows;

        //this.pixels = new Uint32Array(this.pixelCount).fill(0);
        //this.pixels = getPixels(this.columns, this.rows);
        this.coordinates = [];
        this.rgba = [];
        this.owners = [];
        this.prices = [];


        this.offset = {
            x: 0,
            y: 0
        };

        this.canvas.addEventListener("click", (e) => this.getPixelSelected(e), false);


        var resetButton = document.getElementById("resetButton");
        var zoomInButton = document.getElementById("zoomInButton");
        var zoomOutButton = document.getElementById("zoomOutButton");
        var getPixelsButton = document.getElementById("getPixelsButton");
        var buyPixelButton = document.getElementById("buyPixelButton");


        var colorInput = document.getElementById("colorInput");
        var xInput = document.getElementById("xInput");
        var yInput = document.getElementById("yInput");
        var priceInput = document.getElementById("priceInput");

        resetButton.addEventListener("click", () => this.reset(), false);
        zoomInButton.addEventListener("click", () => this.zoomIn(), false);
        zoomOutButton.addEventListener("click", () => this.zoomOut(), false);
        getPixelsButton.addEventListener("click", () => this.getPixels(), false);
        buyPixelButton.addEventListener("click", () => this.buyPixel(), false);

    }

    setPixelStorage(address) {
        this.pixelStorage = new PixelStorage(address);
    }



    buyPixel() {

        var x = Number(xInput.value);
        var y = Number(yInput.value);
        var rgba = hex2rgba(colorInput.value);
        var value = Number(web3.toWei(priceInput.value, 'ether'));
        console.log("value", value)

        this.pixelStorage.buyPixel(x, y, rgba, value).then(
            (data) => {
                console.log("data:", data);
            },
            (error) => {
                console.log("error", error);
            }
        )
    }



    getPixels() {
        this.pixelStorage.getPixels().then(
            (data) => {
                if (data == null) {
                    console.log("no data yet");
                    return;
                }

                this.coordinates = [];
                this.rgba = [];
                this.owners = [];
                this.prices = [];

                for (var i = 0; i < data[0].length; i++) {
                    var x = Number(data[0][i]) >> 16;
                    var y = Number(data[0][i]) & 0x1FF;
                    this.coordinates.push([x, y]);

                    var color = data[1][i];
                    this.rgba.push(color);



                    this.owners.push(data[2][i]);
                    this.prices.push(data[3][i]);
                }



                var table = document.getElementById("tableBody");
                var html = "";
                for (var i = 0; i < this.coordinates.length; i++) {

                    var values = unpackBytes(this.rgba[i]);

                    var bgcolor = 'rgba(' + values[0] + ',' + values[1] + ',' + values[2] + ',' + values[3] + ')';
                    html += "<tr>";

                    html += "<td>";
                    html += "(" + this.coordinates[i].join(",") + ")";
                    html += "</td>";
                    html += '<td style=background:' + bgcolor + '>';

                    html += "</td>";
                    html += "<td>";
                    html += "<a href=https://etherscan.io/address/" + this.owners[i] + ">" + this.owners[i] + "</a>";
                    html += "</td>";
                    html += "<td>";
                    html += web3.fromWei(this.prices[i], "ether");
                    html += "</td>";


                    html += "</tr>";
                }
                table.innerHTML = html;
                this.draw();
            },
            function (error) {
                console.log("error", error);
            }
        )
    }

    getPixel(x, y) {

        return this.pixelStorage.getPixel(x, y).then(
            function (data) {
                return data;
                console.log("data:", data);
            },
            function (error) {
                return error;
                console.log("error", error);
            }
        )
    }



    zoomIn() {
        this.pixelSize += 2;

        this.draw()
    }
    zoomOut() {
        this.pixelSize -= 2;

        if (this.pixelSize <= 2) {
            this.pixelSize = 2;
        }
        this.draw()
    }
    reset() {
        this.pixelSize = 4;
        this.offset.x = 0;
        this.offset.y = 0;
        this.draw()
    }

    async getPixelSelected(e) {
        var rect = this.canvas.getBoundingClientRect();

        var offX = rect.left + this.offset.x;
        var offY = rect.top + this.offset.y;

        var pointX = Math.floor((e.clientX - offX) / this.pixelSize);
        var pointY = Math.floor((e.clientY - offY) / this.pixelSize);

        xInput.value = pointX;
        yInput.value = pointY;

        var pixel = await this.getPixel(pointX, pointY);
        if (pixel[1] == 0) {
            priceInput.value = Number(web3.fromWei(web3.toWei(1, "finney"), "ether"));
        } else {
            priceInput.value = Number(web3.fromWei(Number(web3.fromWei(pixel[2], "ether")) + Number(web3.toWei(2, "finney"), "ether")));
            console.log(priceInput.value)
        }
        console.log("Pixel:", pixel)

        // TODO: priceInput

    }

    drawPixels() {

        for (var i = 0; i < this.coordinates.length; i++) {
            var values = unpackBytes(this.rgba[i])
            //console.log("values:", values);

            this.ctx.fillStyle = 'rgba(' + values[0] + ',' + values[1] + ',' + values[2] + ',' + values[3] + ')';

            var x = this.coordinates[i][0];
            var y = this.coordinates[i][1];


            //console.log("drawing " + x + " " + y)
            this.ctx.fillRect(
                this.offset.x + x * this.pixelSize,
                this.offset.y + y * this.pixelSize,
                this.pixelSize,
                this.pixelSize
            );
        }
    }

    drawGrid() {
        this.ctx.font = "20px Arial";
        this.ctx.fillText("0", this.offset.x - 5, this.offset.y - 5);
        this.ctx.fillText("128", this.offset.x + 128 * this.pixelSize, this.offset.y - 5);
        this.ctx.fillText("256", this.offset.x + 256 * this.pixelSize, this.offset.y - 5);
        this.ctx.fillText("368", this.offset.x + 368 * this.pixelSize, this.offset.y - 5);
        this.ctx.fillText("512", this.offset.x + 512 * this.pixelSize, this.offset.y - 5);

        this.ctx.fillText("0", this.offset.x - 25, this.offset.y + 10);
        this.ctx.fillText("128", this.offset.x - 50, this.offset.y + 128 * this.pixelSize);
        this.ctx.fillText("256", this.offset.x - 50, this.offset.y + 256 * this.pixelSize);
        this.ctx.fillText("368", this.offset.x - 50, this.offset.y + 368 * this.pixelSize);
        this.ctx.fillText("512", this.offset.x - 50, this.offset.y + 512 * this.pixelSize);



        for (var i = 0; i < 512 * this.pixelSize; i += this.pixelSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.offset.x + i, this.offset.y);
            this.ctx.lineTo(this.offset.x + i, this.offset.y + 512 * this.pixelSize);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(this.offset.x, this.offset.y + i);
            this.ctx.lineTo(this.offset.x + 512 * this.pixelSize, this.offset.y + i);
            this.ctx.stroke();
        }
    }

    draw() {

        this.ctx.fillStyle = "grey";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "white";
        this.ctx.fillRect(
            this.offset.x,
            this.offset.y,
            this.pixelSize * 512,
            this.pixelSize * 512
        );

        this.ctx.scale(this.scale, this.scale);
        this.ctx.strokeRect(
            this.offset.x,
            this.offset.y,
            this.pixelSize * 512,
            this.pixelSize * 512
        );

        this.drawPixels()
        this.drawGrid();
    }
};

module.exports = App;