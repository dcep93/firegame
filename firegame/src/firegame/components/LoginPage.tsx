import React, { FormEvent } from "react";

import css from "../css/LoginPage.module.css";
import styles from "../../shared/css/Styles.module.css";

class LoginPage extends React.Component<{
	name: string;
	setUsername: (username: string) => void;
}> {
	inputRef: React.RefObject<HTMLInputElement> = React.createRef();
	render() {
		return (
			<div className={`${css.main} ${styles.bubble}`}>
				<p>Welcome to {this.props.name}!</p>
				<p>Enter your name to continue</p>
				<form onSubmit={this.setUsername.bind(this)}>
					<input type="text" ref={this.inputRef} />
				</form>
			</div>
		);
	}

	setUsername(e: FormEvent<HTMLFormElement>): void {
		e.preventDefault();
		const username: string = this.inputRef.current!.value;
		this.props.setUsername(username);
	}
}

export default LoginPage;
