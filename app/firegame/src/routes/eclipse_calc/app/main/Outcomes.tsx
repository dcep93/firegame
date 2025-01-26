import styles from "../../../../shared/styles.module.css";

function getOutcomes(): {
  winnerIndex: number;
  survivingShips: { [name: string]: number };
  probability: number;
  cumProb: number;
}[] {
  return [
    {
      winnerIndex: 0,
      survivingShips: {},
      probability: 0,
      cumProb: Math.random(),
    },
  ];
}

export default function Outcomes() {
  return (
    <div className={styles.bubble}>
      <h2>Outcomes</h2>
      <div>
        {getOutcomes().map((o, i) => (
          <div key={i}>
            <pre>{JSON.stringify(o, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
