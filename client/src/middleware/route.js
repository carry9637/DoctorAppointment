import { Navigate } from "react-router-dom";

export const Protected = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to={"/login"} replace={true}></Navigate>;
  }
  return children;
};

export const Public = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to={"/"} replace={true}></Navigate>;
  }
  return children;
};

// export const Admin = ({ children }) => {
//   const user = jwtDecode(localStorage.getItem("token"));

//   if (user.isAdmin) {
//     return children;
//   }
//   return (
//     <Navigate
//       to={"/"}
//       replace={true}
//     ></Navigate>
//   );
// };
export const Admin = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to={"/"} replace={true}></Navigate>;
  }
  return children;
};
