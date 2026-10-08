export default function StatusBadge({ value }: { value: string }) {
  const css = value.toLowerCase().replaceAll('_', '-')
  return <span className={`badge badge-${css}`}>{value.replaceAll('_', ' ')}</span>
}
