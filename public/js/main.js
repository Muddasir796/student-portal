// public/js/main.js (Updated to pass language to server)

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
    const adminSidebarNav = document.querySelector('.sidebar-nav'); // Admin sidebar nav

    // =================================================================
    // HELPER FUNCTIONS
    // =================================================================
    
    // Naya Function: Tamam links ko language parameter ke sath update karein
    const updateNavLinks = (lang) => {
        const navContainers = [document.getElementById('sidebar-nav'), document.getElementById('mobile-menu')];
        navContainers.forEach(container => {
            if (container) {
                const links = container.querySelectorAll('a');
                links.forEach(link => {
                    // Pehle se mojood URL ko parse karein
                    const url = new URL(link.href, window.location.origin);
                    if (lang === 'ur') {
                        url.searchParams.set('lang', 'ur');
                    } else {
                        url.searchParams.delete('lang');
                    }
                    link.href = url.toString();
                });
            }
        });
    };

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

        if (langToggleDesktop) langToggleDesktop.textContent = siteData[lang].languageToggle;
        if (langToggleMobile) langToggleMobile.textContent = siteData[lang].languageToggle;
        
        const footer = document.getElementById('footer');
        if (footer) footer.innerHTML = `<p>&copy; ${new Date().getFullYear()} ${siteData[lang].universityName}. All Rights Reserved.</p>`;
        
        // Links ko bhi update karein
        updateNavLinks(lang);
    };

    // =================================================================
    // EVENT HANDLERS
    // =================================================================
    const toggleLanguage = () => {
        currentLanguage = currentLanguage === 'en' ? 'ur' : 'en';
        localStorage.setItem('preferredLanguage', currentLanguage);
        applyLanguage();
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

    // =================================================================
    // INITIALIZATION
    // =================================================================
    const init = () => {
        applyLanguage();
    };

    init();
});
