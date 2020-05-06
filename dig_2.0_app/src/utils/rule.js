const ruleObj = {
  bankCode: /^([1-9]{1})(\d{15}|\d{18})$/,
  phone: /^[1]\d{10}$/,
  password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/,
  number: /^\d*$/,
  idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, //身份证
  email: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
};
export function testRule(type, str) {
  return ruleObj[type].test(str);
}
