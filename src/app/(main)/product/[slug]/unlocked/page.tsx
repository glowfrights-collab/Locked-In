import { redirect } from "next/navigation";

// The product page now shows the download files inline once unlocked, so
// this route just redirects there for any old bookmarks/links.
export default function UnlockedPage({ params }: { params: { slug: string } }) {
  redirect(`/product/${params.slug}`);
}
