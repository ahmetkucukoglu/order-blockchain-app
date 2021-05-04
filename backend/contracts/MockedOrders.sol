pragma solidity >=0.4.22 <0.7.0;

import "./Orders.sol";

contract MockedOrders is Orders {
    uint256 fakeTimestamp;
    
    function getTime() internal view returns (uint256) {
        return fakeTimestamp;
    }

    function mockTimestamp(uint256 timestamp) public {
        fakeTimestamp = timestamp;
    }
}
