// public/js/main.js (Updated with Mobile Menu Fix & Persistent Language)

document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // DATA & STATE
    // =================================================================
    const siteData = {
        en: {
            universityName: "Green International University",
            portalTitle: "BSIS Student Portal",
            languageToggle: "اردو",
            nav: { home: "Dashboard", directory: "Directory", notes: "Notes", timetable: "Timetable", assignments: "Assignments", calculator: "GPA Calc", quiz: "Quiz Zone", gallery: "Gallery", teachers: "Teachers", birthdays: "Birthdays", downloads: "Downloads", feedback: "Feedback" },
            admin_nav: { adminTitle: "Admin Panel", dashboard: "Dashboard", manageStudents: "Manage Students", manageTeachers: "Manage Teachers", manageAssignments: "Manage Assignments", changePassword: "Change Password", logout: "Logout" }
        },
        ur: {
            universityName: "گرین انٹرنیشنل یونیورسٹی",
            portalTitle: "بی ایس آئی ایس اسٹوڈنٹ پورٹل",
            languageToggle: "English",
            nav: { home: "ڈیش بورڈ", directory: "ڈائریکٹری", notes: "نوٹس", timetable: "ٹائم ٹیبل", assignments: "اسائنمنٹس", calculator: "جی پی اے کیلکولیٹر", quiz: "کوئز زون", gallery: "گیلری", teachers: "اساتذہ", birthdays: "سالگرہ", downloads: "ڈاؤن لوڈز", feedback: "رائے دیں" },
            admin_nav: { adminTitle: "ایڈمن پینل", dashboard: "ڈیش بورڈ", manageStudents: "طلباء کا انتظام", manageTeachers: "اساتذہ کا انتظام", manageAssignments: "اسائنمنٹس کا انتظام", changePassword: "پاس ورڈ تبدیل کریں", logout: "لاگ آؤٹ" }
        }
    };
    
    // Icons (ab JS mein zaroori hain mobile menu ke liye)
    const icons = {
        home: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
        directory: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
        notes: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
        // (Add other icons here if needed for mobile menu)
    };
    
    let currentLanguage = localStorage.getItem('preferredLanguage') || 'en';

    // =================================================================
    // DOM ELEMENTS
    // =================================================================
    const body = document.body;
    const langToggleDesktop = document.getElementById('lang-toggle-desktop');
    const langToggleMobile = document.getElementById('lang-toggle-mobile');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const mobileMenuContainer = document.getElementById('mobile-menu');
    const menuOpenIcon = document.getElementById('menu-open-icon');
    const menuCloseIcon = document.getElementById('menu-close-icon');

    // =================================================================
    // UI & TEXT UPDATES
    // =================================================================
    const applyLanguage = () => {
        const lang = currentLanguage;
        const isUrdu = lang === 'ur';

        body.dir = isUrdu ? 'rtl' : 'ltr';
        body.classList.toggle('font-urdu', isUrdu);
        body.classList.toggle('font-sans', !isUrdu);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = siteData[lang][key] || siteData[lang].nav[key] || siteData[lang].admin_nav[key];
            if (translation) {
                el.textContent = translation;
            }
        });

        // FIX: Mobile menu ke links banayein
        if (mobileMenuContainer) {
            const sidebarNav = document.getElementById('sidebar-nav');
            if (sidebarNav) {
                mobileMenuContainer.innerHTML = sidebarNav.innerHTML;
            }
        }

        if (langToggleDesktop) langToggleDesktop.textContent = siteData[lang].languageToggle;
        if (langToggleMobile) langToggleMobile.textContent = siteData[lang].languageToggle;
        
        const footer = document.getElementById('footer');
        if (footer) footer.innerHTML = `<p>&copy; ${new Date().getFullYear()} ${siteData[lang].universityName}. All Rights Reserved.</p>`;
    };

    const toggleLanguage = () => {
        currentLanguage = currentLanguage === 'en' ? 'ur' : 'en';
        localStorage.setItem('preferredLanguage', currentLanguage);
        applyLanguage();
        // Force a reload to apply server-side language changes correctly on all pages
        window.location.reload();
    };

    if (langToggleDesktop) langToggleDesktop.addEventListener('click', toggleLanguage);
    if (langToggleMobile) langToggleMobile.addEventListener('click', toggleLanguage);
    
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', () => {
            const isShown = mobileMenuContainer.classList.toggle('show');
            if(menuOpenIcon) menuOpenIcon.style.display = isShown ? 'none' : 'block';
            if(menuCloseIcon) menuCloseIcon.style.display = isShown ? 'block' : 'none';
        });
    }

    const init = () => {
        applyLanguage();
    };

    init();
});
