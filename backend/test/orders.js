const Orders = artifacts.require("MockedOrders");

contract('Orders', (accounts) => {

    before(async () => {

        const instance = await Orders.deployed();

        let date = new Date();
        let mockDate = Math.round(date.getTime() / 1000);

        instance.mockTimestamp(mockDate);
    });

    describe('Add', () => {

        const orderId = '100';
        const totalPrice = web3.utils.toWei('2.5', 'ether');

        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        const deliveryDate = Math.round(date.getTime() / 1000);

        it('1. The order should not be added as the sender is not authorized', () => {
            return Orders.deployed().then((instance) => {
                return instance.add(orderId, totalPrice, deliveryDate, { from: accounts[1] });
            }).then(assert.fail).catch((error) => {
                assert(error.message.indexOf("The sender isn't authorized") >= 0);
            });
        });

        it('2. The order should be added', async () => {

            const instance = await Orders.deployed();

            await instance.add(orderId, totalPrice, deliveryDate);

            let order = await instance.get(orderId);

            assert.equal(order.status, 0, "Order status doesn't match Created");
        });
    });

    describe('Pay', () => {

        const orderId = '200';
        const totalPrice = web3.utils.toWei('2.5', 'ether');

        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        const deliveryDate = Math.round(date.getTime() / 1000);

        it('3. Should not be paid as there is no the order', () => {
            return Orders.deployed().then((instance) => {
                return instance.pay(orderId, { value: 200 });
            }).then(assert.fail).catch((error) => {
                assert(error.message.indexOf("Order isn't found") >= 0);
            });
        });

        it('4. Should not be pay as the order price does not match the value of the transaction', () => {
            return Orders.deployed().then(async (instance) => {

                await instance.add(orderId, totalPrice, deliveryDate, { from: accounts[0] });

                return instance.pay(orderId, { value: 200 });
            }).then(assert.fail).catch((error) => {
                assert(error.message.indexOf("The order price doesn't match the value of the transaction") >= 0);
            });
        });

        it('5. Should be paid', () => {
            return Orders.deployed().then((instance) => {
                return instance.pay(orderId, { value: totalPrice, from: accounts[1] });
            }).then((tx) => {
                assert.equal(tx.logs[0].event, 'OrderPaid', "Event name doesn't match OrderPaid");
            });
        });

        it('6. Should not be paid again as the order has been paid', () => {
            return Orders.deployed().then((instance) => {
                return instance.pay(orderId, { value: totalPrice, from: accounts[1] });
            }).then(assert.fail).catch((error) => {
                assert(error.message.indexOf('The order has been paid') >= 0);
            });
        });
    });

    describe('Deliver', () => {

        const orderId = '300';
        const totalPrice = web3.utils.toWei('2.5', 'ether');

        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        const deliveryDate = Math.round(date.getTime() / 1000);

        it('7. Should not be delivered as there is no the order', () => {
            return Orders.deployed().then((instance) => {
                return instance.deliver(orderId);
            }).then(assert.fail).catch((error) => {
                assert(error.message.indexOf("Order isn't found") >= 0);
            });
        });

        it('8. Should be delivered', async () => {
            return Orders.deployed().then(async (instance) => {

                await instance.add(orderId, totalPrice, deliveryDate, { from: accounts[0] });

                return instance.deliver(orderId);
            }).then((response) => {
                assert.equal(response.logs[0].event, 'OrderDelivered', "Event name doesn't match OrderDelivered");
            });
        });

        it('9. Should not be delivered again as the order has been delivered', () => {
            return Orders.deployed().then((instance) => {
                return instance.deliver(orderId);
            }).then(assert.fail).catch((error) => {
                assert(error.message.indexOf('The order has been delivered') >= 0);
            });
        });
    });

    describe('Refund', () => {

        const orderId = '400';
        const totalPrice = web3.utils.toWei('1', 'ether');

        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        const deliveryDate = Math.round(date.getTime() / 1000);

        it('10. Should not be refunded as there is no the order', () => {
            return Orders.deployed().then((instance) => {
                return instance.deliver(orderId);
            }).then(assert.fail).catch((error) => {
                assert(error.message.indexOf("Order isn't found") >= 0);
            });
        });

        it('11. Should not be refunded as the order has not been paid', () => {
            return Orders.deployed().then(async (instance) => {

                await instance.add(orderId, totalPrice, deliveryDate);

                return instance.refund(orderId, { from: accounts[1] });
            }).then(assert.fail).catch((error) => {
                assert(error.message.indexOf("The order hasn't been paid") >= 0);
            });
        });

        it('12. Should not be refunded as the delivery date is not over yet', () => {
            return Orders.deployed().then(async (instance) => {

                await instance.pay(orderId, { value: totalPrice, from: accounts[1] });

                return instance.refund(orderId, { from: accounts[1] });
            }).then(assert.fail).catch((error) => {
                assert(error.message.indexOf('The delivery date is not over yet') >= 0);
            });
        });

        it('13. Should not be refunded as the order has been delivered', () => {
            return Orders.deployed().then(async (instance) => {

                await instance.deliver(orderId);

                return instance.refund(orderId, { from: accounts[1] });
            }).then(assert.fail).catch((error) => {
                assert(error.message.indexOf('The order has been delivered') >= 0);
            });
        });

        it('14. Should be refunded', async () => {

            const instance = await Orders.deployed();

            const gasPrice = web3.utils.toBN(await web3.eth.getGasPrice());

            let orderId = "500";

            let date = new Date();
            date.setMonth(date.getMonth() + 2);

            let mockDate = Math.round(date.getTime() / 1000);

            await instance.mockTimestamp(mockDate);

            await instance.add(orderId, totalPrice, deliveryDate);

            let firstBalance = await web3.eth.getBalance(accounts[2]);

            let payTx = await instance.pay(orderId, { value: totalPrice, from: accounts[2] });
            let payTxCost = gasPrice.mul(web3.utils.toBN(payTx.receipt.gasUsed));

            let refundTxt = await instance.refund(orderId, { from: accounts[2] });
            let refundTxtCost = gasPrice.mul(web3.utils.toBN(refundTxt.receipt.gasUsed));

            assert.equal(refundTxt.logs[0].event, 'OrderRefunded', "Event name doesn't match OrderRefunded");

            let currentBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[2]));
            currentBalance = currentBalance.add(payTxCost);
            currentBalance = currentBalance.add(refundTxtCost);

            assert.equal(currentBalance.toString(), firstBalance.toString(), "The current account balance doesn't match first balance");

            let order = await instance.get(orderId);

            assert.equal(order.status, 3, "Order status doesn't match Refunded");
        });
    });
});