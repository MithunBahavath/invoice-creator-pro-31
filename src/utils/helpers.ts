
// Convert number to words function
export function numberToWords(num: number): string {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Lakh', 'Crore'];

  if (num === 0) return 'Zero';

  const indianNumberFormat = (num: number): string => {
    if (num < 0) return 'Minus ' + indianNumberFormat(Math.abs(num));
    if (num === 0) return '';
    if (num < 20) return units[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + units[num % 10] : '');
    if (num < 1000) return units[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + indianNumberFormat(num % 100) : '');

    // Convert to Indian numbering system
    let n = 0;
    let words = '';
    while (num > 0) {
      if (n === 0) {  // Handle ones, tens, hundreds
        const remainder = num % 1000;
        if (remainder) {
          words = indianNumberFormat(remainder) + ' ' + words;
        }
        num = Math.floor(num / 1000);
      } else { // Handle thousands, lakhs, crores
        const remainder = num % 100;
        if (remainder) {
          words = indianNumberFormat(remainder) + ' ' + scales[n] + ' ' + words;
        }
        num = Math.floor(num / 100);
      }
      n++;
    }
    return words.trim();
  };

  // Format for INR (adding paise)
  let result = indianNumberFormat(Math.floor(num));
  const paise = Math.round((num - Math.floor(num)) * 100);

  if (paise > 0) {
    result += ' And ' + indianNumberFormat(paise) + ' Paise';
  }

  return 'INR ' + result + ' Only';
}

// Function to format dates to DD-MMM-YY format
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear().toString().slice(-2);
  
  return `${day < 10 ? '0' + day : day}-${month}-${year}`;
}

// Function to calculate GST and other tax amounts
export function calculateTaxes(taxableAmount: number, cgstRate: number, sgstRate: number) {
  const cgstAmount = (taxableAmount * cgstRate) / 100;
  const sgstAmount = (taxableAmount * sgstRate) / 100;
  const totalAmount = taxableAmount + cgstAmount + sgstAmount;
  const roundedAmount = Math.round(totalAmount);
  const roundedOff = roundedAmount - totalAmount;
  
  return {
    cgstAmount,
    sgstAmount,
    totalAmount: roundedAmount,
    roundedOff
  };
}

// Generate random IRN number (for demo purposes)
export function generateIRN(): string {
  return Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

// Generate random acknowledgment number (for demo purposes)
export function generateAckNo(): string {
  return Math.floor(100000000000000 + Math.random() * 900000000000000).toString();
}

// Extract sequence number from existing invoice number
function extractSequenceFromInvoiceNumber(invoiceNumber: string): number {
  if (!invoiceNumber) return 0;
  
  // Handle both old format (S24XXXX) and new format (INV/YYYY/MM/XXXX)
  if (invoiceNumber.startsWith('INV/')) {
    const parts = invoiceNumber.split('/');
    if (parts.length === 4) {
      return parseInt(parts[3]) || 0;
    }
  } else if (invoiceNumber.startsWith('S')) {
    // Old format: S24XXXX - extract last 4 digits
    const match = invoiceNumber.match(/S\d{2}(\d{4})$/);
    if (match) {
      return parseInt(match[1]) || 0;
    }
  }
  
  return 0;
}

// Check if invoice number belongs to current month and year
function isSameMonthYear(invoiceNumber: string, year: number, month: number): boolean {
  if (!invoiceNumber.startsWith('INV/')) return false;
  
  const parts = invoiceNumber.split('/');
  if (parts.length === 4) {
    const invYear = parseInt(parts[1]);
    const invMonth = parseInt(parts[2]);
    return invYear === year && invMonth === month;
  }
  
  return false;
}

// Generate invoice number using INV/YYYY/MM/XXXX format
export function generateInvoiceNumber(existingInvoices: any[] = [], prefix: string = 'INV'): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // JavaScript months are 0-indexed
  const monthFormatted = month.toString().padStart(2, '0');
  
  // Find the highest sequence number for current month and year
  let maxSequence = 0;
  
  existingInvoices.forEach(invoice => {
    if (invoice.invoiceNo && isSameMonthYear(invoice.invoiceNo, year, month)) {
      const sequence = extractSequenceFromInvoiceNumber(invoice.invoiceNo);
      if (sequence > maxSequence) {
        maxSequence = sequence;
      }
    }
  });
  
  // Increment for new invoice
  const newSequence = maxSequence + 1;
  const sequenceFormatted = newSequence.toString().padStart(4, '0');
  
  return `${prefix}/${year}/${monthFormatted}/${sequenceFormatted}`;
}
