import Loader from "@/components/ui/Loader";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <section className="min-h-screen w-screen flex justify-center items-center">
      <Loader />
    </section>
  );
}
