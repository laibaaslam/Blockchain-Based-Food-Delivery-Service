pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2; // Enable experimental ABI encoder
contract FoodItems {
    address public admin;

    struct FoodItem {
        uint id;
        string name;
        uint price;
    }

    FoodItem[] public foodItems; // Array to store food items
    uint public foodItemCount;

    event FoodItemAdded(
        uint id,
        string name,
        uint price,
        address indexed seller
    );
//    event FoodItemSold(uint id, address indexed buyer, uint price);

    constructor() public {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    function addFoodItem(string memory _name, uint _price) public onlyAdmin {
        foodItemCount++;
        FoodItem memory newItem = FoodItem(foodItemCount, _name, _price);
        foodItems.push(newItem); // Add the new item to the array
        emit FoodItemAdded(foodItemCount, _name, _price, msg.sender);
    }

    // Getting all food items
    // function getAllFoodItems() public view returns (FoodItem[] memory) {
    //     return foodItems;
    // }

    function getAllFoodItems()
        public
        view
        returns (string[] memory, uint[] memory, uint[] memory)
    {
        // Item[] memory items = cart[msg.sender];
        string[] memory names = new string[](foodItems.length);
        uint[] memory prices = new uint[](foodItems.length);
        uint[] memory id = new uint[](foodItems.length);

        for (uint i = 0; i < foodItems.length; i++) {
            names[i] = foodItems[i].name;
            prices[i] = foodItems[i].price;
            id[i] = foodItems[i].id;
        }

        return (names, prices, id);
    }
}

// pragma experimental ABIEncoderV2; // Enable experimental ABI encoder
// contract FoodItems {
//     address public admin;

//     struct FoodItem {
//         uint id;
//         string name;
//         uint price;
//     }

//     FoodItem[] public foodItems; // Array to store food items
//     uint public foodItemCount;

//     event FoodItemAdded(
//         uint id,
//         string name,
//         uint price,
//         address indexed seller
//     );
//     event FoodItemSold(uint id, address indexed buyer, uint price);

//     constructor() public {
//         admin = msg.sender;
//     }

//     modifier onlyAdmin() {
//         require(msg.sender == admin, "Only admin can call this function");
//         _;
//     }

//     function addFoodItem(string memory _name, uint _price) public onlyAdmin {
//         foodItemCount++;
//         FoodItem memory newItem = FoodItem(foodItemCount, _name, _price);
//         foodItems.push(newItem); // Add the new item to the array
//         emit FoodItemAdded(foodItemCount, _name, _price, msg.sender);
//     }

//     // Getting all food items
//     function getAllFoodItems() public view returns (FoodItem[] memory) {
//         return foodItems;
//     }
// }
