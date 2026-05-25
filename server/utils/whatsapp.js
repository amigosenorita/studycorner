const sendWhatsAppMessage = (mobile, studentName) => {
    // In a real production system, you would integrate a WhatsApp Business API like Twilio, Gupshup, or Meta API here.
    // For this demonstration, we will log the simulated API call.
    console.log(`\n--- WHATSAPP MESSAGE SENT ---`);
    console.log(`To: ${mobile}`);
    console.log(`Message: Hello ${studentName}, \nYour admission application has been received. \nOur counsellor will contact you shortly.`);
    console.log(`-----------------------------\n`);
};

module.exports = sendWhatsAppMessage;
