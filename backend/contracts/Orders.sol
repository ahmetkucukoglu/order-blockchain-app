pragma solidity >=0.4.22 <0.7.0;

contract Orders {
    enum Status {Created, Paid, Delivered, Refunded}

    struct Order {
        string id;
        uint256 totalPrice;
        uint256 deliveryDate;
        Status status;
        uint256 createdDate;
        uint256 deliveredDate;
    }

    struct Payment {
        string id;
        address payable buyerAddress;
        uint256 paidDate;
        uint256 refundedDate;
    }

    event OrderPaid(
        string id,
        address paidAddress,
        uint256 paidAmount,
        uint256 date
    );
    event OrderDelivered(string id, uint256 date);
    event OrderRefunded(string id, uint256 date);

    address owner;
    mapping(string => Order) orders;
    mapping(string => Payment) payments;

    modifier onlyOwner {
        require(msg.sender == owner, "The sender isn't authorized");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function add(
        string memory id,
        uint256 totalPrice,
        uint256 deliveryDate
    ) public onlyOwner {
        orders[id] = Order(
            id,
            totalPrice,
            deliveryDate,
            Status.Created,
            getTime(),
            0
        );
    }

    function get(string memory id)
        public
        view
        returns (
            uint8 status,
            uint256 createdDate,
            uint256 deliveryDate,
            uint256 deliveredDate
        )
    {
        Order memory order = orders[id];

        require(order.createdDate > 0, "Order isn't found");

        return (
            uint8(order.status),
            order.createdDate,
            order.deliveryDate,
            order.deliveredDate
        );
    }

    function pay(string memory id) public payable {
        Order storage order = orders[id];

        require(order.createdDate > 0, "Order isn't found");

        Payment storage payment = payments[id];

        require(payment.paidDate == 0, "The order has been paid");

        require(
            msg.value == order.totalPrice,
            "The order price doesn't match the value of the transaction"
        );

        order.status = Status.Paid;

        payments[id] = Payment(id, msg.sender, getTime(), 0);

        emit OrderPaid(id, msg.sender, msg.value, getTime());
    }

    function deliver(string memory id) public onlyOwner {
        Order storage order = orders[id];

        require(order.createdDate > 0, "Order isn't found");

        require(order.deliveredDate == 0, "The order has been delivered");

        order.status = Status.Delivered;
        order.deliveredDate = getTime();

        emit OrderDelivered(id, order.deliveredDate);
    }

    function refund(string memory id) public {
        Order storage order = orders[id];

        require(order.createdDate > 0, "Order isn't found");

        Payment storage payment = payments[id];

        require(payment.paidDate > 0, "The order hasn't been paid");

        require(order.deliveredDate == 0, "The order has been delivered");

        require(payment.refundedDate == 0, "The order has been refunded");

        require(
            payment.buyerAddress == msg.sender,
            "The buyer address doesn't match the address of the transaction"
        );

        require(
            uint256(getTime()) > order.deliveryDate,
            "The delivery date is not over yet"
        );

        payment.buyerAddress.transfer(order.totalPrice);

        order.status = Status.Refunded;

        payment.refundedDate = getTime();

        emit OrderRefunded(id, payment.refundedDate);
    }

    function getTime() internal view returns (uint256) {
        return block.timestamp;
    }
}
