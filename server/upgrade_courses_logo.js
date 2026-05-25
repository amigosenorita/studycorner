const fs = require('fs');
const path = require('path');

const clientDir = path.join(__dirname, '../client');
// All possible course pages linked in index.html
const files = [
    'medicine.html', 'engineering.html', 'agriculture.html', 'law.html', 
    'nursing.html', 'pharmacy.html', 'physiotherapy.html', 'allied-health-science.html', 
    'polytechnic.html', 'arts-and-science.html'
];

files.forEach(file => {
    const filePath = path.join(clientDir, file);
    if (!fs.existsSync(filePath)) {
        console.log('Skipping non-existent', file);
        return;
    }
    
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Extract Image Source
    const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/);
    const imgSrc = imgMatch ? imgMatch[1] : 'logo.png';
    
    // Extract Title from h1
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/);
    const title = h1Match ? h1Match[1] : 'Course Details';
    
    // Extract the rest of the content (it's now from the previous upgrade)
    let contentMatch = html.match(/<div class="prose prose-lg max-w-none prose-blue">([\s\S]*?)<\/div>/);
    let content = contentMatch ? contentMatch[1] : '';
    
    // Construct new premium HTML with Logo and white bar as requested
    let newHtml = '<!DOCTYPE html>\n' +
'<html lang="en">\n' +
'<head>\n' +
'    <meta charset="UTF-8">\n' +
'    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'    <title>' + title + ' - Study Corner Educational Services</title>\n' +
'    <meta name="description" content="Detailed information about ' + title + ' courses. Start your paperless admission process today for 100% guaranteed counseling.">\n' +
'    <script src="https://cdn.tailwindcss.com"></script>\n' +
'    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet">\n' +
'    <style> \n' +
'        body { font-family: \'Outfit\', sans-serif; } \n' +
'        .glass { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); }\n' +
'        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }\n' +
'        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }\n' +
'        .logo-box img { max-height: 40px; width: auto; }\n' +
'    </style>\n' +
'</head>\n' +
'<body class="bg-gray-50 text-gray-800 antialiased min-h-screen flex flex-col">\n' +
'\n' +
'    <!-- Premium Navigation with Request Elements -->\n' +
'    <nav class="bg-blue-900 text-white sticky top-0 z-50 shadow-xl border-b border-blue-800/50 transition-all duration-300">\n' +
'        <div class="container mx-auto px-6 py-4 flex justify-between items-center max-w-7xl">\n' +
'            <a href="index.html" class="flex items-center space-x-4 group">\n' +
'                <div class="logo-box bg-white p-1.5 rounded-lg shadow-inner">\n' +
'                    <img src="logo.png" alt="Logo">\n' +
'                </div>\n' +
'                <!-- Vertical white bar -->\n' +
'                <div class="hidden sm:block w-[2px] h-8 bg-white opacity-50"></div>\n' +
'                <span class="font-extrabold text-white text-xl tracking-tight hidden md:block">Study Corner <span class="text-blue-300">Services</span></span>\n' +
'            </a>\n' +
'            <div class="flex items-center space-x-6">\n' +
'                <a href="index.html" class="hidden sm:flex items-center text-sm font-bold text-blue-200 hover:text-white transition group">\n' +
'                    <svg class="w-4 h-4 mr-1.5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>\n' +
'                    Home\n' +
'                </a>\n' +
'                <a href="admission-form.html" class="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 uppercase tracking-wider text-xs">Apply Now</a>\n' +
'            </div>\n' +
'        </div>\n' +
'    </nav>\n' +
'\n' +
'    <!-- Hero Section -->\n' +
'    <section class="relative w-full h-[45vh] md:h-[60vh] bg-blue-950 overflow-hidden flex items-end">\n' +
'        <img src="' + imgSrc + '" alt="' + title + '" class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen transform scale-110 hover:scale-100 transition-transform duration-[3s]">\n' +
'        <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent"></div>\n' +
'        <div class="relative z-10 w-full p-8 md:p-24 container mx-auto max-w-6xl">\n' +
'            <div class="animate-fade-in">\n' +
'                <div class="flex items-center space-x-3 mb-6">\n' +
'                    <span class="w-8 h-[2px] bg-blue-500"></span>\n' +
'                    <span class="text-blue-400 text-xs font-black uppercase tracking-[0.3em]">Course Enrollment Open</span>\n' +
'                </div>\n' +
'                <h1 class="text-5xl md:text-8xl font-black text-white tracking-tighter drop-shadow-2xl leading-[0.9]">' + title + '</h1>\n' +
'                <p class="text-blue-100/60 mt-6 text-lg md:text-xl font-medium max-w-2xl">Secure your seat in India\'s premier institutions through our professional counseling network.</p>\n' +
'            </div>\n' +
'        </div>\n' +
'    </section>\n' +
'\n' +
'    <!-- Content Section -->\n' +
'    <main class="flex-1 container mx-auto max-w-5xl px-6 py-12 md:py-24 -mt-20 relative z-20">\n' +
'        <div class="bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] rounded-[3.5rem] p-8 md:p-20 border border-gray-100 animate-fade-in ring-1 ring-gray-900/5" style="animation-delay: 0.2s">\n' +
'            <div class="prose prose-lg max-w-none prose-blue">\n' +
'                ' + content + '\n' +
'            </div>\n' +
'            \n' +
'            <div class="mt-24 pt-16 border-t border-gray-100">\n' +
'                <div class="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">\n' +
'                    <div class="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mt-32"></div>\n' +
'                    <div class="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mb-32"></div>\n' +
'                    \n' +
'                    <div class="relative z-10">\n' +
'                        <h3 class="text-3xl md:text-5xl font-black mb-6 tracking-tight">Embark on Your Journey</h3>\n' +
'                        <p class="text-blue-200/80 mb-12 text-lg max-w-xl mx-auto font-medium">Join thousands of successful students. Our counselors are ready to help you navigate your future.</p>\n' +
'                        <div class="flex flex-col sm:flex-row items-center justify-center gap-6">\n' +
'                            <a href="admission-form.html" class="w-full sm:w-auto bg-white text-blue-950 px-12 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95">Apply Online Now</a>\n' +
'                            <a href="https://wa.me/918072927565" target="_blank" class="w-full sm:w-auto bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 backdrop-blur-sm hover:bg-emerald-500/20 transition-all">\n' +
'                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.633 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>\n' +
'                                WhatsApp Expert\n' +
'                            </a>\n' +
'                        </div>\n' +
'                    </div>\n' +
'                </div>\n' +
'            </div>\n' +
'        </div>\n' +
'    </main>\n' +
'\n' +
'    <!-- Footer -->\n' +
'    <footer class="bg-gray-950 py-20 px-6 text-center mt-auto border-t border-white/5">\n' +
'        <div class="container mx-auto max-w-6xl">\n' +
'            <div class="mb-12 flex flex-col items-center">\n' +
'                <div class="bg-white p-2 rounded-xl mb-6 shadow-2xl">\n' +
'                  <img src="logo.png" alt="Logo" class="h-12 w-auto">\n' +
'                </div>\n' +
'                <h2 class="text-white font-black text-3xl mb-4 tracking-tighter">Study Corner <span class="text-blue-500">Educational Services</span></h2>\n' +
'                <p class="text-gray-500 text-base max-w-sm mx-auto font-medium opacity-80">Guaranteed admissions and expert academic counseling for all leading institutions in India.</p>\n' +
'            </div>\n' +
'            <div class="w-24 h-[1px] bg-blue-900/50 mx-auto mb-12"></div>\n' +
'            <div class="flex flex-col md:flex-row justify-center items-center gap-12 text-sm font-bold tracking-widest uppercase text-gray-600">\n' +
'                <div class="flex flex-col items-center">\n' +
'                    <span class="text-gray-400 mb-2">Primary Helpline</span>\n' +
'                    <span class="text-blue-400 text-lg">+91 80729 27565</span>\n' +
'                </div>\n' +
'                <div class="flex flex-col items-center">\n' +
'                    <span class="text-gray-400 mb-2">Academic Head</span>\n' +
'                    <span class="text-blue-400 text-lg">+91 78269 02010</span>\n' +
'                </div>\n' +
'            </div>\n' +
'            <div class="mt-16 pt-8 border-t border-white/5">\n' +
'                <p class="text-gray-700 text-[10px] font-black tracking-[0.4em] uppercase">© 2026 Partners CRM Portal • Made for Excellence</p>\n' +
'            </div>\n' +
'        </div>\n' +
'    </footer>\n' +
'\n' +
'</body>\n' +
'</html>';

    fs.writeFileSync(filePath, newHtml);
    console.log('Successfully Re-Upgraded with Logo and Bar:', file);
});
