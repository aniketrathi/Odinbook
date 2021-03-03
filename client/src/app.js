import { AuthContextProvider } from "./context/auth-context";
import Router from "./router";

function App() {
  return (
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  );
}

export default App;
