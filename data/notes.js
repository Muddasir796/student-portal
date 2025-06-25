// data/notes.js

const notesData = {
    // Har subject ke liye alag property, key URL-friendly honi chahiye
    "quranic-studies": {
        subject: { en: "Quranic Studies", ur: "قرآنی علوم" },
        notes: [
            { id: 1, title: { en: "Tafsir of Surah Al-Baqarah (Part 1)", ur: "تفسیر سورۃ البقرہ (حصہ اول)" }, url: "#", date: "2025-06-01" },
            { id: 2, title: { en: "Introduction to Uloom-ul-Quran", ur: "علوم القرآن کا تعارف" }, url: "#", date: "2025-06-05" }
        ]
    },
    "hadith-literature": {
        subject: { en: "Hadith Literature", ur: "ادب حدیث" },
        notes: [
            { id: 1, title: { en: "Introduction to Sahih Bukhari", ur: "صحیح بخاری کا تعارف" }, url: "#", date: "2025-06-02" },
            { id: 2, title: { en: "Types of Hadith", ur: "حدیث کی اقسام" }, url: "#", date: "2025-06-08" }
        ]
    },
    "islamic-history": {
        subject: { en: "Islamic History", ur: "اسلامی تاریخ" },
        notes: [
            { id: 1, title: { en: "The Life of the Prophet (PBUH)", ur: "سیرت النبی ﷺ" }, url: "#", date: "2025-06-10" }
        ]
    }
};

module.exports = notesData;
