// 브라우저 콘솔에서 실행할 디버그 스크립트
// F12 → Console 탭에서 아래 코드를 복사해서 실행하세요

console.log('=== Auth Debug Info ===');
console.log('Token:', localStorage.getItem('authToken'));
console.log('User JSON:', localStorage.getItem('user'));

try {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('Parsed User:', user);
  console.log('User Name:', user.name);
} catch (e) {
  console.log('Failed to parse user:', e);
}

console.log('=== Clear Auth Data ===');
localStorage.removeItem('authToken');
localStorage.removeItem('user');
console.log('Auth data cleared. Please refresh the page and login again.');