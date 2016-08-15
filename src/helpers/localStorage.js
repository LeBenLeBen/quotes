export function set(id, data) {
  return localStorage.setItem(id, JSON.stringify(data));
}

export function get(id, data) {
  return JSON.parse(localStorage.getItem(id));
}
