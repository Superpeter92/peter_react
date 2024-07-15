import { RouterProvider } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { router } from "./Routes";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer autoClose={2000}  transition={Zoom} />
    </>
  );
}

export default App;
