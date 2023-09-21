import { useContext, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import useFetch from "../Utils/useFetch";
import authService from "../../services/AuthService";
import { AUTH_ROUTES } from "../../services/Apis";
import LoginReq from "../../models/request/LoginReq";
import AuthContext from "../../context/AuthContext";
import UserModel from "../../models/UserModel";
import { Dialog } from "../Utils/Dialog";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameHelpMsg, setUsernameHelpMsg] = useState<string | null>(null);
  const [passwordHelpMsg, setPasswordHelpMsg] = useState<string | null>(null);
  const [formValid, setFormValid] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const fetcher = useFetch();
  const history = useHistory();

  const { user, setAuthTokens, setUser } = useContext(AuthContext);

  const showDialog = (message: string) => {
    setErrorMsg(message);
    setShowErrorDialog(true);
  };

  const validateForm = (field: string): boolean => {
    if (field === "username") {
      return !!password && !passwordHelpMsg;
    } else {
      // for password
      return !!username && !usernameHelpMsg;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formValid) return;

    const login = async () => {
      const { rsp, data } = await fetcher(AUTH_ROUTES.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(new LoginReq(username, password)),
      });

      if (rsp.status === 200) {
        const content = data.data;
        console.log("login content: ", content);
        setAuthTokens(content.token);
        setUser(new UserModel(content.id, content.username, content.email));
        localStorage.setItem("authTokens", content.token);
        history.push("/");
      } else {
        showDialog(data?.msg ? data.msg : "Invald username or password");
        setFormValid(false);
      }
    };

    login().catch((error: any) => {
      console.log("Error in catch", error.message);
      showDialog("Incorrect Password");
      setFormValid(false);
    });
  };

  if (user) {
    return <Redirect to={{ pathname: "/" }} />;
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="card" style={{ borderRadius: "1rem" }}>
          <div className="d-flex align-items-center">
            <div className="card-body p-4 p-lg-5 text-black">
              <form onSubmit={handleSubmit}>
                <h5
                  className="fw-normal mb-3 pb-3"
                  style={{ letterSpacing: "1px" }}
                >
                  Sign into your account
                </h5>

                <div className="form-outline mb-3">
                  <label className="form-label" htmlFor="username">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    onBlur={(e) =>
                      authService.onBlurField(
                        e,
                        "username",
                        "Invalid username",
                        setUsernameHelpMsg
                      )
                    }
                    onChange={(e) =>
                      authService.onChangeField(
                        e,
                        "username",
                        setUsernameHelpMsg,
                        setUsername,
                        setFormValid,
                        validateForm
                      )
                    }
                    aria-describedby="usernameHelp"
                    placeholder="Enter username"
                  />
                  <div
                    id="usernameHelp"
                    className="form-text text-danger"
                    style={{ height: "0.5em" }}
                  >
                    {usernameHelpMsg}
                  </div>
                </div>

                <div className="form-outline mb-3">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    onBlur={(e) =>
                      authService.onBlurField(
                        e,
                        "password",
                        "Invalid password",
                        setPasswordHelpMsg
                      )
                    }
                    onChange={(e) =>
                      authService.onChangeField(
                        e,
                        "password",
                        setPasswordHelpMsg,
                        setPassword,
                        setFormValid,
                        validateForm
                      )
                    }
                    aria-describedby="passwordHelp"
                    placeholder="Enter password"
                  />
                  <div
                    id="passwordHelp"
                    className="form-text text-danger"
                    style={{ height: "0.5em" }}
                  >
                    {passwordHelpMsg}
                  </div>
                </div>

                <div className="pt-1 mb-4">
                  <button
                    className="main-color btn btn-secondary"
                    type="submit"
                    disabled={!formValid}
                  >
                    Login
                  </button>
                </div>

                <a className="small text-muted" href="#">
                  Forgot password?
                </a>
                <p className="text-black">
                  Don't have an account?{" "}
                  <Link className="text-black" to={"/signup"}>
                    Register here
                  </Link>
                </p>
              </form>
              <Dialog
                show={showErrorDialog}
                onClose={() => setShowErrorDialog(false)}
                title="Error"
                message={errorMsg}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
