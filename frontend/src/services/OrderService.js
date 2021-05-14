function getErrorMessage(message) {

    let error = ''

    switch (true) {
        case message.indexOf("The sender isn't authorized") >= 0: error = "The sender isn't authorized"; break
        case message.indexOf("Order isn't found") >= 0: error = "Order isn't found"; break
        case message.indexOf("The order has been paid") >= 0: error = "The order has been paid"; break
        case message.indexOf("The order price doesn't match the value of the transaction") >= 0: error = "The order price doesn't match the value of the transaction"; break
        case message.indexOf("The order has been delivered") >= 0: error = "The order has been delivered"; break
        case message.indexOf("The order hasn't been paid") >= 0: error = "The order hasn't been paid"; break
        case message.indexOf("The order has been refunded") >= 0: error = "The order has been refunded"; break
        case message.indexOf("The buyer address doesn't match the address of the transaction") >= 0: error = "The buyer address doesn't match the address of the transaction"; break
        case message.indexOf("The delivery date is not over yet") >= 0: error = "The delivery date is not over yet"; break
        default: break
    }

    return error
}

function getStatusName(status) {

    switch (status) {
        case 0: return 'New'
        case 1: return 'Paid'
        case 2: return 'Delivered'
        case 3: return 'Refunded'
        default: return ''
    }
}

class OrderService {

    constructor(web3, contract, accountAddress) {

        this.web3 = web3
        this.contract = contract
        this.accountAddress = accountAddress
    }

    async add(id, totalPrice, deliveryDate) {

        try {

            let totalPriceValue = this.web3.utils.toWei(String(totalPrice), 'ether')
            let deliveryDateValue = this.web3.utils.toBN(deliveryDate / 1000)

            await this.contract.methods
                .add(String(id), totalPriceValue, deliveryDateValue)
                .send({ from: this.accountAddress })
        }
        catch (exception) {

            var msg = getErrorMessage(exception.message);

            throw msg;
        }
    }

    async pay(id, totalPrice) {

        try {

            let totalPriceValue = this.web3.utils.toWei(String(totalPrice), 'ether')

            await this.contract.methods
                .pay(String(id))
                .send({ from: this.accountAddress, value: totalPriceValue })
        }
        catch (exception) {

            var msg = getErrorMessage(exception.message)

            throw msg
        }
    }

    async deliver(id) {

        try {

            await this.contract.methods
                .deliver(String(id))
                .send({ from: this.accountAddress })
        }
        catch (exception) {

            var msg = getErrorMessage(exception.message)

            throw msg
        }
    }

    async refund(id) {

        try {

            await this.contract.methods
                .refund(String(id))
                .send({ from: this.accountAddress })
        }
        catch (exception) {

            var msg = getErrorMessage(exception.message)

            throw msg
        }
    }

    async get(id) {

        function parseDate(date) {

            if (Number(date) > 0)
                return new Date(Number(date) * 1000).toLocaleString('tr-TR')
            else
                return '-'
        }

        try {

            let order = await this.contract.methods
                .get(String(id))
                .call()

            return {
                status: getStatusName(Number(order.status)),
                createdDate: parseDate(order.createdDate),
                deliveryDate: parseDate(order.deliveryDate),
                deliveredDate: parseDate(order.deliveredDate),
            };
        }
        catch (exception) {

            var msg = getErrorMessage(exception.message)

            throw msg
        }
    }
}

export default OrderService