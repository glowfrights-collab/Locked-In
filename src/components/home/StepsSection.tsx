const STEPS = [
  { number: 1, title: "Choose a wallpaper", description: "Browse the collection and pick a favorite." },
  { number: 2, title: "Complete an unlock action", description: "Watch an ad, take a survey, or invite a friend." },
  { number: 3, title: "Download instantly", description: "Your file unlocks immediately, ready to save." },
];

export function StepsSection() {
  return (
    <section className="flex flex-col gap-4 px-4 py-8">
      <h2 className="text-lg font-semibold text-ink">How it works</h2>
      <ol className="flex flex-col gap-4">
        {STEPS.map((step) => (
          <li key={step.number} className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
              {step.number}
            </span>
            <div>
              <p className="text-sm font-medium text-ink">{step.title}</p>
              <p className="text-sm text-ink-soft">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
