import * as anchor from "@coral-xyz/anchor";
import { MyAnchorProgram as MyIdl, IDL } from "../idl/my_idl";
import { Connection, Transaction } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";

// This create a struct type for reference
type GlobalStruct = anchor.IdlAccounts<MyIdl>["global"];

export const initProgramClient = async (wallet?: AnchorWallet) => {
  const conn: Connection = new Connection(process.env.RPC_URL!);
  return new ProgramClient(conn, wallet);
};

// CLASS OF PROGRAM
export class ProgramClient {
  conn: Connection;
  myProgram: anchor.Program<MyIdl>;
  provider?: anchor.Provider;
  globalData?: anchor.ProgramAccount<GlobalStruct> | null;

  constructor(conn: Connection, wallet?: AnchorWallet) {
    this.conn = conn;
    anchor.AnchorProvider.defaultOptions();

    if (wallet) {
      this.provider = new anchor.AnchorProvider(
        this.conn,
        wallet,
        anchor.AnchorProvider.defaultOptions()
      );
      this.myProgram = new anchor.Program<MyIdl>(
        IDL,
        process.env.NEXT_PUBLIC_PROGRAM_ID!,
        this.provider
      );
      anchor.setProvider(this.provider);
    } else {
      // Program lack provider missing wallet, lack functions that requires signer
      this.myProgram = new anchor.Program<MyIdl>(
        IDL,
        process.env.NEXT_PUBLIC_PROGRAM_ID!
      );
    }
  }

  setProvider = async (wallet: anchor.Wallet) => {
    // Add wallet into provider for easier references and additional features
    this.provider = new anchor.AnchorProvider(
      this.conn,
      wallet,
      anchor.AnchorProvider.defaultOptions()
    );
    this.myProgram = new anchor.Program<MyIdl>(
      IDL,
      process.env.NEXT_PUBLIC_PROGRAM_ID!,
      this.provider
    );
    anchor.setProvider(this.provider);
  };

  // INSTRUCTION 1: CREATE_OR_UPDATE_GLOBAL
  createOrUpdateGlobalIx = async (): Promise<Transaction> => {
    const tx = new Transaction();

    const updateGlobalIx = await this.myProgram.methods
      .initializeOrUpdateGlobal()
      .accounts({
        global: this.globalData?.publicKey,
        payer: this.provider?.publicKey,
      })
      .instruction();

    tx.add(updateGlobalIx);
    return tx;
  };
}
