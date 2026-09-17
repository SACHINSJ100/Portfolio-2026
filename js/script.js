/**
 * SACHIN S J - Portfolio Application Script
 * Interactive features: Theme toggle, dynamic project filtering, modal viewer,
 * resume actions, stats counters, copy to clipboard, and contact form handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initTheme();
  initNavigation();
  initHeaderScroll();
  initStatsCounter();
  initProjectFiltering();
  initModals();
  initCopyButtons();
  initContactForm();

  // Dynamic footer year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ==========================================================================
   1. Theme Toggle (Dark/Light with localStorage)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('sachin_portfolio_theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  // Apply saved theme or default to dark
  if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('sachin_portfolio_theme', targetTheme);
      showToast(`Switched to ${targetTheme === 'light' ? 'Light' : 'Dark'} mode`);
    });
  }
}

/* ==========================================================================
   2. Mobile Navigation & Active Link Tracking
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile menu on click outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active section tracking using IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }
}

/* ==========================================================================
   3. Header Sticky Appearance on Scroll
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   4. Stats Counter Animation
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length === 0) return;

  let animated = false;

  const countUp = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const isFloat = target % 1 !== 0;
    const duration = 1800; // ms
    const stepTime = 25;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = `${prefix}${isFloat ? current.toFixed(1) : Math.floor(current)}${suffix}`;
    }, stepTime);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(num => countUp(num));
      }
    });
  }, { threshold: 0.3 });

  const statsStrip = document.querySelector('.hero-stats-strip');
  if (statsStrip) {
    observer.observe(statsStrip);
  }
}

/* ==========================================================================
   5. Project Filter Tabs
   ========================================================================== */
function initProjectFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length === 0 || projectCards.length === 0) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   6. Project Case Studies & Resume Modals
   ========================================================================== */
const projectCaseStudies = {
  'project-1': {
    title: 'Accrued Revenue & Multi-Branch Sales Intelligence',
    category: 'Business Intelligence & Reporting',
    organization: "Khan's Tutorial (US-Based EdTech)",
    period: 'Dec 2024 – Present',
    techStack: ['Power BI', 'SQL Server', 'Python', 'Excel ETL', 'GradeCam DB'],
    problem: 'Executive leaders required real-time visibility and cross-branch comparative metrics for monthly sales, tuition collections, and accrued revenues across multiple learning centers.',
    solution: 'Engineered automated Accrued Revenue data pipelines and created executive Power BI dashboards with drill-down capability from overall regional revenue down to individual branch metrics and student enrollment numbers.',
    achievements: [
      'Empowered C-level executives to evaluate monthly sales performance across all branches with 100% data consistency.',
      'Sanitized and managed student records inside GradeCam, ensuring flawless upstream-to-downstream data integrity.',
      'Designed standardized executive reporting templates that cut manual review time by hours per billing cycle.'
    ]
  },
  'project-2': {
    title: 'Employee Promotion Likelihood Prediction Model',
    category: 'Machine Learning & HR Analytics',
    organization: 'Freelance Data Analytics',
    period: 'Sep 2023 – Present',
    techStack: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib'],
    problem: 'HR departments struggled with subjective and delayed promotion evaluations, leading to attrition of top performers and delayed career progression.',
    solution: 'Built an end-to-end Machine Learning classification pipeline using Scikit-Learn that evaluates multi-variable employee historical performance, training scores, project KPI completion rates, and tenure to predict promotion probability.',
    achievements: [
      'Executed thorough exploratory data analysis (EDA) and sophisticated feature engineering to resolve class imbalance in HR data.',
      'Provided HR leadership with ranked potential lists, ensuring data-backed, unbiased talent advancement decisions.'
    ]
  },
  'project-3': {
    title: 'Pharmacological Side Effects Classification & Web App',
    category: 'Machine Learning & Clinical Analytics',
    organization: 'TCS iON',
    period: 'Jun 2023 – Aug 2023',
    techStack: ['Python', 'Scikit-Learn', 'Flask', 'Power BI', 'Pandas'],
    problem: 'Complex pharmacological datasets contained intricate molecular side-effect profiles with high false negative risks, requiring automated predictive classification and stakeholder reporting.',
    solution: 'Developed a robust multi-class ML classification model in Python/Scikit-Learn, optimized via hyperparameter tuning, and packaged the inference engine into a responsive Flask web application paired with interactive Power BI dashboards.',
    achievements: [
      'Boosted classification model accuracy by 5% and significantly reduced critical false negatives.',
      'Constructed complete end-to-end data pipeline from raw pharmacological ingest to interactive stakeholder presentation.'
    ]
  },
  'project-4': {
    title: 'Small Business Inventory & Stock Optimization Suite',
    category: 'BI & Statistical Operations',
    organization: 'Freelance Client Project',
    period: '2023 – 2024',
    techStack: ['Microsoft Excel', 'Power Query', 'Statistical Modeling', 'VBA'],
    problem: 'Small retail and manufacturing businesses were facing frequent stockouts of high-demand goods alongside over-purchasing of stagnant inventory.',
    solution: 'Designed automated Excel-based inventory analysis systems utilizing Power Query for scheduled data refresh, safety stock calculations, and dynamic reorder point triggers.',
    achievements: [
      'Enabled precise stock tracking and automated reorder alerts, substantially mitigating stockout risks.',
      'Delivered structured daily, weekly, and monthly reporting cycles that bolstered purchasing efficiency.'
    ]
  },
  'project-5': {
    title: 'Academic Performance & Faculty Evaluation System',
    category: 'Data Engineering & Analytics',
    organization: "Khan's Tutorial / Educational Analytics",
    period: '2024',
    techStack: ['MySQL', 'Data Cleaning', 'Power BI', 'ETL Automation'],
    problem: 'Academic directors needed continuous, objective visibility into classroom performance, standardized test outcomes, and teacher rating metrics.',
    solution: 'Centralized disparate testing records into structured MySQL databases, developed data cleaning scripts for student exam submissions, and built dynamic teacher rating dashboards.',
    achievements: [
      'Delivered actionable analytics for institutional quality reviews and curriculum adjustments.',
      'Integrated cross-branch operational data into uniform workflows, eliminating manual data re-entry.'
    ]
  }
};

function initModals() {
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalContainer = document.getElementById('modalContainer');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  // Resume triggers
  const resumeTriggers = document.querySelectorAll('.open-resume-btn');
  const resumeTemplate = document.getElementById('resumeTemplate');

  // Project detail triggers
  const detailButtons = document.querySelectorAll('.view-project-details');

  function openModal(title, htmlContent) {
    if (!modalBackdrop || !modalTitle || !modalBody) return;
    modalTitle.textContent = title;
    modalBody.innerHTML = htmlContent;
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // Attach resume modal opener
  resumeTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (resumeTemplate) {
        openModal('Curriculum Vitae — Sachin S J', resumeTemplate.innerHTML);
      }
    });
  });

  // Attach project modal opener
  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project-id');
      const project = projectCaseStudies[projectId];
      if (project) {
        const contentHtml = `
          <div class="case-study-content">
            <div style="margin-bottom: 20px;">
              <span class="project-badge" style="position:static; display:inline-block; margin-bottom:8px;">${project.category}</span>
              <h3 style="font-size: 1.4rem; font-weight:800; margin-bottom: 6px; color: var(--text-primary);">${project.title}</h3>
              <p style="color: var(--accent-cyan); font-weight: 600; font-size: 0.95rem;">${project.organization} • <span style="color: var(--text-muted);">${project.period}</span></p>
            </div>

            <div style="background: var(--bg-surface-elevated); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 20px;">
              <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Technologies & Tools</h4>
              <div class="project-tech" style="margin-bottom: 0;">
                ${project.techStack.map(tech => `<span class="tech-tag" style="background: var(--bg-card); color: var(--accent-cyan); font-weight: 600;">${tech}</span>`).join('')}
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Business Problem & Context</h4>
              <p style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">${project.problem}</p>
            </div>

            <div style="margin-bottom: 20px;">
              <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Technical Solution & Implementation</h4>
              <p style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">${project.solution}</p>
            </div>

            <div style="margin-bottom: 20px;">
              <h4 style="font-size: 1rem; font-weight: 700; color: var(--accent-emerald); margin-bottom: 10px;">Key Impact & Quantifiable Results</h4>
              <ul style="padding-left: 20px; list-style: disc; color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">
                ${project.achievements.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}
              </ul>
            </div>
          </div>
        `;
        openModal(project.title, contentHtml);
      }
    });
  });
}

/* ==========================================================================
   7. Copy to Clipboard Utility
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.borderColor = 'var(--accent-emerald)';
        btn.style.color = 'var(--accent-emerald)';

        showToast(`Copied "${textToCopy}" to clipboard!`);

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2000);
      }).catch(err => {
        showToast('Unable to copy text to clipboard');
      });
    });
  });
}

/* ==========================================================================
   8. Contact Form Handling
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const formSuccessMessage = document.getElementById('formSuccessMessage');
  const openGoogleFormLink = document.getElementById('openGoogleFormLink');

  // Dynamic pre-fill link for Google Form if user chooses to open directly
  if (openGoogleFormLink) {
    const updatePrefillUrl = () => {
      const name = nameInput ? encodeURIComponent(nameInput.value) : '';
      const subject = subjectInput ? encodeURIComponent(subjectInput.value) : '';
      let msg = messageInput ? messageInput.value : '';
      if (emailInput && emailInput.value) {
        msg += `\n\n(Sender Email: ${emailInput.value})`;
      }
      const encodedMsg = encodeURIComponent(msg);
      openGoogleFormLink.href = `https://docs.google.com/forms/d/e/1FAIpQLSc6QfmukUpHIkMWMsF1f2Lqm4-B1-SEuxSagPFLDMG5ktS0Gg/viewform?usp=pp_url&entry.1104900571=${name}&entry.815616158=${subject}&entry.901967300=${encodedMsg}`;
    };

    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input) input.addEventListener('input', updatePrefillUrl);
    });
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const rawMessage = messageInput ? messageInput.value.trim() : '';

    if (!name || !rawMessage) {
      showToast('Please fill in your Name and Message.');
      return;
    }

    const fullMessage = email ? `${rawMessage}\n\n---\nSender Email: ${email}` : rawMessage;

    if (submitBtnText) submitBtnText.textContent = 'Submitting to Google Form...';
    if (submitBtn) submitBtn.disabled = true;

    // Google Forms submission endpoint
    const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSc6QfmukUpHIkMWMsF1f2Lqm4-B1-SEuxSagPFLDMG5ktS0Gg/formResponse';
    const formData = new FormData();
    formData.append('entry.1104900571', name);
    formData.append('entry.815616158', subject);
    formData.append('entry.901967300', fullMessage);

    // Direct fetch with no-cors
    fetch(googleFormUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    }).then(() => {
      handleSuccess(name);
    }).catch(() => {
      // Fallback submission via hidden iframe
      if (messageInput) messageInput.value = fullMessage;
      contactForm.submit();
      handleSuccess(name);
    });

    function handleSuccess(senderName) {
      showToast(`Thank you, ${senderName}! Your response was sent to Google Forms.`);
      if (formSuccessMessage) {
        formSuccessMessage.style.display = 'block';
        setTimeout(() => { formSuccessMessage.style.display = 'none'; }, 8000);
      }
      contactForm.reset();
      if (submitBtnText) submitBtnText.textContent = 'Send Message';
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

/* ==========================================================================
   Toast Notification Generator
   ========================================================================== */
function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent-cyan); flex-shrink:0;">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
