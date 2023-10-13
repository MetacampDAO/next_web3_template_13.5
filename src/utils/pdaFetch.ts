import * as anchor from "@coral-xyz/anchor";
import { MyIdl } from "./idl/my_idl";

// =========================== FETCH ===========================

export const getPdaAddressExmaple = (program: anchor.Program<MyIdl>) => {
  const [globalPda, _globalBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("global")],
    program.programId
  );
  return globalPda;
};

export const getPdaDataExmaple = async (program: anchor.Program<MyIdl>) => {
  const [globalPda, _globalBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("global")],
    program.programId
  );
  return await program.account.global.fetch(globalPda);
};

export const getAllPdaByAuthority = async (
  program: anchor.Program<MyIdl>,
  authority: anchor.web3.PublicKey
) => {
  // If the first item in the PDA is the authority Pubkey
  const filter = [
    {
      memcmp: {
        offset: 8, //prepend for anchor's discriminator
        bytes: authority.toBase58(),
      },
    },
  ];

  // This will return an array of PDAs struct
  // that matches the authority field
  const data = await program.account.global.all(filter);

  return data;
};
