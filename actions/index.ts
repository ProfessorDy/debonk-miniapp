// import { getWebApp } from "@/utils/getWebApp";
import {
  getAddressFromTelegramId,
  getPrivateKeyFromTelegramId,
  verifyTelegramWebAppData,
} from "./utils";
import { UserSolSmartWalletClass } from "./solana-provider";
import { PercentRange, SellTokenInSolParams, SellTokenParams } from "./types";
import { SLippageExceedingError } from "./solanaError";
interface WebApp {
  /**
   * this is the initData form the telegram WebApp object , i am using it to verify the validity of the passed data, make sure you pass it.
   */
  WebAppInitData: string;
}

interface GetWalletAddressInput extends WebApp {
  telegramId: string;
}
interface WithdrawalInput extends WebApp {
  destinationAddress: string;
  amount: number;
  telegramId: string;
}

interface GetUserPositionsInput extends WebApp {
  telegramId: string;
}

export interface BuyTokenInput extends WebApp {
  tokenAddress: string;
  amountInSol: number;
  telegramId: string;
}

interface SellTokenInput extends WebApp {
  telegramId: string;
  tokenAddress: string;
  amountInSol: number;
  amountPercent: number;
  type: "PERCENT" | "AMOUNT";
}
export const ExampleFunction = async (data: WebApp) => {
  const validateData = await verifyTelegramWebAppData(data.WebAppInitData);

  if (!validateData) {
    throw new Error("Invalid WebAppInitData");
  }
};
//NOW TO START THE FUNCTIONS

//SHOW WALLET ADDREEE

/**
 * call this function to get the wallet address of the user
 */
export const getWalletAddress = (data: GetWalletAddressInput): string => {
  return getAddressFromTelegramId(Number(data.telegramId));
};

export const withdrawSOl = async (data: WithdrawalInput): Promise<string> => {
  const key = getPrivateKeyFromTelegramId(data.telegramId);
  const userWalletClass = new UserSolSmartWalletClass(key);
  const res = await userWalletClass.withdrawSol(
    data.amount,
    data.destinationAddress
  );
  return res;
};

export const getUserPositions = async (data: GetUserPositionsInput) => {
  const validateData = await verifyTelegramWebAppData(data.WebAppInitData);

  if (!validateData) {
    throw new Error("Invalid WebAppInitData");
  }
};

export const buyToken = async (data: BuyTokenInput) => {
  const validateData = await verifyTelegramWebAppData(data.WebAppInitData);

  if (!validateData) {
    throw new Error("Invalid WebAppInitData");
  }
  const key = getPrivateKeyFromTelegramId(data.telegramId);
  const userWalletClass = new UserSolSmartWalletClass(key);
  const res = await userWalletClass.buy({
    token: data.tokenAddress,
    amountInSol: data.amountInSol,
  });
  return res;
};

export const sellToken = async (data: SellTokenInput) => {
  const validateData = await verifyTelegramWebAppData(data.WebAppInitData);

  if (!validateData) {
    throw new Error("Invalid WebAppInitData");
  }
  const key = getPrivateKeyFromTelegramId(data.telegramId);
  const userWalletClass = new UserSolSmartWalletClass(key);

  if (data.type === "AMOUNT") {
    const params: SellTokenInSolParams = {
      token: data.tokenAddress,
      amountToSellInSol: data.amountInSol.toString(),
    };
    try {
      return await userWalletClass.sell(params);
    } catch (error) {
      console.log("error: ", error);
      if (error instanceof SLippageExceedingError) {
        // handle slippage error
        // return a message to the user to increase their sell price or reduce their buy price
        return "Slippage exceeded. Please increase your sell price or reduce your buy price.";
      }
    }
  }

  if (data.type === "PERCENT") {
    const params: SellTokenParams = {
      token: data.tokenAddress,
      percentToSell: data.amountPercent as PercentRange,
    };
    try {
      return await userWalletClass.sell(params);
    } catch (error) {
      console.log("error: ", error);
      if (error instanceof SLippageExceedingError) {
        // handle slippage error
        // return a message to the user to increase their sell price or reduce their buy price
        return "Slippage exceeded. Please increase your sell price or reduce your buy price.";
      }
    }
  }
};

export const getWalletGetUserWalletBalance = async (
  data: GetWalletAddressInput
) => {
  const userAddress = getAddressFromTelegramId(Number(data.telegramId));

  const balance = await UserSolSmartWalletClass.getSolBalance(userAddress);
  console.log("balance: ", balance);

  return balance;
};

//WITHDRWAL
