
  // LOADER
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 800);
    }, 2000);
  });

  // CURSOR
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function animCursor() {
    cursor.style.left = mx - 6 + 'px';
    cursor.style.top = my - 6 + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx - 18 + 'px';
    ring.style.top = ry - 18 + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();
  document.querySelectorAll('a,button,.menu-tab,.gallery-item,.menu-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(2.5)');
    el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
  });

  // NAVBAR SCROLL
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // HERO SLIDER
  let current = 0;
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  function goSlide(n) {
    current = n;
    document.getElementById('heroSlider').style.transform = `translateX(-${n * 100}%)`;
    document.getElementById('heroSlider').style.transition = 'transform 1.2s cubic-bezier(.77,0,.18,1)';
    dots.forEach((d,i) => d.classList.toggle('active', i === n));
  }
  setInterval(() => goSlide((current + 1) % slides.length), 5000);

  // MENU TABS
  function switchTab(id) {
    document.querySelectorAll('.menu-tab').forEach((t,i) => {
      const tabs = ['regular','lunch','snacks','dessert','beverages'];
      t.classList.toggle('active', tabs[i] === id);
    });
    document.querySelectorAll('.menu-panel').forEach(p => {
      p.classList.toggle('active', p.id === 'panel-' + id);
    });
  }

  // SCROLL REVEAL
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  reveals.forEach(r => obs.observe(r));

  // FORM HANDLER
  function handleForm(e, type) {
    e.preventDefault();
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    document.getElementById('modalTitle').textContent = type === 'reservation' ? 'Reservation Received!' : 'Feedback Submitted!';
    document.getElementById('modalMsg').textContent = type === 'reservation'
      ? 'Your table reservation has been received. Our team will confirm within 2 hours.'
      : 'Thank you for your valued feedback. We will respond within 24 hours.';
    modal.show();
    e.target.reset();
  }

  // FULL MENU MODAL
//   function showFullMenu() {
//     alert('Full Menu PDF would open here — connecting to the 72 rotating seasonal collections.');
//   }

  // ACTIVE NAV LINK ON SCROLL
  const sections = document.querySelectorAll('section[id], div[id]');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
    });
    document.querySelectorAll('.bottom-nav-item').forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
    });
  });
  function validateReservationForm(e) {
    e.preventDefault();

    let isValid = true;

    // GET VALUES
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let branch = document.getElementById("branch").value.trim();
    let date = document.getElementById("date").value;
    let guests = document.getElementById("guests").value;

    // REGEX
    let nameRegex = /^[A-Za-z\s]{3,40}$/;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let phoneRegex = /^(\+92|0)3[0-9]{9}$/;

    // CLEAR ERRORS
    document.querySelectorAll(".text-danger").forEach(el => el.innerText = "");

    // NAME
    if (!nameRegex.test(name)) {
        document.getElementById("nameError").innerText = "Enter valid name (letters only)";
        isValid = false;
    }

    // EMAIL
    if (!emailRegex.test(email)) {
        document.getElementById("emailError").innerText = "Enter valid email address";
        isValid = false;
    }

    // PHONE
    if (!phoneRegex.test(phone)) {
        document.getElementById("phoneError").innerText = "Enter valid Pakistani number";
        isValid = false;
    }

    // BRANCH
    if (branch.length < 2) {
        document.getElementById("branchError").innerText = "Enter branch name";
        isValid = false;
    }

    // DATE CHECK
    let today = new Date().toISOString().split("T")[0];
    if (!date || date < today) {
        document.getElementById("dateError").innerText = "Select a future date";
        isValid = false;
    }

    // GUESTS
    if (guests === "") {
        document.getElementById("guestsError").innerText = "Select number of guests";
        isValid = false;
    }

    // IF VALID → SHOW MODAL
    if (isValid) {
        document.getElementById("modalTitle").innerText = "Reservation Confirmed!";
        document.getElementById("modalMsg").innerText =
            "Your table has been successfully reserved. We look forward to serving you.";

        let modal = new bootstrap.Modal(document.getElementById("successModal"));
        modal.show();

        document.getElementById("reservationForm").reset();
    }

    return false;
}
// feedback 
function validateFeedbackForm(e) {
    e.preventDefault();

    let isValid = true;

    // VALUES
    let name = document.getElementById("fbName").value.trim();
    let email = document.getElementById("fbEmail").value.trim();
    let type = document.getElementById("fbType").value;
    let branch = document.getElementById("fbBranch").value.trim();
    let message = document.getElementById("fbMessage").value.trim();

    // REGEX
    let nameRegex = /^[A-Za-z\s]{3,40}$/;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // CLEAR OLD ERRORS
    document.querySelectorAll("#feedbackForm .text-danger").forEach(el => el.innerText = "");

    // NAME VALIDATION
    if (!nameRegex.test(name)) {
        document.getElementById("fbNameError").innerText =
            "Please enter a valid name (letters only).";
        isValid = false;
    }

    // EMAIL VALIDATION
    if (!emailRegex.test(email)) {
        document.getElementById("fbEmailError").innerText =
            "Please enter a valid email address.";
        isValid = false;
    }

    // TYPE VALIDATION
    if (type === "") {
        document.getElementById("fbTypeError").innerText =
            "Please select feedback type.";
        isValid = false;
    }

    // BRANCH VALIDATION
    if (branch.length < 2) {
        document.getElementById("fbBranchError").innerText =
            "Please enter branch or city name.";
        isValid = false;
    }

    // MESSAGE VALIDATION
    if (message.length < 10) {
        document.getElementById("fbMessageError").innerText =
            "Message must be at least 10 characters.";
        isValid = false;
    }

    // IF ALL VALID → SHOW SUCCESS MODAL
    if (isValid) {

        document.getElementById("modalTitle").innerText = "Feedback Submitted!";
        document.getElementById("modalMsg").innerText =
            "Thank you for sharing your thoughts with us. We truly value your feedback.";

        let modal = new bootstrap.Modal(document.getElementById("successModal"));
        modal.show();

        document.getElementById("feedbackForm").reset();
    }

    return false;
}