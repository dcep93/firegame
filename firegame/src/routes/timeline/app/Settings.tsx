import React, { RefObject } from "react";

import styles from "../../../shared/Styles.module.css";

import Quizlet from "./Quizlet";

import { VERSION } from "../../../App";

import NewGame, { Params } from "./NewGame";

import { GameType } from "./Render";
import { LobbyType } from "../../../firegame/wrapper/C_LobbyListener";

import css from "./index.module.css";
import StoreElement from "../../../shared/StoreElement";

const DEFAULT_SET_ID = "284065846";

var pulledSets = false;

type SetsToTitlesType = { [setId: number]: string };

type PropsType = {
	userId: string;
	sendGameState: (message: string, newState: GameType) => void;
};

class SettingsWrapper extends React.Component<PropsType> {
	render() {
		return <Settings {...this.props} lobby={StoreElement.getLobby()} />;
	}
}

class Settings extends React.Component<
	PropsType & { lobby: LobbyType },
	{ setsToTitles: SetsToTitlesType }
> {
	handSizeRef: RefObject<HTMLInputElement> = React.createRef();
	boardSizeRef: RefObject<HTMLInputElement> = React.createRef();
	swapRef: RefObject<HTMLInputElement> = React.createRef();
	reverseRef: RefObject<HTMLInputElement> = React.createRef();
	useRankRef: RefObject<HTMLInputElement> = React.createRef();
	quizletRef: RefObject<HTMLInputElement> = React.createRef();
	componentDidMount() {
		if (pulledSets) return;
		pulledSets = true;
		this.fetchFromFolder();
	}

	render() {
		return (
			<div className={styles.bubble}>
				<form className={css.settings_form}>
					<div>
						<span>Hand Size: </span>
						<input
							className={css.settings_input}
							type={"text"}
							defaultValue={"6"}
							size={4}
							ref={this.handSizeRef}
						/>
					</div>
					<div>
						<span>Board Size: </span>
						<input
							className={css.settings_input}
							type={"number"}
							defaultValue={"6"}
							ref={this.boardSizeRef}
						/>
					</div>
					<div>
						<label>
							Swap: <input type={"checkbox"} ref={this.swapRef} />
						</label>
						<br />
						<label>
							Reverse:{" "}
							<input type={"checkbox"} ref={this.reverseRef} />
						</label>
						<br />
						<label>
							Use Rank:{" "}
							<input type={"checkbox"} ref={this.useRankRef} />
						</label>
					</div>
					<div className={styles.dont_grow}>
						<select
							className={css.settings_select}
							onChange={this.selectChange.bind(this)}
						>
							<option defaultChecked>Select Set</option>
							{this.state && this.getSets()}
						</select>
					</div>
					<div>
						<span>Quizlet: </span>
						<input
							type={"text"}
							size={DEFAULT_SET_ID.length + 2}
							ref={this.quizletRef}
							defaultValue={DEFAULT_SET_ID}
						/>
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

	selectChange(e: React.ChangeEvent<HTMLSelectElement>): void {
		e.preventDefault();
		const index = e.target.selectedIndex;
		if (index === 0) return;
		const option = e.target.options[index];
		this.quizletRef.current!.value = option.value;
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
			.then((game) =>
				this.props.sendGameState("started a new game", game)
			)
			.catch((e) => alert(e));
	}

	getParams(): Params {
		return {
			userId: this.props.userId,
			lobby: this.props.lobby,
			quizlet: this.quizletRef.current!.value,
			handSize: parseInt(this.handSizeRef.current!.value),
			boardStartingSize: parseInt(this.boardSizeRef.current!.value),
			swap: this.swapRef.current!.checked,
			reverse: this.reverseRef.current!.checked,
			useRank: this.useRankRef.current!.checked,
		};
	}
}

export default SettingsWrapper;
