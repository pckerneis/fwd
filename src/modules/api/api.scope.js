let scopes = [getDefaultScope()];

function getDefaultScope() {
  return {
    cursor: 0,
    midiChannel: 0,
  };
}

export function resetScopes() {
  scopes = [getDefaultScope()];
}

export function pushScope(scope) {
  scopes.push(scope);
}

export function popScope() {
  return scopes.pop();
}

export function getCurrentScope() {
  return scopes[scopes.length - 1];
}
