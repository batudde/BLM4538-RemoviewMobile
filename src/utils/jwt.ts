export function isLikelyJwt(token: string) {
  return token.split('.').length === 3;
}
