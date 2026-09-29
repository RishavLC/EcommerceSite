export default function ComingSoon({ title, phase }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">
        Built out in {phase}. This page is just a routed placeholder for now.
      </p>
    </div>
  )
}
