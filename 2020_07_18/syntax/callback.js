// function a() {
//   console.log('A');
// }

var a = function() {
  console.log('A');
}
function slowfunc(callback) {
  callback();
}

slowfunc(a);  // 그냥 매개변수로 함수 받을수있는게 콜백아님?
// 아니면 뭐지?
