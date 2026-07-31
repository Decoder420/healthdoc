

export function getReceiptTemplate(receipt: any) {
  return `
<!DOCTYPE html>

<html>

<head>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:Arial, Helvetica, sans-serif;
    background:#EEF2F7;
    color:#374151;
    padding:10px;
    font-size:13px;
}

.receipt{
    width:794px;
    max-width:100%;
    margin:auto;
    background:#FFFFFF;
    border-radius:10px;
    overflow:hidden;
    box-shadow:0 4px 12px rgba(0,0,0,.08);
}

/* ================= HEADER ================= */

.header{
    background:#001F54;
    color:#FFFFFF;
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    padding:16px 20px;
}

.hospital h1{
    font-size:22px;
    margin-bottom:6px;
}

.hospital p,
.receipt-info p{
    font-size:11px;
    margin:2px 0;
}

.receipt-info{
    text-align:right;
}

.receipt-info h2{
    font-size:20px;
    margin-bottom:10px;
    letter-spacing:1px;
}

/* ================= SECTION ================= */

.section{
    padding:10px 20px;
}

.title{
    font-size:15px;
    font-weight:600;
    color:#001F54;
    margin-bottom:10px;
    padding-bottom:5px;
    border-bottom:2px solid #001F54;
}

/* ================= INFO GRID ================= */

.info-grid{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:10px;
}

.info-box{
    background:#F8FAFC;
    border:1px solid #E5E7EB;
    border-radius:8px;
    padding:8px 10px;
    font-size:12px;
}

.info-box b{
    display:block;
    color:#001F54;
    margin-bottom:4px;
}

/* ================= TABLE ================= */

table{
    width:100%;
    border-collapse:collapse;
    margin-top:8px;
}

thead th{
    background:#001F54;
    color:#FFFFFF;
    padding:8px;
    text-align:left;
    font-size:12px;
}

tbody td{
    padding:7px 8px;
    border-bottom:1px solid #ECECEC;
    font-size:11px;
}

tbody tr:nth-child(even){
    background:#F9FBFD;
}

tbody tr:hover{
    background:#EEF6FF;
}

/* ================= NOTES ================= */

.notes{
    background:#FFF8E8;
    border-left:4px solid #F59E0B;
    border-radius:6px;
    padding:10px;
    font-size:11px;
    line-height:1.5;
}

/* ================= SUMMARY ================= */

.summary{
    display:flex;
    justify-content:space-between;
    align-items:center;
    background:#EEF4FF;
    border-left:4px solid #001F54;
    border-radius:8px;
    padding:12px 16px;
}

.summary b{
    font-size:12px;
}

.summary h2{
    color:#001F54;
    font-size:20px;
    margin-top:4px;
}

.summary h3{
    color:#001F54;
    font-size:15px;
    margin-top:4px;
}

/* ================= FOOTER ================= */

.footer{
    display:flex;
    justify-content:space-between;
    align-items:flex-end;
    padding:12px 20px;
    border-top:1px solid #E5E7EB;
    font-size:11px;
    color:#6B7280;
}

.signature{
    text-align:center;
}

.line{
    width:150px;
    border-top:1px solid #000;
    margin-bottom:6px;
}

/* ================= PRINT ================= */

@page{
    size:A4 portrait;
    margin:8mm;
}

@media print{

    html,
    body{
        width:210mm;
        height:297mm;
        margin:0;
        padding:0;
        background:#FFFFFF;
        -webkit-print-color-adjust:exact;
        print-color-adjust:exact;
    }

    .receipt{
        width:100%;
        max-width:none;
        border-radius:0;
        box-shadow:none;
        page-break-inside:avoid;
    }

    .section,
    .summary,
    .footer,
    table,
    tr{
        page-break-inside:avoid;
    }

    table{
        margin-top:6px;
    }
}

</style>

</head>


<body>

<div class="receipt">

    <!-- Header -->
    <div class="header">

        <div class="hospital">
            <h1>🏥 HealthDoc Hospital</h1>
            <p>Sector 21, Faridabad, Haryana</p>
            <p>Phone: +91 98765 43210</p>
            <p>Email: info@healthdoc.com</p>
        </div>

        <div class="receipt-info">
            <h2>PHARMACY RECEIPT</h2>
            <p><strong>Receipt No:</strong> ${receipt.receiptNo}</p>
            <p><strong>Date:</strong> ${receipt.dispenseDate}</p>
        </div>

    </div>

    <!-- Visit Information -->
    <div class="section">

        <div class="title">Visit Information</div>

        <div class="info-grid">

            <div class="info-box">
                <b>Visit Type</b>
                ${receipt.patient.visitType}
            </div>

            <div class="info-box">
                <b>Prescription No.</b>
                ${receipt.patient.prescriptionNumber}
            </div>

        </div>

    </div>

    <!-- Patient Information -->
    <div class="section">

        <div class="title">Patient Information</div>

        <div class="info-grid">

            <div class="info-box">
                <b>Patient Name</b>
                ${receipt.patient.patientName}
            </div>

            <div class="info-box">
                <b>UHID</b>
                ${receipt.patient.uhid}
            </div>

            <div class="info-box">
                <b>Doctor</b>
                ${receipt.patient.doctor}
            </div>

            <div class="info-box">
                <b>Receipt No.</b>
                ${receipt.receiptNo}
            </div>

        </div>

    </div>

    <!-- Medicines -->
    <div class="section">

        <div class="title">Medicines Dispensed</div>

        <table>

            <thead>
                <tr>
                    <th>Medicine</th>
                    <th>Batch</th>
                    <th>Expiry</th>
                    <th>Quantity</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody>

                ${receipt.medicines
                  .map(
                    (med:any)=>`

                <tr>
                    <td>${med.medicineName}</td>
                    <td>${med.batchNumber}</td>
                    <td>${med.expiryDate}</td>
                    <td>${med.dispenseQty}</td>
                    <td>${med.status}</td>
                </tr>

                `
                  )
                  .join("")}

            </tbody>

        </table>

    </div>

    <!-- Notes -->
    <div class="section">

        <div class="title">Pharmacist Notes</div>

        <div class="notes">
            Take medicines exactly as prescribed by your physician. Complete the prescribed course and store medicines in a cool, dry place.
        </div>

    </div>

    <!-- Summary -->
    <div class="section">

        <div class="summary">

            <div>
                <b>Total Medicines</b>
                <h2>${receipt.medicines.length}</h2>
            </div>

            <div style="text-align:right;">
                <b>Pharmacist</b>
                <h3>${receipt.pharmacist}</h3>
            </div>

        </div>

    </div>

    <!-- Footer -->
    <div class="footer">

        <div>
            <strong>Generated by HealthDoc HMS</strong><br>
            Pharmacy Management System
        </div>

        <div class="signature">
            <div class="line"></div>
            Authorized Pharmacist
        </div>

    </div>

</div>

</body>

</html>
`;
}