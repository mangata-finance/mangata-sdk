import { Mangata } from "../index.js";

const uri = process.env.API_URL || "ws://127.0.0.1:8844";

export const instance = Mangata.getInstance([uri]);
export const SUDO_USER_NAME = process.env.TEST_SUDO_NAME || "";
