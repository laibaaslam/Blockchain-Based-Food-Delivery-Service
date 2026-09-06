# Foodize — Blockchain-Based Food Delivery Service

A decentralized food ordering dApp built as a course project for Blockchain and Cryptocurrency. Customers browse a menu, add items to an on-chain cart, and pay with Ether through MetaMask. Restaurant admins can add new dishes, and users can rate the service on-chain.

The frontend is branded **Foodize** and talks to three Solidity contracts on a local Ethereum network (Ganache).

## Features

- **Menu browsing** — dishes such as Biryani, Pizza, and Burger are shown on the home page
- **MetaMask login** — connect a wallet to place orders
- **On-chain shopping cart** — add items, view quantities, and check out
- **Escrow-style checkout** — payment is sent to a transit account, then released to the seller or refunded on cancel
- **Admin food catalog** — only the contract admin can add new items
- **Service ratings** — users submit a 0–5 rating and the contract stores the average

## Smart contracts

| Contract | File | Role |
| --- | --- | --- |
| `FoodItems` | `contracts/FoodItems.sol` | Admin-managed catalog of food name and price |
| `ShoppingCart` | `contracts/ShoppingCart.sol` | Per-wallet cart, checkout, fulfill, and cancel |
| `ServiceRating` | `contracts/ServiceRating.sol` | Collect ratings and return the average |

Contracts are written for **Solidity 0.5.x** and deployed with Truffle.

## Project structure

```
contracts/          Solidity contracts
migrations/         Truffle deployment scripts
src/                Frontend (HTML, JS, CSS, images)
  index.html        Menu / home
  Addfood.html      Admin add-item page
  cart.html         Cart and checkout
  js/app.js         Web3 + contract UI logic
  food.json         Static menu data
build/contracts/    Compiled ABI artifacts
test/               Truffle tests
```

## Tech stack

- Solidity 0.5, Truffle
- Web3.js and `@truffle/contract`
- Ganache (local blockchain on port `7545`)
- MetaMask
- lite-server and Bootstrap

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Truffle](https://trufflesuite.com/truffle/) (`npm install -g truffle`)
- [Ganache](https://trufflesuite.com/ganache/)
- [MetaMask](https://metamask.io/) browser extension

## Setup

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/Lyba-Aslam/Blockchain-Based-Food-Delivery-Service.git
   cd Blockchain-Based-Food-Delivery-Service
   npm install
   ```

2. Start Ganache and keep the default RPC at `http://127.0.0.1:7545`.

3. Compile and deploy the contracts:

   ```bash
   truffle compile
   truffle migrate --reset
   ```

4. In MetaMask, add a Custom RPC network that matches Ganache (`http://127.0.0.1:7545`) and import a Ganache account using its private key.

5. Start the frontend:

   ```bash
   npm run dev
   ```

   The app is served from `src/` and `build/contracts/` (see `bs-config.json`).

## Using the app

1. Open the app in a browser with MetaMask.
2. Click **Login** to connect your wallet.
3. On the home page, add dishes to the cart.
4. Open **CART** to review items and check out (Ether is sent to the transit account).
5. Use **Add Item** (admin account) to publish a new dish on-chain.

## Tests

```bash
truffle test
```

Test files live in `test/` (`testFoodItem.test.js`, `testShoppingCart.test.js`, `restServiceRating.test.js`).

## License

This project started from the Truffle Pet Shop box and is licensed under the MIT License. See [LICENSE](LICENSE).
