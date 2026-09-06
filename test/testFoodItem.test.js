const FoodItems = artifacts.require("FoodItems");

contract("FoodItems", function (accounts) {
    let foodItemsInstance;
    const admin = accounts[0];

    before(async function () {
        foodItemsInstance = await FoodItems.new({ from: admin });
    });

    it("should add a food item", async function () {
        const itemName = "Pizza";
        const itemPrice = 200;
        const itemName2 = "Burger";
        const itemPrice2 = 200;
        await foodItemsInstance.addFoodItem(itemName, itemPrice, { from: admin });
        await foodItemsInstance.addFoodItem(itemName2, itemPrice2, { from: admin });


        const Items = await foodItemsInstance.getAllFoodItems();

        const names = Items[0]; // Assuming checkedOut items is the fourth array returned
        const prices = Items[1];
        assert.equal(names.length, 2, "Number of food items should be 2");
        assert.equal(prices.length, 2, "Number of food items should be 2");
        // Assert all items are checked out

        assert.equal(names[0], itemName, "Item name should match");
        assert.equal(prices[0], itemPrice, "Item price should match");





        assert.equal(names[1], itemName2, "Item name should match");
        assert.equal(prices[1], itemPrice2, "Item price should match");
        // const foodItems = await foodItemsInstance.getAllFoodItems();
        // const addedItem = foodItems[0];

        // assert.equal(addedItem.name, itemName, "Item name should match");
        // assert.equal(addedItem.price, itemPrice, "Item price should match");
    });

    it("should return all food items", async function () {
        const Items = await foodItemsInstance.getAllFoodItems();

        const names = Items[0]; // Assuming checkedOut items is the fourth array returned
        const prices = Items[1];
        assert.equal(names.length, 2, "Number of food items should be 2");
        assert.equal(prices.length, 2, "Number of food items should be 2");
    });
});
