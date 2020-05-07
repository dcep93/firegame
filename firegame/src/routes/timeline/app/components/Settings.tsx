import React from "react";

import styles from "../../../../shared/css/Styles.module.css";

import Quizlet from "./Quizlet";

import NewGame from "./NewGame";

import { GameType } from "./Render";

var pulledSets = false;

type SetsToTitlesType = { [setId: number]: string };

class Settings<T> extends React.Component<
	{ sendGameState: (newState: GameType) => void },
	{ setsToTitles: SetsToTitlesType }
> {
	componentDidMount() {
		if (pulledSets) return;
		pulledSets = true;
		Quizlet.fetch(Quizlet.FOLDER_URL).then(this.seedFromFolder.bind(this));
	}

	render() {
		return (
			<div className={styles.bubble}>
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
						<span>Quizlet:</span>
						<input type={"text"} />
					</div>
					<div>
						<button onClick={this.startGame.bind(this)}>
							Start Game
						</button>
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

	startGame(e: React.MouseEvent) {
		e.preventDefault();
		Promise.resolve()
			.then(NewGame)
			.then(this.props.sendGameState.bind(this));
	}
}

export default Settings;
