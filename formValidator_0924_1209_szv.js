// 代码生成时间: 2025-09-24 12:09:50
const { app, BrowserWindow } = require('electron');

// 表单数据验证器
class FormValidator {
  // 构造函数
  constructor(validationRules) {
    this.validationRules = validationRules;
  }

  // 验证表单数据
  validate(formData) {
    const errors = [];

    // 遍历验证规则进行校验
    for (const [field, rules] of Object.entries(this.validationRules)) {
      const value = formData[field];

      for (const rule of rules) {
        if (rule.required && (value === undefined || value === '')) {
          errors.push({ field, message: `${field} is required.` });
          continue;
        }

        if (rule.email && !this.isEmail(value)) {
          errors.push({ field, message: `${field} is not a valid email.` });
          continue;
        }

        if (rule.minLength && value.length < rule.minLength) {
          errors.push({ field, message: `${field} must be at least ${rule.minLength} characters long.` });
          continue;
        }

        // 可以添加更多规则检查
      }
    }

    return errors.length === 0 ? null : errors;
  }

  // 检查是否为有效的电子邮件
  isEmail(email) {
    const re = /^(([^<>()\[\]\.,;:\s@"!#\$%&'\*+-=\?\^_`{|}~\]\/]|(\u00A0))+)(\.\1)*@(\[?)(\d{1,3}\.){3}\d{1,3}\]?$/i;
    return re.test(String(email).toLowerCase());
  }
}

// 创建一个Electron窗口
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
  // 其他窗口配置
  // ...
}

// Electron主程序
app.whenReady().then(createWindow);

// 应用退出时执行清理
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});