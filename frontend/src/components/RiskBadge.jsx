export default function RiskBadge({ prediction }) {
  const isClassOne = Number(prediction) === 1;
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${isClassOne ? "bg-ember/15 text-ember" : "bg-moss/15 text-moss"}`}>Model class {prediction}</span>;
}
