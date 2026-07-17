const PDFDocument = require('pdfkit');
const moment = require('moment');
const path = require('path');
const fs = require('fs');

/**
 * Generates a PDF receipt for a conference registration.
 * @param {Object} registration - The registration document from the database.
 * @returns {Promise<Buffer>} - A promise that resolves to the PDF buffer.
 */
const generateReceipt = (registration) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const buffers = [];
            
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            const primaryColor = '#0b328a'; // Dark blue for INVOICE and lines
            const textColor = '#000000';
            const tableHeaderColor = '#000000';

            // Top Left Logo
            const logoPath = path.join(__dirname, 'Header-logo.png');
            if (fs.existsSync(logoPath)) {
                // Adjust width as needed for proportion
                doc.image(logoPath, 50, 35, { width: 150 });
            } else {
                // Fallback text if logo missing
                doc.font('Helvetica-Bold').fontSize(16).fillColor(primaryColor).text('Helix Conferences', 50, 45);
                doc.fontSize(8).text('A UNIT OF OCTACREST CORPORATE LLC', 50, 65);
            }

            // Top Right INVOICE text
            doc.font('Helvetica-Bold')
               .fillColor(primaryColor)
               .fontSize(40)
               .text('INVOICE', 300, 45, { width: 250, align: 'right' });

            // Thick blue line under header
            doc.moveTo(50, 120)
               .lineTo(550, 120)
               .lineWidth(3)
               .strokeColor(primaryColor)
               .stroke();

            // Contact Info section
            doc.font('Helvetica-Bold')
               .fontSize(9)
               .fillColor(textColor);
            
            const contactY = 135;
            // Phone
            doc.text('+1-7036-516-096', 50, contactY, { width: 120, align: 'center' });
            // Email
            doc.text('hello@helixconferences.com', 200, contactY, { width: 150, align: 'center' });
            // Web
            doc.text('www.helixconferences.com', 380, contactY, { width: 170, align: 'center' });

            // Address line
            doc.font('Helvetica').text('1200 West 73rd Avenue #1100, Vancouver, British Columbia, Canada', 50, contactY + 20, { width: 500, align: 'center' });

            // Invoice details
            const invoiceY = 195;
            const shortId = registration._id.toString().substring(0, 6).toUpperCase();
            const year = moment().format('YYYY');
            
            const paymentDate = registration.paymentDate 
                ? moment(registration.paymentDate) 
                : moment();
                
            const dateStr = paymentDate.format('DD-MMM-YYYY');
            const dueStr = paymentDate.add(7, 'days').format('DD-MMM-YYYY');

            doc.font('Helvetica').fontSize(11);
            doc.text(`Invoice No : INV-${year}-${shortId}`, 50, invoiceY);
            doc.text(`Date: ${dateStr}`, 450, invoiceY);
            
            doc.text(`Due Date: ${dueStr}`, 50, invoiceY + 25);

            // Bill To section
            const billToY = 265;
            doc.font('Helvetica').fontSize(11).text('Bill To:', 50, billToY);
            
            doc.font('Helvetica').fontSize(10);
            doc.text('Client Name:', 50, billToY + 25);
            doc.text(`${registration.firstName || ''} ${registration.lastName || ''}`, 130, billToY + 25);
            
            doc.text('Company Name:', 280, billToY + 25);
            doc.text(registration.organization || '-', 380, billToY + 25);
            
            doc.text('Address:', 50, billToY + 50);
            doc.text(`${registration.address || ''}, ${registration.city || ''}, ${registration.country || ''}`, 130, billToY + 50, { width: 130 });
            
            doc.text('Phone / Email:', 280, billToY + 50);
            doc.text(`${registration.mobileNumber || '-'}\n${registration.email || '-'}`, 380, billToY + 50, { width: 170 });

            // Table Headers
            const tableY = 355;
            
            // Top dotted line for table header
            doc.lineWidth(1).strokeColor(textColor).dash(2, { space: 2 });
            doc.moveTo(50, tableY).lineTo(550, tableY).stroke();
            doc.undash();

            doc.font('Helvetica-Bold').fontSize(12).fillColor(tableHeaderColor);
            doc.text('Description', 60, tableY + 15);
            doc.text('Qty', 300, tableY + 15, { width: 50, align: 'center' });
            doc.text('Rate', 380, tableY + 15, { width: 60, align: 'center' });
            doc.text('Amount', 470, tableY + 15, { width: 60, align: 'right' });

            // Bottom dotted line for table header
            doc.dash(2, { space: 2 });
            doc.moveTo(50, tableY + 40).lineTo(550, tableY + 40).stroke();
            doc.undash();

            // Table Row
            const rowY = tableY + 55;
            const amountStr = `$${(registration.paymentDetails?.amountTotal || 0).toFixed(2)}`;
            
            doc.font('Helvetica-Bold').fontSize(11).fillColor(textColor);
            doc.text(registration.plan || 'Conference Registration', 60, rowY, { width: 230 });
            doc.text('1', 300, rowY, { width: 50, align: 'center' });
            doc.text(amountStr, 380, rowY, { width: 60, align: 'center' });
            doc.text(amountStr, 470, rowY, { width: 60, align: 'right' });

            // Totals section
            const totalsY = rowY + 100;
            
            doc.font('Helvetica-Bold').fontSize(11);
            doc.text('SUB TOTAL', 350, totalsY);
            doc.text(amountStr, 470, totalsY, { width: 60, align: 'right' });
            
            doc.text('GST', 350, totalsY + 25);
            doc.text('$0.00', 470, totalsY + 25, { width: 60, align: 'right' });
            
            // Dotted line before total
            doc.dash(2, { space: 2 });
            doc.moveTo(50, totalsY + 45).lineTo(550, totalsY + 45).stroke();
            doc.undash();
            
            doc.text('TOTAL', 350, totalsY + 55);
            doc.text(amountStr, 470, totalsY + 55, { width: 60, align: 'right' });
            
            // Dotted line after total
            doc.dash(2, { space: 2 });
            doc.moveTo(50, totalsY + 75).lineTo(550, totalsY + 75).stroke();
            doc.undash();

            // Payment Method Section
            const pmtY = totalsY + 120;
            doc.font('Helvetica-Bold').fontSize(11).text('Payment Method', 50, pmtY);
            
            doc.font('Helvetica').fontSize(10);
            
            const rawMethod = registration.paymentDetails?.method || 'Unknown';
            const methodStr = rawMethod.charAt(0).toUpperCase() + rawMethod.slice(1);

            doc.text('Payment Mode:', 50, pmtY + 30);
            doc.text(methodStr, 150, pmtY + 30);
            
            doc.text('Gateway:', 280, pmtY + 30);
            doc.text(registration.paymentDetails?.paymentGateway || 'Razorpay', 380, pmtY + 30);
            
            doc.text('Transaction ID:', 50, pmtY + 55);
            doc.text(registration.paymentDetails?.razorpayPaymentId || '-', 150, pmtY + 55);
            
            doc.text('IFSC Code:', 280, pmtY + 55);
            doc.text('-', 380, pmtY + 55);
            
            doc.text('UPI ID:', 50, pmtY + 80);
            doc.text('-', 150, pmtY + 80);
            
            doc.text('QR Code:', 280, pmtY + 80);
            // space for QR code if they ever want one

            // Bottom Blue Footer Line (using exact A4 width)
            doc.moveTo(0, 810)
               .lineTo(595, 810)
               .lineWidth(25)
               .strokeColor(primaryColor)
               .stroke();

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    generateReceipt
};
