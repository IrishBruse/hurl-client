import {
	VscodeSingleSelect,
	VscodeTextfield,
	VscodeButton,
} from "@vscode-elements/react-elements";
import { useState } from "react";

const options = [
	"GET",
	"POST",
	"PUT",
	"DELETE",
	"PATCH",
	"OPTIONS",
	"HEAD",
].map((value) => {
	return {
		label: value,
		value: value,
		description: "",
		disabled: false,
		selected: false,
	};
});

export function RequestBar() {
	const [method, setMethod] = useState("GET");
	const [url, setUrl] = useState("");
	const changeMethod = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMethod(e.target?.value);
	};
	const changeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUrl(e.target?.value);
	};

	console.log(method);

	return (
		<span
			style={{
				display: "flex",
				alignItems: "center",
				gap: "6px",
				padding: "1rem",
				lineHeight: "2rem",
			}}
		>
			<VscodeSingleSelect
				value={"GET"}
				onChange={changeMethod as never}
				options={options}
				style={{ maxWidth: "90px" }}
			/>
			<VscodeTextfield
				value={url}
				onInput={changeUrl as never}
				style={{ borderRadius: 0, width: "100%" }}
			/>
			<VscodeButton onClick={() => {}}>Send</VscodeButton>
		</span>
	);
}
