const PDFDocument = require('pdfkit');
const moment = require('moment');
const path = require('path');
const fs = require('fs');

/**
 * Convert numbers to words for USD
 */
const numberToWords = (num) => {
    const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];

    if ((num = num.toString()).length > 9) return 'overflow';
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    
    return str.trim() ? str.trim() + ' Dollars Only' : 'Zero Dollars';
};

const generateReceipt = (registration) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ 
                size: 'A4',
                margins: { top: 50, bottom: 0, left: 50, right: 50 }
            });
            const buffers = [];
            
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            const primaryColor = '#0b328a';
            const textColor = '#000000';
            
            // --- HEADER ---
            // Top Left Logo
            const logoPath = path.join(__dirname, '..', '..', 'frontend', 'src', 'assets', 'images', 'Helix Conference.png');
            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, 50, 15, { width: 130 });
            } else {
                doc.font('Helvetica-Bold').fontSize(16).fillColor(primaryColor).text('Helix Conferences', 50, 45);
            }

            // Top Right PAYMENT RECEIPT text (Full width right aligned to avoid wrapping)
            doc.font('Helvetica-Bold')
               .fillColor(primaryColor)
               .fontSize(26)
               .text('PAYMENT RECEIPT', 50, 60, { width: 495, align: 'right' });

            // Thick blue line under header
            doc.moveTo(50, 115)
               .lineTo(545, 115)
               .lineWidth(3)
               .strokeColor(primaryColor)
               .stroke();

            // --- INVOICE DETAILS ---
            const invoiceY = 135;
            
            const paymentDate = registration.paymentDate 
                ? moment(registration.paymentDate) 
                : moment();
                
            const dateStr = paymentDate.format('DD-MMM-YYYY');
            const dueStr = paymentDate.add(7, 'days').format('DD-MMM-YYYY');
            
            // Fallback for invoice number if not generated yet
            const invNo = registration.invoiceNumber || `INV-${moment().format('YYYY')}-${registration._id.toString().substring(0, 6).toUpperCase()}`;

            doc.font('Helvetica').fontSize(10).fillColor(textColor);
            doc.text(`Invoice No : ${invNo}`, 50, invoiceY);
            doc.text(`Date: ${dateStr}`, 430, invoiceY, { width: 115, align: 'right' });

            // --- BILL TO ---
            const billToY = 195;
            doc.font('Helvetica').fontSize(10).text('Bill To:', 50, billToY);
            
            const clientName = `${registration.firstName || ''} ${registration.lastName || ''}`.trim();
            const companyName = registration.affiliation || registration.university || '';
            const address = `${registration.address || ''}, ${registration.city || ''}, ${registration.country || ''}`.trim();
            const phoneEmail = `${registration.mobileNumber || ''}\n${registration.email || ''}`.trim();

            doc.text('Client Name:', 50, billToY + 25);
            doc.text(clientName || '-', 130, billToY + 25);
            
            doc.text('University:', 280, billToY + 25);
            doc.text(companyName || '-', 380, billToY + 25);
            
            doc.text('Address:', 50, billToY + 50);
            doc.text(address || '-', 130, billToY + 50, { width: 130 });
            
            doc.text('Phone / Email:', 280, billToY + 50);
            doc.text(phoneEmail || '-', 380, billToY + 50, { width: 170 });

            // --- TABLE ---
            const tableY = 285;
            
            // Top dotted line for table header
            doc.lineWidth(1).strokeColor(textColor).dash(2, { space: 2 });
            doc.moveTo(50, tableY).lineTo(545, tableY).stroke();
            doc.undash();

            doc.font('Helvetica-Bold').fontSize(11).fillColor(textColor);
            doc.text('Description', 50, tableY + 10);
            doc.text('Category', 200, tableY + 10);
            doc.text('Qty', 330, tableY + 10, { width: 40, align: 'center' });
            doc.text('Rate', 390, tableY + 10, { width: 60, align: 'center' });
            doc.text('Amount', 470, tableY + 10, { width: 75, align: 'right' });

            // Bottom dotted line for table header
            doc.dash(2, { space: 2 });
            doc.moveTo(50, tableY + 30).lineTo(545, tableY + 30).stroke();
            doc.undash();

            // Table Row Data
            let currentRowY = tableY + 45;
            const amountVal = registration.paymentDetails?.amountTotal || 0;
            const amountStr = `$${amountVal.toFixed(2)}`;

            const orderDetails = (registration.orderDetails && registration.orderDetails.length > 0)
                ? registration.orderDetails
                : [{ name: registration.plan || 'Speaker', price: amountVal, quantity: 1 }];

            const confName = registration.conferenceName || registration.conferenceId || 'Conference Registration';
            const confDate = registration.conferenceDate || '';
            
            // We use standard Helvetica for the row data
            doc.font('Helvetica').fontSize(10);
            
            doc.text(confName, 50, currentRowY, { width: 140 });
            const confNameHeight = doc.heightOfString(confName, { width: 140 });
            if (confDate) {
                doc.text(confDate, 50, currentRowY + confNameHeight + 5, { width: 140 });
            }

            orderDetails.forEach((item) => {
                const qty = item.quantity || 1;
                const price = parseFloat(item.price) || 0;
                const subTotal = qty * price;
                
                doc.text(item.name, 200, currentRowY, { width: 120 });
                doc.text(qty.toString().padStart(2, '0'), 330, currentRowY, { width: 40, align: 'center' });
                doc.text(`$${price.toFixed(2)}`, 390, currentRowY, { width: 60, align: 'center' });
                doc.text(`$${subTotal.toFixed(2)}`, 470, currentRowY, { width: 75, align: 'right' });
                
                const nameHeight = doc.heightOfString(item.name, { width: 120 });
                currentRowY += Math.max(nameHeight, 20) + 10;
            });

            const minRowY = tableY + 45 + confNameHeight + 35;
            if (currentRowY < minRowY) currentRowY = minRowY;

            // --- TOTALS ---
            const totalsY = currentRowY + 10;
            
            // Top dotted line for total
            doc.dash(2, { space: 2 });
            doc.moveTo(50, totalsY).lineTo(545, totalsY).stroke();
            doc.undash();
            
            doc.font('Helvetica-Bold').fontSize(11);
            doc.text('TOTAL', 390, totalsY + 10, { width: 60, align: 'center' });
            doc.text(amountStr, 470, totalsY + 10, { width: 75, align: 'right' });
            
            // Bottom dotted line for total
            doc.dash(2, { space: 2 });
            doc.moveTo(50, totalsY + 30).lineTo(545, totalsY + 30).stroke();
            doc.undash();

            // --- IN WORDS ---
            const wordsY = totalsY + 50;
            doc.font('Helvetica-Oblique').fontSize(10).text('In words :', 50, wordsY);
            doc.font('Helvetica-Oblique').text(numberToWords(Math.floor(amountVal)), 110, wordsY);

            // --- ADDRESSES ---
            const addressY = wordsY + 50;
            doc.font('Helvetica-Bold').fontSize(10);
            doc.text('Shipping Address', 50, addressY);
            doc.text('Billing Address', 280, addressY);
            
            doc.font('Helvetica').fontSize(9);
            doc.text(address || '-', 50, addressY + 20, { width: 200 });
            doc.text(address || '-', 280, addressY + 20, { width: 200 }); // Both use the same address as billing in registration logic mostly

            // --- PAYMENT METHOD ---
            const pmtY = addressY + 70;
            doc.font('Helvetica-Bold').fontSize(10).text('Payment Method', 50, pmtY);
            
            doc.font('Helvetica').fontSize(9);
            
            const paymentMethod = registration.paymentDetails?.method || 'Card';
            const formattedMethod = paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1);
            
            doc.text(`Paid By: ${formattedMethod}`, 50, pmtY + 30);

            // --- FOOTER ---
            const footerLineY = 760;
            doc.moveTo(50, footerLineY)
               .lineTo(545, footerLineY)
               .lineWidth(2)
               .strokeColor(primaryColor)
               .stroke();
               
            // Footer contact info
            const contactY = 772;
            doc.font('Helvetica').fontSize(7).fillColor(textColor);
            
            // Using standard text characters to emulate icons
            doc.text('P +1-7036-516-096', 60, contactY);
            doc.text('E hello@helixconferences.com', 250, contactY, { width: 150, align: 'center' });
            doc.text('W www.helixconferences.com', 400, contactY, { width: 145, align: 'right' });

            // Bottom Blue Footer Line (using exact A4 width)
            doc.moveTo(0, 810)
               .lineTo(595, 810)
               .lineWidth(35)
               .strokeColor(primaryColor)
               .stroke();
               
            doc.font('Helvetica').fontSize(8).fillColor('#ffffff');
            doc.text('📍 1200 West 73rd Avenue #1100, Vancouver, British Columbia, Canada', 0, 806, { width: 595, align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    generateReceipt
};
