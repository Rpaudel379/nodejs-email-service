import mongoose from "mongoose";
import { DB_URI } from "@/common/assets/constants/variables";
import { logger } from "@utils/log/logger";

export const connectDB = async () => {
  try {
    logger.debug("connecting to mongodb");
    await mongoose.connect(DB_URI);
    logger.info("database connected");
  } catch (error) {
    logger.error({ msg: "mongodb connection failed", err: error });
    logger.trace(error);
    process.exit(1);
  }
};
