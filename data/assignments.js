// data/assignments.js

const assignmentsData = [
    { 
        id: 1, 
        subject: { 
            en: "Fiqh al-Ibadat", 
            ur: "فقہ العبادات" 
        }, 
        task: { 
            en: "Essay on the Pillars of Prayer", 
            ur: "ارکان نماز پر مضمون" 
        }, 
        dueDate: "2025-06-25", 
        completed: true 
    }, 
    { 
        id: 2, 
        subject: { 
            en: "Islamic History", 
            ur: "اسلامی تاریخ" 
        }, 
        task: { 
            en: "Presentation on the Four Caliphs", 
            ur: "خلفائے راشدین پر پریزنٹیشن" 
        }, 
        dueDate: "2025-06-30", 
        completed: false 
    },
    { 
        id: 3, 
        subject: { 
            en: "Quranic Studies", 
            ur: "قرآنی علوم" 
        }, 
        task: { 
            en: "Memorize last 10 Surahs", 
            ur: "آخری ۱۰ سورتیں حفظ کریں" 
        }, 
        dueDate: "2025-07-05", 
        completed: false 
    }
];

module.exports = assignmentsData;
