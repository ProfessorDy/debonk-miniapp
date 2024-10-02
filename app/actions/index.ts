import { getWebApp } from "@/utils/getWebApp";
import {
  getAddressFromTelegramId,
  getPrivateKeyFromTelegramId,
  verifyTelegramWebAppData,
} from "./utils";
import { UserSolSmartWalletClass } from "./solana-provider";
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
  return getAddressFromTelegramId(data.telegramId);
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
//WITHDRWAL
