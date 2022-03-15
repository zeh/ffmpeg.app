import { render } from "preact";
import { App } from "./components/App";
import "./index.css";

render(<App />, document.getElementById("content") as HTMLElement);
