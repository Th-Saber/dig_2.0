//这个js文件是用来存放表单验证规则
const baseType = {
  string: ""
};

export default {
  required(message, type = baseType.string) {
    return { type: type, required: true, message: `请输入${message}`, trigger };
  },
  // 邮箱正则
  email(message = "邮箱格式不正确", type = baseType.string) {
    return {
      type: type,
      pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
      message: message,
      trigger
    };
  },
  // 只能输入汉字
  chinese(message = "只能输入汉字", type = baseType.string) {
    return {
      type: type,
      pattern: /^[\u4e00-\u9fa5]+$/,
      message: message,
      trigger
    };
  },
  // 只能输入整数
  number(message = "只能输入整数") {
    return { pattern: /^\d*$/, message: message, trigger };
  },
  // 可以输入小数
  float(message = "只能输入大于0的数字，最多两位小数") {
    return {
      pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,
      message: message,
      trigger
    };
  },
  // 输入正确的手机号码
  phone(message = "输入正确的手机号码") {
    return { pattern: /^[1]\d{10}$/, message: message, trigger };
  },
  // 必须包含字母和数字
  letterAndNumber(message = "必须包含字母和数字") {
    return { pattern: /^(?![^a-zA-Z]+$)(?!\D+$)/, message: message, trigger };
  },
  pwd(message = "密码只能[字母+数字,字母+特殊字符，数字+特殊字符]") {
    return {
      pattern: /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/,
      message: message,
      trigger
    };
  },
  // 长度范围
  range(min, max, type = baseType.string) {
    return {
      type: type,
      min: min,
      max: max,
      message: `长度在 ${min} 到 ${max}`,
      trigger
    };
  }
};
