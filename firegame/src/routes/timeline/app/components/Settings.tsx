import React from "react";

import styles from "../../../../shared/css/Styles.module.css";

import Quizlet from "./Quizlet";

import { VERSION } from "../../../../App";

import NewGame, { Params } from "./NewGame";

import { GameType } from "./Render";
import { LobbyType } from "../../../../firegame/wrapper/C_LobbyListener";

var pulledSets = false;

type SetsToTitlesType = { [setId: number]: string };

class Settings<T> extends React.Component<
	{
		userId: string;
		lobby: LobbyType;
		sendGameState: (newState: GameType) => void;
	},
	{ setsToTitles: SetsToTitlesType }
> {
	componentDidMount() {
		if (pulledSets) return;
		pulledSets = true;
		this.fetchFromFolder();
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

	fetchFromFolder(): void {
		const base =
			localStorage.version === VERSION && localStorage.fetchedFromFolder
				? Promise.resolve(localStorage.fetchedFromFolder).then(
						JSON.parse
				  )
				: Quizlet.fetch(Quizlet.FOLDER_URL, "")
						.then(this.seedFromFolder.bind(this))
						.then((fetchedFromFolder) => {
							localStorage.fetchedFromFolder = JSON.stringify(
								fetchedFromFolder
							);
							return fetchedFromFolder;
						});
		base.then((responses) =>
			responses.map((response: any) => {
				const set = response.models.set[0];
				return { id: set.id, title: set.title };
			})
		)
			.then((responses) => {
				const setsToTitles: SetsToTitlesType = {};
				responses.forEach(
					(response: { id: number; title: string }) =>
						(setsToTitles[response.id] = response.title)
				);
				return setsToTitles;
			})
			.then((setsToTitles) => this.setState({ setsToTitles }));
	}

	seedFromFolder(blob: any) {
		const promises = blob.models.folderSet.map((model: { setId: number }) =>
			Quizlet.fetch(Quizlet.SET_URL, model.setId.toString())
		);
		return Promise.all(promises);
	}

	startGame(e: React.MouseEvent) {
		e.preventDefault();
		Promise.resolve()
			.then(this.getParams.bind(this))
			.then(NewGame)
			.then(this.props.sendGameState.bind(this));
	}

	getParams(): Params {
		return {
			userId: this.props.userId,
			quizlet: "415",
			handSize: 6,
			boardStartingSize: 6,
			swap: false,
			reverse: false,
			lobby: this.props.lobby,
		};
	}
}

export default Settings;
