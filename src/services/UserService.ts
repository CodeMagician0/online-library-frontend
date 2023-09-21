import UserModel from "../models/UserModel";
import { USER_ROUTES } from "./Apis";

class UserService {
  refreshUser = async (token: string): Promise<UserModel | null> => {
    try {
      let rsp = await fetch(USER_ROUTES.REFRESH_USER, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });
      if (!rsp.ok) throw rsp.statusText;
      let data = await rsp.json();
      let user = new UserModel(data.id, data.username, data.email);
      return user;
    } catch (e) {
      console.log("Refresh user error: ", e);
      return null;
    }
  };
}

export default new UserService();
