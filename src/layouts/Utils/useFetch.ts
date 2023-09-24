import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const useFetch = () => {
  const { authTokens } = useContext(AuthContext);

  let originalRequest = async (url: string, config: any) => {
    let rsp = await fetch(url, config);
    let data = await rsp.json();

    return { rsp, data };
  };

  let callFetch = async (url: string, config?: RequestInit) => {
    if (!config) config = { method: "GET" };

    if (authTokens) {
      config["headers"] = {
        ...config["headers"],
        Authorization: `Bearer ${authTokens}`,
      };
    }

    let { rsp, data } = await originalRequest(url, config);
    return { rsp, data };
  };

  return callFetch;
};

export default useFetch;
