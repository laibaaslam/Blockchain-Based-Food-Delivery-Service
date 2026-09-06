
// const ShoppingCart = artifacts.require("ShoppingCart");

// contract("ShoppingCart", function (accounts) {
//     let shoppingCartInstance;
//     const seller = accounts[1];
//     const transitAccount = accounts[2];

//     before(async function () {
//         shoppingCartInstance = await ShoppingCart.new(seller, transitAccount);
//     });

//     it("should add an item to the user's cart", async function () {
//         const itemName = "Biryani";
//         const itemPrice = 100;
//         // const quantity = 1;
//         await shoppingCartInstance.addItem(itemName, itemPrice, { from: accounts[0] });
//         await shoppingCartInstance.addItem(itemName, itemPrice, { from: accounts[0] });
//         const itemCount = await shoppingCartInstance.getCartItemCount({ from: accounts[0] });
//         assert.equal(itemCount, 1, "Item count should be 1");

//         const item = await shoppingCartInstance.getCartItem(0, { from: accounts[0] });
//         assert.equal(item[0], itemName, "Item name should match");
//         assert.equal(item[1], itemPrice, "Item price should match");
//         // assert.equal(item[2], quantity, "Item quantity should match");
//         // assert.equal(item[3], false, "Item checkout should match");
//     });

//     it("should return the user's cart items", async function () {
//         const userCartItems = await shoppingCartInstance.getUserCartItems({ from: accounts[0] });
//         assert.equal(userCartItems.length, 1, "User cart items length should be 1");

//         const item = userCartItems[0];
//         assert.equal(item.name, "Biryani", "Item name should match");
//         assert.equal(item.price, 100, "Item price should match");
//         assert.equal(item.quantity, 2, "Item quantity should be 1");
//         assert.equal(item.checkedOut, false, "Item checkedOut should be false");
//     });

//     it("should checkout and transfer total amount to the transit's account", async function () {
//         const itemPrice = 100;

//         // Add an item to the user's cart
//         await shoppingCartInstance.addItem("Burger", itemPrice, { from: accounts[0] });

//         // Get the initial balance of the seller's account
//         const initialTransitBalance = await web3.eth.getBalance(transitAccount);

//         // Checkout
//         await shoppingCartInstance.checkout({ from: accounts[0] });

//         // Get the final balance of the seller's account after checkout
//         const finalTransitBalance = await web3.eth.getBalance(transitAccount);

//         // Calculate the expected final balance of the seller's account
//         const expectedFinalTransitBalance = web3.utils.toBN(initialTransitBalance).add(web3.utils.toBN(itemPrice));

//         // Assert that the final balance matches the expected final balance
//         assert.equal(finalTransitBalance.toString(), expectedFinalTransitBalance.toString(), "Total amount not transferred to transit");
//     });
// });
// const ShoppingCart = artifacts.require("ShoppingCart");

// contract("ShoppingCart", function (accounts) {
//     let shoppingCartInstance;

//     before(async function () {
//         shoppingCartInstance = await ShoppingCart.deployed();
//     });

//     it("should add an item to the cart", async function () {
//         const itemName = "Item 1";
//         const itemPrice = 100;

//         await shoppingCartInstance.addItem(itemName, itemPrice, { from: accounts[0] });

//         const itemCount = await shoppingCartInstance.getCartItemCount({ from: accounts[0] });
//         assert.equal(itemCount, 1, "Item count should be 1 after adding an item");
//     });

//     it("should mark all items as checked out after checkout", async function () {
//         const transitAccount = accounts[1];
//         const initialBalance = await web3.eth.getBalance(transitAccount);
//         console.log("Initial Balance:", initialBalance.toString());
//         await shoppingCartInstance.checkout(transitAccount, { from: accounts[0], value: 1 });

//         // const itemCount = await shoppingCartInstance.getCartItemCount({ from: accounts[0] });
//         // assert.equal(itemCount, 0, "Item count should be 0 after checkout");

//         const finalBalance = await web3.eth.getBalance(transitAccount);
//         console.log("Final Balance:", finalBalance.toString()); // Log final balance
//         assert.isAbove(finalBalance.toString(), initialBalance.toString(), "Transit account balance should increase after checkout");
//     });
// });
const ShoppingCart = artifacts.require("ShoppingCart");

contract("ShoppingCart", accounts => {
    let shoppingCartInstance;

    before(async () => {
        shoppingCartInstance = await ShoppingCart.deployed();
    });

    it("should add an item to the cart", async () => {
        const itemName = "Burger";
        const itemPrice = 100;

        await shoppingCartInstance.addItem(itemName, itemPrice, { from: accounts[0] });

        const itemCount = await shoppingCartInstance.getCartItemCount({ from: accounts[0] });
        assert.equal(itemCount, 1, "Item count should be 1");
    });



    it("should mark all items as checked out after checkout", async () => {
        const itemName = "Burger";
        const itemPrice = 1;
        const transitAccount = accounts[1];

        await shoppingCartInstance.addItem(itemName, itemPrice, { from: accounts[0] });
        const initialUserBalance = await web3.eth.getBalance(accounts[0]);
        const initialTransitBalance = await web3.eth.getBalance(transitAccount);
        console.log("Initial User Balance:", initialUserBalance.toString());
        console.log("Initial Transit Balance:", initialTransitBalance.toString());
        await shoppingCartInstance.checkout(transitAccount, { from: accounts[0], value: itemPrice });
        const finalUserBalance = await web3.eth.getBalance(accounts[0]);
        const finalTransitBalance = await web3.eth.getBalance(transitAccount);
        console.log("Final User Balance:", finalUserBalance.toString()); // Log final balance
        console.log("Final Transit Balance:", finalTransitBalance.toString()); // Log final balance
        // Assert seller received funds
        const userItems = await shoppingCartInstance.getUserCartItems({ from: accounts[0] });
        const checkedOutItems = userItems[3]; // Assuming checkedOut items is the fourth array returned

        // Assert all items are checked out
        for (let i = 0; i < checkedOutItems.length; i++) {
            assert.equal(checkedOutItems[i], true, "All items should be checked out");
        }
    });

    it("should receive order and fulfill it", async () => {
        const sellerAccount = accounts[2];
        const buyerAccount = accounts[0];
        const transitAccount = accounts[1];
        const orderAmount = 1;

        const initialSellerBalance = await web3.eth.getBalance(sellerAccount);
        const initialTransitBalance = await web3.eth.getBalance(transitAccount);
        console.log("Initial Seller Balance:", initialSellerBalance.toString());
        console.log("Initial Transit Balance:", initialTransitBalance.toString());
        await shoppingCartInstance.receiveOrder(sellerAccount, { from: transitAccount, value: orderAmount });

        const finalSellerBalance = await web3.eth.getBalance(sellerAccount);
        const finalTransitBalance = await web3.eth.getBalance(transitAccount);
        console.log("Final Seller Balance:", finalSellerBalance.toString()); // Log final balance
        console.log("Final Transit Balance:", finalTransitBalance.toString()); // Log final balance
        // Assert seller received funds
        assert.equal(finalSellerBalance > initialSellerBalance, true, "Seller should receive funds");

        // Assert transit balance decreased
        assert.equal(finalTransitBalance < initialTransitBalance, true, "Transit balance should decrease");

        await shoppingCartInstance.removeAllItems({ from: buyerAccount });

        const itemCount = await shoppingCartInstance.getCartItemCount({ from: accounts[0] });
        assert.equal(itemCount, 0, "Item count should be 0 after removal");

    });


    it("should cancel the order and transfer funds back to the buyer", async function () {

        const sellerAccount = accounts[2];
        const buyerAccount = accounts[0];
        const transitAccount = accounts[1];
        const orderAmount = 1;

        const initialBuyerBalance = await web3.eth.getBalance(buyerAccount);
        const initialTransitBalance = await web3.eth.getBalance(transitAccount);
        const initialSellerBalance = await web3.eth.getBalance(sellerAccount);
        // Add an item to the cart
        await shoppingCartInstance.addItem("Burger", 100, { from: buyerAccount });
        console.log("Initial Seller Balance:", initialSellerBalance.toString());
        console.log("Initial Transit Balance:", initialTransitBalance.toString());
        console.log("Initial Buyer Balance:", initialBuyerBalance.toString());
        // Checkout
        await shoppingCartInstance.checkout(transitAccount, { from: buyerAccount, value: orderAmount });


        const AfterCheckoutBuyerBalance = await web3.eth.getBalance(buyerAccount);
        const AfterCheckoutTransitBalance = await web3.eth.getBalance(transitAccount);
        const AfterCheckoutSellerBalance = await web3.eth.getBalance(sellerAccount);

        assert.equal(AfterCheckoutTransitBalance > initialTransitBalance, true, " Transit Balance should be higher after checkout");
        assert.equal(AfterCheckoutBuyerBalance < initialBuyerBalance, true, "Buyer Balance should be less after checkout");

        console.log("After Checkout Seller Balance:", AfterCheckoutSellerBalance.toString());
        console.log("After Checkout Transit Balance:", AfterCheckoutTransitBalance.toString());
        console.log("After Checkout Buyer Balance:", AfterCheckoutBuyerBalance.toString());
        // Checkout

        // Cancel the order
        await shoppingCartInstance.CancelOrder(buyerAccount, { from: transitAccount, value: orderAmount });

        const AfterCancelBuyerBalance = await web3.eth.getBalance(buyerAccount);
        const AfterCancelTransitBalance = await web3.eth.getBalance(transitAccount);
        const AfterCancelSellerBalance = await web3.eth.getBalance(sellerAccount);

        console.log("After Cancel Seller Balance:", AfterCancelSellerBalance.toString());
        console.log("After Cancel Transit Balance:", AfterCancelTransitBalance.toString());
        console.log("After Cancel Buyer Balance:", AfterCancelBuyerBalance.toString());


        // Check if the funds have been transferred back to the buyer

        assert.equal(AfterCancelBuyerBalance > AfterCheckoutBuyerBalance, true, "Buyer Balance should be higher after cancellation");
        assert.equal(AfterCancelTransitBalance < AfterCheckoutTransitBalance, true, "Transit Balance should be less after cancellation");
    });
});
