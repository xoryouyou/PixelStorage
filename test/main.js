var PixelStorage = artifacts.require("./PixelStorage.sol");

var assertRevert = async (promise) => {
    try {
        await promise;
        assert.fail();
    } catch (error) {
        assert(error.message.search('revert') >= 0, "Expected revert got fix this...");
    }
};


contract('Pixel Storage', async (accounts) => {

    var [accountOne, accountTwo] = accounts;
    var psInstance = null;

    before(async () => {

        psInstance = await PixelStorage.deployed();
    });

    it("accountOne should be owner of PixelStorage", async () => {
        var result = await psInstance.owner.call();
        assert.equal(result, accountOne, "accountOne should be owner");
    })

    it("No pixels should exist yet", async () => {
        var result = await psInstance.pixelCount.call();
        assert.equal(result, 0, "pixelCount should be 0");
    });

    it("accountOne should NOT be able to buy pixel (1,1) with <1 finney", async () => {
        assertRevert(
            psInstance.buyPixel(1, 1, 255, { from: accountOne, value: web3.toWei(0.5, "finney") })
        );
    });

    it("accountOne should NOT be able to buy pixel (-1,1)", async () => {
        assertRevert(
            psInstance.buyPixel(-1, 1, 255, { from: accountOne, value: web3.toWei(1, "finney") })
        );
    });

    it("accountOne should NOT be able to buy pixel (1000,1)", async () => {
        assertRevert(
            psInstance.buyPixel(512, 1, 255, { from: accountOne, value: web3.toWei(1, "finney") })
        );
    });

    it("accountOne should NOT be able to buy pixel (1,-1)", async () => {
        assertRevert(
            psInstance.buyPixel(1, -1, 255, { from: accountOne, value: web3.toWei(1, "finney") })
        );
    });

    it("accountOne should NOT be able to buy pixel (1,512)", async () => {
        assertRevert(
            psInstance.buyPixel(1, 512, 255, { from: accountOne, value: web3.toWei(1, "finney") })
        );
    });

    it("accountOne should be able to buy pixel (1,1) with 1 finney", async () => {
        await psInstance.buyPixel(1, 1, 255, { from: accountOne, value: web3.toWei(1, "finney") });
        var result = await psInstance.getPixel(1, 1);
        var owner = result[1];
        assert.equal(owner, accountOne, "accountOne does not own pixel");
    });

    it("Pixel (1,1) should have color 255", async () => {
        var result = await psInstance.getPixel(1, 1);
        var color = result[0].toNumber();
        assert.equal(color, 255, "color is not 255");
    });

    it("Pixel (1,1) should have price of 1 finney", async () => {
        var result = await psInstance.getPixel(1, 1);
        var price = result[2];
        assert.equal(price, web3.toWei(1, "finney"), "price is not 1 finney");
    });

    it("accountTwo should NOT be able to buy pixel (1,1) with price + 0.5 finney", async () => {
        assertRevert(
            psInstance.buyPixel(1, 1, 123, { from: accountTwo, value: web3.toWei(1.5, "finney") })
        );
    });

    it("accountTwo should be able to buy pixel (1,1) with price + 1finney", async () => {
        await psInstance.buyPixel(1, 1, 123, { from: accountTwo, value: web3.toWei(2.0, "finney") });
        var result = await psInstance.getPixel(1, 1);
        var owner = result[1];
        assert.equal(owner, accountTwo, "accountTwo does not own pixel");
    });

    it("Pixel (1,1) should have color 123", async () => {
        var result = await psInstance.getPixel(1, 1);
        var color = result[0].toNumber();
        assert.equal(color, 123, "color is not 123");
    });

    it("Contract balance should be 3.0 finney", async () => {
        var result = await psInstance.getBalance();
        assert.equal(result, web3.toWei(3.0, "finney"));
    });


    it("accountTwo should not be able to withdraw", async () => {
        assertRevert(
            psInstance.withdraw({ from: accountTwo })
        );
    });

    it("accountOne should be able to withdraw", async () => {
        var oldBalance = await web3.eth.getBalance(accounts[0]);
        oldBalance = Number(web3.fromWei(oldBalance, "finney"));
        await psInstance.withdraw();
        newBalance = await web3.eth.getBalance(accounts[0]);
        newBalance = Number(web3.fromWei(newBalance, "finney"));

        var diff = newBalance - oldBalance;

        assert.isAtLeast(diff, 0.03, "accountOne should have contract funds now")
    });

    it("Contract balance should be 0.0 finney", async () => {
        var result = await psInstance.getBalance();
        assert.equal(result, web3.toWei(0.0, "finney"));
    });


    it("1 pixels should exist", async () => {
        var result = await psInstance.pixelCount.call();
        assert.equal(result, 1, "pixelCount should be 1");
    });

    it("accountOne should be able to buy pixel (1,2) with 1 finney", async () => {
        await psInstance.buyPixel(1, 2, 100, { from: accountOne, value: web3.toWei(5, "finney") });
        var result = await psInstance.getPixel(1, 2);
        var owner = result[1];
        assert.equal(owner, accountOne, "accountOne does not own pixel");
    });

    it("2 pixels should exist", async () => {
        var result = await psInstance.pixelCount.call();
        assert.equal(result, 2, "pixelCount should be 1");
    });





});