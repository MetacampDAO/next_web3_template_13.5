"use client";

import React, { useContext, useEffect, useState, createContext } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Keypair, Transaction } from "@solana/web3.js";
import { ProgramClient, initProgramClient } from "./program/myProgramClass";

interface StoreConfig {
  programClient: ProgramClient | null;
  signAndSendTransaction: (
    transaction: Transaction,
    partialSign?: boolean,
    signer?: Keypair | null
  ) => Promise<string | undefined>;
}

const StoreContext = createContext<StoreConfig>({
  programClient: null,
  signAndSendTransaction: async () => "",
});

export function StoreProvider({ children }: { children: any }) {
  const [programClient, setProgramClient] = useState<ProgramClient | null>(
    null
  );

  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  useEffect(() => {
    (async () => {
      try {
        if (!process.env.NEXT_PUBLIC_PROGRAM_ID) {
          throw "ProgramID Required";
        }

        if (wallet) {
          const program = await initProgramClient(wallet);
          setProgramClient(program);
        } else {
          const program = await initProgramClient();
          setProgramClient(program);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [wallet]);

  const signAndSendTransaction = async (
    transaction: Transaction,
    partialSign = false,
    signer: Keypair | null = null
  ) => {
    if (wallet) {
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash("confirmed")
      ).blockhash;
      transaction.feePayer = wallet.publicKey;

      if (partialSign && signer) transaction.partialSign(signer);

      const signedTx = await wallet.signTransaction(transaction);
      const rawTransaction = signedTx.serialize();
      const txSig = await connection.sendRawTransaction(rawTransaction);
      return txSig;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        programClient,
        signAndSendTransaction,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => {
  const context = useContext(StoreContext);

  return {
    programClient: context.programClient,
    signAndSendTransaction: context.signAndSendTransaction,
  };
};
