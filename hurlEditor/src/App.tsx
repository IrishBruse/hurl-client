import {
	VscodeSplitLayout,
	VscodeTabHeader,
	VscodeTabPanel,
	VscodeTabs,
} from "@vscode-elements/react-elements";
import { RequestBar } from "./Components/RequestBar";

function App() {
	return (
		<VscodeSplitLayout style={{ border: "none", height: "100vh", margin: "0" }}>
			<div slot="start">
				<RequestBar />
				<VscodeTabs panel>
					<VscodeTabHeader slot="header">Params</VscodeTabHeader>
					<VscodeTabPanel style={{ margin: "0 1rem" }}>AASD</VscodeTabPanel>
					<VscodeTabHeader slot="header">Body</VscodeTabHeader>
					<VscodeTabPanel style={{ margin: "0 1rem" }}>B</VscodeTabPanel>
					<VscodeTabHeader slot="header">Header</VscodeTabHeader>
					<VscodeTabPanel style={{ margin: "0 1rem" }}>C</VscodeTabPanel>
					<VscodeTabHeader slot="header">Auth</VscodeTabHeader>
					<VscodeTabPanel style={{ margin: "0 1rem" }}>D</VscodeTabPanel>
				</VscodeTabs>
			</div>
			<div slot="end" style={{ margin: "1.5rem 1rem" }}>
				test
			</div>
		</VscodeSplitLayout>
	);
}
export default App;
