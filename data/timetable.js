// data/timetable.js

// Hum yahan English aur Urdu dono ka data rakhenge
const timetableData = {
    en: {
        title: "Class Timetable",
        headers: ["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        rows: [
            ["09-10 AM", "Quranic Studies", "Islamic History", "Quranic Studies", "Islamic History", "Fiqh"],
            ["10-11 AM", "Hadith", "Arabic", "Hadith", "Arabic", "Fiqh"],
            ["11-12 PM", "BREAK", "BREAK", "BREAK", "BREAK", "BREAK"],
            ["12-01 PM", "Islamic Ethics", "Computer Skills", "Islamic Ethics", "Computer Skills", "---"]
        ]
    },
    ur: {
        title: "کلاس ٹائم ٹیبل",
        headers: ["وقت", "پیر", "منگل", "بدھ", "جمعرات", "جمعہ"],
        rows: [
            ["صبح ۹-۱۰", "قرآنی علوم", "اسلامی تاریخ", "قرآنی علوم", "اسلامی تاریخ", "فقہ"],
            ["صبح ۱۰-۱۱", "حدیث", "عربی", "حدیث", "عربی", "فقہ"],
            ["صبح ۱۱-۱۲", "وقفہ", "وقفہ", "وقفہ", "وقفہ", "وقفہ"],
            ["دوپہر ۱۲-۱", "اسلامی اخلاقیات", "کمپیوٹر ہنر", "اسلامی اخلاقیات", "کمپیوٹر ہنر", "---"]
        ]
    }
};

module.exports = timetableData;
