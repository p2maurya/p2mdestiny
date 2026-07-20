import PostPropertyForm from "@/components/property/PostPropertyForm";

export default function PostPropertyPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono-num text-xs uppercase tracking-[0.3em] text-ember-deep">List with P2mdestiny</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">
          Post your property in minutes
        </h1>
        <p className="mt-2 text-sm text-mist">
          Add real photos and a walkthrough video — verified listings get 3x more inquiries.
        </p>
      </div>

      <div className="mt-10">
        <PostPropertyForm />
      </div>
    </div>
  );
}
