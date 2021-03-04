import axios from "axios";
import { AuthContextProvider } from "./context/auth-context";
import Router from "./router";

axios.defaults.withCredentials = true;

function App() {
  return (
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  );
}

export default App;
