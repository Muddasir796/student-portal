// data/teachers.js

const teachersData = [
    { 
        id: 1, 
        name: { 
            en: "Dr. Ibrahim Al-Farsi", 
            ur: "ڈاکٹر ابراہیم الفارسی" 
        }, 
        subject: { 
            en: "Quranic Studies", 
            ur: "قرآنی علوم" 
        }, 
        photo: "https://placehold.co/400x400/006400/FFF?text=IA", 
        officeHours: {
            en: "Mon, Wed (10-12 PM)", 
            ur:"پیر، بدھ (صبح ۱۰-۱۲)"
        } 
    },
    { 
        id: 2, 
        name: { 
            en: "Prof. Maryam Asadi", 
            ur: "پروفیسر مریم اسدی" 
        }, 
        subject: { 
            en: "Fiqh & Usul al-Fiqh", 
            ur: "فقہ و اصول الفقہ" 
        }, 
        photo: "https://placehold.co/400x400/DAA520/333?text=MA", 
        officeHours: {
            en: "Tue, Thu (1-3 PM)", 
            ur:"منگل، جمعرات (دوپہر ۱-۳)"
        } 
    },
    { 
        id: 3, 
        name: { 
            en: "Sheikh Abdullah Yusuf", 
            ur: "شیخ عبداللہ یوسف" 
        }, 
        subject: { 
            en: "Hadith Literature", 
            ur: "ادب حدیث" 
        }, 
        photo: "https://placehold.co/400x400/006400/FFF?text=AY", 
        officeHours: {
            en: "Fri (9-11 AM)", 
            ur:"جمعہ (صبح ۹-۱۱)"
        } 
    }
];

module.exports = teachersData;
