var members = ['arav', 'ddori', 'k3333'];
console.log(members[1]);  // ddori
var i = 0;
while(i<members.length){
  console.log('loop', members[i]);
  i++;
}


// 배열은 [], 객체는 {}
var roles = {
  'programmer' : 'arav',
  'designer' : 'ddori',
  'manager': 'k3333'
}
console.log(roles.designer); // ddori

for(var n in roles){
  console.log('object => ', n, 'value => ', roles[n]);
}
