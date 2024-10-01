import { getWebApp } from "@/utils/getWebApp";
import { verifyTelegramWebAppData } from "./utils";
interface IAProp {
  WebAppInitData: string;
}
export const fuckSung = async (data: IAProp) => {
  const validateData = await verifyTelegramWebAppData(data.WebAppInitData);

  if (!validateData) {
    throw new Error("Invalid WebAppInitData");
  }
};
