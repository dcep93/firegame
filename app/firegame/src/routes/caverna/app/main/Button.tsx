import { ReactNode } from "react";

export default function Button(props: {
  text: string;
  children: ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        padding: 0,
        margin: 0,
      }}
    >
      <div
        style={{
          width: 0,
        }}
      >
        <button
          disabled={props.disabled}
          style={{
            position: "absolute",
            top: "60%",
            transform: "translate(0, -100%)",
          }}
          onClick={() => !props.disabled && props.onClick()}
        >
          <pre style={{ margin: "0.2em -0.05em" }}>{props.text}</pre>
        </button>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "40%",
          transform: "translate(0, 100%)",
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
