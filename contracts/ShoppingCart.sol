// // SPDX-License-Identifier: MIT
// pragma solidity ^0.5.0;
// pragma experimental ABIEncoderV2; // Enable experimental ABI encoder

// contract ShoppingCart {
//     struct Item {
//         string name;
//         uint price;
//         uint quantity;
//         bool checkedOut; // Default value is false
//     }

//     mapping(address => Item[]) public cart;
//     address payable public transitAccount; // Address of the seller
//     address payable public seller; // Address of the seller
//     uint public rupeesToEthRate = 100; // Assuming 100 rupees = 1 Ether
//     // Function to convert wei to Ether (ETH)
//     function weiToEther(uint _weiAmount) public pure returns (uint) {
//         return _weiAmount / 1 ether; // 1 ether = 10^18 wei
//     }

//     event ItemAdded(
//         address indexed user,
//         string name,
//         uint price,
//         uint quantity
//     );
//     // Declare DebugTotalAmount event for logging
//     event DebugTotalAmount(uint totalAmount);
//     event OrderCancelled(address indexed user, uint indexed orderId);
//     event OrderCheckedOut(
//         address indexed user,
//         address indexed transitAccount,
//         uint totalAmount
//     );

//     // constructor(address payable _seller, address payable _transit) public {
//     //     seller = _seller;
//     //     transitAccount = _transit;
//     // }

//     //   no need to send qty from fromt end just add 1 need price from user
//     function addItem(string memory _name, uint _price) public {
//         bool itemFound = false;

//         for (uint i = 0; i < cart[msg.sender].length; i++) {
//             if (
//                 keccak256(bytes(cart[msg.sender][i].name)) ==
//                 keccak256(bytes(_name))
//             ) {
//                 cart[msg.sender][i].quantity++;
//                 itemFound = true;
//                 break;
//             }
//         }
//         // this status tracks if user adding item and order is new
//         if (!itemFound) {
//             cart[msg.sender].push(Item(_name, _price, 1, false));
//         }
//         //   emit event
//         emit ItemAdded(msg.sender, _name, _price, 1);
//     }

//     //   getting a users cart items
//     function getUserCartItems()
//         public
//         view
//         returns (string[] memory, uint[] memory, uint[] memory, bool[] memory)
//     {
//         Item[] memory items = cart[msg.sender];
//         string[] memory names = new string[](items.length);
//         uint[] memory prices = new uint[](items.length);
//         uint[] memory quantities = new uint[](items.length);
//         bool[] memory checkedOut = new bool[](items.length);

//         for (uint i = 0; i < items.length; i++) {
//             names[i] = items[i].name;
//             prices[i] = items[i].price;
//             quantities[i] = items[i].quantity;
//             checkedOut[i] = items[i].checkedOut;
//         }

//         return (names, prices, quantities, checkedOut);
//     }
//     // Function to get the number of items in the user's cart
//     function getCartItemCount() public view returns (uint256) {
//         return cart[msg.sender].length;
//     }

//     // Function to get a specific item from the user's cart
//     function getCartItem(
//         uint256 _index
//     ) external view returns (string memory, uint256) {
//         require(_index < cart[msg.sender].length, "Index out of bounds");
//         Item memory item = cart[msg.sender][_index];
//         return (item.name, item.price);
//     }

//     function checkout(address payable _transitAccount) public {
//         Item[] storage items = cart[msg.sender];
//         uint totalAmount = 0;

//         // Calculate total cost and update item status
//         for (uint i = 0; i < items.length; i++) {
//             if (!items[i].checkedOut) {
//                 totalAmount += items[i].price * items[i].quantity;
//                 items[i].checkedOut = true; // Mark item as checked out
//             }
//         }
//         // Add a debug log for total amount
//         emit DebugTotalAmount(totalAmount);
//         uint totalAmountInEth = totalAmount / rupeesToEthRate;

//         // Check if the payer's balance is sufficient for the transfer
//         require(
//             msg.sender.balance >= totalAmountInEth,
//             "Insufficient balance for checkout"
//         );

//         // Attempt to transfer the total amount to the seller's account
//         bool sent = _transitAccount.send(totalAmountInEth);
//         require(sent, "Failed to send Ether");

//         // Emit event if transfer is successful
//         emit OrderCheckedOut(msg.sender, _transitAccount, totalAmount);
//     }
// }
// SPDX-License-Identifier: MIT

pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2; // Enable experimental ABI encoder
// Enable experimental ABI encoder

contract ShoppingCart {
    struct Item {
        string name;
        uint price;
        uint quantity;
        bool checkedOut; // Default value is false
    }

    mapping(address => Item[]) public cart;

    uint256 public constant RP_TO_ETH_CONVERSION_RATE = 10 ** 6; // 1 INR = 10^6 wei

    // Function to convert Rupees to Ether
    function rupeesToEther(uint256 _rupeeAmount) public pure returns (uint256) {
        return (_rupeeAmount * RP_TO_ETH_CONVERSION_RATE) / 10 ** 8; // Adjusted for 6 decimal places
    }
    event ItemAdded(
        address indexed user,
        string name,
        uint price,
        uint quantity
    );
    // Declare DebugTotalAmount event for logging
    event DebugTotalAmount(uint totalAmount);
    event OrderCancelled(address indexed user);
    event OrderCheckedOut(
        address indexed user,
        address indexed transitAccount,
        uint256 totalAmountInEth
    );
    event OrderFulfilled(
        address indexed user,
        address indexed seller,
        uint totalAmount,
        uint timestamp
    );

    //   no need to send qty from fromt end just add 1 need price from user
    function addItem(string memory _name, uint _price) public {
        bool itemFound = false;

        for (uint i = 0; i < cart[msg.sender].length; i++) {
            if (
                keccak256(bytes(cart[msg.sender][i].name)) ==
                keccak256(bytes(_name)) &&
                !cart[msg.sender][i].checkedOut
            ) {
                cart[msg.sender][i].quantity++;
                itemFound = true;
                break;
            }
        }
        // this status tracks if user adding item and order is new
        if (!itemFound) {
            cart[msg.sender].push(Item(_name, _price, 1, false));
        }
        //   emit event
        emit ItemAdded(msg.sender, _name, _price, 1);
    }

    //   getting a users cart items
    // function getUserCartItems() public view returns (Item[] memory) {
    //     return cart[msg.sender];
    // }
    // Function to get the number of items in the user's cart
    function getCartItemCount() public view returns (uint256) {
        return cart[msg.sender].length;
    }

    // Function to get a specific item from the user's cart
    function getCartItem(
        uint256 _index
    ) external view returns (string memory, uint256) {
        require(_index < cart[msg.sender].length, "Index out of bounds");
        Item memory item = cart[msg.sender][_index];
        return (item.name, item.price);
    }

    function getUserCartItems()
        public
        view
        returns (string[] memory, uint[] memory, uint[] memory, bool[] memory)
    {
        Item[] memory items = cart[msg.sender];
        string[] memory names = new string[](items.length);
        uint[] memory prices = new uint[](items.length);
        uint[] memory quantities = new uint[](items.length);
        bool[] memory checkedOut = new bool[](items.length);

        for (uint i = 0; i < items.length; i++) {
            names[i] = items[i].name;
            prices[i] = items[i].price;
            quantities[i] = items[i].quantity;
            checkedOut[i] = items[i].checkedOut;
        }

        return (names, prices, quantities, checkedOut);
    }
    // Function to calculate the total cost of items in the cart
    function getTotal() public view returns (uint256) {
        Item[] storage items = cart[msg.sender]; // Get items for the sender's address
        uint totalAmount = 0;

        // Iterate through each item in the cart
        for (uint i = 0; i < items.length; i++) {
            // Check if the item has not been checked out
            if (!items[i].checkedOut) {
                // Add the price of the item multiplied by the quantity to the total amount
                totalAmount += items[i].price * items[i].quantity;
            }
        }

        // Return the total amount
        return totalAmount;
    }

    function markAllItemsCheckedOut() public {
        Item[] storage items = cart[msg.sender];
        for (uint i = 0; i < items.length; i++) {
            items[i].checkedOut = true;
        }
    }

    // Function to remove all items from the user's cart
    function removeAllItems() public {
        delete cart[msg.sender];
    }

    function checkout(address payable _transitAccount) public payable {
        // uint totalAmount = getTotal();

        // // Add a debug log for total amount
        // emit DebugTotalAmount(totalAmount);

        // uint256 totalAmountInEth=rupeesToEther(totalAmount);
        // uCheck if the payer's balance is sufficient for the transfer
        require(
            msg.sender.balance >= msg.value,
            "Insufficient balance for checkout"
        );

        // Attempt to transfer the total amount to the seller's account

        _transitAccount.transfer(msg.value);
        markAllItemsCheckedOut();

        // Emit event if transfer is successful
        emit OrderCheckedOut(msg.sender, _transitAccount, msg.value);
    }

    // Function to receive orders and transfer funds
    function receiveOrder(address payable _seller) public payable {
        require(
            msg.sender.balance >= msg.value,
            "Insufficient balance for checkout"
        );

        // Attempt to transfer the total amount to the seller's account

        _seller.transfer(msg.value);

        // Emit event if transfer is successful
        emit OrderFulfilled(msg.sender, _seller, msg.value, block.timestamp);
    }

    function CancelOrder(address payable buyer) public payable {
        require(
            msg.sender.balance >= msg.value,
            "Insufficient balance for checkout"
        );

        // Attempt to transfer the total amount to the seller's account

        buyer.transfer(msg.value);

        // Emit event if transfer is successful
        emit OrderCancelled(buyer);
    }
}

// contract ShoppingCart {
//     struct Item {
//         string name;
//         uint price;
//         uint quantity;
//         bool checkedOut; // Default value is false
//     }

//     mapping(address => Item[]) public cart;

//     uint256 public constant RP_TO_ETH_CONVERSION_RATE = 10 ** 6; // 1 INR = 10^6 wei

//     // Function to convert Rupees to Ether
//     function rupeesToEther(uint256 _rupeeAmount) public pure returns (uint256) {
//         return (_rupeeAmount * RP_TO_ETH_CONVERSION_RATE) / 10 ** 8; // Adjusted for 6 decimal places
//     }
//     event ItemAdded(
//         address indexed user,
//         string name,
//         uint price,
//         uint quantity
//     );
//     // Declare DebugTotalAmount event for logging
//     event DebugTotalAmount(uint totalAmount);
//     event OrderCancelled(address indexed user, uint indexed orderId);
//     event OrderCheckedOut(
//         address indexed user,
//         address indexed transitAccount,
//         uint256 totalAmountInEth
//     );

//     //   no need to send qty from fromt end just add 1 need price from user
//     function addItem(string memory _name, uint _price) public {
//         bool itemFound = false;

//         for (uint i = 0; i < cart[msg.sender].length; i++) {
//             if (
//                 keccak256(bytes(cart[msg.sender][i].name)) ==
//                 keccak256(bytes(_name)) &&
//                 !cart[msg.sender][i].checkedOut
//             ) {
//                 cart[msg.sender][i].quantity++;
//                 itemFound = true;
//                 break;
//             }
//         }
//         // this status tracks if user adding item and order is new
//         if (!itemFound) {
//             cart[msg.sender].push(Item(_name, _price, 1, false));
//         }
//         //   emit event
//         emit ItemAdded(msg.sender, _name, _price, 1);
//     }

//     //   getting a users cart items
//     // function getUserCartItems() public view returns (Item[] memory) {
//     //     return cart[msg.sender];
//     // }
//     // Function to get the number of items in the user's cart
//     function getCartItemCount() public view returns (uint256) {
//         return cart[msg.sender].length;
//     }

//     // Function to get a specific item from the user's cart
//     function getCartItem(
//         uint256 _index
//     ) external view returns (string memory, uint256) {
//         require(_index < cart[msg.sender].length, "Index out of bounds");
//         Item memory item = cart[msg.sender][_index];
//         return (item.name, item.price);
//     }

//     function getUserCartItems()
//         public
//         view
//         returns (string[] memory, uint[] memory, uint[] memory, bool[] memory)
//     {
//         Item[] memory items = cart[msg.sender];
//         string[] memory names = new string[](items.length);
//         uint[] memory prices = new uint[](items.length);
//         uint[] memory quantities = new uint[](items.length);
//         bool[] memory checkedOut = new bool[](items.length);

//         for (uint i = 0; i < items.length; i++) {
//             names[i] = items[i].name;
//             prices[i] = items[i].price;
//             quantities[i] = items[i].quantity;
//             checkedOut[i] = items[i].checkedOut;
//         }

//         return (names, prices, quantities, checkedOut);
//     }
//     // Function to calculate the total cost of items in the cart
//     function getTotal() public view returns (uint256) {
//         Item[] storage items = cart[msg.sender]; // Get items for the sender's address
//         uint totalAmount = 0;

//         // Iterate through each item in the cart
//         for (uint i = 0; i < items.length; i++) {
//             // Check if the item has not been checked out
//             if (!items[i].checkedOut) {
//                 // Add the price of the item multiplied by the quantity to the total amount
//                 totalAmount += items[i].price * items[i].quantity;
//             }
//         }

//         // Return the total amount
//         return totalAmount;
//     }

//     function markAllItemsCheckedOut() public {
//         Item[] storage items = cart[msg.sender];
//         for (uint i = 0; i < items.length; i++) {
//             items[i].checkedOut = true;
//         }
//     }

//     function checkout(address payable _transitAccount) public payable {
//         // uint totalAmount = getTotal();

//         // // Add a debug log for total amount
//         // emit DebugTotalAmount(totalAmount);

//         // uint256 totalAmountInEth=rupeesToEther(totalAmount);
//         // uCheck if the payer's balance is sufficient for the transfer
//         require(
//             msg.sender.balance >= msg.value,
//             "Insufficient balance for checkout"
//         );

//         // Attempt to transfer the total amount to the seller's account

//         _transitAccount.transfer(msg.value);
//         markAllItemsCheckedOut();

//         // Emit event if transfer is successful
//         emit OrderCheckedOut(msg.sender, _transitAccount, msg.value);
//     }
// }
