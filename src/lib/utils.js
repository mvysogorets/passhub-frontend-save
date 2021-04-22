
function serverLog(msg) {
  /*
  $.ajax({
    url: 'serverlog.php',
    type: 'POST',
    data: {
    //  verifier: csrf,
      msg,
    },
    error: () => {},
    success: () => {},
  });
  */
}

//https://en.wikipedia.org/wiki/List_of_the_most_common_passwords
const frequentPasswords = [
"01234567890",
"123123321",
"0000000000",
"1111111111",
"5555555555",
"6666666666",
"6969696969",
"7777777777",
"8888888888",
"09876543210",
"123qwe",
"1qaz2wsx3edc",
"1q2w3e4r5t",
"aa123456789",
"aaron431",
"administrator",
"access",
"ashley",
"asdfghjkl",
"azerty",
"baseball",
"bailey",
"batman",
"password1",
"passw0rd",
"picture1",
"abc123",
"charlie",
"donald",
"dragon",
"flower",
"football",
"freedom",
"google",
"iloveyou",
"letmein",
"loveme",
"lovely",
"master",
"million2",
"monkey",
"mustang",
"mynoob",
"princess",
"qazwsxedc",
"qqww1122",
"querty123",
"quertyiop",
"shadow",
"starwars",
"sunshine",
"superman",
"trustno1",
"welcome",
"whatever",
"zaq1zaq1",
"zxcvbnm",
"!@#$%^&*"
];

function isStrongPassword(pw) {
  if(pw.length < 6) {
    return false;
  }
  const lpw = pw.toLowerCase();
  for(const p of frequentPasswords) {
    if(p.indexOf(lpw) !== -1) {
      return false;
    }
  }
  return true;
}

export {
  serverLog,
  isStrongPassword,
};
