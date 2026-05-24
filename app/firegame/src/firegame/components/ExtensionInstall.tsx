import React from "react";
import { Link } from "react-router-dom";

import css from "./index.module.css";

const releasesUrl = "https://github.com/dcep93/firegame/releases";

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
          Open the Firegame{" "}
          <a href={releasesUrl}>GitHub releases page</a>.
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
          If you don't see <strong>Load unpacked</strong>, turn on{" "}
          <strong>Developer mode</strong>.
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
