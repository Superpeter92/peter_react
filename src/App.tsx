import { RouterProvider } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { router } from "./Routes";
import { QueryClient, QueryClientProvider } from "react-query";
import AnimatedSuspense from "./components/AnimatedSuspance";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        suspense: true,
      },
    },
  });
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AnimatedSuspense>
          <RouterProvider router={router} />
        </AnimatedSuspense>
        <ToastContainer autoClose={2000} transition={Zoom} />
      </QueryClientProvider>
    </>
  );
}

export default App;
