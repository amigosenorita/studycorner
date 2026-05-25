const fs = require('fs');
const path = require('path');

const clientDir = path.join(__dirname, '../client');
const files = [
    'medicine.html', 'engineering.html', 'agriculture.html', 'law.html', 
    'nursing.html', 'pharmacy.html', 'physiotherapy.html', 'allied-health-science.html', 
    'polytechnic.html', 'arts-and-science.html'
];

files.forEach(file => {
    const filePath = path.join(clientDir, file);
    if (!fs.existsSync(filePath)) return;
    
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Extract Image Source
    const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/);
    const imgSrc = imgMatch ? imgMatch[1] : 'logo.png';
    
    // Extract Title from h1
    const h1Match = html.match(/<h1>(.*?)<\/h1>/);
    const title = h1Match ? h1Match[1] : 'Course Details';
    
    // Extract the rest of the content (everything between h1 and the back button, roughly)
    // We'll just grab the inner HTML of the container and strip h1 and back button
    let contentMatch = html.match(/<div class="container">([\s\S]*?)<\/div>/);
    let content = contentMatch ? contentMatch[1] : '';
    
    content = content.replace(/<h1>.*?<\/h1>/, '');
    content = content.replace(/<a[^>]+class="back"[^>]*>.*?<\/a>/, '');
    
    // Clean up basic tags to have tailwind classes
    content = content.replace(/<h2>/g, '<h2 class="text-2xl font-bold text-blue-900 mt-10 mb-4 border-b pb-2">');
    content = content.replace(/<p>/g, '<p class="text-gray-600 leading-relaxed mb-6 text-lg">');
    content = content.replace(/<ul>/g, '<ul class="list-disc list-inside space-y-3 text-gray-700 bg-blue-50/50 p-6 rounded-xl border border-blue-100">');
    content = content.replace(/<li>/g, '<li class="text-lg">');
    
    // Construct new premium HTML
    let newHtml = \<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>\ - Study Corner</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style> body { font-family: 'Inter', sans-serif; } </style>
</head>
<body class="bg-gray-50 text-gray-800 antialiased min-h-screen flex flex-col">

    <!-- Premium Navigation -->
    <nav class="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
            <a href="index.html" class="flex items-center space-x-3 group">
                <svg class="w-6 h-6 text-blue-600 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                <span class="font-bold text-gray-800 text-lg">Back to Home</span>
            </a>
            <a href="admission-form.html" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow-md transition-colors duration-300">Apply Now</a>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative w-full h-[40vh] md:h-[50vh] bg-blue-900 overflow-hidden">
        <img src="\" alt="\" class="w-full h-full object-cover opacity-50 mix-blend-overlay">
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        <div class="absolute bottom-0 left-0 w-full p-8 md:p-16">
            <div class="container mx-auto max-w-5xl">
                <span class="bg-blue-500 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block shadow-sm">Explore Course</span>
                <h1 class="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">\</h1>
            </div>
        </div>
    </div>

    <!-- Content Section -->
    <main class="flex-1 container mx-auto max-w-4xl px-6 py-12 md:py-20 -mt-10 relative z-10">
        <div class="bg-white shadow-2xl rounded-3xl p-8 md:p-12 border border-gray-100">
            \
            
            <div class="mt-16 pt-8 border-t border-gray-100 text-center">
                <h3 class="text-2xl font-bold text-gray-800 mb-4">Ready to shape your future?</h3>
                <p class="text-gray-500 mb-8">Join thousands of successful students who found their perfect path with us.</p>
                <a href="admission-form.html" class="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">Start Your Application Journey</a>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 py-8 text-center mt-auto">
        <p class="text-gray-500 text-sm">© 2026 Study Corner Educational Services. Guaranteed Admissions.</p>
    </footer>

</body>
</html>\;

    fs.writeFileSync(filePath, newHtml);
    console.log('Upgraded', file);
});
