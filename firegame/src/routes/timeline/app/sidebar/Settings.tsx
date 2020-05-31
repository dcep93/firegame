import React, { RefObject } from "react";

import { store } from "../utils/utils";
import Quizlet from "../utils/Quizlet";
import NewGame, { Params } from "../utils/NewGame";

import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";

const DEFAULT_SET_ID = "284065846";

type SetsToTitlesType = { [setId: number]: string };

class Settings extends React.Component<{}, { setsToTitles: SetsToTitlesType }> {
	handSizeRef: RefObject<HTMLInputElement> = React.createRef();
	boardSizeRef: RefObject<HTMLInputElement> = React.createRef();
	swapRef: RefObject<HTMLInputElement> = React.createRef();
	reverseRef: RefObject<HTMLInputElement> = React.createRef();
	useRankRef: RefObject<HTMLInputElement> = React.createRef();
	quizletRef: RefObject<HTMLInputElement> = React.createRef();

	componentDidMount() {
		if (this.state) return;
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
						<span onClick={this.refresh.bind(this)}>Quizlet: </span>
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

	refresh() {
		localStorage.fetchedFromFolderVersion = null;
		this.fetchFromFolder().then(() => alert("refreshed"));
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

	fetchFromFolder(): Promise<void> {
		return this.fetchFromFolderHelper().then((setsToTitles) =>
			this.setState({ setsToTitles })
		);
	}

	fetchFromFolderHelper(): Promise<SetsToTitlesType> {
		if (
			localStorage.fetchedFromFolderVersion === store.me.VERSION &&
			localStorage.fetchedFromFolder
		)
			return Promise.resolve(localStorage.fetchedFromFolder).then(
				JSON.parse
			);
		return Quizlet.fetch(Quizlet.FOLDER_URL, "")
			.then(this.seedFromFolder.bind(this))
			.then((fetchedFromFolder) => {
				localStorage.fetchedFromFolder = JSON.stringify(
					fetchedFromFolder
				);
				localStorage.fetchedFromFolderVersion = store.me.VERSION;
				return fetchedFromFolder;
			});
	}

	seedFromFolder(blob: any): Promise<SetsToTitlesType> {
		const promises = blob.folderSet.map((model: { setId: number }) =>
			Quizlet.fetch(Quizlet.SET_URL, model.setId.toString())
		);
		return Promise.all(promises)
			.then((responses: any[]) =>
				responses.map((response: any) => {
					const set = response.set[0];
					return { id: set.id, title: set.title };
				})
			)
			.then((responses: any[]) => {
				const setsToTitles: SetsToTitlesType = {};
				responses.forEach(
					(response: { id: number; title: string }) =>
						(setsToTitles[response.id] = response.title)
				);
				return setsToTitles;
			});
	}

	startGame(e: React.MouseEvent) {
		e.preventDefault();
		Promise.resolve()
			.then(this.getParams.bind(this))
			.then(NewGame)
			.catch((e) => alert(e))
			.then((game) => game && store.update("started a new game", game));
	}

	getParams(): Params {
		return {
			userId: store.me.userId,
			lobby: store.lobby,
			quizlet: this.quizletRef.current!.value,
			handSize: parseInt(this.handSizeRef.current!.value),
			boardStartingSize: parseInt(this.boardSizeRef.current!.value),
			swap: this.swapRef.current!.checked,
			reverse: this.reverseRef.current!.checked,
			useRank: this.useRankRef.current!.checked,
		};
	}
}

export default Settings;
