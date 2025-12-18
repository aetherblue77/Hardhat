# 🎰 Decentralized Smart Contract Lottery

A fully decentralized and automated lottery application built on the Ethereum blockchain. This project ensures fairness and transparency by using smart contracts to manage the entire process without a centralized authority.

# 🚀 How It Works

1. **Enter the Lottery:** Users join by paying a specific entrance fee in ETH. Their wallet address is added to the players' list.
2. **Wait for Drawing:** The lottery runs for a set interval (e.g., every 30 seconds or 1 hour).
3. **Pick a Winner:** Once the time is up, the smart contract automatically selects a winner.
4. **Automatic Payout:** The winner receives the entire accumulated balance (pot) directly to their wallet, and the lottery resets for the next round.

# 🛠 Key Technologies

- **Solidity:** For writing the secure smart contract logic.
- **Chainlink VRF:** Ensures the winner is chosen via **verifiable true randomness**, preventing manipulation.
- **Chainlink Automation (Keepers):** Automatically triggers the winner selection process when conditions are met.
