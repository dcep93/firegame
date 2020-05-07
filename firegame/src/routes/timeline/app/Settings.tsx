import React from "react";

import Quizlet from "./Quizlet";

var pulledSets = false;

type SetsToTitlesType = { [setId: number]: string };

class Settings extends React.Component<{}, { setsToTitles: SetsToTitlesType }> {
	componentDidMount() {
		if (pulledSets) return;
		pulledSets = true;
		Quizlet.fetch(Quizlet.FOLDER_URL).then(this.seedFromFolder.bind(this));
	}

	render() {
		return (
			<div>
				<form>
					<div>
						<span>Hand Size</span>
						<input type={"text"} />
					</div>
					<div>
						<span>Board Starting Size Size</span>
						<input type={"text"} />
					</div>
					<div>
						<label>
							Swap <input type={"checkbox"} />
						</label>
						<label>
							Reverse <input type={"checkbox"} />
						</label>
					</div>
					<div>
						<select>
							<option value="select_set">Select Set</option>
							{this.state && this.getSets()}
						</select>
					</div>
					<div>
						<span>Set Id:</span>
						<input type={"text"} />
					</div>
					<div>
						<button>Start Game</button>
					</div>
				</form>
			</div>
		);
	}

	getSets(): JSX.Element[] {
		const sets: JSX.Element[] = [];
		for (let [setId, title] of Object.entries(this.state.setsToTitles)) {
			sets.push(
				<option key={setId} value={setId}>
					{title}
				</option>
			);
		}
		return sets;
	}

	seedFromFolder(blob: any) {
		const models: any[] = blob.models.folderSet;
		const setsToTitles: SetsToTitlesType = {};
		models.forEach((model) => {
			const setId: number = model.setId;
			Quizlet.fetch(`${Quizlet.SET_URL}${setId}`)
				.then((response) => {
					setsToTitles[setId] = response.models.set[0].title;
				})
				.then(() => {
					if (Object.keys(setsToTitles).length === models.length)
						this.setState({ setsToTitles });
				});
		});
	}
}

export default Settings;
