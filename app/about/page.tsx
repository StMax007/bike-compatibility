import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen px-4 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">About BikeCompat</h1>

      <div className="space-y-8 text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">What is this?</h2>
          <p>
            BikeCompat helps road cyclists quickly check whether components from different
            groupsets will work together. Select your current groupset and instantly see which
            chains, cassettes, derailleurs, shifters, and other components are compatible — no
            more digging through forum posts or manufacturer PDFs.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Supported brands and systems</h2>
          <div className="space-y-3">
            {[
              {
                brand: 'Shimano Road',
                items: ['105 R7000 (11s mechanical)', 'Ultegra R8000 (11s mechanical)', 'Dura-Ace R9100 (11s mechanical)', '105 R7100 Di2 (12s electronic)', 'Ultegra R8100 Di2 (12s electronic)', 'Dura-Ace R9200 Di2 (12s electronic)'],
              },
              {
                brand: 'SRAM Road',
                items: ['Rival 22 (11s mechanical)', 'Force 22 (11s mechanical)', 'Red 22 (11s mechanical)', 'Rival AXS (12s electronic)', 'Force AXS (12s electronic)', 'Red AXS (12s electronic)'],
              },
              {
                brand: 'Campagnolo',
                items: ['Chorus 11s', 'Record 11s', 'Super Record 11s', 'Chorus 12s', 'Record 12s', 'Super Record 12s'],
              },
            ].map(({ brand, items }) => (
              <div key={brand}>
                <p className="font-medium text-white text-sm mb-1">{brand}</p>
                <ul className="text-sm text-gray-400 space-y-0.5 list-disc list-inside">
                  {items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Compatibility rules</h2>
          <ul className="text-sm space-y-2 text-gray-400 list-disc list-inside">
            <li>Shimano 11-speed road (R7000/R8000/R9100) components are cross-compatible</li>
            <li>Shimano 12-speed Di2 (R7100/R8100/R9200) components are cross-compatible</li>
            <li>Shimano 11s and 12s are <strong className="text-white">not</strong> cross-compatible</li>
            <li>SRAM 11-speed mechanical (Rival 22/Force 22/Red 22) components are cross-compatible</li>
            <li>SRAM AXS 12-speed components are cross-compatible within the AXS ecosystem</li>
            <li>SRAM 11s and AXS 12s are <strong className="text-white">not</strong> cross-compatible</li>
            <li>Campagnolo 11s components are cross-compatible across Chorus/Record/Super Record</li>
            <li>Campagnolo 12s components are cross-compatible across Chorus/Record/Super Record</li>
            <li>Campagnolo 11s and 12s are <strong className="text-white">not</strong> cross-compatible (different freehub — N3W for 12s)</li>
            <li>Shimano, SRAM, and Campagnolo are <strong className="text-white">not</strong> mutually compatible (different cable pull ratios)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Data sources &amp; accuracy</h2>
          <p className="text-sm text-gray-400">
            Compatibility data is based on published manufacturer specifications and established
            cycling community knowledge. Prices are indicative and may vary. Always verify
            compatibility with your local bike shop before purchasing — especially for bottom
            brackets, where frame BB shell type (BSA, PF30, BB86, T47) also matters.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Affiliate disclosure</h2>
          <p className="text-sm text-gray-400">
            Buy links point to bike-components.de. We may earn a small commission on purchases
            at no extra cost to you. This helps keep the tool free.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Roadmap</h2>
          <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
            <li>Light mode</li>
            <li>More component categories (wheels, tyres, saddles)</li>
            <li>Custom component search</li>
            <li>Frame / BB shell selector</li>
            <li>User-submitted compatibility reports</li>
          </ul>
        </section>

        <div className="pt-4 border-t border-gray-800">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
