import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Header from "./components/header";

const container = document.getElementById("root");

if (!container) {
	throw new Error("Root container missing in index.html");
}

const root = ReactDOM.createRoot(container);

root.render(
	<BrowserRouter>
		<Header />
		<Routes>
			<Route path="/" element={<App />} />
		</Routes>
	</BrowserRouter>,
);
