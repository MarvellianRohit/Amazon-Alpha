import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generateInvoice(order: any) {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("Amazon Alpha", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("123 Commerce Way, Tech City", 14, 28);
    doc.text("support@amazonalpha.com", 14, 33);

    // Invoice Details
    const now = new Date();
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("INVOICE", 150, 22, { align: 'right' });

    doc.setFontSize(10);
    doc.text(`Invoice #: INV-${order.id.slice(0, 8).toUpperCase()}`, 150, 28, { align: 'right' });
    doc.text(`Date: ${now.toLocaleDateString()}`, 150, 33, { align: 'right' });

    // Bill To
    doc.text("Bill To:", 14, 50);
    doc.setFont("helvetica", "bold");
    doc.text("Customer", 14, 55);
    // In real app, fetch user name. For now generic.
    doc.setFont("helvetica", "normal");

    // Table
    const tableColumn = ["Item", "Quantity", "Price", "Total"];
    const tableRows: any[] = [];

    let total = 0;
    order.items?.forEach((item: any) => {
        const price = item.price_at_purchase || item.price || 0;
        const itemTotal = price * item.quantity;
        total += itemTotal;

        // Fallback if product title missing in deep join
        const title = item.product?.title || item.product?.name || `Product ID: ${item.product_id?.slice(0, 8)}`;

        tableRows.push([
            title,
            item.quantity,
            `$${price.toFixed(2)}`,
            `$${itemTotal.toFixed(2)}`,
        ]);
    });

    autoTable(doc, {
        startY: 65,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [50, 50, 50] }, // Dark gray
    });

    // Footer / Total
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total: $${total.toFixed(2)}`, 190, finalY, { align: 'right' });

    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150);
    doc.text("Thank you for your business!", 105, 280, { align: 'center' });

    // Save
    doc.save(`invoice_${order.id.slice(0, 8)}.pdf`);
}
