import { RouterProvider } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import { router } from "./Routes";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer autoClose={2000} hideProgressBar transition={Zoom} />
    </>
  );
}

export default App;
