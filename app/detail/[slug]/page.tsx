import Info from "./info";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="bg-black">
      <div className="max-w-3xl mx-auto ">
        <Info
          params={{
            slug: params.slug,
          }}
        />
      </div>
    </div>
  );
}
