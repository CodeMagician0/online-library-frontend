import dayjs from "dayjs";
import jwtDecoder, { JwtPayload } from "jwt-decode";

class AuthService {
  private emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

  validateField = (str: string, field: string): boolean => {
    switch (field) {
      case "username":
        return str.length >= 3 && str.length <= 20;
      case "password":
        return str.length >= 6 && str.length <= 40;
      case "email":
        return this.emailRegex.test(str);
      default:
        return false;
    }
  };

  onChangeField = (
    e: any,
    field: string,
    setMsg: Function,
    setField: Function,
    setValid: Function,
    validateForm: Function
  ) => {
    const fieldVal = e.target.value;
    setField(fieldVal);
    const isValid = this.validateField(fieldVal, field);
    if (!isValid) {
      setValid(false);
    } else {
      setMsg("");
      setValid(validateForm(field));
    }
  };

  onBlurField = (e: any, field: string, msg: string, setMsg: Function) => {
    const fieldVal = e.target.value;
    const isValid = this.validateField(fieldVal, field);
    if (!isValid) {
      if (fieldVal === "") {
        setMsg("");
      } else {
        setMsg(msg);
      }
    } else {
      setMsg("");
    }
  };

  validateToken = (token: string | null): boolean => {
    if (!token) return false;
    let decoded: JwtPayload;
    try {
      decoded = jwtDecoder<JwtPayload>(token);
      return dayjs.unix(decoded.exp!).diff(dayjs()) > 1;
    } catch (error: any) {
      localStorage.removeItem("authTokens");
      console.log("token decode error: ", error.message);
      return false;
    }
  };
}

export default new AuthService();
