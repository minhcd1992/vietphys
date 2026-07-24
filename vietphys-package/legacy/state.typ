#let vp-q-counter = counter("vp-question")
#let vp-show-ans = state("vp-show-ans", false)
#let vp-show-sol = state("vp-show-sol", false)
#let vp-show-level = state("vp-show-level", true)
#let vp-show-source = state("vp-show-source", false)
#let vp-sol-store = state("vp-sol-store", ())

#let vp-config(ans: none, sol: none, level: none, source: none) = {
  if ans != none { vp-show-ans.update(ans) }
  if sol != none { vp-show-sol.update(sol) }
  if level != none { vp-show-level.update(level) }
  if source != none { vp-show-source.update(source) }
}
#let vp-reset() = { vp-q-counter.update(0) }
#let vp-clear-solutions() = { vp-sol-store.update(()) }
