(() => {
  const FORMBOLD_ENDPOINT = 'https://formbold.com/s/3VaE0';

  async function loadContactForm() {
    const mountPoint = document.getElementById('contactFormMount');

    if (!mountPoint) {
      return;
    }

    try {
      const response = await fetch('./contact-form.html', {
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`Unable to load the contact form (HTTP ${response.status})`);
      }

      mountPoint.innerHTML = await response.text();
      initializeContactForm();
    } catch (error) {
      console.error('Contact form component failed to load:', error);
      mountPoint.innerHTML = '<p class="form-status error">The enquiry form could not be loaded. Please refresh the page or contact us directly.</p>';
    }
  }

  function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm || contactForm.dataset.initialized === 'true') {
      return;
    }

    contactForm.dataset.initialized = 'true';

    const submitButton = document.getElementById('submitMessage');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (submitButton.disabled) {
        return;
      }

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
      formStatus.textContent = '';
      formStatus.className = 'form-status';

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(FORMBOLD_ENDPOINT, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`FormBold returned HTTP ${response.status}`);
        }

        contactForm.reset();
        formStatus.textContent = "Thank you! Your message has been sent. We'll contact you soon.";
        formStatus.className = 'form-status success';
        submitButton.textContent = '✓ Message Sent';
        submitButton.className = 'submit-btn success';

        setTimeout(() => {
          submitButton.textContent = '✦ Send Message & Get Free Consultation';
          submitButton.className = 'submit-btn';
        }, 4000);
      } catch (error) {
        console.error('Form submission failed:', error);
        formStatus.textContent = 'We couldn’t send your message. Please check your connection and try again.';
        formStatus.className = 'form-status error';
        submitButton.textContent = 'Try Again';
        submitButton.className = 'submit-btn';
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadContactForm);
  } else {
    loadContactForm();
  }
})();
