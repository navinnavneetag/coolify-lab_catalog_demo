import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userDb } from "../db/user.db.js";
import config from "../utils/config.js";
import { errorHandler } from "../helpers/error.js";

export const authService = {
  signup: async (user, next) => {
    try {
      const { email, password } = user;
      // if (!email || !password) {
      //   return next(errorHandler(404, "User not found!"));
      // }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const userByEmail = await userDb.getUserByEmailDb(email);

      if (userByEmail) {
        next(errorHandler(401, "Email already taken"));
        return null;
      }

      const newUser = await userDb.createUserDb({
        ...user,
        password: hashedPassword,
      });

      // No token for signup, just return user
      return {
        user: newUser.email,
      };
    } catch (error) {
      next(error);
      return null;
    }
  },

  login: async (credentials, next) => {
    try {
      const user = await userDb.getUserByEmailDb(credentials.email);

      if (!user) {
        next(errorHandler(403, "Email or password incorrect"));
        return null;
      }

      const isCorrectPassword = await bcrypt.compare(
        credentials.password,
        user.password
      );

      if (!isCorrectPassword) {
        next(errorHandler(403, "Email or password incorrect"));
        return null;
      }

      const token = jwt.sign(user.id, config.SECRET);

      return {
        token,
        user: user.email,
      };
    } catch (error) {
      next(error);
      return null;
    }
  },
};
