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
    const h1Match = html.match(/<h1>(.*?)<\/h1>/);
    const title = h1Match ? h1Match[1] : 'Course Details';
    
    // Extract the rest of the content
    let contentMatch = html.match(/<div class="container">([\s\S]*?)<\/div>/);
    let content = contentMatch ? contentMatch[1] : '';
    
    // Sanitize extracted content
    content = content.replace(/<h1>.*?<\/h1>/, '');
    content = content.replace(/<a[^>]+class="back"[^>]*>.*?<\/a>/, '');
    
    // Clean up basic tags to have tailwind classes for premium look
    content = content.replace(/<h2>/g, '<h2 class="text-2xl font-bold text-blue-900 mt-10 mb-4 border-b pb-2">');
    content = content.replace(/<p>/g, '<p class="text-gray-600 leading-relaxed mb-6 text-lg">');
    content = content.replace(/<ul>/g, '<ul class="list-disc list-inside space-y-3 text-gray-700 bg-blue-50/50 p-6 rounded-xl border border-blue-100">');
    content = content.replace(/<li>/g, '<li class="text-lg">');
    
    // Construct new premium HTML with responsiveness and SEO best practices
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
'    </style>\n' +
'</head>\n' +
'<body class="bg-gray-50 text-gray-800 antialiased min-h-screen flex flex-col">\n' +
'\n' +
'    <!-- Premium Navigation -->\n' +
'    <nav class="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-100 transition-all duration-300">\n' +
'        <div class="container mx-auto px-6 py-4 flex justify-between items-center max-w-6xl">\n' +
'            <a href="index.html" class="flex items-center space-x-3 group">\n' +
'                <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-blue-500/30 transition-all">\n' +
'                    <svg class="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>\n' +
'                </div>\n' +
'                <span class="font-bold text-gray-800 text-lg hidden sm:block">Back to Home</span>\n' +
'            </a>\n' +
'            <div class="flex items-center space-x-4">\n' +
'                <a href="admission-form.html" class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2.5 rounded-full font-bold shadow-xl shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95">Apply Now</a>\n' +
'            </div>\n' +
'        </div>\n' +
'    </nav>\n' +
'\n' +
'    <!-- Hero Section -->\n' +
'    <section class="relative w-full h-[45vh] md:h-[55vh] bg-blue-900 overflow-hidden flex items-end">\n' +
'        <img src="' + imgSrc + '" alt="' + title + '" class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay transform scale-105 hover:scale-100 transition-transform duration-[2s]">\n' +
'        <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent"></div>\n' +
'        <div class="relative z-10 w-full p-8 md:p-20 container mx-auto max-w-6xl">\n' +
'            <div class="animate-fade-in">\n' +
'                <span class="bg-blue-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 inline-block shadow-lg shadow-blue-500/30">Course Spotlight</span>\n' +
'                <h1 class="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-2xl leading-tight">' + title + '</h1>\n' +
'            </div>\n' +
'        </div>\n' +
'    </section>\n' +
'\n' +
'    <!-- Content Section -->\n' +
'    <main class="flex-1 container mx-auto max-w-5xl px-6 py-12 md:py-24 -mt-16 relative z-20">\n' +
'        <div class="bg-white/95 backdrop-blur-sm shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-[3rem] p-8 md:p-16 border border-white/40 animate-fade-in" style="animation-delay: 0.2s">\n' +
'            <div class="prose prose-lg max-w-none prose-blue">\n' +
'                ' + content + '\n' +
'            </div>\n' +
'            \n' +
'            <div class="mt-20 pt-12 border-t border-gray-100 text-center">\n' +
'                <div class="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-8">\n' +
'                    <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>\n' +
'                </div>\n' +
'                <h3 class="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Ready to start your journey?</h3>\n' +
'                <p class="text-gray-500 mb-10 text-lg max-w-md mx-auto">Skip the paperwork. Complete your entire admission process online today with expert counseling.</p>\n' +
'                <a href="admission-form.html" class="inline-block bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:scale-105 text-white px-12 py-5 rounded-3xl font-extrabold text-xl shadow-2xl shadow-blue-600/30 transition-all duration-300">Start Application Now</a>\n' +
'            </div>\n' +
'        </div>\n' +
'    </main>\n' +
'\n' +
'    <!-- Footer -->\n' +
'    <footer class="bg-gray-950 py-16 px-6 text-center mt-auto border-t border-white/5">\n' +
'        <div class="container mx-auto max-w-6xl">\n' +
'            <h2 class="text-white font-extrabold text-2xl mb-4 tracking-tight">Study Corner <span class="text-blue-500">Educational Services</span></h2>\n' +
'            <p class="text-gray-500 text-sm max-w-sm mx-auto mb-8">Empowering students through guaranteed admissions and expert counseling across India.</p>\n' +
'            <div class="w-16 h-1 bg-blue-600 mx-auto mb-8 rounded-full"></div>\n' +
'            <p class="text-gray-600 text-xs font-medium tracking-widest uppercase">© 2026 Partners CRM Portal. All Rights Reserved.</p>\n' +
'        </div>\n' +
'    </footer>\n' +
'\n' +
'</body>\n' +
'</html>';

    fs.writeFileSync(filePath, newHtml);
    console.log('Successfully Upgraded', file);
});
