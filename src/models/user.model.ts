import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import mail from "../utils/mail";
import invoice from "../utils/invoice";

export interface User {
  fullName: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
  profilePicture: string;
  createdAt?: string;
}

const Schema = mongoose.Schema;

const UserSchema = new Schema<User>(
  {
    fullName: {
      type: Schema.Types.String,
      required: true,
    },
    username: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    roles: {
      type: [Schema.Types.String],
      enum: ["admin", "user"],
      default: ["user"],
    },
    profilePicture: {
      type: Schema.Types.String,
      default: "user.jpg",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  const user = this;
  user.password = encrypt(user.password);
  next();
});

UserSchema.pre("updateOne", async function (next) {
  const user = (this as unknown as { _update: any })._update as User;
  user.password = encrypt(user.password);
  next();
});

UserSchema.post("save", async function (doc, next) {
  const user = doc;

  // send mail
  console.log("Send Email to", user.email);

  const content = await mail.render("register.-success.ejs", {
    username: user.username,
  });

  await mail.send({
    to: user.email,
    subject: "Register Success",
    content,
  });

  next();
}),

UserSchema.pre("updateOne", async function (next) {
  const user = (this as unknown as { _update: any })._update as User;
  user.password = encrypt(user.password);
  next();
});

UserSchema.post("save", async function (doc, next) {
  const user = doc;

  // send mail
  console.log("Send Invoice to", user.email);

  const content = await invoice.render("invoice.ejs", {
    username: user.username,
  });

  await invoice.send({
    to: user.email,
    subject: "Order Success",
    content,
  });

  next();
}),

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
