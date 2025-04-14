/**
 * Share Functions
 * Maneja la funcionalidad del menú desplegable de compartir y las opciones
 * para compartir por email, WhatsApp y copiar el enlace al portafolio
 */

document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  // Los botones originales (estáticos)
  const shareButton = document.getElementById('share-button');
  const shareDropdown = document.getElementById('share-dropdown');
  const emailShare = document.getElementById('email-share');
  const whatsappShare = document.getElementById('whatsapp-share');
  const copyLink = document.getElementById('copy-link');
  const staticButtons = document.getElementById('static-buttons');

  // URL del portafolio principal (sin parámetros)
  const portfolioUrl = 'https://migueldilalla.github.io/';
  
  // Textos para compartir
  const shareSubject = 'Te comparto el portafolio de Miguel Di Lalla';
  const shareText = 'Dale un vistazo a este portafolio de Data Science y Machine Learning: ';
  
  // Función para mostrar/ocultar el menú desplegable (para cualquier botón)
  function toggleDropdown(dropdownElement) {
    dropdownElement.classList.toggle('hidden');
  }
  
  // Función para cerrar el menú si se hace clic fuera de él (para todos los dropdowns)
  function closeDropdownOnClickOutside(event) {
    // Cerrar dropdown estático si existe
    if (shareDropdown && !event.target.closest('#share-dropdown-container')) {
      shareDropdown.classList.add('hidden');
    }
    
    // Cerrar dropdown dinámico si existe
    const dynamicDropdown = document.getElementById('share-dropdown-dynamic');
    if (dynamicDropdown && !event.target.closest('#share-dropdown-container-dynamic')) {
      dynamicDropdown.classList.add('hidden');
    }
  }
  
  // Función para compartir por email
  function shareByEmail(event) {
    event.preventDefault();
    
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(shareSubject)}&body=${encodeURIComponent(shareText + portfolioUrl)}`;
    window.location.href = mailtoUrl;
    
    // Cerrar todos los menús desplegables
    if (shareDropdown) shareDropdown.classList.add('hidden');
    const dynamicDropdown = document.getElementById('share-dropdown-dynamic');
    if (dynamicDropdown) dynamicDropdown.classList.add('hidden');
  }
  
  // Función para compartir por WhatsApp
  function shareByWhatsapp(event) {
    event.preventDefault();
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + portfolioUrl)}`;
    window.open(whatsappUrl, '_blank');
    
    // Cerrar todos los menús desplegables
    if (shareDropdown) shareDropdown.classList.add('hidden');
    const dynamicDropdown = document.getElementById('share-dropdown-dynamic');
    if (dynamicDropdown) dynamicDropdown.classList.add('hidden');
  }
  
  // Función para copiar el enlace al portafolio
  function copyLinkToClipboard() {
    navigator.clipboard.writeText(portfolioUrl).then(() => {
      // Mostrar notificación de éxito
      showCopyNotification();
    }).catch(err => {
      console.error('Error al copiar: ', err);
    });
    
    // Cerrar todos los menús desplegables
    if (shareDropdown) shareDropdown.classList.add('hidden');
    const dynamicDropdown = document.getElementById('share-dropdown-dynamic');
    if (dynamicDropdown) dynamicDropdown.classList.add('hidden');
  }
  
  // Función para mostrar notificación de enlace copiado
  function showCopyNotification() {
    // Crear la notificación
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-lg z-50';
    notification.textContent = '¡Enlace copiado al portapapeles!';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    
    // Añadir la notificación al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 10);
    
    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  // Escuchamos el evento de que la animación de la carta ha terminado
  window.addEventListener('letter-animation-completed', function() {
    // Mostrar los botones estáticos con una animación de fade in
    if (staticButtons) {
      staticButtons.style.transition = 'opacity 0.6s ease';
      staticButtons.style.opacity = '1';
    }
  });
  
  // Manejo global de eventos para ambos conjuntos de botones (estático y dinámico)
  document.addEventListener('click', function(event) {
    const target = event.target;
    
    // Manejo de clics en botones de compartir (estático y dinámico)
    if (target.id === 'share-button' || target.closest('#share-button')) {
      if (shareDropdown) {
        toggleDropdown(shareDropdown);
        event.stopPropagation();
      }
    } else if (target.id === 'share-button-dynamic' || target.closest('#share-button-dynamic')) {
      const dynamicDropdown = document.getElementById('share-dropdown-dynamic');
      if (dynamicDropdown) {
        toggleDropdown(dynamicDropdown);
        event.stopPropagation();
      }
    }
    
    // Manejo de clics en opciones de compartir (estático y dinámico)
    const closestTarget = target.closest('a, button');
    if (!closestTarget) return;
    
    // Opciones estáticas
    if (closestTarget.id === 'email-share') {
      shareByEmail(event);
    } else if (closestTarget.id === 'whatsapp-share') {
      shareByWhatsapp(event);
    } else if (closestTarget.id === 'copy-link') {
      copyLinkToClipboard();
    }
    
    // Opciones dinámicas
    if (closestTarget.id === 'email-share-dynamic') {
      shareByEmail(event);
    } else if (closestTarget.id === 'whatsapp-share-dynamic') {
      shareByWhatsapp(event);
    } else if (closestTarget.id === 'copy-link-dynamic') {
      copyLinkToClipboard();
    }
  });
  
  // Event listener para cerrar dropdowns al hacer clic fuera
  document.addEventListener('click', closeDropdownOnClickOutside);
});