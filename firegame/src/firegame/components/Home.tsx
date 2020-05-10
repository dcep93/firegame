import React from "react";
import { Link } from "react-router-dom";

import games from "../games";

import styles from "../../shared/styles.module.css";

class Home extends React.Component {
	render() {
		return <h2>{Object.keys(games).map(this.renderLink.bind(this))}</h2>;
	}

	renderLink(gameName: string) {
		return (
			<div key={gameName} className={styles.bubble}>
				<Link to={`/${gameName}`}>{gameName.toLocaleUpperCase()}</Link>
			</div>
		);
	}
}

export default Home;
