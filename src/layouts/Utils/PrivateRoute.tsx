import { Route, RouteProps, Redirect } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

interface PrivateRouteProps extends RouteProps {}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  ...rest
}) => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Route {...rest}>
      {isAuthenticated ? children : <Redirect to="/login" />}
    </Route>
  );
};
