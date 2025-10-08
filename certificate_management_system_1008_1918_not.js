// 代码生成时间: 2025-10-08 19:18:45
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
# 改进用户体验
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// 证书信息模型
class Certificate {
  constructor(id, name, issuer, expiryDate) {
    this.id = id;
# 改进用户体验
    this.name = name;
    this.issuer = issuer;
    this.expiryDate = expiryDate;
  }
}

// 证书管理器
class CertificateManager {
  constructor() {
# 增强安全性
    this.certificates = [];
  }

  // 添加证书
  addCertificate(name, issuer, expiryDate) {
    const id = uuidv4();
# NOTE: 重要实现细节
    const certificate = new Certificate(id, name, issuer, expiryDate);
    this.certificates.push(certificate);
# 增强安全性
    return certificate;
  }

  // 获取所有证书
  getAllCertificates() {
    return this.certificates;
  }

  // 根据ID删除证书
  deleteCertificateById(id) {
    this.certificates = this.certificates.filter(certificate => certificate.id !== id);
  }

  // 根据ID更新证书信息
  updateCertificateById(id, name, issuer, expiryDate) {
    const certificate = this.certificates.find(cert => cert.id === id);
    if (certificate) {
      certificate.name = name;
      certificate.issuer = issuer;
      certificate.expiryDate = expiryDate;
    }
  }

  // 保存证书到文件
  saveCertificatesToFile() {
    const data = JSON.stringify(this.certificates);
    const filePath = path.join(app.getPath('userData'), 'certificates.json');
    fs.writeFileSync(filePath, data, 'utf8');
  }

  // 从文件加载证书
# 增强安全性
  loadCertificatesFromFile() {
    const filePath = path.join(app.getPath('userData'), 'certificates.json');
# 扩展功能模块
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      this.certificates = JSON.parse(data);
    }
# 扩展功能模块
  }
}

// 创建并加载窗口
# TODO: 优化性能
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
# 增强安全性
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 启动时加载证书
  const certificateManager = new CertificateManager();
  certificateManager.loadCertificatesFromFile();
# 优化算法效率

  // 窗口关闭时保存证书
  win.on('close', () => {
    certificateManager.saveCertificatesToFile();
  });

  win.loadFile('index.html');
}
# TODO: 优化性能

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
# 添加错误处理
    createWindow();
  }
});