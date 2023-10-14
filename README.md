# NEXTJS Web3 Starter Code

1. Update .env.example to .env
2. Update custom program ID in .env file

## IDL Path

`src/utils/idl`

## Wallet Adapter Path

`src/utils/Wallet.tsx`

## Store Path

`src/utils/Store.tsx`
React Store uses useContext to allow all children components to access values in the Store.

### Store Breakdown

`signAndSendTransaction` function which takes a transaction, sets recentBlockhash and feePayers and then sends the transaction.

`programClient` accessible with `const { programClient } = useStoreContext();`

### Utils Breakdown

In `src/utils/pdaFetch.ts`, you will find 3 examples of fetching PDAs from your custom program.

1. `getPdaAddressExample` returns the address of the PDA
2. `getPdaDataExmaple` returns the single PDA data
3. `getAllPdaByAuthority` returns an array of PDAs data that matches a filter
