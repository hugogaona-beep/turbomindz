export function PhilosophyManifesto() {
  return (
    <section className="py-24 bg-midnight/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs text-electric uppercase tracking-widest font-body mb-6">Manifesto</p>

        <blockquote className="font-display text-h2 md:text-display-lg font-light leading-tight mb-8">
          <span className="text-gradient-gold">"The unexamined life</span>
          <br />
          is not worth living."
        </blockquote>

        <p className="text-muted font-body text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
          TURBOMINDZ was built for those who refuse to separate thinking from doing.
          Each NFT is a permanent record of a philosophy — and a live key to a community
          that turns wisdom into results.
        </p>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          {[
            { title: 'Ownership',  body: 'Full commercial rights. Trade it, build with it, pass it forward.' },
            { title: 'Access',     body: 'Gated rooms for verified holders. Real conversations, no noise.' },
            { title: 'Commerce',   body: 'Load services, post offers, earn through the network.' },
          ].map(item => (
            <div key={item.title} className="p-6 rounded-xl bg-void border border-border">
              <h3 className="font-display text-xl font-light text-electric mb-2">{item.title}</h3>
              <p className="text-sm text-muted font-body leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
