import { configure } from 'mobx';

// Configure MobX for strict mode
configure({
  enforceActions: 'always', // Require actions for state mutations
  computedRequiresReaction: true, // Computed values require reactions
  reactionRequiresObservable: true, // Reactions require observable state
  observableRequiresReaction: true, // Observable access requires reactions
  disableErrorBoundaries: true // Disable error boundaries for better debugging
});
