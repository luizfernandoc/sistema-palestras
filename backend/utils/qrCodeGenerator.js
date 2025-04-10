// utils/qrCodeGenerator.js
const QRCode = require('qrcode');

exports.generateQRCodeForPresentation = async (accessCode, frontendUrl) => {
  try {
    const accessUrl = `${frontendUrl}/audience/join/${accessCode}`;
    const qrCodeDataUrl = await QRCode.toDataURL(accessUrl);
    
    return {
      qrCode: qrCodeDataUrl,
      accessUrl
    };
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    throw error;
  }
};