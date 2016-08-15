/**
 * From http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
export function hash(str) {
  let hash = 0;

  if (!str) return hash;

  if (typeof str === 'object') {
    str = str.join('');
  }

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash &= hash; // Convert to 32bit integer
  }

  return hash;
}
