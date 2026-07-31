import { dispenseReceiptData } from "@/features/pharmacy/data/dispenseData";

export function generateReceiptPDF() {

  const receipt = dispenseReceiptData;

  const html = `
    <html>
      <body>

        <h2>Pharmacy Receipt</h2>

        <p>
        Receipt No: ${receipt.receiptNo}
        </p>

        <p>
        Patient: ${receipt.patient.name}
        </p>

        <p>
        Doctor: ${receipt.doctor}
        </p>


        <table border="1">
          <tr>
            <th>Medicine</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>

          ${receipt.medicines.map(
            (med) => `
              <tr>
                <td>${med.name}</td>
                <td>${med.quantity}</td>
                <td>${med.price}</td>
              </tr>
            `
          ).join("")}

        </table>

        <p>
        Pharmacist: ${receipt.pharmacist}
        </p>

      </body>
    </html>
  `;


  console.log(html);

}