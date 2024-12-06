import { VscodeButton } from "@vscode-elements/react-elements";
import { useState } from "react";

function App() {
	const [value, setValue] = useState(0);
	return (
		<>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more asd
			</p>
			<VscodeButton
				onClick={() => {
					setValue(20);
				}} 
			>
				{value}
			</VscodeButton>
		</>
	);
}

export default App;
