/*
    ===================================================================
    هذا هو الملف الرئيسي للجافاسكريبت لموقع Afaq
    ===================================================================
*/


// ننتظر حتى يتم تحميل كامل محتوى الصفحة قبل تشغيل أي كود
document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------------------------
        بلوك 1: التحكم بالهيدر (جعله لاصقاً ومتقلصاً عند التمرير)
        -------------------------------------------------------------
        هذا الجزء يجعل الهيدر يلتصق بأعلى الشاشة ويصغر حجمه 
        عندما يقوم المستخدم بتمرير الصفحة للأسفل.
    */
    const header = document.querySelector('header');
    if (header) {
        const scrollEffect = () => {
            if (window.scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        };
        window.addEventListener('scroll', scrollEffect);
    }

    /* -------------------------------------------------------------
        بلوك 2: التحكم بقائمة الجوال (Hamburger Menu)
        -------------------------------------------------------------
        هذا الجزء هو المسؤول عن فتح وإغلاق قائمة الجوال العمودية 
        عند الضغط على أيقونة الهامبرغر.
    */
    const hamburger = document.querySelector('.hamburger-icon');
    const navMenu = document.querySelector('nav');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('nav-active');
        });
    }

    /* -------------------------------------------------------------
        بلوك 3: التحكم بمعارض الصور (Sliders) - إصلاح شامل
        -------------------------------------------------------------
        هذا الكود يقوم بتشغيل أي معرض صور في الصفحة، سواء في الهيرو
        أو في صفحات المعاهد، مع دعم التحريك بواسطة transform.
    */
    const sliders = document.querySelectorAll('.slider-container');
    
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        // بما أن الأسهم محذوفة من HTML لصفحة index.html، ستكون هذه المتغيرات null
        const nextBtn = slider.parentElement.querySelector('.next-arrow');
        const prevBtn = slider.parentElement.querySelector('.prev-arrow');
        let currentSlide = 0;
        let slideInterval; // متغير لتخزين معرف الـ setInterval

        // وظيفة لتحديث موقع شريط التمرير بناءً على currentSlide
        const updateSlider = () => {
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            // إذا كان هناك حاجة لتفعيل/إلغاء فئة 'active' للشرائح لأي تأثيرات إضافية في CSS
            slides.forEach((slide, index) => {
                if (index === currentSlide) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
        };

        // وظيفة للتقدم إلى الشريحة التالية
        const goToNextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        };

        // وظيفة للتقدم إلى الشريحة السابقة
        const goToPrevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider();
        };

        // بدء التشغيل التلقائي للشريط
        const startAutoSlide = () => {
            clearInterval(slideInterval); // مسح أي تشغيل سابق
            slideInterval = setInterval(goToNextSlide, 3000); // تغيير الشريحة كل 3 ثوانٍ
        };

        // إذا كان هناك أسهم، أضف مستمعي الأحداث (لضمان التوافق مع صفحات قد تحتوي على أسهم)
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToNextSlide();
                startAutoSlide(); // إعادة تشغيل التشغيل التلقائي بعد النقر اليدوي
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToPrevSlide();
                startAutoSlide(); // إعادة تشغيل التشغيل التلقائي بعد النقر اليدوي
            });
        }

        // إظهار الشريحة الأولى عند تحميل الصفحة
        if (slides.length > 0) {
            updateSlider(); // تحديث الشريط للعرض الأولي
            startAutoSlide(); // بدء التشغيل التلقائي
        }
    });
    
    /* -------------------------------------------------------------
        بلوك 4: التحكم بالحركات عند التمرير (WOW Scroll Animation)
        -------------------------------------------------------------
        هذا هو كود تأثير 'الواو'. يقوم بمراقبة الصفحة، وعندما يصل 
        الزائر إلى قسم جديد، يجعله يظهر بحركة ناعمة.
    */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.1 // يبدأ التأثير عندما يظهر 10% من العنصر
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
    
    /* -------------------------------------------------------------
        بلوك 5: التحكم بمعرض الصور التفاعلي (Lightbox)
        -------------------------------------------------------------
        هذا الكود يقوم بفتح الصور في نافذة منبثقة أنيقة عند الضغط
        عليها في قسم معرض الصور.
    */
    const lightbox = document.getElementById('lightbox-modal');
    if (lightbox) { // التأكد من وجود Lightbox في الصفحة
        const lightboxImage = document.getElementById('lightbox-image');
        const galleryImages = document.querySelectorAll('.gallery-image'); // تأكد أن صور المعرض تحمل هذه الفئة
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');
        let currentImageIndex;

        const showImage = (index) => {
            if (galleryImages[index]) {
                lightboxImage.src = galleryImages[index].src;
                currentImageIndex = index;
            }
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                lightbox.style.display = 'block';
                showImage(index);
            });
        });
        
        if(closeBtn) {
            closeBtn.addEventListener('click', () => {
                lightbox.style.display = 'none';
            });
        }
        
        if(prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                showImage(currentImageIndex);
            });
        }

        if(nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                showImage(currentImageIndex);
            });
        }
        
        // إغلاق اللايت بوكس عند النقر خارج الصورة
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }

    /* -------------------------------------------------------------
        بلوك 6: التحكم بالأسئلة الشائعة (FAQ Accordion)
        -------------------------------------------------------------
        يسمح بفتح وإغلاق الإجابات على الأسئلة الشائعة.
    */
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) { // التأكد من وجود عناصر FAQ
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // إغلاق جميع الأسئلة المفتوحة الأخرى
                faqItems.forEach(i => {
                    if (i !== item) { // لا تغلق العنصر الذي تم النقر عليه
                        i.classList.remove('active');
                        const otherAnswer = i.querySelector('.faq-answer');
                        if (otherAnswer) otherAnswer.style.maxHeight = null;
                    }
                });

                // فتح أو إغلاق السؤال الحالي
                if (!isOpen) {
                    item.classList.add('active');
                    if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
                } else {
                    item.classList.remove('active');
                    if (answer) answer.style.maxHeight = null;
                }
            });
        });
    }

    /* -------------------------------------------------------------
        بلوك 7: التحكم بنظام الألسنة (Tabs System) - إذا كان مستخدمًا
        -------------------------------------------------------------
        هذا الجزء يقوم بالتحكم في نظام الألسنة (Tabs) إذا كان موجوداً
        في أي صفحة (مثل صفحات المعاهد التي قد تستخدم ألسنة للبرامج).
    */
    const tabButtons = document.querySelectorAll('.tab-button');
    if (tabButtons.length > 0) { // التأكد من وجود ألسنة
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                const tabContents = document.querySelectorAll('.tab-content');

                // إزالة فئة active من جميع الأزرار والمحتوى
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // إضافة فئة active للزر والمحتوى المحدد
                button.classList.add('active');
                const activeTabContent = document.getElementById(tabId);
                if (activeTabContent) {
                    activeTabContent.classList.add('active');
                }
            });
        });
        // تفعيل أول تبويب عند تحميل الصفحة
        if (!document.querySelector('.tab-button.active')) {
            tabButtons[0].click();
        }
    }
});