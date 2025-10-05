
import React, { useState } from 'react';

interface HelpModalProps {
    onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
    const [lang, setLang] = useState<'en' | 'ar'>('en');

    const helpContent = {
        en: {
            title: "Help & Instructions",
            html: `
                <div class="space-y-4 text-left">
                    <div>
                        <h3 class="text-xl font-bold text-yellow-400">Main Launcher</h3>
                        <p>This is the main screen where you can choose your image source.</p>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-yellow-400">Image Downloader Window</h3>
                        <ul class="list-disc list-inside space-y-1">
                            <li><b>Enter keywords:</b> Type one or more search terms, separated by commas (e.g., cats, dogs).</li>
                            <li><b>Number of images:</b> Set how many images to download for each keyword.</li>
                            <li><b>Start Download:</b> Begins the download process.</li>
                            <li><b>Clear All:</b> Clears the current list of images.</li>
                            <li><b>Back:</b> Returns to the main launcher screen.</li>
                            <li><b>Select & Delete:</b> Enables a mode to select and delete multiple images.</li>
                            <li><b>Download All (.zip):</b> Downloads all currently displayed images as a single zip file.</li>
                            <li><b>Sort by size:</b> Check this box to reorder the images, showing the largest ones first.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-yellow-400">Footy Renders Downloader</h3>
                        <p>This window is specialized for downloading from footyrenders.com.</p>
                        <ul class="list-disc list-inside space-y-1">
                            <li><b>Enter Team Name:</b> The name of the team to search for (e.g., Real Madrid).</li>
                            <li><b>Max pages to scan:</b> How many pages of players to scan.</li>
                            <li><b>Start Collecting Links:</b> Starts fetching player links. A new window will appear to let you select which players to download.</li>
                        </ul>
                    </div>
                </div>
            `,
            toggle: "Translate to Arabic",
            close: "Close"
        },
        ar: {
            title: "مساعدة وتعليمات",
            html: `
                <div dir="rtl" class="space-y-4 text-right">
                    <div>
                        <h3 class="text-xl font-bold text-yellow-400">الواجهة الرئيسية</h3>
                        <p>هذه هي الشاشة الرئيسية حيث يمكنك اختيار مصدر الصور.</p>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-yellow-400">نافذة تحميل الصور</h3>
                        <ul class="list-disc list-inside space-y-1">
                            <li><b>إدخال الكلمات المفتاحية:</b> اكتب كلمة بحث أو أكثر، مفصولة بفواصل (مثال: قطط, كلاب).</li>
                            <li><b>عدد الصور:</b> حدد عدد الصور التي سيتم تحميلها لكل كلمة مفتاحية.</li>
                            <li><b>بدء التحميل:</b> يبدأ عملية التحميل.</li>
                            <li><b>مسح الكل:</b> يمسح قائمة الصور الحالية.</li>
                            <li><b>رجوع:</b> يعود إلى شاشة الواجهة الرئيسية.</li>
                            <li><b>تحديد وحذف:</b> يفعّل وضعًا لتحديد وحذف صور متعددة.</li>
                            <li><b>تحميل الكل (ملف مضغوط):</b> ينقل جميع الصور المعروضة حاليًا كملف مضغوط واحد.</li>
                            <li><b>فرز حسب الحجم:</b> حدد هذا المربع لإعادة ترتيب الصور، مع إظهار أكبرها أولاً.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-yellow-400">نافذة تحميل فوتي ريندر</h3>
                        <p>هذه النافذة متخصصة للتحميل من footyrenders.com.</p>
                        <ul class="list-disc list-inside space-y-1">
                            <li><b>إدخال اسم الفريق:</b> اسم الفريق الذي تريد البحث عنه (مثال: ريال مدريد).</li>
                            <li><b>أقصى عدد صفحات للمسح:</b> عدد صفحات اللاعبين التي سيتم مسحها.</li>
                            <li><b>بدء جمع الروابط:</b> يبدأ عملية جمع الروابط. ستظهر نافذة جديدة لتختار منها اللاعبين الذين تريد تحميل صورهم.</li>
                        </ul>
                    </div>
                </div>
            `,
            toggle: "Translate to English",
            close: "إغلاق"
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-[#2C3E50] rounded-xl shadow-2xl p-6 max-w-3xl w-full flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <h2 className="text-3xl font-bold text-[#1ABC9C] text-center mb-4">{helpContent[lang].title}</h2>
                <div className="overflow-y-auto p-4 bg-[#34495E] rounded-lg text-gray-200" dangerouslySetInnerHTML={{ __html: helpContent[lang].html }} />
                <div className="flex justify-between items-center mt-6">
                    <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="bg-[#3498DB] hover:bg-[#2980B9] text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        {helpContent[lang].toggle}
                    </button>
                     <button onClick={onClose} className="bg-[#7F8C8D] hover:bg-[#95A5A6] text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        {helpContent[lang].close}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
