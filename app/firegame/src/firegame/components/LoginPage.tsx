import React, { FormEvent } from "react";
import store from "../../shared/store";
import styles from "../../shared/styles.module.css";
import writer from "../writer/writer";
import css from "./index.module.css";

class LoginPage extends React.Component {
  inputRef: React.RefObject<HTMLInputElement> = React.createRef();
  render() {
    return (
      <div className={`${css.login} ${styles.bubble}`}>
        <p>Welcome to {store.me.gameName}!</p>
        <p>Enter your name to continue</p>
        <form onSubmit={this.setUsername.bind(this)}>
          <input type="text" ref={this.inputRef} />
          <input type="submit" />
        </form>
      </div>
    );
  }

  componentDidMount() {
    this.inputRef.current?.focus();
  }

  setUsername(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const username: string = this.inputRef.current!.value;
    writer.setUsername(username);
  }
}

export default LoginPage;
