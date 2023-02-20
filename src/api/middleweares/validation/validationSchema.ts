import { Joi } from "express-validation";

export const validationSchema = {
  config: {
    context: true,
    statusCode: 422,
    keyByField: true,
  },
  signUpUserSchema: {
    body: Joi.object({
      firstName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{3,30}/)
        .required(),
    }),
  },
  signInUserSchema: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{3,30}/)
        .required(),
    }),
  },
  editUserSchema: {
    body: Joi.object({
      email: Joi.string().email(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      photo: Joi.string(),
      gender: Joi.string(),
    }),
  },
};
