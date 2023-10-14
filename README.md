# NEXTJS Web3 Starter Code

1. Update .env.example to .env
2. Update custom program ID in .env file

## IDL Path

`src/utils/idl`

## Wallet Adapter Path

`src/utils/Wallet.tsx`

## Store Path

`src/utils/Store.tsx`
React Store uses useContext to allow all children components to access values in Store.

### Store Breakdown

`signAndSendTransaction` function which take a transaction, set recentBlockhash and feePayers, then send the transaction.
get.

`programClient` accessible with `const { programClient } = useStoreContext();`

### Utils Breakdown

In `src/utils/pdaFetch.ts`, you will find 3 examples of how you can fetch PDAs from your custom program.

1. getPdaAddressExample:
   `getCustomPda` is a simple fetch request

`getCustomPdaWithFilter` includes a filter
