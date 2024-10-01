import { getWebApp } from "@/utils/getWebApp";
import { getAddressFromTelegramId, verifyTelegramWebAppData } from "./utils";
interface WebApp {
  /**
   * this is the initData form the telegram WebApp object , i am using it to verify the validity of the passed data, make sure you pass it.
   */
  WebAppInitData: string;
}

interface GetWalletAddressInput extends WebApp {
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
//WITHDRWAL
