import { authService } from "../services/auth.service.js";

const createAccount = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body, next);
    if (!result) return; // error already handled by next
    const { user } = result;
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const result = await authService.login(req.body, next);
    if (!result) return; // error already handled by next
    const { token, user } = result;
    res.header("auth-token", token);
    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};

export { createAccount, loginUser };
