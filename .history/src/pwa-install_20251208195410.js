// PWA Installation Handler
let deferredPrompt;
let installButton;

// បង្កើត Install Button ដោយស្វ័យប្រវត្តិ
window.addEventListener('load', () => {
  createInstallButton();
  registerServiceWorker();
});

// Register Service Worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registered successfully:', registration.scope);
        
        // ពិនិត្យមើល updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // មានកំណែថ្មី - ប្រាប់អ្នកប្រើប្រាស់
              showUpdateNotification();
            }
          });
        });
      })
      .catch((error) => {
        console.log('❌ Service Worker registration failed:', error);
      });
  }
}

// បង្កើត Install Button
function createInstallButton() {
  installButton = document.createElement('button');
  installButton.id = 'installAppBtn';
  installButton.innerHTML = '<i class="fas fa-download"></i> ដំឡើង App';
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 15px 25px;
    border-radius: 50px;
    font-size: 1em;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    z-index: 9999;
    display: none;
    transition: all 0.3s ease;
    font-family: 'Khmer OS Battambang', sans-serif;
  `;
  
  installButton.addEventListener('mouseenter', () => {
    installButton.style.transform = 'translateY(-3px) scale(1.05)';
    installButton.style.boxShadow = '0 12px 25px rgba(102, 126, 234, 0.6)';
  });
  
  installButton.addEventListener('mouseleave', () => {
    installButton.style.transform = 'translateY(0) scale(1)';
    installButton.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
  });
  
  installButton.addEventListener('click', installApp);
  document.body.appendChild(installButton);
}

// Listen for install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('💡 Install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  
  // បង្ហាញ button
  if (installButton) {
    installButton.style.display = 'block';
  }
});

// Install App function
async function installApp() {
  if (!deferredPrompt) {
    alert('កម្មវិធីនេះត្រូវបានដំឡើងរួចហើយ ឬមិនអាចដំឡើងបានទេ។');
    return;
  }
  
  // បង្ហាញ install prompt
  deferredPrompt.prompt();
  
  // រង់ចាំចម្លើយពីអ្នកប្រើប្រាស់
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response: ${outcome}`);
  
  if (outcome === 'accepted') {
    console.log('✅ អ្នកប្រើប្រាស់បានដំឡើង App');
    showSuccessMessage();
  } else {
    console.log('❌ អ្នកប្រើប្រាស់បដិសេធមិនដំឡើង');
  }
  
  // លុប prompt
  deferredPrompt = null;
  installButton.style.display = 'none';
}

// បង្ហាញសារជោគជ័យ
function showSuccessMessage() {
  const message = document.createElement('div');
  message.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #28a745;
      color: white;
      padding: 15px 30px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      z-index: 10000;
      font-weight: 600;
      animation: slideDown 0.5s ease;
    ">
      ✅ ដំឡើង App ជោគជ័យ! អរគុណ! 🎉
    </div>
  `;
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.remove();
  }, 3000);
}

// បង្ហាញការជូនដំណឹងអំពីការ update
function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed;
      bottom: 80px;
      right: 20px;
      background: #ffc107;
      color: #333;
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      z-index: 9999;
      max-width: 300px;
      font-weight: 600;
    ">
      🔄 មានកំណែថ្មី! សូម Reload ទំព័រ
      <button onclick="window.location.reload()" style="
        display: block;
        margin-top: 10px;
        background: #333;
        color: white;
        border: none;
        padding: 8px 20px;
        border-radius: 5px;
        cursor: pointer;
        width: 100%;
      ">Reload ឥឡូវ</button>
    </div>
  `;
  document.body.appendChild(notification);
}

// ពិនិត្យមើលថាតើ App ត្រូវបាន install ហើយឬនៅ
window.addEventListener('appinstalled', () => {
  console.log('✅ PWA installed successfully!');
  if (installButton) {
    installButton.style.display = 'none';
  }
  
  // Analytics tracking (optional)
  if (typeof gtag !== 'undefined') {
    gtag('event', 'app_installed', {
      event_category: 'PWA',
      event_label: 'Installation'
    });
  }
});

// ពិនិត្យមើលថាតើកំពុងរត់ជា standalone app
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('🎉 Running as installed PWA!');
  // លាក់ Install button បើកំពុងរត់ជា app
  if (installButton) {
    installButton.style.display = 'none';
  }
}
