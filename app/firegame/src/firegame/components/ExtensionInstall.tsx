import React from "react";
import { Link } from "react-router-dom";

import css from "./index.module.css";

const sourceZipUrl =
  "https://github.com/dcep93/firegame/archive/refs/heads/master.zip";

function ExtensionInstall() {
  const [copyLabel, setCopyLabel] = React.useState("Copy");

  async function copyExtensionsUrl() {
    try {
      await navigator.clipboard.writeText("chrome://extensions");
      setCopyLabel("Copied");
    } catch {
      setCopyLabel("Copy failed");
    }

    window.setTimeout(() => setCopyLabel("Copy"), 1600);
  }

  return (
    <main className={css.extensionInstall}>
      <Link className={css.extensionBackLink} to="/">
        Firegame
      </Link>
      <h1>Install Firegame extension</h1>
      <ol>
        <li>
          Download the Firegame source code ZIP from{" "}
          <a href={sourceZipUrl}>GitHub</a>.
        </li>
        <li>Unzip the file.</li>
        <li>
          Visit <code>chrome://extensions</code>{" "}
          <button type="button" onClick={copyExtensionsUrl}>
            {copyLabel}
          </button>{" "}
          in Chrome.
        </li>
        <li>
          Turn on <strong>Developer mode</strong>.
        </li>
        <li>
          Click <strong>Load unpacked</strong>, then select the{" "}
          <code>extension</code> folder inside the unzipped source code.
        </li>
      </ol>
    </main>
  );
}

export default ExtensionInstall;
