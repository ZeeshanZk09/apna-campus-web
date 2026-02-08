import { getAllActiveEnrollments } from "@/lib/queries/enrollmentQueries";
import { getAllFees } from "@/lib/queries/financeQueries";
import InvoiceForm from "../../_components/InvoiceForm";

export default async function NewInvoicePage() {
  const [enrollments, fees] = await Promise.all([
    getAllActiveEnrollments(),
    getAllFees(),
  ]);

  return (
    <div className="p-8">
      <InvoiceForm enrollments={enrollments} fees={fees} />
    </div>
  );
}
