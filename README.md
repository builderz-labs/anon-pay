# AnonPay
![AnonPay](/public/anon-pay-logo-with-text.png)

**AnonPay** is a Dashboard to make private payments with Elusiv. It’s build on-top of their SDK enabling all current features.

Elusiv is a privacy solution in web3 using ZK technology. Unique to most privacy solutions, Elusiv utilizes an off-chain “Warden Network” to create private transactions. You can read more about it on their website: [https://elusiv.io/](https://elusiv.io/)

## Using AnonPay

AnonPay is the frontend dashboard for using Elusiv privacy. Here you can manage your private balance. That means…

- Depositing money into your private balance
- Sending money to other people
- Withdrawing from your private balance

You can also check all your balances as well as see your private transaction history.

At login you’re required to enter a password. This is not stored anywhere but Elusiv needs it create a reference to your private balance. Remember it, or you will lose access to your funds!

Check out the demo-video or try it our yourself [HERE](https://anonpay.vercel.app/)

---
Feel free to give us any feedback or questions. You can contact us best on discord or twitter.
[@KultureElectric](https://twitter.com/KultureElectric)
[@Web3Wiz](https://twitter.com/Web3Wiz)

**And don't forget to leave a vote for the Sandstorm Hackathon. Much appreciated!**
---
## Preview

Responsive                     |  Desktop
:-------------------------:|:-------------------------:
![AnonPay Mobile](/public/AnonPay-Mobile.png)  |  ![AnonPay Desktop](/public/AnonPay-Desktop.png)

## Getting Started

1. Clone this repository
2. Install dependencies
```bash
yarn install
```
3. Add .env file
```
NEXT_PUBLIC_RPC_URL=<DEVNET_RPC>
```
4. Run in local environment
```bash
yarn dev
```

