
const LoginwithMetaMask = async () => {
  console.log('Login trying'); // Log success message
  // Request account access from MetaMask
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  document.getElementById("loginButton").innerText = accounts[11];
  console.log(accounts); // Log success message
  alert('Login successful'); // Show success message
};

App = {

  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load food.
    $.getJSON('../food.json', function (data) {
      var foodRow = $('#foodsRow');
      var foodTemplate = $('#foodTemplate');

      for (i = 0; i < data.length; i++) {
        foodTemplate.find('.panel-title').text(data[i].name);
        foodTemplate.find('img').attr('src', data[i].picture);
        foodTemplate.find('.food-name').text(data[i].name);
        foodTemplate.find('.food-price').text(data[i].price);
        foodTemplate.find('.btn-add').attr('data-id', data[i].id);
        foodRow.append(foodTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      document.getElementById("loginButton").addEventListener('click', LoginwithMetaMask);
      // Request account access
      // await window.ethereum.enable();

    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },
  initContract: function () {
    // console.log("cdinc");
    $.getJSON('ShoppingCart.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var ShoppingCartArtifact = data;
      App.contracts.ShoppingCart = TruffleContract(ShoppingCartArtifact);

      // Set the provider for our contract
      App.contracts.ShoppingCart.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.displayCart();
    });
    return App.bindEvents();
  },
  // handleAddToCart: async function (event) {


  //   if (event.target.classList.contains('btn-add')) {
  //     const foodItemContainer = event.target.closest('.panel-food');
  //     const foodNameElement = foodItemContainer.querySelector('.food-name');
  //     const foodPriceElement = foodItemContainer.querySelector('.food-price');

  //     const foodName = foodNameElement.textContent;
  //     const foodPrice = parseInt(foodPriceElement.textContent.split(" ").slice(-1)[0]);


  //     try {

  //       const accounts = await web3.eth.getAccounts();
  //       console.log("idie");
  //       const account = accounts[0];

  //       console.log(account);
  //       const cartInstance = await App.contracts.ShoppingCart.deployed();
  //       console.log(cartInstance);
  //       // Add the item to the user's list (cart)

  //       await cartInstance.addItem(foodName, foodPrice, { from: account });

  //       // Update the cart page to display the user's cart
  //       await App.displayCart();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   } else {
  //     console.log("errr");
  //   }
  // },

  handleAdd: function (event) {
    console.log('called')
    // Check if the clicked element is a "Add to Cart" button
    if (event.target.classList.contains('btn-add')) {
      // Get the container element of the clicked button
      const foodItemContainer = event.target.closest('.panel-food');

      // Find the food name and price elements within the container
      const foodNameElement = foodItemContainer.querySelector('.food-name');
      const foodPriceElement = foodItemContainer.querySelector('.food-price');

      // Get the food name and price values
      const foodName = foodNameElement.textContent;
      const foodPrice = parseInt(foodPriceElement.textContent.split(" ").slice(-1)[0]);

      // Now you can use the food name and price values as needed (e.g., add to cart)
      console.log('Food Name:', foodName);
      console.log('Food Price:', foodPrice);
      var CartInstance;

      web3.eth.getAccounts(function (error, accounts) {
        if (error) {
          console.log(error);
        }

        var account = accounts[0];
        console.log(account)
        App.contracts.ShoppingCart.deployed().then(function (instance) {
          console.log("Calling instance ");
          CartInstance = instance;
          var size = CartInstance.getCartItemCount.call();
          console.log("Calling instance 2 ");
          console.log(size);
          console.log("Calling instance 3 ");
          console.log(CartInstance);
          // Execute adopt as a transaction by sending account
          return CartInstance.addItem(foodName, foodPrice, { from: account });
        }).then(function () {
          console.log("Calling DISPLAY");
          var size = CartInstance.getCartItemCount.call();
          console.log("Calling instance 2 ");
          console.log(size);
          return App.displayCart();
        }).catch(function (err) {
          console.log("Calling error ");
          console.log(err.message);
        });
      });


    }
  }
  ,

  bindEvents: function () {
    console.log('binded');
    $(document).on('click', '.btn-add', App.handleAdd);
  },



  displayCart: function () {
    var CartInstance;
    var size;
    var items;
    console.log("in display cart ");
    web3.eth.getAccounts(function (error, accounts) {
      //     if (error) {
      //       console.log(error);
      //     }
      var account = accounts[0];

      App.contracts.ShoppingCart.deployed().then(function (instance) {
        CartInstance = instance;
        console.log(accounts[0])
        return CartInstance.getCartItemCount.call();
      }).then(function (cartSize) {
        console.log(cartSize);
        size = parseInt(cartSize);
        console.log(size);
        App.contracts.ShoppingCart.deployed().then(function (instance) {
          CartInstance = instance;
          return CartInstance.getUserCartItems({ from: accounts[0] }); // Use getCartItems function instead of cart function
        })
      }).then(function (userCartItems) {
        items = userCartItems;

        var CartRow = $('#CartRow');
        var CartTemplate = $('#CartTemplate');

        for (var i = 0; i < size; i++) {
          var itemDetails = items[i];
          var itemName = itemDetails[0];
          var itemPrice = itemDetails[1];

          CartTemplate.find('.panel-title').text(itemName);
          CartTemplate.find('.food-name').text(itemName);
          CartTemplate.find('.food-price').text(itemPrice);
          CartRow.append(CartTemplate.html()); // Use CartTemplate instead of foodTemplate
        }
      }).catch(function (err) {
        console.log('errrrrrr');
        console.log(err);
        console.log(err.message);
      });
    })



    // displayCart: function () {
    //   var CartInstance;
    //   var size;
    //   var items;

    //   App.contracts.ShoppingCart.deployed().then(function (instance) {
    //     CartInstance = instance;
    //     return CartInstance.getCartItemCount.call();
    //   }).then(function (cartSize) {
    //     size = parseInt(cartSize);
    //     return CartInstance.cart('0x3553aA88d38F21174e606dF951fE57c43A54561b');
    //   }).then(function (cartItems) {
    //     items = cartItems;

    //     var CartRow = $('#CartRow');
    //     var CartTemplate = $('#CartTemplate');

    //     for (var i = 0; i < size; i++) {
    //       // Assuming cartItems is an array of item IDs, retrieve item details from your contract
    //       // You may need to modify this part based on how your contract stores item details
    //       // For example:
    //       var itemDetails = items[i];
    //       // var itemDetails = CartInstance.items(itemId);
    //       var itemName = itemDetails[0];
    //       var itemPrice = itemDetails[1];

    //       CartTemplate.find('.panel-title').text(itemName);
    //       CartTemplate.find('.food-name').text(itemName);
    //       CartTemplate.find('.food-price').text(itemPrice);
    //       CartRow.append(foodTemplate.html());
    //     }
    //   }).catch(function (err) {
    //     console.log("err.message");
    //     console.log(err.message);
    //   });
    // }

    // markAdopted: function () {
    //   var adoptionInstance;

    //   App.contracts.Adoption.deployed().then(function (instance) {
    //     adoptionInstance = instance;

    //     return adoptionInstance.getAdopters.call();
    //   }).then(function (adopters) {
    //     for (i = 0; i < adopters.length; i++) {
    //       if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
    //         $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
    //       }
    //     }
    //   }).catch(function (err) {
    //     console.log(err.message);
    //   });

    // },




    // handleAdopt: function (event) {
    //   event.preventDefault();

    //   var petId = parseInt($(event.target).data('id'));

    //   var adoptionInstance;

    //   web3.eth.getAccounts(function (error, accounts) {
    //     if (error) {
    //       console.log(error);
    //     }

    //     var account = accounts[0];

    //     App.contracts.Adoption.deployed().then(function (instance) {
    //       adoptionInstance = instance;

    //       // Execute adopt as a transaction by sending account
    //       return adoptionInstance.adopt(petId, { from: account });
    //     }).then(function (result) {
    //       return App.markAdopted();
    //     }).catch(function (err) {
    //       console.log(err.message);
    //     });
    //   });


    // }
  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
