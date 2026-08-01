import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import Button from "@mui/material/Button";
import axios from "axios";

interface Film {
	title: string;
	director: string;
}

function App() {
	const [warsData, setWarsData] = useState<Film[]>([]);
	const [counter, setCounter] = useState(0);

	useEffect(() => {
		axios
			.get("https://swapi.info/api/films")
			.then((response) => {
				console.log(response.data);
				setWarsData(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [counter]);

	return (
		<div className="App">
			<header className="App-header">
				<ul>
					{warsData.map((data) => (
						<li key={data.title}>{data?.director}</li>
					))}
				</ul>
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
					Learn React
				</a>
				{/* <Button variant="contained"> A</Button> */}
				<Button />
				<Button variant="text">Text</Button>
				<Button variant="contained">Contained</Button>
				<Button variant="outlined" className="testing" sx={{ background: "red" }} onClick={() => setCounter(counter + 1)}>
					Outlined
				</Button>
			</header>
		</div>
	);
}

export default App;
