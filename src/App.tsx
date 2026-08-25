import { HashRouter } from "react-router-dom";
import { AppRouter } from "./app/AppRouter";

export default function App() {
  // GitHub Pages ne réécrit pas les URL vers index.html : le hash garde donc
  // chaque route accessible après un rechargement, sans serveur supplémentaire.
  return <HashRouter><AppRouter /></HashRouter>;
}
