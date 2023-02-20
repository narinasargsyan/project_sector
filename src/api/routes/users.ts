import * as express from "express";
const userRouter = express.Router();
import UserController from "../controller/users.controller";
import validate from "../middleweares/validation/validate";
import auth from "../middleweares/authentication.middlewear";
import { canEditProfile } from "../middleweares/canEdit.middleware";
import { MediaService } from "../services/s3Service";

const mediaService = new MediaService();
const user = new UserController(mediaService);

const { authenticate } = auth;

userRouter.get("/", user.sortByRegistrationDate);

userRouter.post("/sign-up", validate("signUpUserSchema"), user.signUp);
userRouter.post("/sign-in", validate("signInUserSchema"), user.signIn);

userRouter.use(authenticate);

userRouter.put("/profile/:id/photo", canEditProfile, user.changeProfilePicture);
userRouter.put(
  "/profile/:id",
  validate("editUserSchema"),
  canEditProfile,
  user.editUser
);

userRouter.get("/profile/:id", user.getUser);

export { userRouter };
