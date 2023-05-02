import { render } from "preact";
import { App } from "./components/App";

import "./main.css";

render(<App />, document.getElementById("content") as HTMLElement);
