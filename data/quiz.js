// data/quiz.js

const quizData = {
    en: [
        { 
            question: "How many Surahs are in the Holy Quran?", 
            options: ["112", "114", "124", "104"], 
            answer: "114" 
        },
        { 
            question: "Who was the first Caliph of Islam?", 
            options: ["Umar ibn Al-Khattab (RA)", "Ali ibn Abi Talib (RA)", "Abu Bakr Al-Siddiq (RA)", "Uthman ibn Affan (RA)"], 
            answer: "Abu Bakr Al-Siddiq (RA)" 
        },
        {
            question: "In which month is a fast obligatory for Muslims?",
            options: ["Ramadan", "Shawwal", "Dhul-Hijjah", "Muharram"],
            answer: "Ramadan"
        }
    ],
    ur: [
        { 
            question: "قرآن مجید میں کتنی سورتیں ہیں؟", 
            options: ["۱۱۲", "۱۱۴", "۱۲۴", "۱۰۴"], 
            answer: "۱۱۴" 
        },
        { 
            question: "اسلام کے پہلے خلیفہ کون تھے؟", 
            options: ["عمر بن الخطاب (رض)", "علی بن ابی طالب (رض)", "ابوبکر الصدیق (رض)", "عثمان بن عفان (رض)"], 
            answer: "ابوبکر الصدیق (رض)" 
        },
        {
            question: "مسلمانوں پر کس مہینے میں روزہ رکھنا فرض ہے؟",
            options: ["رمضان", "شوال", "ذوالحجہ", "محرم"],
            answer: "رمضان"
        }
    ]
};

module.exports = quizData;
