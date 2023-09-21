import { useContext, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import useFetch from "../Utils/useFetch";
import authService from "../../services/AuthService";
import { AUTH_ROUTES } from "../../services/Apis";
import SignupReq from "../../models/request/SignupReq";
import { Dialog } from "../Utils/Dialog";

export const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailHelpMsg, setEmailHelpMsg] = useState<string | null>(null);
  const [usernameHelpMsg, setUsernameHelpMsg] = useState<string | null>(null);
  const [passwordHelpMsg, setPasswordHelpMsg] = useState<string | null>(null);
  const [formValid, setFormValid] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const fetcher = useFetch();
  const history = useHistory();

  const { user } = useContext(AuthContext);

  const validateForm = (field: string): boolean => {
    if (field === "username") {
      return !!password && !passwordHelpMsg && !!email && !emailHelpMsg;
    } else if (field === "password") {
      return !!username && !usernameHelpMsg && !!email && !emailHelpMsg;
    } else {
      // email
      return !!username && !usernameHelpMsg && !!password && !passwordHelpMsg;
    }
  };

  const showDialog = (message: string) => {
    setErrorMsg(message);
    setShowErrorDialog(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formValid) return;

    const signup = async () => {
      const { rsp, data } = await fetcher(AUTH_ROUTES.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(new SignupReq(email, username, password)),
      });
      if (rsp.status === 200) {
        // redirect to login page
        history.push("/login");
      } else {
        showDialog(
          data?.msg ? data.msg : "Invald email address or username or password"
        );
        setFormValid(false);
      }
    };

    signup().catch((error: any) => {
      showDialog(error.message);
      setFormValid(false);
    });
  };

  if (user) {
    return <Redirect to={{ pathname: "/" }} />;
  }

  return (
    <>
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
                    Registration Info
                  </h5>
                  <div className="form-outline mb-3">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      onBlur={(e) =>
                        authService.onBlurField(
                          e,
                          "email",
                          "Invalid email",
                          setEmailHelpMsg
                        )
                      }
                      onChange={(e) =>
                        authService.onChangeField(
                          e,
                          "email",
                          setEmailHelpMsg,
                          setEmail,
                          setFormValid,
                          validateForm
                        )
                      }
                      aria-describedby="emailHelp"
                      placeholder="Enter email"
                    />
                    <div
                      id="emailHelp"
                      className="form-text text-danger"
                      style={{ height: "0.5em" }}
                    >
                      {emailHelpMsg}
                    </div>
                  </div>

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

                  <div className="mb-4 pt-1">
                    <button
                      className="main-color btn btn-secondary"
                      type="submit"
                      disabled={!formValid}
                    >
                      Register
                    </button>
                  </div>

                  <p className="text-black">
                    Already have an account?{" "}
                    <Link className="text-black" to={"/login"}>
                      Login here
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
    </>
  );
};
