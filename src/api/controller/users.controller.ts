import * as bcrypt from "bcrypt";
import { models } from "../../db";
import authService from "../services/auth.service";
import { MediaService } from "../services/s3Service";

class UserController {
  private mediaService: MediaService;
  constructor(mediaService: MediaService) {
    this.mediaService = mediaService;
  }

  signUp = async (req, res) => {
    try {
      const { firstName, email, password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await models.Users.create({
        firstName,
        email,
        password: hashedPassword,
      });
      res.send("You have successfully registered!");
    } catch (err) {
      res.status(400).send("Something went wrong");
      console.log("error=>", err);
    }
  };

  signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
      const isUserExists = await models.Users.findOne({ where: { email } });
      if (!isUserExists) {
        res.status(400).send("User not exists");
        return;
      }
      const validPassword = bcrypt.compare(password, isUserExists.password);
      if (!validPassword) {
        res.status(400).send("Credentials are invalid");
        return;
      }

      const auth = { email, id: String(isUserExists.id) };
      const accessToken = await authService.signAccessToken(auth);

      const result = {
        accessToken,
      };
      res.status(200).send(result);
    } catch (err) {
      console.log("err", err);
      res.status(400).send("Something went wrong");
      console.log("error=>", err);
    }
  };

  editUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, email, gender } = req.body;
      const user = await models.Users.update(
        { firstName, lastName, email, gender },
        { where: { id } }
      );
      if (user == 0) {
        res.status(400).send("user not found");
      }
      res.send("You have successfully edited user!");
    } catch (err) {
      res.status(400).send("Something went wrong");
      console.log("error=>", err);
    }
  };

  getUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await models.Users.findOne({ where: { id } });
      if (!user) {
        res.status(400).send("user not found");
      }
      res.send(user);
    } catch (err) {
      res.status(400).send("Something went wrong");
      console.log("error=>", err);
    }
  };

  sortByRegistrationDate = async (req, res) => {
    try {
      const { limit = 10, offset = 0 } = req.query;
      const sortUserByDate = await models.Users.findAll({
        order: [["createdAt", "asc"]],
        limit,
        offset,
      });
      res.send({ sortUserByDate });
    } catch (err) {
      res.status(400).send("Something went wrong");
      console.log(err);
    }
  };

  changeProfilePicture = async (req, res) => {
    try {
      const { id } = req.params;
      if (!req.files) {
        return res.send({
          status: false,
          message: "No photo to upload",
        });
      }
      const { photo } = req.files;
      const pathToPhoto = await this.mediaService.uploadPhoto(
        photo.data,
        photo.mimetype
      );
      if (!pathToPhoto) {
        return res.status(406).send({ message: "failed to upload photo" });
      }
      await models.Users.update({ photo: pathToPhoto }, { where: { id } });
      return res.sendStatus(200);
    } catch (e) {
      res.status(400).send("Something went wrong");
      console.log(e);
    }
  };
}

export default UserController;
